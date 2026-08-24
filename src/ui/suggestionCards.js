import { eventBus } from '../utils/eventBus.js';
import { suggestionsEngine } from '../modules/suggestions.js';
import { shoppingList } from '../modules/shoppingList.js';
import { CATEGORIES, PRODUCTS, getProductImage } from '../data/productDatabase.js';
import { formatPrice } from '../data/translations.js';

let activeRecTab = 'restock'; // 'restock' | 'seasonal' | 'substitutes'

export function initSuggestionCards(container) {
    if (!container) return;

    const render = () => {
        const restockItems = suggestionsEngine.getRestockRecommendations(6);
        const seasonalItems = suggestionsEngine.getSeasonalAndSale(6);
        const substituteItems = suggestionsEngine.getSubstitutesForCurrentList();

        let itemsToDisplay = [];
        if (activeRecTab === 'restock') itemsToDisplay = restockItems;
        else if (activeRecTab === 'seasonal') itemsToDisplay = seasonalItems;
        else if (activeRecTab === 'substitutes') itemsToDisplay = substituteItems;

        container.style.display = 'block';

        let html = `
            <div class="recommendations-hub">
                <div class="recommendations-hub__header">
                    <div class="rec-title-wrap">
                        <div>
                            <h3 class="rec-title">AI Smart Recommendations</h3>
                            <p class="rec-subtitle">Personalized restock alerts, seasonal harvest picks & dietary swaps</p>
                        </div>
                    </div>

                    <div class="rec-tabs">
                        <button class="rec-tab ${activeRecTab === 'restock' ? 'active' : ''}" data-tab="restock">
                            ⚡ Low Stock & Restock
                            <span class="rec-tab-count">${restockItems.length}</span>
                        </button>
                        <button class="rec-tab ${activeRecTab === 'seasonal' ? 'active' : ''}" data-tab="seasonal">
                            🌱 In-Season & Deals
                            <span class="rec-tab-count">${seasonalItems.length}</span>
                        </button>
                        <button class="rec-tab ${activeRecTab === 'substitutes' ? 'active' : ''}" data-tab="substitutes">
                            🔄 Smart Swaps
                            <span class="rec-tab-count">${substituteItems.length}</span>
                        </button>
                    </div>
                </div>

                <div class="recommendations-grid">
        `;

        if (itemsToDisplay.length === 0) {
            html += `
                <div class="rec-empty-state">
                    <span>🎉</span>
                    <p>No active recommendations in this category right now.</p>
                </div>
            `;
        } else {
            itemsToDisplay.forEach(item => {
                const foundProd = PRODUCTS.find(p => p.name.toLowerCase() === item.name.toLowerCase());
                const imgUrl = getProductImage(item.name, foundProd?.category || 'PRODUCE');
                const priceStr = foundProd ? formatPrice(item.salePrice || foundProd.price) : formatPrice(3.49);
                const isSwap = item.type === 'substitute' && item.originalItem;

                html += `
                    <div class="rec-card rec-card--${item.type}" data-name="${item.name}">
                        <div class="rec-card__img-box">
                            <img src="${imgUrl}" alt="${item.name}" loading="lazy" onerror="this.onerror=null; this.src='https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=300&q=80';">
                            <span class="rec-card__badge badge-${item.type}">${item.badge || 'RECOMMENDED'}</span>
                        </div>
                        <div class="rec-card__info">
                            <div class="rec-card__name">${item.name}</div>
                            <div class="rec-card__reason">${item.reason}</div>
                            <div class="rec-card__bottom">
                                <span class="rec-card__price">${priceStr}</span>
                                <button class="rec-card__action-btn ${isSwap ? 'swap-btn' : 'add-btn'}" 
                                        data-name="${item.name}" 
                                        data-type="${item.type}"
                                        data-orig-id="${item.originalItem?.id || ''}"
                                        data-orig-name="${item.originalName || ''}">
                                    ${isSwap ? '🔄 Swap' : '+ Add'}
                                </button>
                            </div>
                        </div>
                    </div>
                `;
            });
        }

        html += `
                </div>
            </div>
        `;

        container.innerHTML = html;

        // Tab switching
        container.querySelectorAll('.rec-tab').forEach(tabBtn => {
            tabBtn.addEventListener('click', () => {
                activeRecTab = tabBtn.dataset.tab;
                render();
            });
        });

        // Action button (Add or Swap)
        container.querySelectorAll('.rec-card__action-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const name = btn.dataset.name;
                const type = btn.dataset.type;
                const origId = btn.dataset.origId;
                const origName = btn.dataset.origName;

                if (type === 'substitute' && origId) {
                    shoppingList.swapItem(origId, name);
                    eventBus.emit('toast:show', { message: `Swapped ${origName} with ${name}!`, type: 'success' });
                } else {
                    shoppingList.addItem(name, 1, '');
                    eventBus.emit('toast:show', { message: `Added ${name} to cart`, type: 'success' });
                }

                eventBus.emit('suggestions:updated');
            });
        });
    };

    eventBus.on('suggestions:updated', render);
    eventBus.on('list:updated', render);
    eventBus.on('location:updated', render);
    eventBus.on('currency:updated', render);
    eventBus.on('recommendations:switch-tab', (tab) => {
        if (['restock', 'seasonal', 'substitutes'].includes(tab)) {
            activeRecTab = tab;
            render();
        }
    });

    render();
}

