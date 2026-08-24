import { eventBus } from '../utils/eventBus.js';

export class VoiceRecognition {
  constructor() {
    const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
    this.isSupported = !!SR;
    this.recognition = null;
    this.isListening = false;
    this.isStarting = false;
    this.language = 'en-US';
    this.silenceTimer = null;
    this.watchdogTimer = null;
    this.startGuardTimer = null;
    this.currentTranscript = '';
    this.lastProcessedTranscript = '';
    this.lastResultAt = 0;
    this.noSpeechStreak = 0;
    this.silentEndStreak = 0; // sessions that ended with zero activity
    this.hadActivity = false; // any result/no-speech seen this session
    this.silenceDelayMs = 1500; // 1.5s silence auto-finalizes
    this.watchdogMs = 8000; // restart engine if deaf for 8s

    if (this.isSupported) {
      this._createRecognition();
    }
  }

  _createRecognition() {
    const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SR) return;

    this.recognition = new SR();
    this.recognition.continuous = true;
    this.recognition.interimResults = true;
    this.recognition.maxAlternatives = 1;
    this.recognition.lang = this.language;

    this.recognition.onstart = () => {
      console.log('[VoiceRecognition] ✅ Recognition started');
      this.isListening = true;
      this.isStarting = false;
      this.hadActivity = false;
      this.currentTranscript = '';
      this.lastProcessedTranscript = '';
      this.lastResultAt = Date.now();
      clearTimeout(this.startGuardTimer);
      eventBus.emit('voice:start');
      this._armWatchdog();
    };

    this.recognition.onresult = (event) => {
      let interimTranscript = '';
      let finalTranscript = '';

      for (let i = event.resultIndex; i < event.results.length; i++) {
        const res = event.results[i];
        const text = res[0]?.transcript || '';
        if (res.isFinal) {
          finalTranscript += text;
        } else {
          interimTranscript += text;
        }
      }

      const live = (interimTranscript || finalTranscript).trim();
      if (!live) return;

      console.log('[VoiceRecognition] heard:', live, '| isFinal:', !!finalTranscript.trim());

      // Engine is hearing — reset diagnostics
      this.lastResultAt = Date.now();
      this.noSpeechStreak = 0;
      this.silentEndStreak = 0;
      this.hadActivity = true;
      this._armWatchdog();

      // Emit interim result for live transcription display
      eventBus.emit('voice:result', {
        transcript: live,
        isFinal: false,
        confidence: event.results[event.results.length - 1]?.[0]?.confidence || 0.8
      });

      // If the browser gave us a definitive final, process it immediately.
      // Keep any trailing interim so it isn't lost across the finalization.
      if (finalTranscript.trim()) {
        this.currentTranscript = interimTranscript.trim();
        this._finalizeCommand(finalTranscript.trim(),
          event.results[event.results.length - 1]?.[0]?.confidence || 0.95);
        return;
      }

      // Otherwise track the interim and auto-finalize after a short pause
      this.currentTranscript = interimTranscript.trim();
      clearTimeout(this.silenceTimer);
      this.silenceTimer = setTimeout(() => {
        if (this.currentTranscript && this.currentTranscript !== this.lastProcessedTranscript) {
          this._finalizeCommand(this.currentTranscript, 0.88);
        }
      }, this.silenceDelayMs);
    };

    this.recognition.onerror = (event) => {
      console.warn('[VoiceRecognition] error:', event.error);
      clearTimeout(this.silenceTimer);
      clearTimeout(this.startGuardTimer);
      // Never leave the start flag latched — that would permanently
      // deadlock the mic button (every later start() would bail out).
      this.isStarting = false;

      if (event.error === 'not-allowed' || event.error === 'service-not-allowed') {
        this.isListening = false;
        eventBus.emit('voice:end');
        eventBus.emit('voice:status', 'Microphone blocked — allow mic access');
        eventBus.emit('toast:show', {
          message: '🎤 Microphone permission denied. Allow mic access in the address bar.',
          type: 'error'
        });
      } else if (event.error === 'audio-capture') {
        this.isListening = false;
        eventBus.emit('voice:end');
        eventBus.emit('voice:status', 'No microphone found');
        eventBus.emit('toast:show', {
          message: '🎤 No microphone found. Connect an audio input device.',
          type: 'error'
        });
      } else if (event.error === 'no-speech') {
        // Engine IS alive, it just heard nothing — counts as activity so
        // the silent-restart cap doesn't trip on normal quiet pauses.
        this.hadActivity = true;
        this.silentEndStreak = 0;
        // User hasn't spoken yet — not a real error, just restart listening.
        // After a couple of silent cycles, let the user know nothing is coming in.
        this.noSpeechStreak += 1;
        if (this.noSpeechStreak === 2) {
          eventBus.emit('toast:show', {
            message: '🎤 I can\'t hear anything yet — speak a little louder or check your microphone.',
            type: 'info'
          });
        }
        console.log('[VoiceRecognition] No speech detected, continuing to listen...');
      } else if (event.error === 'aborted') {
        // Intentional stop, do nothing
      } else if (event.error === 'network') {
        eventBus.emit('voice:status', 'Speech service unreachable');
        eventBus.emit('toast:show', {
          message: '🌐 Speech recognition network error. Check your internet connection.',
          type: 'error'
        });
        // The engine instance may now be in a bad state — rebuild it so the
        // next attempt starts clean instead of reusing a broken session.
        this.isListening = false;
        eventBus.emit('voice:end');
        this._createRecognition();
      } else {
        // Unknown error — rebuild the engine so the next tap starts clean.
        this._createRecognition();
      }
    };

    this.recognition.onend = () => {
      console.log('[VoiceRecognition] onend fired. isListening =', this.isListening);
      clearTimeout(this.silenceTimer);
      clearTimeout(this.watchdogTimer);
      clearTimeout(this.startGuardTimer);
      this.isStarting = false;

      // If there was uncommitted speech, finalize it
      if (this.currentTranscript && this.currentTranscript !== this.lastProcessedTranscript) {
        this._finalizeCommand(this.currentTranscript, 0.88);
      }

      // Track sessions that produced absolutely nothing (no results, no
      // no-speech event). Repeated silent sessions mean the engine cannot
      // access the audio device — restart a few times, then give up with
      // a clear message instead of looping forever.
      if (this.hadActivity) {
        this.silentEndStreak = 0;
      } else if (this.isListening) {
        this.silentEndStreak += 1;
        console.warn('[VoiceRecognition] silent session ended, streak =', this.silentEndStreak);
      }

      // Auto-restart if we're supposed to keep listening
      if (this.isListening) {
        if (this.silentEndStreak >= 3) {
          this.isListening = false;
          this.silentEndStreak = 0;
          eventBus.emit('voice:end');
          eventBus.emit('toast:show', {
            message: '🎤 Microphone started but no audio is reaching the app. Check Windows mic privacy settings (Settings → Privacy → Microphone → allow desktop apps) and your default input device.',
            type: 'error'
          });
          return;
        }
        setTimeout(() => {
          if (this.isListening) {
            try {
              this.recognition.start();
            } catch (e) {
              console.warn('[VoiceRecognition] restart failed, recreating:', e);
              this._createRecognition();
              try { this.recognition.start(); } catch (err) {}
            }
          }
        }, 250);
      } else {
        eventBus.emit('voice:end');
      }
    };
  }

  /**
   * Watchdog: if the engine goes silent (no results at all) while we're
   * supposed to be listening, it has likely lost the audio stream.
   * Force a restart — onend fires and the auto-restart loop takes over.
   */
  _armWatchdog() {
    clearTimeout(this.watchdogTimer);
    if (!this.isListening) return;
    this.watchdogTimer = setTimeout(() => {
      if (!this.isListening) return;
      const silentFor = Date.now() - this.lastResultAt;
      if (silentFor >= this.watchdogMs) {
        console.warn('[VoiceRecognition] watchdog: engine silent for', silentFor, 'ms — restarting');
        try { this.recognition.stop(); } catch (e) {}
      } else {
        this._armWatchdog();
      }
    }, this.watchdogMs);
  }

  _finalizeCommand(text, confidence = 0.9) {
    clearTimeout(this.silenceTimer);
    const cleanText = text.trim();
    if (!cleanText) return;

    console.log('[VoiceRecognition] ✅ FINALIZED:', cleanText);

    this.lastProcessedTranscript = cleanText;
    this.currentTranscript = '';

    eventBus.emit('voice:result', {
      transcript: cleanText,
      isFinal: true,
      confidence
    });
  }

  start() {
    if (!this.isSupported) {
      eventBus.emit('toast:show', {
        message: '⚠️ Voice recognition is not supported. Use Chrome or Edge.',
        type: 'error'
      });
      return;
    }

    if (this.isListening || this.isStarting) return;

    // Microphone APIs require a secure context (https or localhost)
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      eventBus.emit('toast:show', {
        message: '🎤 Microphone needs a secure connection. Open the site via localhost or https.',
        type: 'error'
      });
      return;
    }

    this.isStarting = true;
    this.currentTranscript = '';
    this.lastProcessedTranscript = '';
    this.noSpeechStreak = 0;
    this.silentEndStreak = 0;

    // IMPORTANT: do NOT pre-acquire the mic with getUserMedia here.
    // Stopping a permission stream right before recognition.start() is a
    // known Chrome race (especially on Windows) that leaves the session
    // completely deaf — no results, no errors. Letting the recognizer
    // acquire the device directly avoids the race; the browser shows its
    // own permission prompt and denials surface via onerror('not-allowed').

    // Safety net: if the engine never fires onstart, don't leave the
    // button latched in "starting" state forever.
    clearTimeout(this.startGuardTimer);
    this.startGuardTimer = setTimeout(() => {
      if (this.isStarting && !this.isListening) {
        console.warn('[VoiceRecognition] start guard: onstart never fired — resetting');
        this.isStarting = false;
        eventBus.emit('voice:end');
        eventBus.emit('toast:show', {
          message: '🎤 Microphone did not start. Click the mic button and try again.',
          type: 'error'
        });
      }
    }, 6000);

    try {
      if (!this.recognition) {
        this._createRecognition();
      }
      eventBus.emit('voice:status', 'Starting microphone...');
      this.recognition.start();
    } catch (e) {
      console.warn('[VoiceRecognition] start error:', e);
      clearTimeout(this.startGuardTimer);
      if (e.name === 'InvalidStateError') {
        // Already running — recreate
        this._createRecognition();
        try { this.recognition.start(); } catch (err) {}
      } else {
        this.isStarting = false;
      }
    }
  }

  stop() {
    if (!this.isSupported) return;

    this.isListening = false;
    this.isStarting = false;
    clearTimeout(this.silenceTimer);
    clearTimeout(this.watchdogTimer);
    clearTimeout(this.startGuardTimer);

    // Finalize pending speech before stopping
    if (this.currentTranscript && this.currentTranscript !== this.lastProcessedTranscript) {
      this._finalizeCommand(this.currentTranscript, 0.88);
    }

    if (this.recognition) {
      try { this.recognition.stop(); } catch (e) {}
    }

    eventBus.emit('voice:end');
  }

  setLanguage(langCode) {
    this.language = langCode;
    if (this.recognition) {
      this.recognition.lang = langCode;
    }
  }
}

export const voiceRecognition = new VoiceRecognition();
