import { eventBus } from '../utils/eventBus.js';
import { shoppingList } from '../modules/shoppingList.js';
import { PRODUCTS, getProductImage } from '../data/productDatabase.js';
import { formatPrice } from '../data/translations.js';

export function initTranscriptDisplay(container) {
    if (!container) return;

    let display = container.querySelector('.transcript-display');
    if (!display) {
        display = document.createElement('div');
        display.className = 'transcript-display';
        container.appendChild(display);
    }
    
    let clearTimer = null;

    const resetTimer = (delay = 5000) => {
        clearTimeout(clearTimer);
        clearTimer = setTimeout(() => {
            display.innerHTML = '';
        }, delay);
    };

    // Show small live transcript box below mic as user speaks
    eventBus.on('voice:result', ({ transcript, isFinal }) => {
        if (!isFinal) {
            // Live interim transcription — small box, small italic text
            display.innerHTML = `<div class="transcript-live-box">
                <span class="transcript-text interim">"${transcript}"</span>
            </div>`;
        } else {
            // Final processed result
            display.innerHTML = `<div class="transcript-live-box final">
                <span class="transcript-text final-speech">"${transcript}"</span>
                <span class="transcript-action">✅ Command processed</span>
            </div>`;
            resetTimer(4000);
        }
    });

    // Action confirmation card when item is added
    eventBus.on('list:item-added', ({ item }) => {
        renderActionCard(item, 'added');
    });

    eventBus.on('list:item-swapped', ({ oldItem, newItem }) => {
        renderActionCard(newItem, 'swapped', oldItem);
    });

    function renderActionCard(item, actionType = 'added', oldItem = null) {
        const foundProd = PRODUCTS.find(p => p.name.toLowerCase() === item.name.toLowerCase());
        const imgUrl = getProductImage(item.name, item.category || foundProd?.category || 'PRODUCE');
        const unitPrice = foundProd ? foundProd.price : 3.49;
        const totalCost = unitPrice * (item.quantity || 1);

        display.innerHTML = `
            <div class="action-confirmation-card animate-slide-in">
                <div class="action-card__badge-row">
                    <span class="action-card__status-badge">
                        ${actionType === 'swapped' ? '🔄 ITEM SWAPPED' : '✓ ADDED TO CART'}
                    </span>
                    <span class="action-card__time">Just now</span>
                </div>
                <div class="action-card__body">
                    <div class="action-card__img-box">
                        <img src="${imgUrl}" alt="${item.name}" loading="lazy" onerror="this.onerror=null; this.src='https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=200&q=80';">
                    </div>
                    <div class="action-card__details">
                        <div class="action-card__name">${item.name}</div>
                        <div class="action-card__meta">
                            ${actionType === 'swapped' && oldItem ? `Replaced <s>${oldItem.name}</s> • ` : ''}
                            <span>${item.quantity} ${item.unit || 'pack'}</span> • 
                            <strong class="action-card__price">${formatPrice(totalCost)}</strong>
                        </div>
                    </div>
                </div>
                <div class="action-card__countdown-bar"></div>
            </div>
        `;

        resetTimer(5500);
    }
}
