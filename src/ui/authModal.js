import { eventBus } from '../utils/eventBus.js';
import { storage } from '../utils/storage.js';
import { speechSynthesizer } from '../modules/speechSynthesis.js';
import { firebaseAuth } from '../utils/firebaseAuth.js';

export function initAuthModal() {
    let container = document.getElementById('auth-modal');
    if (!container) {
        container = document.createElement('div');
        container.id = 'auth-modal';
        container.className = 'modal-backdrop';
        document.body.appendChild(container);
    }

    // Listen for Firebase auth state changes (persistent sessions, page reloads)
    firebaseAuth.onAuthChange((user) => {
        storage.set('voice_cart_user', user);
        eventBus.emit('user:updated', user);
        if (container.classList.contains('active')) {
            renderModal(container, user, 'login');
        }
    });

    const savedUser = firebaseAuth.getCurrentUser() || storage.get('voice_cart_user', null);
    renderModal(container, savedUser, 'login');

    return {
        open: () => {
            const user = firebaseAuth.getCurrentUser() || storage.get('voice_cart_user', null);
            renderModal(container, user, 'login');
            container.classList.add('active');
        },
        close: () => container.classList.remove('active'),
        getUser: () => firebaseAuth.getCurrentUser() || storage.get('voice_cart_user', null)
    };
}

// ── Render ───────────────────────────────────────────────────────
function renderModal(container, user, activeTab = 'login', errorMsg = '') {
    container.innerHTML = `
        <div class="modal-card auth-modal-card">
            <button class="modal-close-btn" id="auth-close-btn">
                <svg viewBox="0 0 24 24" width="20" height="20" stroke="currentColor" stroke-width="2" fill="none"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
            </button>

            ${user ? renderLoggedIn(user) : renderAuthForm(activeTab, errorMsg)}
        </div>
    `;
    attachListeners(container, activeTab);
}

function renderLoggedIn(user) {
    return `
        <div class="auth-logged-in">
            <div class="user-avatar-large">
                ${user.picture
                    ? `<img src="${user.picture}" alt="${user.name}" style="width:100%;height:100%;border-radius:50%;object-fit:cover;">`
                    : `<span>${(user.name || user.email || 'U').charAt(0).toUpperCase()}</span>`}
            </div>
            <h3 class="auth-title">Welcome, ${user.name || 'Shopper'}!</h3>
            <p class="auth-subtitle">${user.email}</p>
            ${user.provider ? `<span style="font-size:0.7rem;font-weight:700;background:rgba(0,0,0,0.06);padding:2px 8px;border-radius:12px;color:var(--text-tertiary);">Signed in with ${user.provider}</span>` : ''}

            <div class="user-stats-grid" style="grid-template-columns: 1fr; margin: var(--space-4) 0;">
                <div class="user-stat-card">
                    <span class="user-stat-val">0</span>
                    <span class="user-stat-lbl">Orders Placed</span>
                </div>
            </div>

            <button class="btn btn-outline full-width" id="auth-logout-btn">
                Sign Out
            </button>
        </div>
    `;
}

function renderAuthForm(activeTab, errorMsg) {
    return `
        <div class="auth-tabs">
            <button class="auth-tab ${activeTab === 'login' ? 'active' : ''}" id="tab-login">Sign In</button>
            <button class="auth-tab ${activeTab === 'signup' ? 'active' : ''}" id="tab-signup">Create Account</button>
        </div>

        ${errorMsg ? `<div class="auth-error-alert">⚠️ ${errorMsg}</div>` : ''}

        <form class="auth-form" id="auth-form" onsubmit="return false;">
            ${activeTab === 'signup' ? `
                <div class="form-group">
                    <label class="form-label">Full Name</label>
                    <input type="text" id="auth-name" class="form-input" placeholder="Jane Doe" required>
                </div>
            ` : ''}

            <div class="form-group">
                <label class="form-label">Email Address</label>
                <input type="email" id="auth-email" class="form-input" placeholder="you@example.com" required>
            </div>

            <div class="form-group">
                <label class="form-label">Password</label>
                <input type="password" id="auth-password" class="form-input" placeholder="••••••••" minlength="6" required>
            </div>

            <button type="submit" class="btn btn-primary full-width" id="auth-submit-btn">
                ${activeTab === 'login' ? 'Sign In' : 'Create Account'}
            </button>

            <div class="auth-divider">
                <span>or continue with</span>
            </div>

            <div class="social-login-grid">
                <button type="button" class="btn btn-social" id="social-google">
                    <svg viewBox="0 0 24 24" width="18" height="18"><path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/><path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/><path fill="#FBBC05" d="M5.84 14.1c-.22-.66-.35-1.36-.35-2.1s.13-1.44.35-2.1V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.62z"/><path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"/></svg>
                    Google
                </button>
                <button type="button" class="btn btn-social" id="social-apple" disabled style="opacity:0.5;cursor:not-allowed;">
                    <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor"><path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M15.97 6.8c.67-.82 1.12-1.96.99-3.1-.97.04-2.14.65-2.83 1.45-.62.72-1.16 1.88-1.01 3 .08.01.16.02.24.02 1.07 0 2.14-.55 2.61-1.37z"/></svg>
                    Apple
                </button>
            </div>
        </form>
    `;
}

// ── Firebase error → friendly message ───────────────────────────
function friendlyError(code) {
    const map = {
        'auth/email-already-in-use':    'An account with this email already exists. Try signing in.',
        'auth/invalid-email':           'Please enter a valid email address.',
        'auth/user-not-found':          'No account found with this email. Create one instead.',
        'auth/wrong-password':          'Incorrect password. Please try again.',
        'auth/invalid-credential':      'Incorrect email or password. Please try again.',
        'auth/weak-password':           'Password must be at least 6 characters.',
        'auth/too-many-requests':       'Too many failed attempts. Please wait a moment and try again.',
        'auth/popup-closed-by-user':    'Sign-in popup was closed. Please try again.',
        'auth/network-request-failed':  'Network error. Check your connection and try again.',
        'auth/invalid-api-key':         'Firebase is not configured. Set your VITE_FIREBASE_* environment variables in a .env file.',
        'auth/not-configured':          'Firebase is not configured yet. Create a .env file with your Firebase credentials (see .env.example).',
        'auth/unauthorized-domain':     'This domain is not authorized in your Firebase project. Add it under Authentication → Settings → Authorized domains.',
    };
    return map[code] || `Something went wrong (${code || 'unknown'}). Please try again.`;
}

// ── Listeners ───────────────────────────────────────────────────
function attachListeners(container, activeTab) {
    // Close
    const closeBtn = container.querySelector('#auth-close-btn');
    if (closeBtn) closeBtn.onclick = () => container.classList.remove('active');
    container.onclick = (e) => { if (e.target === container) container.classList.remove('active'); };

    // Tabs
    const loginTab  = container.querySelector('#tab-login');
    const signupTab = container.querySelector('#tab-signup');
    if (loginTab)  loginTab.onclick  = () => renderModal(container, null, 'login');
    if (signupTab) signupTab.onclick = () => renderModal(container, null, 'signup');

    // Sign Out
    const logoutBtn = container.querySelector('#auth-logout-btn');
    if (logoutBtn) {
        logoutBtn.onclick = async () => {
            await firebaseAuth.signOut();
            storage.remove('voice_cart_user');
            eventBus.emit('toast:show', { message: 'Signed out successfully', type: 'info' });
            eventBus.emit('user:updated', null);
            renderModal(container, null, 'login');
        };
    }

    // Email / Password form
    const form = container.querySelector('#auth-form');
    if (form) {
        form.onsubmit = async (e) => {
            e.preventDefault();
            const email    = (container.querySelector('#auth-email')?.value || '').trim();
            const password = (container.querySelector('#auth-password')?.value || '').trim();
            const name     = (container.querySelector('#auth-name')?.value || '').trim();
            const submitBtn = container.querySelector('#auth-submit-btn');

            if (!email || !password) return;

            // Disable button while processing
            if (submitBtn) { submitBtn.disabled = true; submitBtn.textContent = 'Please wait…'; }

            try {
                let user;
                if (activeTab === 'signup') {
                    user = await firebaseAuth.createAccount(email, password, name);
                    eventBus.emit('toast:show', { message: `Account created! Welcome, ${user.name || 'Shopper'}`, type: 'success' });
                    speechSynthesizer.speak(`Account created. Welcome ${user.name}`);
                } else {
                    user = await firebaseAuth.signInWithEmail(email, password);
                    eventBus.emit('toast:show', { message: `Welcome back, ${user.name || user.email}!`, type: 'success' });
                    speechSynthesizer.speak(`Welcome back ${user.name || ''}`);
                }

                storage.set('voice_cart_user', user);
                eventBus.emit('user:updated', user);
                renderModal(container, user, 'login');
                container.classList.remove('active');

            } catch (err) {
                console.error('Auth error:', err);
                renderModal(container, null, activeTab, friendlyError(err.code));
            }
        };
    }

    // Google Sign-In
    const googleBtn = container.querySelector('#social-google');
    if (googleBtn) {
        googleBtn.onclick = async () => {
            try {
                const user = await firebaseAuth.signInWithGoogle();
                storage.set('voice_cart_user', user);
                eventBus.emit('toast:show', { message: `Signed in as ${user.name}`, type: 'success' });
                eventBus.emit('user:updated', user);
                speechSynthesizer.speak(`Signed in with Google. Welcome ${user.name}`);
                renderModal(container, user, 'login');
                container.classList.remove('active');
            } catch (err) {
                console.error('Google Auth error:', err);
                if (err.code !== 'auth/popup-closed-by-user') {
                    renderModal(container, null, activeTab, friendlyError(err.code));
                }
            }
        };
    }
}
