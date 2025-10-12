// src/lib/firebase.js
import { initializeApp, getApps } from 'firebase/app';
import { getAuth, setPersistence, browserLocalPersistence, GoogleAuthProvider } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';
import { getAnalytics } from 'firebase/analytics';

// Your Firebase project configuration (capstone-login)
const firebaseConfig = {
  apiKey: "AIzaSyCszXf_pf2sZGDmu-ozZpzEpQUkLJs0J0c",
  authDomain: "capstone-login-a5c91.firebaseapp.com",
  projectId: "capstone-login-a5c91",
  storageBucket: "capstone-login-a5c91.firebasestorage.app",
  messagingSenderId: "341590185981",
  appId: "1:341590185981:web:30684a3d216d3975796b94"
};



// Initialize Firebase
const app = getApps().length ? getApps()[0] : initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);
const analytics = getAnalytics(app);

// Persist login across browser reloads
void setPersistence(auth, browserLocalPersistence);

// Google Auth provider
const googleProvider = new GoogleAuthProvider();

export { app, auth, db, storage, analytics, googleProvider };
