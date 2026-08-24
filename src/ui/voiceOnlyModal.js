import { eventBus } from '../utils/eventBus.js';
import { voiceRecognition } from '../modules/voiceRecognition.js';
import { shoppingList } from '../modules/shoppingList.js';
import { nlpParser } from '../modules/nlpParser.js';
import { formatPrice } from '../data/translations.js';
import { PRODUCTS, getProductImage } from '../data/productDatabase.js';
import { audioFeedback } from '../utils/audioFeedback.js';

export function initVoiceOnlyModal() {
    let container = document.getElementById('voice-only-modal');
    if (!container) {
        container = document.createElement('div');
        container.id = 'voice-only-modal';
        container.className = 'voice-only-backdrop';
        document.body.appendChild(container);
    }

    let isOpen = false;

    const render = () => {
        const items = shoppingList.getItems();
        const totalPrice = items.reduce((sum, item) => {
            const p = PRODUCTS.find(prod => prod.name.toLowerCase() === item.name.toLowerCase());
            return sum + (p ? p.price : 3.49) * (item.quantity || 1);
        }, 0);

        container.innerHTML = `
            <div class="voice-only-cockpit">
                <!-- Top Nav / Close -->
                <div class="voice-cockpit__header">
                    <div class="voice-cockpit__brand">
                        <div class="cockpit-logo-dot"></div>
                        <span>VoiceCart <strong>Hands-Free Cockpit</strong></span>
                    </div>
                    <button class="voice-cockpit__close-btn" id="cockpit-close-btn" title="Exit Hands-Free Mode">
                        ✕ Exit
                    </button>
                </div>

                <!-- Main Center Audio Sphere -->
                <div class="voice-cockpit__center">
                    <div class="cockpit-mic-ring ${voiceRecognition.isListening ? 'active' : ''}">
                        <div class="cockpit-mic-pulse"></div>
                        <div class="cockpit-mic-pulse-2"></div>
                        <button class="cockpit-mic-sphere" id="cockpit-mic-toggle">
                            <svg viewBox="0 0 24 24" width="48" height="48" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round">
                                <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z"></path>
                                <path d="M19 10v2a7 7 0 0 1-14 0v-2"></path>
                                <line x1="12" y1="19" x2="12" y2="23"></line>
                                <line x1="8" y1="23" x2="16" y2="23"></line>
                            </svg>
                        </button>
                    </div>

                    <div class="cockpit-status-label" id="cockpit-status-lbl">
                        ${voiceRecognition.isListening ? 'Listening live... Speak any command' : 'Tap sphere or speak to start'}
                    </div>

                    <!-- Equalizer wave bars -->
                    <div class="cockpit-equalizer ${voiceRecognition.isListening ? 'active' : ''}">
                        <span class="c-bar"></span>
                        <span class="c-bar"></span>
                        <span class="c-bar"></span>
                        <span class="c-bar"></span>
                        <span class="c-bar"></span>
                        <span class="c-bar"></span>
                        <span class="c-bar"></span>
                    </div>
                </div>

                <!-- Live Subtitles & Intent HUD -->
                <div class="voice-cockpit__transcript-box" id="cockpit-transcript-box">
                    <div class="cockpit-subtitles" id="cockpit-subtitles">
                        "Say something like 'Add 2 bottles of olive oil' or 'What's in season?'"
                    </div>
                </div>

                <!-- Live Action Card Popup in Cockpit -->
                <div class="cockpit-action-slot" id="cockpit-action-slot"></div>

                <!-- Bottom Cart Strip & Quick Command Hints -->
                <div class="voice-cockpit__bottom">
                    <div class="cockpit-cart-bar">
                        <div class="cockpit-cart-info">
                            <span class="cockpit-cart-icon">🛒</span>
                            <span><strong>${items.length} items</strong> in cart</span>
                            <span class="cockpit-cart-dot">•</span>
                            <span class="cockpit-cart-total">${formatPrice(totalPrice)}</span>
                        </div>
                        <button class="cockpit-checkout-btn" id="cockpit-checkout-btn">
                            Proceed to Checkout →
                        </button>
                    </div>

                    <div class="cockpit-hints-scroll">
                        <button class="cockpit-hint-chip" data-cmd="Add 2 gallons of milk">"Add 2 gallons of milk"</button>
                        <button class="cockpit-hint-chip" data-cmd="Buy 5 bananas and 3 apples">"Buy 5 bananas & 3 apples"</button>
                        <button class="cockpit-hint-chip" data-cmd="What's in season?">"What's in season?"</button>
                        <button class="cockpit-hint-chip" data-cmd="What should I buy?">"What should I buy?"</button>
                        <button class="cockpit-hint-chip" data-cmd="Substitute for milk">"Substitute for milk"</button>
                        <button class="cockpit-hint-chip" data-cmd="Read my list">"Read my list"</button>
                    </div>
                </div>
            </div>
        `;

        // Listeners
        container.querySelector('#cockpit-close-btn')?.addEventListener('click', () => {
            close();
        });

        container.querySelector('#cockpit-mic-toggle')?.addEventListener('click', () => {
            if (voiceRecognition.isListening) {
                voiceRecognition.stop();
            } else {
                voiceRecognition.start();
            }
        });

        container.querySelector('#cockpit-checkout-btn')?.addEventListener('click', () => {
            close();
            document.getElementById('checkout-btn')?.click();
        });

        container.querySelectorAll('.cockpit-hint-chip').forEach(chip => {
            chip.addEventListener('click', () => {
                const cmd = chip.dataset.cmd;
                eventBus.emit('voice:result', { transcript: cmd, isFinal: true, confidence: 1.0 });
            });
        });
    };

    const open = () => {
        isOpen = true;
        render();
        container.classList.add('active');
        document.body.style.overflow = 'hidden';
        if (!voiceRecognition.isListening) {
            voiceRecognition.start();
        }
    };

    const close = () => {
        isOpen = false;
        container.classList.remove('active');
        document.body.style.overflow = '';
    };

    // Voice & List state handlers for Cockpit
    eventBus.on('voice:start', () => {
        if (!isOpen) return;
        const ring = container.querySelector('.cockpit-mic-ring');
        const eq = container.querySelector('.cockpit-equalizer');
        const lbl = container.querySelector('#cockpit-status-lbl');
        ring?.classList.add('active');
        eq?.classList.add('active');
        if (lbl) lbl.textContent = 'Listening live... Speak any command';
    });

    eventBus.on('voice:end', () => {
        if (!isOpen) return;
        const ring = container.querySelector('.cockpit-mic-ring');
        const eq = container.querySelector('.cockpit-equalizer');
        const lbl = container.querySelector('#cockpit-status-lbl');
        ring?.classList.remove('active');
        eq?.classList.remove('active');
        if (lbl) lbl.textContent = 'Tap sphere to speak';
    });

    eventBus.on('voice:result', ({ transcript, isFinal }) => {
        if (!isOpen) return;
        const sub = container.querySelector('#cockpit-subtitles');
        if (sub) {
            sub.textContent = `"${transcript}"`;
            sub.classList.toggle('interim', !isFinal);
        }

        if (isFinal && /(exit|close|leave)\s*(?:voice|handsfree|cockpit|mode)?/i.test(transcript)) {
            close();
        }
    });

    eventBus.on('list:item-added', ({ item }) => {
        if (!isOpen) return;
        renderCockpitActionCard(item, 'added');
        renderCartBar();
    });

    eventBus.on('list:item-swapped', ({ oldItem, newItem }) => {
        if (!isOpen) return;
        renderCockpitActionCard(newItem, 'swapped', oldItem);
        renderCartBar();
    });

    eventBus.on('list:updated', () => {
        if (!isOpen) return;
        renderCartBar();
    });

    function renderCartBar() {
        const items = shoppingList.getItems();
        const totalPrice = items.reduce((sum, item) => {
            const p = PRODUCTS.find(prod => prod.name.toLowerCase() === item.name.toLowerCase());
            return sum + (p ? p.price : 3.49) * (item.quantity || 1);
        }, 0);
        const info = container.querySelector('.cockpit-cart-info');
        if (info) {
            info.innerHTML = `
                <span class="cockpit-cart-icon">🛒</span>
                <span><strong>${items.length} items</strong> in cart</span>
                <span class="cockpit-cart-dot">•</span>
                <span class="cockpit-cart-total">${formatPrice(totalPrice)}</span>
            `;
        }
    }

    function renderCockpitActionCard(item, actionType = 'added', oldItem = null) {
        const slot = container.querySelector('#cockpit-action-slot');
        if (!slot) return;

        const foundProd = PRODUCTS.find(p => p.name.toLowerCase() === item.name.toLowerCase());
        const imgUrl = getProductImage(item.name, item.category || foundProd?.category || 'PRODUCE');

        slot.innerHTML = `
            <div class="cockpit-action-card animate-slide-in">
                <img src="${imgUrl}" alt="${item.name}" class="cockpit-action-img" onerror="this.onerror=null; this.src='https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=200&q=80';">
                <div class="cockpit-action-details">
                    <span class="cockpit-action-badge">${actionType === 'swapped' ? '🔄 SWAPPED' : '✓ ADDED'}</span>
                    <h5 class="cockpit-action-title">${item.quantity}x ${item.name}</h5>
                    ${actionType === 'swapped' && oldItem ? `<small>Replaced ${oldItem.name}</small>` : ''}
                </div>
            </div>
        `;

        setTimeout(() => {
            if (slot.querySelector('.cockpit-action-card')) {
                slot.innerHTML = '';
            }
        }, 4500);
    }

    return {
        open,
        close,
        isOpen: () => isOpen
    };
}
