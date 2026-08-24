/**
 * Firebase Configuration & Services for VoiceCart
 *
 * Initializes Firebase App, Authentication, and Firestore.
 * All Firebase credentials are read from Vite environment variables.
 * If no .env is present the app still works — auth buttons show a
 * setup prompt instead of crashing.
 */
import { initializeApp } from 'firebase/app';
import {
    getAuth,
    GoogleAuthProvider,
    signInWithPopup,
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    signOut as fbSignOut,
    onAuthStateChanged,
    updateProfile
} from 'firebase/auth';
import {
    getFirestore,
    doc,
    setDoc,
    getDoc,
    serverTimestamp
} from 'firebase/firestore';

// ── Firebase Config (from .env) ─────────────────────────────────
function cleanVal(v) {
    if (!v || typeof v !== 'string') return '';
    let s = v.trim();
    s = s.replace(/^["'`]|["'`]$/g, '').trim();
    s = s.replace(/[,;]+$/, '').trim();
    return s;
}

function getEnv(...keys) {
    for (const key of keys) {
        const val = cleanVal(import.meta.env[key]);
        if (val && val !== 'undefined' && val !== 'null') {
            return val;
        }
    }
    return '';
}

const firebaseConfig = {
    apiKey:            getEnv('VITE_FIREBASE_API_KEY', 'FIREBASE_API_KEY', 'VITE_API_KEY', 'API_KEY'),
    authDomain:        getEnv('VITE_FIREBASE_AUTH_DOMAIN', 'FIREBASE_AUTH_DOMAIN', 'VITE_AUTH_DOMAIN', 'AUTH_DOMAIN'),
    projectId:         getEnv('VITE_FIREBASE_PROJECT_ID', 'FIREBASE_PROJECT_ID', 'VITE_PROJECT_ID', 'PROJECT_ID'),
    storageBucket:     getEnv('VITE_FIREBASE_STORAGE_BUCKET', 'FIREBASE_STORAGE_BUCKET', 'VITE_STORAGE_BUCKET', 'STORAGE_BUCKET'),
    messagingSenderId: getEnv('VITE_FIREBASE_MESSAGING_SENDER_ID', 'FIREBASE_MESSAGING_SENDER_ID', 'VITE_MESSAGING_SENDER_ID', 'MESSAGING_SENDER_ID'),
    appId:             getEnv('VITE_FIREBASE_APP_ID', 'FIREBASE_APP_ID', 'VITE_APP_ID', 'APP_ID')
};

const isConfigured = Boolean(firebaseConfig.apiKey && (firebaseConfig.authDomain || firebaseConfig.projectId));

let app  = null;
let auth = null;
let db   = null;
let googleProvider = null;

if (isConfigured) {
    try {
        app  = initializeApp(firebaseConfig);
        auth = getAuth(app);
        db   = getFirestore(app);
        googleProvider = new GoogleAuthProvider();
        googleProvider.setCustomParameters({ prompt: 'select_account' });
    } catch (err) {
        console.error('Firebase init error:', err);
    }
} else {
    console.warn(
        '⚠️ Firebase is not configured. Create a .env file with your VITE_FIREBASE_* keys. See .env.example.'
    );
}


// ── Firestore: log user to "users" collection ──────────────────
async function recordUser(user) {
    if (!user || !db) return;
    try {
        const userRef = doc(db, 'users', user.uid);
        const snap    = await getDoc(userRef);

        const userData = {
            uid:         user.uid,
            email:       user.email,
            displayName: user.displayName || '',
            photoURL:    user.photoURL || '',
            provider:    user.providerData?.[0]?.providerId || 'unknown',
            lastLoginAt: serverTimestamp()
        };

        if (!snap.exists()) {
            userData.createdAt = serverTimestamp();
        }

        await setDoc(userRef, userData, { merge: true });
    } catch (err) {
        console.error('Firestore recordUser error:', err);
    }
}

// ── Helper: build a plain user object for the app ───────────────
function toUserObj(firebaseUser) {
    if (!firebaseUser) return null;
    return {
        id:       firebaseUser.uid,
        name:     firebaseUser.displayName || '',
        email:    firebaseUser.email || '',
        picture:  firebaseUser.photoURL || '',
        provider: firebaseUser.providerData?.[0]?.providerId === 'google.com'
                    ? 'Google' : 'Email'
    };
}

// ── Error thrown when Firebase hasn't been configured yet ────────
class FirebaseNotConfiguredError extends Error {
    constructor() {
        super('Firebase is not configured. Add your VITE_FIREBASE_* keys to a .env file.');
        this.code = 'auth/not-configured';
    }
}

// ── Public API ──────────────────────────────────────────────────
export const firebaseAuth = {
    /** true when .env keys are present and Firebase initialised */
    get isConfigured() { return isConfigured && auth !== null; },

    auth,
    db,

    /** Sign in with Google popup */
    async signInWithGoogle() {
        if (!auth) throw new FirebaseNotConfiguredError();
        const result = await signInWithPopup(auth, googleProvider);
        await recordUser(result.user);
        return toUserObj(result.user);
    },

    /** Create account with email & password */
    async createAccount(email, password, displayName) {
        if (!auth) throw new FirebaseNotConfiguredError();
        const cred = await createUserWithEmailAndPassword(auth, email, password);
        if (displayName) {
            await updateProfile(cred.user, { displayName });
        }
        await recordUser(cred.user);
        return toUserObj(cred.user);
    },

    /** Sign in with email & password */
    async signInWithEmail(email, password) {
        if (!auth) throw new FirebaseNotConfiguredError();
        const cred = await signInWithEmailAndPassword(auth, email, password);
        await recordUser(cred.user);
        return toUserObj(cred.user);
    },

    /** Sign out */
    async signOut() {
        if (auth) await fbSignOut(auth);
    },

    /** Get current user (or null) */
    getCurrentUser() {
        return auth ? toUserObj(auth.currentUser) : null;
    },

    /** Listen for auth state changes; returns unsubscribe fn */
    onAuthChange(callback) {
        if (!auth) {
            // Not configured — call back with null once and return a noop
            callback(null);
            return () => {};
        }
        return onAuthStateChanged(auth, (fbUser) => {
            callback(toUserObj(fbUser));
        });
    }
};
