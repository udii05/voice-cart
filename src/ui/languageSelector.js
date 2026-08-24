import { eventBus } from '../utils/eventBus.js';
import { voiceRecognition } from '../modules/voiceRecognition.js';
import { speechSynthesizer } from '../modules/speechSynthesis.js';
import { storage } from '../utils/storage.js';

export function initLanguageSelector() {
    const modal = document.getElementById('language-modal');
    if (!modal) return;
    
    modal.className = 'modal-backdrop language-modal-backdrop';
    
    const languages = [
        { flag: '🇺🇸', name: 'English (US)', code: 'en-US' },
        { flag: '🇬🇧', name: 'English (UK)', code: 'en-GB' },
        { flag: '🇪🇸', name: 'Spanish (ES)', code: 'es-ES' },
        { flag: '🇫🇷', name: 'French (FR)', code: 'fr-FR' },
        { flag: '🇩🇪', name: 'German (DE)', code: 'de-DE' },
        { flag: '🇮🇹', name: 'Italian (IT)', code: 'it-IT' },
        { flag: '🇵🇹', name: 'Portuguese (BR)', code: 'pt-BR' },
        { flag: '🇮🇳', name: 'Hindi (IN)', code: 'hi-IN' },
        { flag: '🇨🇳', name: 'Chinese (CN)', code: 'zh-CN' },
        { flag: '🇯🇵', name: 'Japanese (JP)', code: 'ja-JP' },
        { flag: '🇰🇷', name: 'Korean (KR)', code: 'ko-KR' },
        { flag: '🇸🇦', name: 'Arabic (SA)', code: 'ar-SA' },
        { flag: '🇷🇺', name: 'Russian (RU)', code: 'ru-RU' },
        { flag: '🇳🇱', name: 'Dutch (NL)', code: 'nl-NL' }
    ];

    let currentLang = storage.get('voice_cart_language', 'en-US');
    
    const renderModal = () => {
        modal.innerHTML = `
            <div class="modal-card language-modal-card" style="animation: none !important; max-width: 640px; width: 100%;">
                <div class="language-modal-header">
                    <div>
                        <h2 class="modal-title">Select Voice Language</h2>
                        <p class="modal-subtitle">Choose language for voice command recognition & speech output</p>
                    </div>
                    <button class="modal-close-btn" id="lang-modal-close">
                        <svg viewBox="0 0 24 24" width="20" height="20" stroke="currentColor" stroke-width="2" fill="none"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
                    </button>
                </div>

                <div class="language-grid">
                    ${languages.map(lang => {
                        const isActive = lang.code === currentLang;
                        return `
                            <button type="button" class="language-card ${isActive ? 'active' : ''}" data-code="${lang.code}">
                                <span class="language-flag">${lang.flag}</span>
                                <div class="language-info">
                                    <div class="language-name">${lang.name}</div>
                                    <div class="language-code">${lang.code}</div>
                                </div>
                            </button>
                        `;
                    }).join('')}
                </div>
            </div>
        `;

        bindEvents();
    };

    const open = () => {
        renderModal();
        modal.classList.add('active');
    };

    const close = () => modal.classList.remove('active');

    const bindEvents = () => {
        const closeBtn = modal.querySelector('#lang-modal-close');
        if (closeBtn) closeBtn.onclick = close;

        modal.querySelectorAll('.language-card').forEach(card => {
            card.onclick = () => {
                const code = card.dataset.code;
                currentLang = code;
                
                if (voiceRecognition && voiceRecognition.setLanguage) voiceRecognition.setLanguage(code);
                if (speechSynthesizer && speechSynthesizer.setLanguage) speechSynthesizer.setLanguage(code);
                
                storage.set('voice_cart_language', code);
                
                const label = document.getElementById('current-lang-label');
                if (label) label.textContent = code.split('-')[1]?.toLowerCase() || code.split('-')[0].toLowerCase();

                const langName = languages.find(l => l.code === code)?.name || code;
                eventBus.emit('toast:show', { message: `Language changed to ${langName}`, type: 'success' });
                eventBus.emit('language:changed', code);
                
                close();
            };
        });
    };

    modal.addEventListener('click', (e) => {
        if (e.target === modal) close();
    });
    
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && modal.classList.contains('active')) close();
    });

    renderModal();
    
    return { open, close };
}
