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
    this.currentTranscript = '';
    this.lastProcessedTranscript = '';
    this.lastResultAt = 0;
    this.noSpeechStreak = 0;
    this.silenceDelayMs = 1500; // 1.5s silence auto-finalizes
    this.watchdogMs = 8000; // restart engine if deaf for 8s
    this.micSettleMs = 200; // let the audio device settle before recognition

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
      this.currentTranscript = '';
      this.lastProcessedTranscript = '';
      this.lastResultAt = Date.now();
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

      if (event.error === 'not-allowed' || event.error === 'service-not-allowed') {
        this.isListening = false;
        this.isStarting = false;
        eventBus.emit('voice:end');
        eventBus.emit('toast:show', {
          message: '🎤 Microphone permission denied. Allow mic access in the address bar.',
          type: 'error'
        });
      } else if (event.error === 'audio-capture') {
        this.isListening = false;
        this.isStarting = false;
        eventBus.emit('voice:end');
        eventBus.emit('toast:show', {
          message: '🎤 No microphone found. Connect an audio input device.',
          type: 'error'
        });
      } else if (event.error === 'no-speech') {
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
        eventBus.emit('toast:show', {
          message: '🌐 Speech recognition network error. Check your internet connection.',
          type: 'error'
        });
      }
    };

    this.recognition.onend = () => {
      console.log('[VoiceRecognition] onend fired. isListening =', this.isListening);
      clearTimeout(this.silenceTimer);
      clearTimeout(this.watchdogTimer);

      // If there was uncommitted speech, finalize it
      if (this.currentTranscript && this.currentTranscript !== this.lastProcessedTranscript) {
        this._finalizeCommand(this.currentTranscript, 0.88);
      }

      // Auto-restart if we're supposed to keep listening
      if (this.isListening) {
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

  async start() {
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

    // Request microphone permission first
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      // Release the permission stream
      stream.getTracks().forEach(t => t.stop());
      // Give the audio device time to fully release BEFORE the recognizer
      // re-acquires it — starting immediately can leave recognition deaf.
      await new Promise(r => setTimeout(r, this.micSettleMs));
    } catch (err) {
      console.warn('[VoiceRecognition] Mic permission error:', err);
      this.isStarting = false;
      eventBus.emit('toast:show', {
        message: '🎤 Please allow microphone access to use voice commands.',
        type: 'error'
      });
      return;
    }

    // User may have toggled stop() while we were awaiting permission
    if (!this.isStarting) return;

    this.currentTranscript = '';
    this.lastProcessedTranscript = '';
    this.noSpeechStreak = 0;

    try {
      if (!this.recognition) {
        this._createRecognition();
      }
      this.recognition.start();
    } catch (e) {
      console.warn('[VoiceRecognition] start error:', e);
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
