"use client";
import React from "react";
import { auth, googleProvider } from "@/lib/firebase";
import { signInWithPopup } from "firebase/auth";
import { createOrUpdateUserRole } from "@/lib/userRoles";
import toast from "react-hot-toast";

const SignIn = () => {
  const handleLogin = async () => {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      
      if (result.user) {
        // Create or update user role in Firestore
        try {
          await createOrUpdateUserRole(result.user.uid, result.user.email!);
          toast.success("Successfully signed in!");
        } catch (roleError) {
          console.error("Error managing user role:", roleError);
          toast.error("Signed in but there was an issue with role management");
        }
      }
    } catch (e) {
      console.error("Firebase sign-in failed", e);
      toast.error("Sign-in failed. Please try again.");
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
