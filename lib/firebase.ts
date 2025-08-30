"use client";

import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

// Firebase configuration - temporarily hardcoded for debugging
const firebaseConfig = {
  apiKey: "AIzaSyDM64xOoS-pJbpkY8568tahnjZMD6Drm3M",
  authDomain: "boomerang-29c2b.firebaseapp.com",
  projectId: "boomerang-29c2b",
  storageBucket: "boomerang-29c2b.firebasestorage.app",
  messagingSenderId: "673294627206",
  appId: "1:673294627206:web:420cda60c82a7352c07c07",
  measurementId: "G-FYCSWX22YZ",
};

const app = getApps().length ? getApp() : initializeApp(firebaseConfig);

const auth = getAuth(app);
const googleProvider = new GoogleAuthProvider();

export { app, auth, googleProvider };


