import { initializeAnalytics, isSupported } from 'firebase/analytics';
import { initializeApp } from 'firebase/app';

export const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FB_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FB_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FB_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FB_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FB_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FB_APP_ID,
  measurementId: process.env.NEXT_PUBLIC_FB_MEASUREMENT_ID,
};

if (process.env.NODE_ENV === 'production') {
  const app = initializeApp(firebaseConfig);
  isSupported().then((yes) => (yes ? initializeAnalytics(app) : null));
}
