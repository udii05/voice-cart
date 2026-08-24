import { eventBus } from '../utils/eventBus.js';
import { voiceRecognition } from '../modules/voiceRecognition.js';

export function initVoiceButton(container) {
    const btn = document.createElement('button');
    btn.className = 'voice-btn';
    btn.innerHTML = `
        <svg viewBox="0 0 24 24" width="32" height="32" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round">
            <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z"></path>
            <path d="M19 10v2a7 7 0 0 1-14 0v-2"></path>
            <line x1="12" y1="19" x2="12" y2="23"></line>
            <line x1="8" y1="23" x2="16" y2="23"></line>
        </svg>
    `;
    
    container.appendChild(btn);
    
    const statusEl = document.querySelector('.voice-status');

    if (voiceRecognition && !voiceRecognition.isSupported) {
        btn.classList.add('disabled');
        if (statusEl) statusEl.textContent = 'Voice not supported — use Chrome or Edge';
    }

    btn.addEventListener('click', () => {
        console.log('[VoiceButton] clicked | supported =', voiceRecognition?.isSupported,
            '| listening =', voiceRecognition?.isListening,
            '| browser =', navigator.userAgent);

        if (!voiceRecognition || !voiceRecognition.isSupported) {
            eventBus.emit('toast:show', {
                message: '⚠️ Voice recognition is not supported in this browser. Please open this site in Google Chrome or Microsoft Edge.',
                type: 'error'
            });
            return;
        }

        if (voiceRecognition.isListening) {
            voiceRecognition.stop();
        } else {
            if (statusEl) statusEl.textContent = 'Starting microphone...';
            voiceRecognition.start();
        }
    });

    eventBus.on('voice:start', () => {
        btn.classList.add('listening');
        if (statusEl) statusEl.textContent = 'Listening...';
    });

    eventBus.on('voice:end', () => {
        btn.classList.remove('listening');
        if (statusEl) statusEl.textContent = 'Tap to speak';
    });

    eventBus.on('voice:status', (text) => {
        if (statusEl) statusEl.textContent = text;
    });
}
