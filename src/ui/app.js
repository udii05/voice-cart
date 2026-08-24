import { initVoiceButton } from './voiceButton.js';
import { initShoppingListView } from './shoppingListView.js';
import { initSuggestionCards } from './suggestionCards.js';
import { initTranscriptDisplay } from './transcriptDisplay.js';
import { initAuthModal } from './authModal.js';
import { initCheckoutModal } from './checkoutModal.js';
import { initSearchOverlay } from './searchOverlay.js';
import { initLanguageSelector } from './languageSelector.js';
import { initLocationModal } from './locationModal.js';
import { initSeasonalSpotlight } from './seasonalSpotlight.js';
import { initVoiceOnlyModal } from './voiceOnlyModal.js';
import { locationService } from '../utils/locationService.js';
import { shoppingList } from '../modules/shoppingList.js';
import { CATEGORIES, PRODUCTS, getProductImage } from '../data/productDatabase.js';
import { eventBus } from '../utils/eventBus.js';
import { speechSynthesizer } from '../modules/speechSynthesis.js';
import { storage } from '../utils/storage.js';
import { getTranslation, formatPrice } from '../data/translations.js';

export function initApp() {
    const appContainer = document.getElementById('app');
    if (!appContainer) return;

    const currentUser = storage.get('voice_cart_user', null);
    const currentLang = storage.get('voice_cart_language', 'en-US');
    const currentLoc = locationService.getLocation();
    const t = (k) => getTranslation(k, currentLang);

    // Keep layout direction LTR so logo and UI structure never flip
    document.documentElement.dir = 'ltr';
    document.documentElement.lang = currentLang.split('-')[0];

    if (currentLang === 'ar-SA') {
        document.body.classList.add('lang-ar');
    } else {
        document.body.classList.remove('lang-ar');
    }

    const isMac = typeof navigator !== 'undefined' && /Mac|iPod|iPhone|iPad/i.test(navigator.userAgent || navigator.platform || '');
    const shortcutLabel = isMac ? '⌘K' : 'Ctrl K';

    appContainer.innerHTML = `
        <!-- Top Sticky Header -->
        <header class="header">
            <div class="header__inner">
                <div class="header__brand">
                    <div class="header__logo">
                        <div class="logo-icon-box">
                            <svg viewBox="0 0 24 24" width="16" height="16" stroke="white" stroke-width="2.5" fill="none"><circle cx="9" cy="21" r="1"></circle><circle cx="20" cy="21" r="1"></circle><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path></svg>
                        </div>
                        <span class="header__logo-text">Voice<span>Cart</span></span>
                    </div>
                    <span class="header__badge">${t('badge')}</span>
                </div>

                <div class="header__search-bar" id="header-search-bar-wrap">
                    <svg viewBox="0 0 24 24" width="18" height="18" stroke="currentColor" stroke-width="2" fill="none"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
                    <input type="text" id="main-search-input" placeholder="${t('searchPlaceholder')}" autocomplete="off">
                    <div class="search-shortcut-group" title="Quick Search: Press Ctrl+K or ⌘K">
                        <kbd class="keycap">Ctrl K</kbd>
                        <span class="keycap-divider">/</span>
                        <kbd class="keycap">⌘K</kbd>
                    </div>

                    <!-- Attached Dropdown Panel -->
                    <div class="header-search-dropdown" id="header-search-dropdown">
                        <div class="search-filters-nav">
                            <button type="button" class="filter-nav-btn" id="filter-nav-prev" title="Scroll Left">‹</button>
                            <div class="search-filters" id="dropdown-search-filters">
                                <button class="filter-pill active" data-filter="all">${t('allCategory')}</button>
                                <button class="filter-pill" data-filter="produce">${t('catProduce')}</button>
                                <button class="filter-pill" data-filter="dairy">${t('catDairy')}</button>
                                <button class="filter-pill" data-filter="bakery">${t('catBakery')}</button>
                                <button class="filter-pill" data-filter="meat">${t('catMeat')}</button>
                                <button class="filter-pill" data-filter="pantry">${t('catPantry')}</button>
                                <button class="filter-pill" data-filter="beverages">${t('catBeverages')}</button>
                                <button class="filter-pill" data-filter="snacks">${t('catSnacks')}</button>
                                <button class="filter-pill" data-filter="frozen">${t('catFrozen')}</button>
                                <button class="filter-pill" data-filter="household">${t('catHousehold')}</button>
                                <button class="filter-pill" data-filter="personal_care">${t('catPersonalCare')}</button>
                            </div>
                            <button type="button" class="filter-nav-btn" id="filter-nav-next" title="Scroll Right">›</button>
                        </div>
                        <div class="search-results-count" id="dropdown-results-count">Showing catalog items</div>
                        <div class="search-results-list" id="dropdown-results-list"></div>
                    </div>
                </div>

                <div class="header__actions">
                    <!-- Delivery Location Selector -->
                    <button class="header__btn header__location-btn" id="location-btn" title="Choose Delivery Location">
                        <div class="loc-pin-icon-wrap">
                            <svg viewBox="0 0 24 24" width="14" height="14" stroke="currentColor" stroke-width="2.5" fill="none"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle></svg>
                        </div>
                        <div class="location-btn-text">
                            <span class="location-btn-sub">Deliver to</span>
                            <span class="location-btn-title" id="current-location-label">${currentLoc.city || 'New York'}</span>
                        </div>
                        <svg class="loc-chevron" viewBox="0 0 24 24" width="11" height="11" stroke="currentColor" stroke-width="2.5" fill="none"><polyline points="6 9 12 15 18 9"></polyline></svg>
                    </button>

                    <button class="header__btn header__voice-mode-btn" id="voice-cockpit-btn" title="Open Hands-Free Voice Cockpit">
                        <span class="voice-mode-dot"></span>
                        <span class="btn-label">🎙️ Voice Mode</span>
                    </button>

                    <button class="header__btn" id="voice-help-btn" title="Voice Help Commands">
                        <svg viewBox="0 0 24 24" width="18" height="18" stroke="currentColor" stroke-width="2" fill="none"><circle cx="12" cy="12" r="10"></circle><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"></path><line x1="12" y1="17" x2="12.01" y2="17"></line></svg>
                        <span class="btn-label">${t('help')}</span>
                    </button>

                    <button class="header__btn" id="language-btn" title="Select Voice Language">
                        <svg viewBox="0 0 24 24" width="18" height="18" stroke="currentColor" stroke-width="2" fill="none"><circle cx="12" cy="12" r="10"></circle><line x1="2" y1="12" x2="22" y2="12"></line><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path></svg>
                        <span class="btn-label" id="current-lang-label">${currentLang.split('-')[1]?.toLowerCase() || currentLang.split('-')[0].toLowerCase()}</span>
                    </button>

                    <button class="header__btn" id="auth-btn" title="Sign In / User Profile">
                        <svg viewBox="0 0 24 24" width="18" height="18" stroke="currentColor" stroke-width="2" fill="none"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>
                        <span class="btn-label" id="user-btn-label">${currentUser ? currentUser.name.split(' ')[0] : t('signIn')}</span>
                    </button>

                    <button class="header__cart-btn" id="cart-summary-btn">
                        <svg viewBox="0 0 24 24" width="18" height="18" stroke="currentColor" stroke-width="2" fill="none"><circle cx="9" cy="21" r="1"></circle><circle cx="20" cy="21" r="1"></circle><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path></svg>
                        <span class="header__cart-count" id="header-cart-count">0</span>
                    </button>
                </div>
            </div>
        </header>

        <!-- Main Workspace Grid -->
        <div class="main-container">
            
            <!-- Hero Voice Command Banner -->
            <section class="voice-hero">
                <div class="voice-hero__content">
                    <div class="voice-hero__left">
                        <div class="voice-status">${t('micStatusIdle')}</div>
                        <div id="voice-btn-container"></div>
                        <div id="transcript-container"></div>
                    </div>
                    
                    <div class="voice-hero__right">
                        <div class="command-hints-title">${t('exampleTitle')}</div>
                        <div class="command-pills">
                            <button class="command-pill pill-blue" data-cmd="Add 2 gallons of milk">${t('cmd1')}</button>
                            <button class="command-pill pill-emerald" data-cmd="Buy 5 organic apples">${t('cmd2')}</button>
                            <button class="command-pill pill-teal" data-cmd="What should I buy?">"What should I buy?"</button>
                            <button class="command-pill pill-blue" data-cmd="What's in season?">"What's in season?"</button>
                            <button class="command-pill pill-emerald" data-cmd="Substitute for milk">"Substitute for milk"</button>
                            <button class="command-pill pill-teal" data-cmd="Find toothpaste under $5">${t('cmd3')}</button>
                        </div>
                    </div>
                </div>
            </section>

            <!-- Seasonal In-Season Spotlight Sliding Cards -->
            <section class="spotlight-section" id="spotlight-container"></section>

            <!-- Smart Recommendations Banner -->
            <section class="suggestions-section" id="suggestions-container"></section>

            <!-- Shopping Layout Grid (Main List + Sidebar) -->
            <div class="shopping-layout">
                <!-- Left: Shopping List Grid -->
                <main class="shopping-main">
                    <div class="list-header">
                        <div>
                            <h2 class="list-title">${t('myListTitle')}</h2>
                            <span class="list-count" id="main-list-count">0 items</span>
                        </div>
                        <div class="list-actions">
                            <button class="list-action-btn" id="read-list-btn" title="Read list out loud">
                                <svg viewBox="0 0 24 24" width="14" height="14" stroke="currentColor" stroke-width="2" fill="none"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon><path d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07"></path></svg> ${t('readAloud')}
                            </button>
                            <button class="list-action-btn" id="clear-checked-btn">${t('clearChecked')}</button>
                            <button class="list-action-btn danger" id="clear-all-btn">${t('clearAll')}</button>
                        </div>
                    </div>

                    <div id="list-items-container"></div>

                    <!-- Instant Store Catalog Section -->
                    <section class="store-catalog">
                        <div class="store-catalog__header">
                            <div>
                                <h3 class="store-catalog__title">${t('catalogTitle')}</h3>
                                <p class="store-catalog__subtitle">${t('catalogSubtitle')}</p>
                            </div>
                            <div class="store-catalog__filters" id="catalog-category-filters">
                                <button class="catalog-filter-btn active" data-category="ALL">${t('allCategory')}</button>
                                ${Object.entries(CATEGORIES).map(([key, cat]) => `
                                    <button class="catalog-filter-btn" data-category="${key}">${cat.icon} ${cat.name}</button>
                                `).join('')}
                            </div>
                        </div>

                        <div class="store-catalog__grid" id="catalog-grid"></div>
                    </section>
                </main>

                <!-- Right Sidebar: Quick Cart Summary & Checkout -->
                <aside class="shopping-sidebar">
                    <div class="sidebar-card">
                        <h3 class="sidebar-card__title">${t('orderSummaryTitle')}</h3>
                        <div class="sidebar-stats">
                            <div class="stat-row">
                                <span>${t('totalItems')}</span>
                                <strong id="sidebar-total-items">0</strong>
                            </div>
                            <div class="stat-row">
                                <span>${t('categories')}</span>
                                <strong id="sidebar-total-categories">0</strong>
                            </div>
                            <div class="stat-row">
                                <span>${t('estimatedSubtotal')}</span>
                                <strong id="sidebar-estimated-price" class="stat-price">$0.00</strong>
                            </div>
                        </div>

                        <div class="sidebar-free-delivery">
                            <div class="delivery-progress-bar">
                                <div class="delivery-progress-fill"></div>
                            </div>
                            <div class="delivery-progress-text">
                                <span class="delivery-truck-icon">🚚</span>
                                <span>Free Express Delivery on all voice orders</span>
                            </div>
                        </div>

                        <button class="checkout-btn" id="checkout-btn">
                            ${t('proceedCheckout')}
                            <svg viewBox="0 0 24 24" width="18" height="18" stroke="currentColor" stroke-width="2" fill="none"><line x1="5" y1="12" x2="19" y2="12"></line><polyline points="12 5 19 12 12 19"></polyline></svg>
                        </button>
                    </div>

                    <div class="sidebar-card info-card">
                        <div class="info-card__header">
                            <span class="info-card__icon">🎙️</span>
                            <h4>${t('voiceTipsTitle')}</h4>
                        </div>
                        <ul class="info-card__list">
                            <li>Multi-item: <em>"Add milk, eggs and bread"</em></li>
                            <li>Quantity: <em>"Buy 3 bottles of orange juice"</em></li>
                            <li>Filtering: <em>"Find organic apples under $5"</em></li>
                            <li>Multilingual: Change voice language anytime in top bar.</li>
                        </ul>
                    </div>
                </aside>
            </div>
        </div>

        <footer class="footer">
            <div class="footer__inner">
                <div class="footer__brand">Voice<span>Cart</span> — Enterprise Smart Voice Assistant Platform</div>
                <div class="footer__links">
                    <span>Copyright © 2026 VoiceCart. All rights reserved.</span>
                </div>
            </div>
        </footer>
        
        <div id="search-overlay"></div>
        <div id="toast-container"></div>
        <div id="language-modal"></div>
        <div id="voice-only-modal"></div>

        <!-- Mobile Floating Dock (Quick Voice & Cart Bar) -->
        <div class="mobile-bottom-dock" id="mobile-dock">
            <button class="mobile-dock-btn" id="mobile-search-btn" title="Search catalog">
                <svg viewBox="0 0 24 24" width="20" height="20" stroke="currentColor" stroke-width="2" fill="none"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
                <span>Search</span>
            </button>
            <button class="mobile-dock-mic" id="mobile-mic-fab" title="Open Hands-Free Voice Mode">
                <div class="mobile-mic-waves"></div>
                <svg viewBox="0 0 24 24" width="24" height="24" stroke="white" stroke-width="2.5" fill="none"><path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z"></path><path d="M19 10v2a7 7 0 0 1-14 0v-2"></path><line x1="12" y1="19" x2="12" y2="23"></line><line x1="8" y1="23" x2="16" y2="23"></line></svg>
            </button>
            <button class="mobile-dock-btn" id="mobile-cart-btn" title="View Cart & Checkout">
                <div class="mobile-dock-cart-wrap">
                    <svg viewBox="0 0 24 24" width="20" height="20" stroke="currentColor" stroke-width="2" fill="none"><circle cx="9" cy="21" r="1"></circle><circle cx="20" cy="21" r="1"></circle><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path></svg>
                    <span class="mobile-dock-cart-badge" id="mobile-dock-cart-badge">0</span>
                </div>
                <span>Cart</span>
            </button>
        </div>
    `;

    // Initialize Auth, Checkout, Search Dropdown, Language, Location & Voice-Only Modals
    const authModal = initAuthModal();
    const checkoutModal = initCheckoutModal();
    const searchOverlay = initSearchOverlay();
    const languageSelector = initLanguageSelector();
    const locationModal = initLocationModal();
    const voiceOnlyModal = initVoiceOnlyModal();

    // Location Selector Trigger
    document.getElementById('location-btn')?.addEventListener('click', () => {
        locationModal.open();
    });

    // Keyboard shortcut (⌘K or Ctrl+K) for search
    document.addEventListener('keydown', (e) => {
        if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
            e.preventDefault();
            const mainInp = document.getElementById('main-search-input');
            if (mainInp) {
                mainInp.focus();
                searchOverlay?.open();
            }
        }
    });

    document.getElementById('auth-btn').addEventListener('click', () => {
        authModal.open();
    });

    document.getElementById('language-btn').addEventListener('click', () => {
        languageSelector.open();
    });

    // Listen for Location & Currency updates to re-render prices across catalog and sidebar order summary
    const onLocationOrCurrencyChange = (loc) => {
        const label = document.getElementById('current-location-label');
        if (label) {
            label.textContent = loc?.city || locationService.getLocation()?.city || 'Select Location';
        }
        const activeCategory = document.querySelector('.catalog-filter-btn.active')?.dataset.category || 'ALL';
        const activeLang = storage.get('voice_cart_language', 'en-US');
        renderCatalog(activeCategory, activeLang);
        updateCartSummary(shoppingList.getItems());
    };

    eventBus.on('location:updated', onLocationOrCurrencyChange);
    eventBus.on('currency:updated', onLocationOrCurrencyChange);

    document.getElementById('voice-help-btn').addEventListener('click', () => {
        const activeLang = storage.get('voice_cart_language', 'en-US');
        const toastMsg = getTranslation('helpToast', activeLang);
        const speechMsg = getTranslation('helpSpeech', activeLang);

        eventBus.emit('toast:show', {
            message: toastMsg,
            type: 'info'
        });
        
        speechSynthesizer.setLanguage(activeLang);
        speechSynthesizer.speak(speechMsg, true);
    });

    document.getElementById('read-list-btn').addEventListener('click', () => {
        eventBus.emit('command:parsed', { command: { intent: 'READ_LIST' } });
        const items = shoppingList.getItems();
        if (items.length === 0) {
            speechSynthesizer.speak('Your list is currently empty');
        } else {
            const names = items.map(i => `${i.quantity} ${i.name}`).join(', ');
            speechSynthesizer.speak(`Your shopping list has ${items.length} items: ${names}`);
        }
    });

    document.getElementById('clear-checked-btn').addEventListener('click', () => {
        shoppingList.clearChecked();
    });

    document.getElementById('clear-all-btn').addEventListener('click', () => {
        shoppingList.clearList();
    });

    // Cart / Checkout Trigger
    document.getElementById('checkout-btn').addEventListener('click', () => {
        checkoutModal.open();
    });

    document.getElementById('cart-summary-btn').addEventListener('click', () => {
        checkoutModal.open();
    });

    // Hands-Free Voice-Only Cockpit Trigger
    document.getElementById('voice-cockpit-btn')?.addEventListener('click', () => {
        voiceOnlyModal.open();
    });

    document.getElementById('mobile-mic-fab')?.addEventListener('click', () => {
        voiceOnlyModal.open();
    });

    document.getElementById('mobile-search-btn')?.addEventListener('click', () => {
        searchOverlay.open();
    });

    document.getElementById('mobile-cart-btn')?.addEventListener('click', () => {
        checkoutModal.open();
    });

    // Listen to User update events to sync user button label
    eventBus.on('user:updated', (usr) => {
        const label = document.getElementById('user-btn-label');
        if (label) {
            label.textContent = usr ? usr.name.split(' ')[0] : t('signIn');
        }
    });

    // Listen for language changes to re-render UI in new target language
    eventBus.on('language:changed', () => {
        initApp();
    });

    // Command Pills Click Event
    document.querySelectorAll('.command-pill').forEach(pill => {
        pill.addEventListener('click', () => {
            const cmdText = pill.dataset.cmd;
            eventBus.emit('voice:result', { transcript: cmdText, isFinal: true, confidence: 1.0 });
        });
    });

    // Catalog Rendering & Filtering
    renderCatalog('ALL', currentLang);
    setupCatalogFilters(currentLang);

    // Listen to shopping list changes to update cart count & total price summary
    eventBus.on('list:updated', updateCartSummary);
    updateCartSummary(shoppingList.getItems());

    // Initialize sub-components
    initVoiceButton(document.getElementById('voice-btn-container'));
    initTranscriptDisplay(document.getElementById('transcript-container'));
    initSeasonalSpotlight(document.getElementById('spotlight-container'));
    initSuggestionCards(document.getElementById('suggestions-container'));
    initShoppingListView(document.getElementById('list-items-container'));

    return {
        appContainer
    };
}

function renderCatalog(selectedCategory = 'ALL', currentLang = 'en-US') {
    const grid = document.getElementById('catalog-grid');
    if (!grid) return;

    const t = (k) => getTranslation(k, currentLang);

    let itemsToDisplay = PRODUCTS;
    if (selectedCategory !== 'ALL') {
        itemsToDisplay = PRODUCTS.filter(p => p.category === selectedCategory);
    }

    grid.innerHTML = itemsToDisplay.slice(0, 24).map(prod => {
        const imgUrl = getProductImage(prod.name, prod.category);
        const icon = CATEGORIES[prod.category]?.icon || '🛒';
        return `
            <div class="catalog-card">
                <div class="catalog-card__img-wrap">
                    <img src="${imgUrl}" alt="${prod.name}" loading="lazy" onerror="this.onerror=null; this.src='https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=400&q=80';">
                </div>
                <div class="catalog-card__body">
                    <div class="catalog-card__category cat-badge-${prod.category.toLowerCase()}">${CATEGORIES[prod.category]?.name || prod.category}</div>
                    <div class="catalog-card__name">${prod.name}</div>
                    <div class="catalog-card__footer">
                        <span class="catalog-card__price">${formatPrice(prod.price, currentLang)}</span>
                        <button class="catalog-card__add-btn" data-name="${prod.name}">
                            ${t('addBtn')}
                        </button>
                    </div>
                </div>
            </div>
        `;
    }).join('');

    grid.querySelectorAll('.catalog-card__add-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const name = e.currentTarget.dataset.name;
            shoppingList.addItem(name, 1, '');
            eventBus.emit('toast:show', { message: `Added ${name} to cart`, type: 'success' });
        });
    });
}

function setupCatalogFilters(currentLang = 'en-US') {
    const filterContainer = document.getElementById('catalog-category-filters');
    if (!filterContainer) return;

    filterContainer.querySelectorAll('.catalog-filter-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            filterContainer.querySelectorAll('.catalog-filter-btn').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            renderCatalog(btn.dataset.category, currentLang);
        });
    });
}

function updateCartSummary(items = []) {
    const countEl = document.getElementById('header-cart-count');
    const mobileCountEl = document.getElementById('mobile-dock-cart-badge');
    const mainCountEl = document.getElementById('main-list-count');
    const sideItemsEl = document.getElementById('sidebar-total-items');
    const sideCatEl = document.getElementById('sidebar-total-categories');
    const sidePriceEl = document.getElementById('sidebar-estimated-price');

    if (countEl) countEl.textContent = items.length;
    if (mobileCountEl) mobileCountEl.textContent = items.length;
    if (mainCountEl) mainCountEl.textContent = `${items.length} ${items.length === 1 ? 'item' : 'items'}`;
    if (sideItemsEl) sideItemsEl.textContent = items.length;

    const categories = new Set(items.map(i => i.category));
    if (sideCatEl) sideCatEl.textContent = categories.size;

    let totalPrice = 0;
    items.forEach(item => {
        const found = PRODUCTS.find(p => p.name.toLowerCase() === item.name.toLowerCase());
        const price = found ? found.price : 3.49;
        totalPrice += price * (item.quantity || 1);
    });

    const currentLang = storage.get('voice_cart_language', 'en-US');
    if (sidePriceEl) sidePriceEl.textContent = formatPrice(totalPrice, currentLang);
}
