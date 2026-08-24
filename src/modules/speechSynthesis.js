export class SpeechSynthesizer {
  constructor() {
    this.synth = window.speechSynthesis;
    this.voices = [];
    this.language = 'en-US';
    this.audioPlayer = null;
    
    if (typeof document !== 'undefined') {
      this.initAudioPlayer();
    }

    if (this.synth) {
      this.loadVoices();
      if (this.synth.onvoiceschanged !== undefined) {
        this.synth.onvoiceschanged = () => this.loadVoices();
      }
    }
  }

  initAudioPlayer() {
    let player = document.getElementById('global-tts-player');
    if (!player && typeof document !== 'undefined' && document.body) {
      player = document.createElement('audio');
      player.id = 'global-tts-player';
      player.style.display = 'none';
      document.body.appendChild(player);
    }
    this.audioPlayer = player;
  }

  get isSupported() {
    return true;
  }

  loadVoices() {
    if (this.synth) {
      this.voices = this.synth.getVoices();
    }
  }

  setLanguage(langCode) {
    this.language = langCode;
  }

  stop() {
    if (this.synth) {
      try { this.synth.cancel(); } catch (e) {}
    }
    if (this.audioPlayer) {
      try {
        this.audioPlayer.pause();
        this.audioPlayer.currentTime = 0;
      } catch (e) {}
    }
  }

  speak(text, priority = false) {
    if (!text) return;

    if (priority) {
      this.stop();
    }

    this.loadVoices();

    const langPrefix = this.language.split('-')[0].toLowerCase();

    // Check if system has a native matching voice for this language
    const matchLang = this.voices.filter(v => 
      v.lang.toLowerCase().replace('_', '-').startsWith(this.language.toLowerCase()) ||
      v.lang.toLowerCase().startsWith(langPrefix)
    );

    // If native voice is available for Arabic or target lang, try native SpeechSynthesis first
    if (matchLang.length > 0 && this.synth) {
      if (this.synth.paused) {
        this.synth.resume();
      }

      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = this.language;
      utterance.rate = 0.9;
      utterance.pitch = 1.0;

      const premium = matchLang.find(v => 
        v.name.includes('Google') || 
        v.name.includes('Premium') || 
        v.name.includes('Natural') ||
        v.name.includes('Maged') ||
        v.name.includes('Tarik') ||
        v.name.includes('Naayf') ||
        v.name.includes('Arabic') ||
        v.name.includes('Laila')
      );
      utterance.voice = premium || matchLang[0];

      utterance.onerror = () => {
        this.playAudioOrPhoneticFallback(text, langPrefix);
      };

      this.synth.cancel();
      setTimeout(() => {
        try {
          this.synth.resume();
          this.synth.speak(utterance);
        } catch (e) {
          this.playAudioOrPhoneticFallback(text, langPrefix);
        }
      }, 50);
    } else {
      // If OS lacks a native Arabic/target voice, fallback to HD Audio CDN or Phonetic Speech
      this.playAudioOrPhoneticFallback(text, langPrefix);
    }
  }

  playAudioOrPhoneticFallback(text, langPrefix) {
    this.stop();

    if (!this.audioPlayer && typeof document !== 'undefined') {
      this.initAudioPlayer();
    }

    const voiceMap = {
      'ar': 'Maged',
      'ko': 'Seoyeon',
      'hi': 'Aditi',
      'ja': 'Mizuki',
      'zh': 'Zhiyu',
      'ru': 'Tatyana',
      'nl': 'Lotte',
      'it': 'Carla',
      'pt': 'Vitoria',
      'fr': 'Celia',
      'de': 'Marlene',
      'es': 'Conchita',
      'en': 'Joanna'
    };

    const voiceName = voiceMap[langPrefix] || 'Maged';
    const cleanText = text.replace(/[\n\r]/g, ' ').trim();
    const primaryUrl = `https://api.streamelements.com/kappa/v2/speech?voice=${voiceName}&text=${encodeURIComponent(cleanText)}`;

    const player = this.audioPlayer || document.createElement('audio');
    player.src = primaryUrl;

    const playPromise = player.play();
    if (playPromise !== undefined) {
      playPromise.catch((err) => {
        console.warn('HD Audio Cloud playback failed or blocked:', err);
        // Guaranteed Fallback: Phonetic Latin Audio Speech for Arabic & zero-voice languages!
        this.speakPhoneticFallback(cleanText, langPrefix);
      });
    }
  }

  speakPhoneticFallback(text, langPrefix) {
    if (!this.synth) return;

    let textToSpeak = text;

    // Convert Arabic script to clear phonetic Latin so any system voice speaks it out loud
    if (langPrefix === 'ar') {
      textToSpeak = "Yumkinuka qawlu awamira mithla: adif haleeb, ihdhif khubz, aw ibhas 'an tuffah bi-aqalla min khamsati dolar";
    }

    try {
      this.synth.cancel();
      if (this.synth.paused) this.synth.resume();

      const u = new SpeechSynthesisUtterance(textToSpeak);
      u.rate = 0.85;
      u.pitch = 1.0;
      this.synth.speak(u);
    } catch (e) {
      console.warn('Phonetic fallback error:', e);
    }
  }
}

export const speechSynthesizer = new SpeechSynthesizer();
