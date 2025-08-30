"use client";
import React from "react";
import { auth, googleProvider } from "@/lib/firebase";
import { signInWithPopup } from "firebase/auth";

const SignIn = () => {
  const handleLogin = async () => {
    try {
      await signInWithPopup(auth, googleProvider);
    } catch (e) {
      console.error("Firebase sign-in failed", e);
    }
  };

  return (
    <button
      onClick={handleLogin}
      className="text-sm font-semibold hover:text-darkColor text-lightColor hover:cursor-pointer hoverEffect"
    >
      Login
    </button>
  );
};

export default SignIn;
