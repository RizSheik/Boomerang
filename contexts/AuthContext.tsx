"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { User, onAuthStateChanged, signOut as firebaseSignOut } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { createOrUpdateUserRole, getUserRole, UserRole, syncLocalRolesWithFirestore } from "@/lib/userRoles";
import toast from "react-hot-toast";

interface AuthContextType {
  user: User | null;
  userRole: UserRole | null;
  isLoading: boolean;
  signOut: () => Promise<void>;
  isAdmin: boolean;
  isOnline: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [userRole, setUserRole] = useState<UserRole | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isOnline, setIsOnline] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        setUser(user);
        
        try {
          // Create or update user role in Firestore
          const role = await createOrUpdateUserRole(user.uid, user.email!);
          setUserRole(role);
          setIsOnline(true);
          toast.success("Successfully signed in!");
        } catch (error) {
          console.error("Error managing user role:", error);
          
          // Check if it's an offline error
          if (error instanceof Error && error.message.includes('offline')) {
            setIsOnline(false);
            
            // Try to get existing role as fallback
            try {
              const existingRole = await getUserRole(user.uid);
              if (existingRole) {
                setUserRole(existingRole);
                toast.warning("Signed in with offline mode. Some features may be limited.");
              } else {
                // If no cached role, create a temporary one based on email
                const tempRole: UserRole = {
                  uid: user.uid,
                  email: user.email!,
                  role: user.email === "bhoomerang983@gmail.com" ? "admin" : "user",
                  createdAt: new Date(),
                  updatedAt: new Date(),
                };
                setUserRole(tempRole);
                toast.warning("Created temporary user role while offline");
              }
            } catch (fallbackError) {
              console.error("Error fetching existing user role:", fallbackError);
              setUserRole(null);
            }
          } else {
            // Other errors - try to get existing role
            try {
              const existingRole = await getUserRole(user.uid);
              setUserRole(existingRole);
            } catch (fallbackError) {
              console.error("Error fetching existing user role:", fallbackError);
              setUserRole(null);
            }
          }
        }
      } else {
        setUser(null);
        setUserRole(null);
      }
      
      setIsLoading(false);
    });

    return unsubscribe;
  }, []);

  // Monitor online/offline status and sync data when back online
  useEffect(() => {
    const handleOnline = async () => {
      setIsOnline(true);
      toast.success("You're back online!");
      
      // Try to sync local data with Firestore
      try {
        await syncLocalRolesWithFirestore();
        toast.success("Data synced successfully!");
      } catch (error) {
        console.error("Failed to sync data:", error);
      }
    };

    const handleOffline = () => {
      setIsOnline(false);
      toast.error("You're offline. Some features may not work properly.");
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    // Set initial status
    setIsOnline(navigator.onLine);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const signOut = async () => {
    try {
      await firebaseSignOut(auth);
      setUser(null);
      setUserRole(null);
      toast.success("Signed out successfully");
    } catch (error) {
      console.error("Error signing out:", error);
      toast.error("Error signing out. Please try again.");
    }
  };

  const value: AuthContextType = {
    user,
    userRole,
    isLoading,
    signOut,
    isAdmin: userRole?.role === "admin",
    isOnline,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
