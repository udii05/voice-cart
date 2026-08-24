import { eventBus } from '../utils/eventBus.js';
import { searchProducts, CATEGORIES, getProductImage } from '../data/productDatabase.js';
import { shoppingList } from '../modules/shoppingList.js';
import { formatPrice } from '../data/translations.js';

export function initSearchOverlay() {
    const searchWrap = document.getElementById('header-search-bar-wrap');
    const input = document.getElementById('main-search-input');
    const dropdown = document.getElementById('header-search-dropdown');
    const countEl = document.getElementById('dropdown-results-count');
    const listEl = document.getElementById('dropdown-results-list');

    if (!input || !dropdown || !listEl) return;

    const filters = dropdown.querySelectorAll('.filter-pill');
    let currentFilter = 'all';
    let timeout = null;

    const open = () => {
        dropdown.classList.add('active');
        searchWrap?.classList.add('focused');
        doSearch();
    };

    const close = () => {
        dropdown.classList.remove('active');
        searchWrap?.classList.remove('focused');
    };

    input.addEventListener('focus', open);
    input.addEventListener('click', open);
    searchWrap.addEventListener('click', () => {
        input.focus();
        open();
    });

    document.addEventListener('click', (e) => {
        if (searchWrap && !searchWrap.contains(e.target)) {
            close();
        }
    });

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') close();
    });

    const renderResults = (results) => {
        if (countEl) countEl.textContent = `Found ${results.length} matching ${results.length === 1 ? 'item' : 'items'}`;

        if (results.length === 0) {
            listEl.innerHTML = `
                <div class="search-dropdown-empty">
                    <span>🔍</span> No products found for "${input.value}"
                </div>
            `;
            return;
        }

        listEl.innerHTML = results.slice(0, 16).map(r => {
            const imgUrl = getProductImage(r.name, r.category);
            const icon = CATEGORIES[r.category]?.icon || '🛒';
            return `
                <div class="dropdown-item-card">
                    <div class="dropdown-item-img">
                        <img src="${imgUrl}" alt="${r.name}" loading="lazy" onerror="this.style.display='none'; this.nextElementSibling.style.display='flex';">
                        <span class="dropdown-item-fallback" style="display:none;">${icon}</span>
                    </div>
                    <div class="dropdown-item-details">
                        <div class="dropdown-item-name">${r.name}</div>
                        <div class="dropdown-item-cat">${CATEGORIES[r.category]?.name || r.category}</div>
                    </div>
                    <div class="dropdown-item-price">${formatPrice(r.price || 0)}</div>
                    <button class="dropdown-item-add" data-name="${r.name}">+ Add</button>
                </div>
            `;
        }).join('');

        listEl.querySelectorAll('.dropdown-item-add').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.stopPropagation();
                const name = e.currentTarget.dataset.name;
                shoppingList.addItem(name, 1, '');
                eventBus.emit('toast:show', { message: `Added ${name} to cart`, type: 'success' });
            });
        });
    };

    const doSearch = () => {
        const query = input.value;
        const opts = {};
        if (currentFilter && currentFilter !== 'all') {
            opts.category = currentFilter.toUpperCase();
        }
        const results = searchProducts ? searchProducts(query, opts) : [];
        renderResults(results);
    };

    input.addEventListener('input', () => {
        clearTimeout(timeout);
        timeout = setTimeout(doSearch, 150);
    });

    filters.forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.stopPropagation();
            filters.forEach(f => f.classList.remove('active'));
            btn.classList.add('active');
            currentFilter = btn.dataset.filter;
            doSearch();
        });
    });

    const prevBtn = dropdown.querySelector('#filter-nav-prev');
    const nextBtn = dropdown.querySelector('#filter-nav-next');
    const filtersContainer = dropdown.querySelector('#dropdown-search-filters');

    if (prevBtn && nextBtn && filtersContainer) {
        prevBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            filtersContainer.scrollBy({ left: -160, behavior: 'smooth' });
        });
        nextBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            filtersContainer.scrollBy({ left: 160, behavior: 'smooth' });
        });
    }

    eventBus.on('search:results', ({results, query}) => {
        input.value = query;
        renderResults(results);
        open();
    });

    return { open, close };
}
