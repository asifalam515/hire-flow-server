import * as admin from 'firebase-admin';

// We attempt to parse the service account from an environment variable.
// If it is not provided, we won't throw immediately, but we will log a warning
// so the server doesn't instantly crash in development.
let isFirebaseInitialized = false;

try {
  const serviceAccountKey = process.env.FIREBASE_SERVICE_ACCOUNT;
  if (serviceAccountKey) {
    const serviceAccount = JSON.parse(serviceAccountKey);
    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount)
    });
    isFirebaseInitialized = true;
    console.log('✅ Firebase Admin SDK initialized successfully.');
  } else {
    console.warn('⚠️ FIREBASE_SERVICE_ACCOUNT not provided. Push notifications are disabled.');
  }
} catch (error) {
  console.error('❌ Failed to initialize Firebase Admin SDK:', error);
}

export { admin, isFirebaseInitialized };
