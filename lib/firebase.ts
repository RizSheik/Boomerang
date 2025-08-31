"use client";

import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore, enableNetwork, disableNetwork, connectFirestoreEmulator, collection, getDocs, enableIndexedDbPersistence } from "firebase/firestore";

// Firebase configuration - use environment variables
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY || "AIzaSyDM64xOoS-pJbpkY8568tahnjZMD6Drm3M",
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || "boomerang-29c2b.firebaseapp.com",
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || "boomerang-29c2b",
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || "boomerang-29c2b.firebasestorage.app",
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || "673294627206",
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID || "1:673294627206:web:420cda60c82a7352c07c07",
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID || "G-FYCSWX22YZ",
};

const app = getApps().length ? getApp() : initializeApp(firebaseConfig);

const auth = getAuth(app);
const googleProvider = new GoogleAuthProvider();
const db = getFirestore(app);

// Enhanced offline persistence and connection handling
if (typeof window !== 'undefined') {
  // Only run in browser environment
  const initializeFirestore = async () => {
    try {
      // Enable offline persistence with IndexedDB
      await enableIndexedDbPersistence(db);
      console.log('Firestore offline persistence enabled successfully');
      
      // Enable network
      await enableNetwork(db);
      console.log('Firestore network enabled successfully');
    } catch (error) {
      console.error('Failed to initialize Firestore:', error);
      
      // If persistence fails, still try to enable network
      try {
        await enableNetwork(db);
        console.log('Firestore network enabled (persistence failed)');
      } catch (networkError) {
        console.error('Failed to enable Firestore network:', networkError);
      }
    }
  };

  // Initialize Firestore on app load
  initializeFirestore();
}

// Test function to verify Firestore connectivity
export async function testFirestoreConnection() {
  try {
    console.log('Testing Firestore connection...');
    const testCollection = collection(db, 'test');
    const snapshot = await getDocs(testCollection);
    console.log('Firestore connection successful!');
    return true;
  } catch (error) {
    console.error('Firestore connection failed:', error);
    return false;
  }
}

export { app, auth, googleProvider, db };


