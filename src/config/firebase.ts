import { initializeApp, cert, getApps, App } from 'firebase-admin/app';
import { getMessaging, Messaging } from 'firebase-admin/messaging';

// We attempt to parse the service account from an environment variable.
// If it is not provided, we won't throw immediately, but we will log a warning
// so the server doesn't instantly crash in development.
let isFirebaseInitialized = false;
let firebaseApp: App | undefined;
let messaging: Messaging | undefined;

try {
  const serviceAccountKey = process.env.FIREBASE_SERVICE_ACCOUNT;
  if (serviceAccountKey) {
    const serviceAccount = JSON.parse(serviceAccountKey);
    const existingApps = getApps();
    firebaseApp = existingApps.length > 0 && existingApps[0] ? existingApps[0] : initializeApp({
      credential: cert(serviceAccount)
    });
    messaging = getMessaging(firebaseApp);
    isFirebaseInitialized = true;
    console.log('✅ Firebase Admin SDK initialized successfully.');
  } else {
    console.warn('⚠️ FIREBASE_SERVICE_ACCOUNT not provided. Push notifications are disabled.');
  }
} catch (error) {
  console.error('❌ Failed to initialize Firebase Admin SDK:', error);
}

export { firebaseApp, messaging, isFirebaseInitialized };
