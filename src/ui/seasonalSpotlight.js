import { eventBus } from '../utils/eventBus.js';
import { shoppingList } from '../modules/shoppingList.js';
import { formatPrice } from '../data/translations.js';

const DAY_MS = 24 * 60 * 60 * 1000;

// ── 1. IN-SEASON PRODUCE (Rotates every 3 days) ───────────────
const SEASONAL_PRODUCE_SETS = [
    {
        id: 'seasonal_berries',
        badge: '🌱 IN SEASON',
        badgeClass: 'badge-emerald',
        title: 'Peak Season Berries & Orchard Fruit',
        tagline: 'Hand-picked from certified regional farms at peak sweetness',
        image: 'https://images.unsplash.com/photo-1464965911861-746a04b4bca6?auto=format&fit=crop&w=600&q=80',
        bgTheme: 'card-theme-emerald',
        items: [
            { name: 'Strawberries', qty: 1, unit: 'box', price: 3.99 },
            { name: 'Blueberries', qty: 1, unit: 'pack', price: 4.49 },
            { name: 'Organic Apples', qty: 3, unit: 'pcs', price: 2.99 }
        ]
    },
    {
        id: 'seasonal_citrus',
        badge: '🍊 IN SEASON',
        badgeClass: 'badge-teal',
        title: 'Sun-Ripened Valencia Citrus & Grapes',
        tagline: 'Bursting with vitamin C, juicy sweetness & sun-ripened flavor',
        image: 'https://images.unsplash.com/photo-1611080626919-7cf5a9dbab5b?auto=format&fit=crop&w=600&q=80',
        bgTheme: 'card-theme-teal',
        items: [
            { name: 'Oranges', qty: 4, unit: 'pcs', price: 3.49 },
            { name: 'Green Grapes', qty: 1, unit: 'bunch', price: 3.89 },
            { name: 'Lemons', qty: 3, unit: 'pcs', price: 1.99 }
        ]
    },
    {
        id: 'seasonal_greens',
        badge: '🥦 IN SEASON',
        badgeClass: 'badge-emerald',
        title: 'Tender Broccoli & Crisp Baby Spinach',
        tagline: 'Fresh morning cut greens packed with iron, minerals & fiber',
        image: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=600&q=80',
        bgTheme: 'card-theme-emerald',
        items: [
            { name: 'Broccoli', qty: 2, unit: 'heads', price: 2.89 },
            { name: 'Organic Spinach', qty: 1, unit: 'box', price: 3.29 },
            { name: 'Cucumbers', qty: 2, unit: 'pcs', price: 2.19 }
        ]
    },
    {
        id: 'seasonal_tomatoes',
        badge: '🍅 IN SEASON',
        badgeClass: 'badge-teal',
        title: 'Vine-Ripened Tomatoes & Sweet Peppers',
        tagline: 'Sun-warmed farm tomatoes, sweet bell peppers & garden garlic',
        image: 'https://images.unsplash.com/photo-1592924357228-91a4daadcfea?auto=format&fit=crop&w=600&q=80',
        bgTheme: 'card-theme-teal',
        items: [
            { name: 'Tomatoes', qty: 4, unit: 'pcs', price: 2.99 },
            { name: 'Bell Peppers', qty: 2, unit: 'pcs', price: 2.49 },
            { name: 'Garlic', qty: 1, unit: 'pack', price: 1.69 }
        ]
    }
];

// ── 2. FRESHLY BAKED (Rotates EVERY SINGLE DAY) ───────────────
const DAILY_BAKERY_SETS = [
    {
        id: 'bakery_sourdough',
        badge: '🥖 FRESHLY BAKED TODAY',
        badgeClass: 'badge-emerald',
        title: 'Artisan Hearth Sourdough & Croissants',
        tagline: 'Slow-fermented artisan crusts baked fresh at dawn',
        image: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=600&q=80',
        bgTheme: 'card-theme-emerald',
        items: [
            { name: 'Sourdough Bread', qty: 1, unit: 'loaf', price: 4.29 },
            { name: 'Croissants', qty: 2, unit: 'pcs', price: 2.49 },
            { name: 'Whole Wheat Bread', qty: 1, unit: 'loaf', price: 3.49 }
        ]
    },
    {
        id: 'bakery_baguettes',
        badge: '🥖 FRESHLY BAKED TODAY',
        badgeClass: 'badge-emerald',
        title: 'French Baguettes & Golden Brioche',
        tagline: 'Crisp golden crusts with soft, buttery honeycomb crumb',
        image: 'https://images.unsplash.com/photo-1549931319-a545dcf3bc73?auto=format&fit=crop&w=600&q=80',
        bgTheme: 'card-theme-emerald',
        items: [
            { name: 'Baguette', qty: 1, unit: 'loaf', price: 2.99 },
            { name: 'Sourdough Bread', qty: 1, unit: 'loaf', price: 4.29 },
            { name: 'Butter', qty: 1, unit: 'block', price: 3.99 }
        ]
    },
    {
        id: 'bakery_bagels',
        badge: '🥖 FRESHLY BAKED TODAY',
        badgeClass: 'badge-emerald',
        title: 'Boiled NY Bagels & Morning Muffins',
        tagline: 'Chewy traditional kettle bagels paired with fresh morning bakes',
        image: 'https://images.unsplash.com/photo-1586985289688-ca3cf47d3e6e?auto=format&fit=crop&w=600&q=80',
        bgTheme: 'card-theme-emerald',
        items: [
            { name: 'Whole Wheat Bread', qty: 1, unit: 'loaf', price: 3.49 },
            { name: 'Croissants', qty: 2, unit: 'pcs', price: 2.49 },
            { name: 'Sourdough Bread', qty: 1, unit: 'loaf', price: 4.29 }
        ]
    },
    {
        id: 'bakery_ciabatta',
        badge: '🥖 FRESHLY BAKED TODAY',
        badgeClass: 'badge-emerald',
        title: 'Italian Ciabatta & Rustic Loaves',
        tagline: 'Open crumb artisan loaves perfect for dipping in olive oil',
        image: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=600&q=80',
        bgTheme: 'card-theme-emerald',
        items: [
            { name: 'Sourdough Bread', qty: 1, unit: 'loaf', price: 4.29 },
            { name: 'Baguette', qty: 1, unit: 'loaf', price: 2.99 },
            { name: 'Whole Wheat Bread', qty: 1, unit: 'loaf', price: 3.49 }
        ]
    }
];

// ── 3. PURE ORGANIC DAIRY & FARM (Rotates EVERY SINGLE DAY) ───
const DAILY_DAIRY_SETS = [
    {
        id: 'dairy_pasture',
        badge: '🥛 DAILY FARM PICK',
        badgeClass: 'badge-blue',
        title: 'Pasture-Raised Whole Milk & Eggs',
        tagline: 'Non-GMO whole milk, cultured yogurts & free-range farm eggs',
        image: 'https://images.unsplash.com/photo-1550583724-b2692b85b150?auto=format&fit=crop&w=600&q=80',
        bgTheme: 'card-theme-blue',
        items: [
            { name: 'Organic Milk', qty: 1, unit: 'gallon', price: 4.19 },
            { name: 'Eggs 12-pack', qty: 1, unit: 'dozen', price: 4.99 },
            { name: 'Greek Yogurt', qty: 1, unit: 'tub', price: 3.89 }
        ]
    },
    {
        id: 'dairy_cheeses',
        badge: '🧀 DAILY FARM PICK',
        badgeClass: 'badge-blue',
        title: 'Aged Farmstead Cheddar & Butter',
        tagline: 'Rich grass-fed churned butter and sharp farmhouse cheeses',
        image: 'https://images.unsplash.com/photo-1486297678162-eb2a19b0a32d?auto=format&fit=crop&w=600&q=80',
        bgTheme: 'card-theme-blue',
        items: [
            { name: 'Cheddar Cheese', qty: 1, unit: 'block', price: 4.89 },
            { name: 'Butter', qty: 1, unit: 'block', price: 3.99 },
            { name: 'Whole Milk', qty: 1, unit: 'gallon', price: 3.99 }
        ]
    },
    {
        id: 'dairy_plant_milks',
        badge: '🥛 DAILY FARM PICK',
        badgeClass: 'badge-blue',
        title: 'Barista Oat Milk & Greek Yogurt',
        tagline: 'Silky calcium-rich plant milks & protein-dense cultured yogurts',
        image: 'https://images.unsplash.com/photo-1563636619-e9143da7973b?auto=format&fit=crop&w=600&q=80',
        bgTheme: 'card-theme-blue',
        items: [
            { name: 'Oat Milk', qty: 1, unit: 'carton', price: 3.79 },
            { name: 'Greek Yogurt', qty: 1, unit: 'tub', price: 3.89 },
            { name: 'Eggs 12-pack', qty: 1, unit: 'dozen', price: 4.99 }
        ]
    },
    {
        id: 'dairy_mozzarella',
        badge: '🧀 DAILY FARM PICK',
        badgeClass: 'badge-blue',
        title: 'Fresh Mozzarella & Cottage Curds',
        tagline: 'Soft artisanal mozzarella and pasture-fed fresh cottage cheese',
        image: 'https://images.unsplash.com/photo-1550583724-b2692b85b150?auto=format&fit=crop&w=600&q=80',
        bgTheme: 'card-theme-blue',
        items: [
            { name: 'Cheese Slices', qty: 1, unit: 'pack', price: 3.49 },
            { name: 'Whole Milk', qty: 1, unit: 'gallon', price: 3.99 },
            { name: 'Butter', qty: 1, unit: 'block', price: 3.99 }
        ]
    }
];

// ── 4. SUPERFOOD & PANTRY (Rotates EVERY SINGLE DAY) ──────────
const DAILY_SUPERFOOD_SETS = [
    {
        id: 'superfood_avocado',
        badge: '✨ SUPERFOOD PICK',
        badgeClass: 'badge-teal',
        title: 'Fresh Avocados & Cold-Pressed Oil',
        tagline: 'Heart-healthy fats, cold-pressed olive oils & tender spinach',
        image: 'https://images.unsplash.com/photo-1523049673857-eb18f1d7b578?auto=format&fit=crop&w=600&q=80',
        bgTheme: 'card-theme-teal',
        items: [
            { name: 'Avocados', qty: 2, unit: 'pcs', price: 3.99 },
            { name: 'Olive Oil', qty: 1, unit: 'bottle', price: 8.99 },
            { name: 'Organic Spinach', qty: 1, unit: 'pack', price: 2.99 }
        ]
    },
    {
        id: 'superfood_nuts',
        badge: '✨ SUPERFOOD PICK',
        badgeClass: 'badge-teal',
        title: 'Creamy Nut Butters & Whole Oats',
        tagline: 'Protein-packed nut butters, rolled oats & energy bananas',
        image: 'https://images.unsplash.com/photo-1508061253366-f7da158b6d46?auto=format&fit=crop&w=600&q=80',
        bgTheme: 'card-theme-teal',
        items: [
            { name: 'Peanut Butter', qty: 1, unit: 'jar', price: 4.49 },
            { name: 'Rolled Oats', qty: 1, unit: 'can', price: 3.99 },
            { name: 'Bananas', qty: 1, unit: 'bunch', price: 1.89 }
        ]
    },
    {
        id: 'superfood_plant_protein',
        badge: '✨ SUPERFOOD PICK',
        badgeClass: 'badge-teal',
        title: 'Organic Tofu & Chia Seeds',
        tagline: 'Clean plant-based protein, omega-3 seeds & organic staples',
        image: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&w=600&q=80',
        bgTheme: 'card-theme-teal',
        items: [
            { name: 'Tofu', qty: 1, unit: 'block', price: 2.99 },
            { name: 'Chia Seeds', qty: 1, unit: 'pouch', price: 4.29 },
            { name: 'Olive Oil', qty: 1, unit: 'bottle', price: 8.99 }
        ]
    },
    {
        id: 'superfood_honey',
        badge: '✨ SUPERFOOD PICK',
        badgeClass: 'badge-teal',
        title: 'Raw Wildflower Honey & Fresh Berries',
        tagline: 'Antioxidant-dense berries with pure unheated raw honey',
        image: 'https://images.unsplash.com/photo-1518635017498-87f514b751ba?auto=format&fit=crop&w=600&q=80',
        bgTheme: 'card-theme-teal',
        items: [
            { name: 'Honey', qty: 1, unit: 'jar', price: 5.99 },
            { name: 'Strawberries', qty: 1, unit: 'box', price: 3.99 },
            { name: 'Greek Yogurt', qty: 1, unit: 'tub', price: 3.89 }
        ]
    }
];

export function getRotatedCards() {
    const now = Date.now();
    
    // In-season produce rotates every 3 days
    const seasonalIndex = Math.floor(now / (3 * DAY_MS)) % SEASONAL_PRODUCE_SETS.length;
    
    // Daily items rotate every single day (1 day)
    const dailyDayIndex = Math.floor(now / DAY_MS);
    const bakeryIndex = dailyDayIndex % DAILY_BAKERY_SETS.length;
    const dairyIndex = (dailyDayIndex + 1) % DAILY_DAIRY_SETS.length;
    const superfoodIndex = (dailyDayIndex + 2) % DAILY_SUPERFOOD_SETS.length;

    return [
        SEASONAL_PRODUCE_SETS[seasonalIndex],
        DAILY_BAKERY_SETS[bakeryIndex],
        DAILY_DAIRY_SETS[dairyIndex],
        DAILY_SUPERFOOD_SETS[superfoodIndex]
    ];
}

let autoSlideTimer = null;
let currentSlideIndex = 0;

export function initSeasonalSpotlight(container) {
    if (!container) return;

    const render = () => {
        const cards = getRotatedCards();
        if (currentSlideIndex >= cards.length) {
            currentSlideIndex = 0;
        }

        container.innerHTML = `
            <div class="spotlight-wrapper" id="spotlight-carousel-wrap">
                <div class="spotlight-header">
                    <div class="spotlight-title-wrap">
                        <div>
                            <h3 class="spotlight-title">In-Season & Fresh Highlights</h3>
                            <p class="spotlight-subtitle">Explore daily fresh farm harvests, artisan bakery & organic picks</p>
                        </div>
                    </div>
                </div>

                <!-- 1-Card at a time viewport with slide track -->
                <div class="spotlight-carousel-viewport">
                    <div class="spotlight-carousel-track" id="spotlight-track" style="transform: translateX(-${currentSlideIndex * 100}%);">
                        ${cards.map((card, idx) => `
                            <div class="spotlight-slide-card ${card.bgTheme}" data-index="${idx}">
                                <div class="spotlight-card-content">
                                    <span class="spotlight-badge ${card.badgeClass}">${card.badge}</span>
                                    <h4 class="spotlight-card-title">${card.title}</h4>
                                    <p class="spotlight-card-tagline">${card.tagline}</p>

                                    <div class="spotlight-items-row">
                                        ${card.items.map(item => `
                                            <div class="spotlight-item-pill">
                                                <div class="spotlight-item-name-price">
                                                    <span class="item-name">${item.name}</span>
                                                    <span class="item-price">${formatPrice(item.price)}</span>
                                                </div>
                                                <button type="button" class="spotlight-add-btn" data-name="${item.name}" data-qty="${item.qty}" data-unit="${item.unit}" title="Add ${item.name} to cart">
                                                    + Add
                                                </button>
                                            </div>
                                        `).join('')}
                                    </div>
                                </div>
                                <div class="spotlight-card-img-wrap">
                                    <img src="${card.image}" alt="${card.title}" loading="lazy" onerror="this.onerror=null; this.src='https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=600&q=80';">
                                </div>
                            </div>
                        `).join('')}
                    </div>
                </div>

                <!-- Bottom Navigation Bar with < [ o o o o ] > -->
                <div class="spotlight-bottom-nav">
                    <button type="button" class="spotlight-nav-btn" id="spotlight-prev-btn" aria-label="Previous Highlight" title="Previous Highlight">
                        <svg viewBox="0 0 24 24" width="16" height="16" stroke="currentColor" stroke-width="2.5" fill="none"><polyline points="15 18 9 12 15 6"></polyline></svg>
                    </button>
                    
                    <div class="spotlight-dots-container" id="spotlight-dots">
                        ${cards.map((_, i) => `
                            <button type="button" class="spotlight-dot ${i === currentSlideIndex ? 'active' : ''}" data-index="${i}" aria-label="Go to slide ${i + 1}" title="Highlight ${i + 1}"></button>
                        `).join('')}
                    </div>

                    <button type="button" class="spotlight-nav-btn" id="spotlight-next-btn" aria-label="Next Highlight" title="Next Highlight">
                        <svg viewBox="0 0 24 24" width="16" height="16" stroke="currentColor" stroke-width="2.5" fill="none"><polyline points="9 18 15 12 9 6"></polyline></svg>
                    </button>
                </div>
            </div>
        `;

        setupCarousel(container, cards.length);
    };

    const setupCarousel = (parent, totalCards) => {
        const wrap = parent.querySelector('#spotlight-carousel-wrap');
        const track = parent.querySelector('#spotlight-track');
        const prevBtn = parent.querySelector('#spotlight-prev-btn');
        const nextBtn = parent.querySelector('#spotlight-next-btn');
        const dots = parent.querySelectorAll('.spotlight-dot');

        const goToSlide = (index) => {
            currentSlideIndex = (index + totalCards) % totalCards;
            if (track) {
                track.style.transform = `translateX(-${currentSlideIndex * 100}%)`;
            }
            dots.forEach((dot, i) => {
                dot.classList.toggle('active', i === currentSlideIndex);
            });
        };

        const startTimer = () => {
            stopTimer();
            autoSlideTimer = setInterval(() => {
                goToSlide(currentSlideIndex + 1);
            }, 5000); // 5 seconds
        };

        const stopTimer = () => {
            if (autoSlideTimer) {
                clearInterval(autoSlideTimer);
                autoSlideTimer = null;
            }
        };

        if (prevBtn) {
            prevBtn.onclick = () => {
                goToSlide(currentSlideIndex - 1);
                startTimer();
            };
        }

        if (nextBtn) {
            nextBtn.onclick = () => {
                goToSlide(currentSlideIndex + 1);
                startTimer();
            };
        }

        dots.forEach(dot => {
            dot.onclick = () => {
                const targetIdx = parseInt(dot.dataset.index, 10);
                goToSlide(targetIdx);
                startTimer();
            };
        });

        // Pause auto-slide when hovering over the card
        if (wrap) {
            wrap.onmouseenter = () => stopTimer();
            wrap.onmouseleave = () => startTimer();
        }

        // Add to cart buttons
        parent.querySelectorAll('.spotlight-add-btn').forEach(btn => {
            btn.onclick = (e) => {
                e.stopPropagation();
                const name = btn.dataset.name;
                const qty = parseInt(btn.dataset.qty, 10) || 1;
                const unit = btn.dataset.unit || '';
                shoppingList.addItem(name, qty, unit);
                eventBus.emit('toast:show', {
                    message: `Added ${qty} ${unit ? unit + ' of ' : ''}${name} to your cart`,
                    type: 'success'
                });
            };
        });

        startTimer();
    };

    eventBus.on('location:updated', render);
    eventBus.on('currency:updated', render);
    render();
}
