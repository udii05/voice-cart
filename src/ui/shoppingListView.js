import { eventBus } from '../utils/eventBus.js';
import { shoppingList } from '../modules/shoppingList.js';
import { suggestionsEngine } from '../modules/suggestions.js';
import { CATEGORIES, PRODUCTS, getProductImage } from '../data/productDatabase.js';
import { formatPrice } from '../data/translations.js';

export function initShoppingListView(container) {
    const updateCount = (items) => {
        const countEl = document.querySelector('.list-count');
        if (countEl) countEl.textContent = `${items.length} items`;
    };

    const render = () => {
        const itemsByCategory = shoppingList.getItemsByCategory();
        const allItems = shoppingList.getItems();
        
        updateCount(allItems);

        if (allItems.length === 0) {
            container.innerHTML = `
                <div class="empty-state">
                    <div class="empty-state__icon">
                        <svg viewBox="0 0 24 24" width="48" height="48" stroke="currentColor" stroke-width="2" fill="none"><circle cx="9" cy="21" r="1"></circle><circle cx="20" cy="21" r="1"></circle><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path></svg>
                    </div>
                    <div class="empty-state__title">Your list is empty</div>
                    <div class="empty-state__subtitle">Start by tapping the microphone and saying "Add milk" or "I need bananas"</div>
                </div>
            `;
            return;
        }

        container.innerHTML = '';

        for (const [category, items] of Object.entries(itemsByCategory)) {
            if (items.length === 0) continue;

            const group = document.createElement('div');
            group.className = 'category-group';
            
            group.innerHTML = `
                <div class="category-header">
                    <span class="category-icon icon-box-${category.toLowerCase()}">${CATEGORIES[category]?.icon || '🛒'}</span>
                    <span class="category-name">${CATEGORIES[category]?.name || category}</span>
                    <span class="category-count">${items.length}</span>
                    <svg class="category-chevron" viewBox="0 0 24 24" width="16" height="16" stroke="currentColor" stroke-width="2" fill="none"><polyline points="6 9 12 15 18 9"></polyline></svg>
                </div>
                <div class="category-items"></div>
            `;

            const header = group.querySelector('.category-header');
            const itemsContainer = group.querySelector('.category-items');

            header.addEventListener('click', () => {
                header.classList.toggle('collapsed');
                itemsContainer.style.display = header.classList.contains('collapsed') ? 'none' : 'block';
            });

            items.forEach(item => {
                const itemEl = document.createElement('div');
                itemEl.className = `list-item-wrapper`;
                
                const imgUrl = getProductImage(item.name, item.category);
                const foundProd = PRODUCTS.find(p => p.name.toLowerCase() === item.name.toLowerCase());
                const unitPrice = foundProd ? foundProd.price : 3.49;
                const itemTotal = unitPrice * (item.quantity || 1);

                const subs = suggestionsEngine.getSubstitutes(item.name);
                const hasSubs = subs && subs.length > 0;

                itemEl.innerHTML = `
                    <div class="list-item ${item.checked ? 'checked' : ''}" data-id="${item.id}">
                        <div class="list-item__checkbox ${item.checked ? 'checked' : ''}">
                            ${item.checked ? '<svg viewBox="0 0 24 24" width="16" height="16" stroke="white" stroke-width="2" fill="none"><polyline points="20 6 9 17 4 12"></polyline></svg>' : ''}
                        </div>
                        <div class="search-result-card__img-wrap" style="width:40px; height:40px; border-radius:8px;">
                            <img src="${imgUrl}" alt="${item.name}" loading="lazy" onerror="this.onerror=null; this.src='https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=400&q=80';">
                        </div>
                        <div class="list-item__info">
                            <div class="list-item__name">${item.name}</div>
                            <div class="list-item__meta">${item.quantity} ${item.unit || ''} • <strong>${formatPrice(itemTotal)}</strong></div>
                        </div>
                        <div class="list-item__quantity">
                            <button class="list-item__qty-btn minus">-</button>
                            <span class="list-item__qty-value">${item.quantity}</span>
                            <button class="list-item__qty-btn plus">+</button>
                        </div>
                        <button class="list-item__delete" title="Remove item">
                            <svg viewBox="0 0 24 24" width="16" height="16" stroke="currentColor" stroke-width="2" fill="none"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>
                        </button>
                    </div>

                    ${hasSubs ? `
                        <div class="list-item__sub-row">
                            <button class="list-item__sub-toggle" data-id="${item.id}">
                                <span>🌱 Dietary / Healthy Swaps (${subs.length})</span>
                                <svg viewBox="0 0 24 24" width="12" height="12" stroke="currentColor" stroke-width="2.5" fill="none"><polyline points="6 9 12 15 18 9"></polyline></svg>
                            </button>
                            <div class="list-item__sub-drawer" id="sub-drawer-${item.id}" style="display:none;">
                                <div class="sub-drawer__list">
                                    ${subs.slice(0, 3).map(sub => `
                                        <div class="sub-drawer__item">
                                            <div class="sub-drawer__info">
                                                <span class="sub-name">${sub.name}</span>
                                                <span class="sub-reason">${sub.reason}</span>
                                            </div>
                                            <button class="sub-drawer__swap-btn" data-old-id="${item.id}" data-old-name="${item.name}" data-new-name="${sub.name}">
                                                🔄 Swap
                                            </button>
                                        </div>
                                    `).join('')}
                                </div>
                            </div>
                        </div>
                    ` : ''}
                `;

                // Checkbox toggle
                const checkbox = itemEl.querySelector('.list-item__checkbox');
                checkbox.addEventListener('click', () => {
                    shoppingList.toggleItem(item.id);
                });

                // Quantity controls
                itemEl.querySelector('.minus').addEventListener('click', () => {
                    if (item.quantity > 1) {
                        shoppingList.updateQuantity(item.id, item.quantity - 1);
                    }
                });

                itemEl.querySelector('.plus').addEventListener('click', () => {
                    shoppingList.updateQuantity(item.id, item.quantity + 1);
                });

                // Delete
                itemEl.querySelector('.list-item__delete').addEventListener('click', () => {
                    shoppingList.removeItem(item.id);
                });

                // Substitute drawer toggle
                const subToggle = itemEl.querySelector('.list-item__sub-toggle');
                if (subToggle) {
                    subToggle.addEventListener('click', () => {
                        const drawer = itemEl.querySelector(`#sub-drawer-${item.id}`);
                        if (drawer) {
                            const isHidden = drawer.style.display === 'none';
                            drawer.style.display = isHidden ? 'block' : 'none';
                            subToggle.classList.toggle('active', isHidden);
                        }
                    });
                }

                // Swap buttons
                itemEl.querySelectorAll('.sub-drawer__swap-btn').forEach(swapBtn => {
                    swapBtn.addEventListener('click', () => {
                        const oldId = swapBtn.dataset.oldId;
                        const oldName = swapBtn.dataset.oldName;
                        const newName = swapBtn.dataset.newName;
                        shoppingList.swapItem(oldId, newName);
                        eventBus.emit('toast:show', { message: `Swapped ${oldName} for ${newName}!`, type: 'success' });
                        eventBus.emit('suggestions:updated');
                    });
                });

                itemsContainer.appendChild(itemEl);
            });

            container.appendChild(group);
        }
    };

    eventBus.on('list:updated', render);
    eventBus.on('location:updated', render);
    eventBus.on('currency:updated', render);
    render();
}
