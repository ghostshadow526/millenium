import { initializeApp, getApps } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore, initializeFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

// Use NEXT_PUBLIC_ envs for client-side Firebase config
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY || 'AIzaSyD239JqpspNL_KN7-buMq2PTWUM5P0D5YA',
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || 'milliniem-86b63.firebaseapp.com',
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || 'milliniem-86b63',
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || 'milliniem-86b63.appspot.com',
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || '455693438371',
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID || '1:455693438371:web:0a64c5c007cb906e241e16',
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID || 'G-KHHJRMKW9V'
};

const app = getApps().length ? getApps()[0] : initializeApp(firebaseConfig);
export const auth = getAuth(app);

// Connectivity fallbacks for restrictive networks (ERR_CONNECTION_CLOSED)
// Gate with env so we can toggle without code changes.
const forceLongPolling = process.env.NEXT_PUBLIC_FIRESTORE_FORCE_LONG_POLLING === 'true';
const autoDetect = process.env.NEXT_PUBLIC_FIRESTORE_AUTODETECT_STREAMING === 'true';

let dbInstance;
try {
  if (forceLongPolling || autoDetect) {
    dbInstance = initializeFirestore(app, {
      experimentalForceLongPolling: forceLongPolling,
      experimentalAutoDetectLongPolling: autoDetect,
    });
    // eslint-disable-next-line no-console
    console.log('[firebase] Firestore initialized with options', { forceLongPolling, autoDetect });
  } else {
    dbInstance = getFirestore(app);
  }
} catch (err) {
  // eslint-disable-next-line no-console
  console.error('[firebase] Firestore init error, falling back to default', err);
  dbInstance = getFirestore(app);
}

export const db = dbInstance as ReturnType<typeof getFirestore>;
export const storage = getStorage(app);
