'use client';
import { getApp, getApps, initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

function createFirebaseApp() {
    if (getApps().length > 0) {
      return getApp();
    }
  
    // Check if all required environment variables are present.
    // This helps prevent the "configuration-not-found" error.
    const missingVars = Object.entries(firebaseConfig).filter(([, value]) => !value);
    if (missingVars.length > 0) {
      console.warn(
        `Firebase is not configured. Please add the following environment variables to your .env.local file: ${missingVars
          .map(([key]) => key)
          .join(', ')}`
      );
      // Return a dummy object or handle this case as you see fit
      // For now, we'll try to initialize but it will likely fail with a clear error.
    }
  
    return initializeApp(firebaseConfig);
}
  
const app = createFirebaseApp();
const auth = getAuth(app);
const db = getFirestore(app);

export { app, auth, db };
