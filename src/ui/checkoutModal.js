import { eventBus } from '../utils/eventBus.js';
import { shoppingList } from '../modules/shoppingList.js';
import { PRODUCTS, CATEGORIES, getProductImage } from '../data/productDatabase.js';
import { speechSynthesizer } from '../modules/speechSynthesis.js';
import { storage } from '../utils/storage.js';
import { getTranslation, formatPrice } from '../data/translations.js';

export function initCheckoutModal() {
    let container = document.getElementById('checkout-modal');
    if (!container) {
        container = document.createElement('div');
        container.id = 'checkout-modal';
        container.className = 'modal-backdrop';
        document.body.appendChild(container);
    }

    const open = () => {
        renderCheckout(container);
        container.classList.add('active');
    };

    const close = () => container.classList.remove('active');

    eventBus.on('location:updated', () => {
        if (container.classList.contains('active')) {
            renderCheckout(container);
        }
    });

    eventBus.on('currency:updated', () => {
        if (container.classList.contains('active')) {
            renderCheckout(container);
        }
    });

    return { open, close };
}

function renderCheckout(container) {
    const items = shoppingList.getItems();
    const user = storage.get('voice_cart_user', null);
    const currentLang = storage.get('voice_cart_language', 'en-US');
    const t = (k) => getTranslation(k, currentLang);

    // If cart is empty, render dedicated Empty Cart View
    if (items.length === 0) {
        renderEmptyCartModal(container, currentLang);
        return;
    }

    const savedCustomAddress = storage.get('voice_cart_saved_address', {
        name: user?.name || 'Shopper',
        street: '742 Evergreen Terrace',
        apt: 'Apt 4B',
        city: 'Springfield',
        zip: '62704',
        notes: 'Leave at front door / Ring bell'
    });

    let isEditingAddress = false;
    let selectedDeliverySlot = 'express';
    let selectedPayment = 'card';
    let discount = 0;
    let promoApplied = false;
    let promoCodeText = '';

    // Calculate subtotal
    let subtotal = 0;
    items.forEach(item => {
        const found = PRODUCTS.find(p => p.name.toLowerCase() === item.name.toLowerCase());
        const price = found ? found.price : 3.49;
        subtotal += price * (item.quantity || 1);
    });

    const deliveryFee = subtotal >= 35 ? 0 : 3.99;
    const estimatedTax = subtotal * 0.08;

    const renderFullModal = () => {
        const total = Math.max(0, subtotal - discount + deliveryFee + estimatedTax);

        container.innerHTML = `
            <div class="modal-card checkout-modal-card">
                <div class="checkout-header">
                    <div>
                        <h2 class="checkout-title">${t('checkoutTitle')}</h2>
                        <p class="checkout-subtitle">${t('checkoutSubtitle')}</p>
                    </div>
                    <button class="modal-close-btn" id="checkout-close-btn" aria-label="Close Checkout">
                        <svg viewBox="0 0 24 24" width="20" height="20" stroke="currentColor" stroke-width="2" fill="none"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
                    </button>
                </div>

                <div class="checkout-grid">
                    <!-- Left Column: Delivery & Payment Details -->
                    <div class="checkout-left">
                        
                        <!-- Step 1: Delivery Address -->
                        <div class="checkout-section">
                            <div class="section-heading">
                                <div class="section-heading-title">
                                    <span class="step-num">1</span>
                                    <h3>${t('deliveryAddress')}</h3>
                                </div>
                                <button type="button" class="btn-text-action" id="toggle-edit-address">
                                    ${isEditingAddress ? t('doneEditing') : t('editAddress')}
                                </button>
                            </div>

                            ${isEditingAddress ? `
                                <form class="address-edit-form" id="address-form" onsubmit="return false;">
                                    <div class="form-group">
                                        <label class="form-label">Recipient Name</label>
                                        <input type="text" id="edit-addr-name" class="form-input" placeholder="e.g. Sarah Jenkins" value="${savedCustomAddress.name || ''}" required>
                                    </div>
                                    <div class="form-row">
                                        <div class="form-group" style="flex: 2;">
                                            <label class="form-label">Street Address</label>
                                            <input type="text" id="edit-addr-street" class="form-input" placeholder="123 Main St" value="${savedCustomAddress.street || ''}" required>
                                        </div>
                                        <div class="form-group" style="flex: 1;">
                                            <label class="form-label">Apt / Suite</label>
                                            <input type="text" id="edit-addr-apt" class="form-input" placeholder="Apt 4B" value="${savedCustomAddress.apt || ''}">
                                        </div>
                                    </div>
                                    <div class="form-row">
                                        <div class="form-group" style="flex: 1;">
                                            <label class="form-label">City</label>
                                            <input type="text" id="edit-addr-city" class="form-input" placeholder="New York" value="${savedCustomAddress.city || ''}" required>
                                        </div>
                                        <div class="form-group" style="flex: 1;">
                                            <label class="form-label">ZIP Code</label>
                                            <input type="text" id="edit-addr-zip" class="form-input" placeholder="10001" value="${savedCustomAddress.zip || ''}" required>
                                        </div>
                                    </div>
                                    <div class="form-group">
                                        <label class="form-label">Delivery Instructions (Optional)</label>
                                        <input type="text" id="edit-addr-notes" class="form-input" placeholder="Leave at front porch / Ring doorbell" value="${savedCustomAddress.notes || ''}">
                                    </div>
                                    <button type="button" class="btn btn-primary" id="save-address-btn" style="height: 40px; margin-top: 4px;">
                                        Save Address
                                    </button>
                                </form>
                            ` : `
                                <div class="address-card active">
                                    <div class="address-card-header">
                                        <span class="address-type-badge">🏡 Home Delivery</span>
                                        <span class="address-name">${savedCustomAddress.name || 'Shopper'}</span>
                                    </div>
                                    <div class="address-detail">${savedCustomAddress.street || '742 Evergreen Terrace'}, ${savedCustomAddress.apt ? savedCustomAddress.apt + ', ' : ''}${savedCustomAddress.city || 'Springfield'} ${savedCustomAddress.zip || '62704'}</div>
                                    ${savedCustomAddress.notes ? `
                                        <div class="address-notes">
                                            <svg viewBox="0 0 24 24" width="14" height="14" stroke="currentColor" stroke-width="2" fill="none"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="16" x2="12" y2="12"></line><line x1="12" y1="8" x2="12.01" y2="8"></line></svg>
                                            <span>${savedCustomAddress.notes}</span>
                                        </div>
                                    ` : ''}
                                </div>
                            `}
                        </div>

                        <!-- Step 2: Delivery Speed & Slot -->
                        <div class="checkout-section">
                            <div class="section-heading">
                                <div class="section-heading-title">
                                    <span class="step-num">2</span>
                                    <h3>${t('deliverySpeed')}</h3>
                                </div>
                            </div>

                            <div class="delivery-slots-grid">
                                <div class="delivery-slot-card ${selectedDeliverySlot === 'express' ? 'active' : ''}" data-slot="express">
                                    <div class="slot-radio-indicator"></div>
                                    <div class="slot-content">
                                        <div class="slot-header">
                                            <span class="slot-title">⚡ Express Delivery (30–45 mins)</span>
                                            <span class="slot-badge fastest">FASTEST</span>
                                        </div>
                                        <div class="slot-desc">Direct courier dispatch with live GPS order tracking</div>
                                    </div>
                                </div>

                                <div class="delivery-slot-card ${selectedDeliverySlot === 'today' ? 'active' : ''}" data-slot="today">
                                    <div class="slot-radio-indicator"></div>
                                    <div class="slot-content">
                                        <div class="slot-header">
                                            <span class="slot-title">📅 Today Afternoon (2:00 PM – 4:00 PM)</span>
                                            <span class="slot-badge">SCHEDULED</span>
                                        </div>
                                        <div class="slot-desc">Standard afternoon scheduled delivery window</div>
                                    </div>
                                </div>

                                <div class="delivery-slot-card ${selectedDeliverySlot === 'tomorrow' ? 'active' : ''}" data-slot="tomorrow">
                                    <div class="slot-radio-indicator"></div>
                                    <div class="slot-content">
                                        <div class="slot-header">
                                            <span class="slot-title">🌅 Tomorrow Morning (8:00 AM – 11:00 AM)</span>
                                            <span class="slot-badge">RELAXED</span>
                                        </div>
                                        <div class="slot-desc">Eco-friendly consolidated morning route</div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <!-- Step 3: Payment Method -->
                        <div class="checkout-section">
                            <div class="section-heading">
                                <div class="section-heading-title">
                                    <span class="step-num">3</span>
                                    <h3>${t('paymentOptions')}</h3>
                                </div>
                            </div>

                            <div class="payment-tabs-grid">
                                <button type="button" class="payment-tab ${selectedPayment === 'card' ? 'active' : ''}" data-pay="card">
                                    <svg viewBox="0 0 24 24" width="16" height="16" stroke="currentColor" stroke-width="2" fill="none"><rect x="1" y="4" width="22" height="16" rx="2" ry="2"></rect><line x1="1" y1="10" x2="23" y2="10"></line></svg>
                                    <span>Credit / Debit Card</span>
                                </button>
                                <button type="button" class="payment-tab ${selectedPayment === 'apple' ? 'active' : ''}" data-pay="apple">
                                    <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor"><path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M15.97 6.8c.67-.82 1.12-1.96.99-3.1-.97.04-2.14.65-2.83 1.45-.62.72-1.16 1.88-1.01 3 .08.01.16.02.24.02 1.07 0 2.14-.55 2.61-1.37z"/></svg>
                                    <span>Apple / Google Pay</span>
                                </button>
                                <button type="button" class="payment-tab ${selectedPayment === 'cod' ? 'active' : ''}" data-pay="cod">
                                    <svg viewBox="0 0 24 24" width="16" height="16" stroke="currentColor" stroke-width="2" fill="none"><rect x="2" y="6" width="20" height="12" rx="2"></rect><circle cx="12" cy="12" r="2"></circle><path d="M6 12h.01M18 12h.01"></path></svg>
                                    <span>Cash on Delivery</span>
                                </button>
                            </div>

                            ${selectedPayment === 'card' ? `
                                <div class="card-input-box">
                                    <div class="form-group">
                                        <label class="form-label">Card Number</label>
                                        <div class="input-with-icon">
                                            <input type="text" class="form-input" placeholder="4532 •••• •••• 8892" value="4532 8920 1840 8892">
                                            <span class="card-type-icon">💳</span>
                                        </div>
                                    </div>
                                    <div class="form-row">
                                        <div class="form-group" style="flex: 1;">
                                            <label class="form-label">Expires</label>
                                            <input type="text" class="form-input" placeholder="MM/YY" value="08/28">
                                        </div>
                                        <div class="form-group" style="flex: 1;">
                                            <label class="form-label">Security CVC</label>
                                            <input type="password" class="form-input" placeholder="CVC" value="492" maxlength="4">
                                        </div>
                                    </div>
                                    <label class="form-checkbox" style="margin-top: 4px;">
                                        <input type="checkbox" checked> Save card securely for 1-click future checkout
                                    </label>
                                </div>
                            ` : selectedPayment === 'apple' ? `
                                <div class="payment-info-box">
                                    <div class="payment-info-icon">📲</div>
                                    <div class="payment-info-text">
                                        <strong>Instant Digital Wallet Checkout</strong>
                                        <p>You can confirm payment with Face ID / Touch ID / Google Biometrics upon clicking Place Order.</p>
                                    </div>
                                </div>
                            ` : `
                                <div class="payment-info-box">
                                    <div class="payment-info-icon">💵</div>
                                    <div class="payment-info-text">
                                        <strong>Doorstep Cash / QR Payment</strong>
                                        <p>Pay with cash or scan delivery partner's UPI / QR code upon delivery.</p>
                                    </div>
                                </div>
                            `}
                        </div>
                    </div>

                    <!-- Right Column: Cart Itemized Breakdown & Order Total -->
                    <div class="checkout-right">
                        <div class="checkout-summary-card">
                            <div class="summary-header">
                                <h3 class="summary-title">Order Items (${items.length})</h3>
                                <span class="summary-item-badge">${items.reduce((s, i) => s + (i.quantity || 1), 0)} items</span>
                            </div>

                            <div class="checkout-items-list">
                                ${items.map(item => {
                                    const found = PRODUCTS.find(p => p.name.toLowerCase() === item.name.toLowerCase());
                                    const unitPrice = found ? found.price : 3.49;
                                    const lineTotal = unitPrice * (item.quantity || 1);
                                    const imgUrl = getProductImage(item.name, item.category);
                                    const icon = CATEGORIES[item.category]?.icon || '🛒';

                                    return `
                                        <div class="checkout-item-row">
                                            <div class="checkout-item-img-wrap">
                                                <img src="${imgUrl}" alt="${item.name}" onerror="this.onerror=null; this.src='https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=120&q=80';">
                                            </div>
                                            <div class="checkout-item-info">
                                                <div class="checkout-item-name">${item.name}</div>
                                                <div class="checkout-item-meta">${item.quantity || 1} ${item.unit || 'unit'}${item.quantity > 1 ? 's' : ''} × ${formatPrice(unitPrice, currentLang)}</div>
                                            </div>
                                            <div class="checkout-item-price">${formatPrice(lineTotal, currentLang)}</div>
                                        </div>
                                    `;
                                }).join('')}
                            </div>

                            <!-- Promo Code Input -->
                            <div class="promo-box">
                                <input type="text" id="promo-input" class="promo-input" placeholder="Promo code (e.g. VOICE10)" value="${promoCodeText}" ${promoApplied ? 'disabled' : ''}>
                                <button type="button" class="promo-apply-btn ${promoApplied ? 'applied' : ''}" id="apply-promo-btn" ${promoApplied ? 'disabled' : ''}>
                                    ${promoApplied ? 'Applied ✓' : 'Apply'}
                                </button>
                            </div>

                            <!-- Calculations & Summary -->
                            <div class="summary-pricing">
                                <div class="price-row">
                                    <span>Items Subtotal</span>
                                    <span>${formatPrice(subtotal, currentLang)}</span>
                                </div>
                                ${discount > 0 ? `
                                    <div class="price-row text-success">
                                        <span>Promo Discount (VOICE10)</span>
                                        <span>-${formatPrice(discount, currentLang)}</span>
                                    </div>
                                ` : ''}
                                <div class="price-row">
                                    <span>Delivery Fee</span>
                                    <span>${deliveryFee === 0 ? '<strong class="free-badge">FREE</strong>' : formatPrice(deliveryFee, currentLang)}</span>
                                </div>
                                <div class="price-row">
                                    <span>Estimated Taxes (8%)</span>
                                    <span>${formatPrice(estimatedTax, currentLang)}</span>
                                </div>
                                <div class="price-row total-row">
                                    <span>Grand Total</span>
                                    <span class="total-price">${formatPrice(total, currentLang)}</span>
                                </div>
                            </div>

                            <button type="button" class="checkout-submit-btn" id="place-order-btn">
                                <span>${t('placeOrder')} • ${formatPrice(total, currentLang)}</span>
                            </button>

                            <div class="checkout-guarantee">
                                <span>🛡️ 100% Satisfaction Guarantee • Contactless Safe Delivery</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;

        bindEvents();
    };

    const bindEvents = () => {
        const closeBtn = container.querySelector('#checkout-close-btn');
        if (closeBtn) closeBtn.onclick = () => container.classList.remove('active');

        container.onclick = (e) => {
            if (e.target === container) container.classList.remove('active');
        };

        const toggleBtn = container.querySelector('#toggle-edit-address');
        if (toggleBtn) {
            toggleBtn.onclick = () => {
                isEditingAddress = !isEditingAddress;
                renderFullModal();
            };
        }

        const saveAddrBtn = container.querySelector('#save-address-btn');
        if (saveAddrBtn) {
            saveAddrBtn.onclick = () => {
                const name = (container.querySelector('#edit-addr-name')?.value || '').trim() || savedCustomAddress.name;
                const street = (container.querySelector('#edit-addr-street')?.value || '').trim() || savedCustomAddress.street;
                const apt = (container.querySelector('#edit-addr-apt')?.value || '').trim();
                const city = (container.querySelector('#edit-addr-city')?.value || '').trim() || savedCustomAddress.city;
                const zip = (container.querySelector('#edit-addr-zip')?.value || '').trim() || savedCustomAddress.zip;
                const notes = (container.querySelector('#edit-addr-notes')?.value || '').trim();

                const updated = { name, street, apt, city, zip, notes };
                storage.set('voice_cart_saved_address', updated);
                isEditingAddress = false;
                eventBus.emit('toast:show', { message: 'Delivery address updated successfully!', type: 'success' });
                renderFullModal();
            };
        }

        container.querySelectorAll('.delivery-slot-card').forEach(slotCard => {
            slotCard.onclick = () => {
                selectedDeliverySlot = slotCard.dataset.slot;
                renderFullModal();
            };
        });

        container.querySelectorAll('.payment-tab').forEach(tab => {
            tab.onclick = () => {
                selectedPayment = tab.dataset.pay;
                renderFullModal();
            };
        });

        const applyPromoBtn = container.querySelector('#apply-promo-btn');
        if (applyPromoBtn) {
            applyPromoBtn.onclick = () => {
                const code = (container.querySelector('#promo-input')?.value || '').trim().toUpperCase();
                promoCodeText = code;
                if (code === 'VOICE10' || code === 'VOICECART10') {
                    discount = Math.min(10.00, subtotal);
                    promoApplied = true;
                    eventBus.emit('toast:show', { message: '🎉 $10.00 promo discount applied!', type: 'success' });
                    speechSynthesizer.speak('Promo code applied. You saved 10 dollars.');
                    renderFullModal();
                } else if (code) {
                    eventBus.emit('toast:show', { message: 'Invalid promo code. Try "VOICE10"', type: 'error' });
                }
            };
        }

        const placeOrderBtn = container.querySelector('#place-order-btn');
        if (placeOrderBtn) {
            placeOrderBtn.onclick = () => {
                const total = Math.max(0, subtotal - discount + deliveryFee + estimatedTax);
                const orderNumber = 'VC-' + Math.floor(100000 + Math.random() * 900000);
                const orderedItems = [...items];

                // Clear cart in state and local storage
                shoppingList.clearList();

                const orderData = {
                    orderNumber,
                    items: orderedItems,
                    subtotal,
                    discount,
                    deliveryFee,
                    estimatedTax,
                    total,
                    address: savedCustomAddress,
                    slot: selectedDeliverySlot,
                    paymentMethod: selectedPayment,
                    timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                };

                speechSynthesizer.speak(`Thank you for your order! Your order ${orderNumber} for $${total.toFixed(2)} is confirmed and being prepared.`);
                eventBus.emit('toast:show', { message: `🎉 Order #${orderNumber} Confirmed!`, type: 'success' });

                renderOrderSuccessModal(container, orderData, currentLang);
            };
        }
    };

    renderFullModal();
}

function renderOrderSuccessModal(container, orderData, currentLang = 'en-US') {
    container.innerHTML = `
        <div class="modal-card checkout-success-card">
            <button class="modal-close-btn" id="success-close-btn">
                <svg viewBox="0 0 24 24" width="20" height="20" stroke="currentColor" stroke-width="2" fill="none"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
            </button>

            <div class="success-icon-wrap">
                🎉
            </div>

            <h2 class="success-title">Order Confirmed!</h2>
            <p class="success-subtitle">Thank you for shopping with VoiceCart. Your fresh items are being packed.</p>

            <div class="success-details-box">
                <div class="success-row">
                    <span>Order Number</span>
                    <strong style="color: var(--accent-primary); font-family: monospace; font-size: 0.95rem;">${orderData.orderNumber}</strong>
                </div>
                <div class="success-row">
                    <span>Estimated Arrival</span>
                    <strong>${orderData.slot === 'express' ? '⚡ 30–45 Minutes' : orderData.slot === 'today' ? '📅 Today 2:00–4:00 PM' : '🌅 Tomorrow Morning'}</strong>
                </div>
                <div class="success-row">
                    <span>Delivering To</span>
                    <span>${orderData.address?.street || '742 Evergreen Terrace'}</span>
                </div>
                <div class="success-row">
                    <span>Items Count</span>
                    <span>${orderData.items.length} items (${orderData.items.reduce((s, i) => s + (i.quantity || 1), 0)} total units)</span>
                </div>
                <div class="success-row" style="border-top: 1px dashed rgba(0,0,0,0.1); padding-top: 8px; margin-top: 4px;">
                    <span style="font-weight: 700; color: var(--text-primary);">Total Paid</span>
                    <strong style="font-size: 1.1rem; color: var(--accent-primary);">${formatPrice(orderData.total, currentLang)}</strong>
                </div>
            </div>

            <div class="success-actions" style="display: flex; gap: 12px; width: 100%;">
                <button type="button" class="btn btn-primary full-width" id="continue-shopping-btn">
                    Continue Shopping
                </button>
            </div>
        </div>
    `;

    const closeBtn = container.querySelector('#success-close-btn');
    const continueBtn = container.querySelector('#continue-shopping-btn');

    if (closeBtn) closeBtn.onclick = () => container.classList.remove('active');
    if (continueBtn) continueBtn.onclick = () => container.classList.remove('active');
}

function renderEmptyCartModal(container, currentLang = 'en-US') {
    const t = (k) => getTranslation(k, currentLang);

    container.innerHTML = `
        <div class="modal-card empty-cart-modal-card">
            <div class="checkout-header" style="justify-content: flex-end; border: none; margin-bottom: 0; padding-bottom: 0;">
                <button class="modal-close-btn" id="empty-cart-close-btn">
                    <svg viewBox="0 0 24 24" width="20" height="20" stroke="currentColor" stroke-width="2" fill="none"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
                </button>
            </div>

            <div class="empty-cart-hero">
                <div class="empty-cart-icon-bg">🛒</div>
                <h2 class="empty-cart-headline">${t('emptyCartTitle')}</h2>
                <p class="empty-cart-subtext">${t('emptyCartSub')}</p>
                
                <div class="empty-cart-actions">
                    <button type="button" class="btn btn-primary" id="empty-modal-mic-btn">
                        ${t('speakCommand')}
                    </button>
                    <button type="button" class="btn btn-secondary" id="empty-modal-catalog-btn">
                        ${t('browseCatalog')}
                    </button>
                </div>

                <div class="quick-add-section">
                    <div class="quick-add-title">${t('quickAddTitle')}</div>
                    <div class="quick-add-chips">
                        <button class="quick-add-chip" data-name="milk">+ Whole Milk (${formatPrice(3.49, currentLang)})</button>
                        <button class="quick-add-chip" data-name="apples">+ Organic Apples (${formatPrice(4.99, currentLang)})</button>
                        <button class="quick-add-chip" data-name="sourdough">+ Sourdough Bread (${formatPrice(3.99, currentLang)})</button>
                        <button class="quick-add-chip" data-name="avocado">+ Fresh Avocado (${formatPrice(1.99, currentLang)})</button>
                        <button class="quick-add-chip" data-name="eggs">+ Grade A Eggs (${formatPrice(4.29, currentLang)})</button>
                    </div>
                </div>
            </div>
        </div>
    `;

    const closeBtn = container.querySelector('#empty-cart-close-btn');
    if (closeBtn) closeBtn.onclick = () => container.classList.remove('active');

    const micBtn = container.querySelector('#empty-modal-mic-btn');
    if (micBtn) {
        micBtn.onclick = () => {
            container.classList.remove('active');
            const mainMic = document.getElementById('main-mic-btn');
            if (mainMic) mainMic.click();
            eventBus.emit('toast:show', { message: 'Try saying "Add milk" or "Buy apples"', type: 'info' });
        };
    }

    const catalogBtn = container.querySelector('#empty-modal-catalog-btn');
    if (catalogBtn) {
        catalogBtn.onclick = () => {
            container.classList.remove('active');
            document.querySelector('.store-catalog')?.scrollIntoView({ behavior: 'smooth' });
        };
    }

    container.querySelectorAll('.quick-add-chip').forEach(chip => {
        chip.onclick = (e) => {
            const name = e.currentTarget.dataset.name;
            shoppingList.addItem(name, 1, '');
            eventBus.emit('toast:show', { message: `Added ${name} to cart!`, type: 'success' });
            renderCheckout(container);
        };
    });
}
