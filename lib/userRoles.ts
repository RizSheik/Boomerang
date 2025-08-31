import { doc, setDoc, getDoc, updateDoc, enableNetwork } from "firebase/firestore";
import { db } from "./firebase";

// Hardcoded admin email - ONLY this email can be admin
export const ADMIN_EMAIL = "bhoomerang983@gmail.com";

export interface UserRole {
  uid: string;
  email: string;
  role: "admin" | "user";
  createdAt: Date;
  updatedAt: Date;
}

// Local storage fallback for offline scenarios
const USER_ROLES_STORAGE_KEY = 'boomerang_user_roles';

/**
 * Store user role in local storage as fallback
 */
function storeUserRoleLocally(userRole: UserRole): void {
  try {
    if (typeof window !== 'undefined') {
      const existingRoles = JSON.parse(localStorage.getItem(USER_ROLES_STORAGE_KEY) || '{}');
      existingRoles[userRole.uid] = userRole;
      localStorage.setItem(USER_ROLES_STORAGE_KEY, JSON.stringify(existingRoles));
    }
  } catch (error) {
    console.error('Failed to store user role locally:', error);
  }
}

/**
 * Get user role from local storage
 */
function getUserRoleLocally(uid: string): UserRole | null {
  try {
    if (typeof window !== 'undefined') {
      const existingRoles = JSON.parse(localStorage.getItem(USER_ROLES_STORAGE_KEY) || '{}');
      return existingRoles[uid] || null;
    }
  } catch (error) {
    console.error('Failed to get user role locally:', error);
  }
  return null;
}

/**
 * Ensures Firestore is online before operations
 */
async function ensureFirestoreOnline() {
  try {
    await enableNetwork(db);
    return true;
  } catch (error) {
    console.error('Failed to enable Firestore network:', error);
    return false;
  }
}

/**
 * Determines user role based on email
 * Only the hardcoded admin email can be admin
 */
export function determineUserRole(email: string): "admin" | "user" {
  return email === ADMIN_EMAIL ? "admin" : "user";
}

/**
 * Creates or updates user role in Firestore
 * This function is called after successful authentication
 */
export async function createOrUpdateUserRole(
  uid: string,
  email: string
): Promise<UserRole> {
  try {
    // Ensure Firestore is online
    const isOnline = await ensureFirestoreOnline();
    if (!isOnline) {
      // Create role locally and store it
      const newUser: UserRole = {
        uid,
        email,
        role: determineUserRole(email),
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      
      // Store locally for offline use
      storeUserRoleLocally(newUser);
      
      throw new Error('Firestore is offline. Using local storage fallback.');
    }

    const userRef = doc(db, "users", uid);
    const userSnap = await getDoc(userRef);

    if (userSnap.exists()) {
      // User exists, update if needed
      const existingUser = userSnap.data() as UserRole;
      const newRole = determineUserRole(email);
      
      // Only update if role has changed
      if (existingUser.role !== newRole) {
        await updateDoc(userRef, {
          role: newRole,
          updatedAt: new Date(),
        });
        
        const updatedUser = {
          ...existingUser,
          role: newRole,
          updatedAt: new Date(),
        };
        
        // Update local storage
        storeUserRoleLocally(updatedUser);
        return updatedUser;
      }
      
      // Update local storage
      storeUserRoleLocally(existingUser);
      return existingUser;
    } else {
      // New user, create with determined role
      const newUser: UserRole = {
        uid,
        email,
        role: determineUserRole(email),
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      
      await setDoc(userRef, newUser);
      
      // Store locally
      storeUserRoleLocally(newUser);
      return newUser;
    }
  } catch (error) {
    console.error('Error in createOrUpdateUserRole:', error);
    
    // If it's an offline error, try to get/create locally
    if (error instanceof Error && error.message.includes('offline')) {
      console.log('Firestore offline, using local storage fallback');
      
      // Try to get existing role from local storage
      const localRole = getUserRoleLocally(uid);
      if (localRole) {
        console.log('Using cached user role from local storage');
        return localRole;
      }
      
      // Create new role locally
      const newUser: UserRole = {
        uid,
        email,
        role: determineUserRole(email),
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      
      storeUserRoleLocally(newUser);
      console.log('Created new user role in local storage');
      return newUser;
    }
    
    throw error;
  }
}

/**
 * Gets user role from Firestore or local storage
 */
export async function getUserRole(uid: string): Promise<UserRole | null> {
  try {
    // First try to get from local storage (faster)
    const localRole = getUserRoleLocally(uid);
    if (localRole) {
      console.log('User role found in local storage');
    }
    
    // Try to get from Firestore
    const isOnline = await ensureFirestoreOnline();
    if (!isOnline) {
      console.warn('Firestore is offline, returning local role if available');
      return localRole;
    }

    const userRef = doc(db, "users", uid);
    const userSnap = await getDoc(userRef);
    
    if (userSnap.exists()) {
      const firestoreRole = userSnap.data() as UserRole;
      
      // Update local storage with latest data
      storeUserRoleLocally(firestoreRole);
      
      return firestoreRole;
    }
    
    // If not in Firestore but exists locally, return local
    if (localRole) {
      console.log('User role not in Firestore, using local storage');
      return localRole;
    }
    
    return null;
  } catch (error) {
    console.error("Error fetching user role:", error);
    
    // If it's an offline error, return local role
    if (error instanceof Error && error.message.includes('offline')) {
      console.warn('Firestore is offline, returning local role if available');
      return getUserRoleLocally(uid);
    }
    
    // For other errors, try local storage as fallback
    return getUserRoleLocally(uid);
  }
}

/**
 * Checks if user is admin
 */
export async function isUserAdmin(uid: string): Promise<boolean> {
  try {
    const userRole = await getUserRole(uid);
    return userRole?.role === "admin";
  } catch (error) {
    console.error("Error checking if user is admin:", error);
    
    // Fallback to local storage
    try {
      const localRole = getUserRoleLocally(uid);
      return localRole?.role === "admin";
    } catch (localError) {
      console.error("Error checking local user role:", localError);
      return false;
    }
  }
}

/**
 * Security check - ensures only the hardcoded admin email can be admin
 * This function should be called before any admin operations
 */
export function validateAdminAccess(email: string): boolean {
  return email === ADMIN_EMAIL;
}

/**
 * Sync local roles with Firestore when back online
 */
export async function syncLocalRolesWithFirestore(): Promise<void> {
  try {
    if (typeof window === 'undefined') return;
    
    const localRoles = JSON.parse(localStorage.getItem(USER_ROLES_STORAGE_KEY) || '{}');
    const isOnline = await ensureFirestoreOnline();
    
    if (!isOnline) {
      console.log('Firestore still offline, cannot sync');
      return;
    }
    
    // Sync each local role to Firestore
    for (const [uid, userRole] of Object.entries(localRoles)) {
      try {
        const userRef = doc(db, "users", uid);
        await setDoc(userRef, userRole, { merge: true });
        console.log(`Synced user role for ${uid}`);
      } catch (error) {
        console.error(`Failed to sync user role for ${uid}:`, error);
      }
    }
    
    console.log('Local roles synced with Firestore successfully');
  } catch (error) {
    console.error('Error syncing local roles:', error);
  }
}
