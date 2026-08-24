import { eventBus } from '../utils/eventBus.js';
import { locationService, POPULAR_REGIONS } from '../utils/locationService.js';
import { speechSynthesizer } from '../modules/speechSynthesis.js';

export function initLocationModal() {
    let container = document.getElementById('location-modal');
    if (!container) {
        container = document.createElement('div');
        container.id = 'location-modal';
        container.className = 'modal-backdrop';
        document.body.appendChild(container);
    }

    const open = () => {
        renderModal(container);
        container.classList.add('active');
    };

    const close = () => container.classList.remove('active');

    // Re-render if opened and location changes
    eventBus.on('location:updated', () => {
        if (container.classList.contains('active')) {
            renderModal(container);
        }
    });

    return { open, close };
}

function renderModal(container) {
    const currentLoc = locationService.getLocation();

    container.innerHTML = `
        <div class="modal-card location-modal-card">
            <div class="modal-header-row">
                <div class="flex align-center gap-3">
                    <div class="modal-loc-icon-wrap">
                        <svg viewBox="0 0 24 24" width="18" height="18" stroke="currentColor" stroke-width="2.5" fill="none"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle></svg>
                    </div>
                    <div>
                        <h3 class="location-modal-title">Choose Delivery Location</h3>
                        <p class="location-modal-sub">Select your city or enter a postal code to check delivery</p>
                    </div>
                </div>
                <button class="modal-close-btn" id="location-close-btn" aria-label="Close">
                    <svg viewBox="0 0 24 24" width="20" height="20" stroke="currentColor" stroke-width="2" fill="none"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
                </button>
            </div>

            <!-- Current Active Location Badge -->
            <div class="current-location-status">
                <div class="loc-status-left">
                    <span class="loc-status-flag">${currentLoc.flag || '🌐'}</span>
                    <div>
                        <div class="loc-status-city">${currentLoc.city || 'New York'}, ${currentLoc.country || 'USA'}</div>
                        <div class="loc-status-meta">PIN / Postal Code: <strong>${currentLoc.postalCode || '10001'}</strong></div>
                    </div>
                </div>
                <span class="active-badge">Active</span>
            </div>

            <!-- GPS Auto Detect Option -->
            <button type="button" class="btn btn-secondary full-width gps-detect-btn" id="gps-detect-btn">
                <svg viewBox="0 0 24 24" width="18" height="18" stroke="currentColor" stroke-width="2" fill="none"><circle cx="12" cy="12" r="10"></circle><polygon points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76"></polygon></svg>
                <span id="gps-detect-label">Detect My Current Location (GPS)</span>
            </button>

            <div class="auth-divider" style="margin: var(--space-4) 0;">
                <span>or enter postal / PIN code</span>
            </div>

            <!-- Manual PIN / Postal Code Form -->
            <form class="pincode-form" id="pincode-form" onsubmit="return false;">
                <div class="pincode-input-wrap">
                    <input type="text" id="pincode-input" class="pincode-input" placeholder="e.g. 560001, 10001, London, Mumbai" autocomplete="off">
                    <button type="submit" class="btn btn-primary pincode-submit-btn" id="pincode-submit-btn">
                        Apply
                    </button>
                </div>
                <div class="pincode-help">Enter a 6-digit Indian PIN, 5-digit US ZIP, UK postcode, or city name</div>
            </form>

            <div class="popular-locations-section">
                <div class="popular-locations-title">Popular Delivery Cities</div>
                <div class="popular-locations-grid">
                    ${POPULAR_REGIONS.map(reg => {
                        const isActive = currentLoc.countryCode === reg.countryCode;
                        return `
                            <button type="button" class="popular-loc-card ${isActive ? 'active' : ''}" data-reg-id="${reg.id}">
                                <span class="popular-loc-flag">${reg.flag}</span>
                                <div class="popular-loc-info">
                                    <div class="popular-loc-name">${reg.city}</div>
                                    <div class="popular-loc-country">${reg.country}</div>
                                </div>
                                ${isActive ? '<span class="loc-check">✓</span>' : ''}
                            </button>
                        `;
                    }).join('')}
                </div>
            </div>
        </div>
    `;

    attachListeners(container);
}

function attachListeners(container) {
    const closeBtn = container.querySelector('#location-close-btn');
    if (closeBtn) closeBtn.onclick = () => container.classList.remove('active');

    container.onclick = (e) => {
        if (e.target === container) container.classList.remove('active');
    };

    // GPS Detect Button
    const gpsBtn = container.querySelector('#gps-detect-btn');
    const gpsLabel = container.querySelector('#gps-detect-label');

    if (gpsBtn) {
        gpsBtn.onclick = async () => {
            if (gpsLabel) gpsLabel.textContent = 'Detecting location...';
            gpsBtn.disabled = true;

            try {
                const loc = await locationService.detectCurrentLocation();
                eventBus.emit('toast:show', {
                    message: `Delivery location set to ${loc.city}, ${loc.country}`,
                    type: 'success'
                });
                speechSynthesizer.speak(`Delivery location set to ${loc.city}.`);
                container.classList.remove('active');
            } catch (err) {
                console.error(err);
                eventBus.emit('toast:show', { message: 'Could not detect GPS location. Please enter a PIN code.', type: 'error' });
            } finally {
                if (gpsLabel) gpsLabel.textContent = 'Detect My Current Location (GPS)';
                gpsBtn.disabled = false;
            }
        };
    }

    // PIN / Postal Code Form Submit
    const form = container.querySelector('#pincode-form');
    if (form) {
        form.onsubmit = (e) => {
            e.preventDefault();
            const inputVal = (container.querySelector('#pincode-input')?.value || '').trim();
            if (!inputVal) return;

            const resolved = locationService.resolveInput(inputVal);
            if (resolved) {
                locationService.setLocation(resolved);
                eventBus.emit('toast:show', {
                    message: `Delivery location updated to ${resolved.displayName}`,
                    type: 'success'
                });
                speechSynthesizer.speak(`Delivery location set to ${resolved.city}.`);
                container.classList.remove('active');
            }
        };
    }

    // Popular Region Click
    container.querySelectorAll('.popular-loc-card').forEach(card => {
        card.onclick = () => {
            const regId = card.dataset.regId;
            const found = POPULAR_REGIONS.find(r => r.id === regId);
            if (found) {
                locationService.setLocation(found);
                eventBus.emit('toast:show', {
                    message: `Delivery location updated to ${found.displayName}`,
                    type: 'success'
                });
                speechSynthesizer.speak(`Delivery location set to ${found.city}.`);
                container.classList.remove('active');
            }
        };
    });
}
