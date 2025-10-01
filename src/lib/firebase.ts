import { initializeApp, getApps } from 'firebase/app';
import { getAuth, setPersistence, browserLocalPersistence } from 'firebase/auth';

// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCkqCFySdC9L25V9VtkaB4zEvEOT-CM4Mg",
  authDomain: "shri-krishna-steel-works.firebaseapp.com",
  projectId: "shri-krishna-steel-works",
  storageBucket: "shri-krishna-steel-works.firebasestorage.app",
  messagingSenderId: "873095928725",
  appId: "1:873095928725:web:333b6cbf0a2a9f29a3f49c",
  measurementId: "G-NGM016N53M",
};

const app = getApps().length ? getApps()[0] : initializeApp(firebaseConfig);
export const auth = getAuth(app);
// Persist auth state in localStorage so the session survives reloads
try {
  // Not awaited to avoid blocking module init
  void setPersistence(auth, browserLocalPersistence);
} catch {}
export default app;


