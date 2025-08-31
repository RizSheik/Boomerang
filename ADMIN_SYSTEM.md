# 🔐 Admin Role System Documentation

## Overview

This document describes the secure admin role system implemented in the Boomerang e-commerce platform. The system ensures that only one specific email address can ever have admin privileges, providing a secure and controlled access mechanism.

## 🎯 Key Features

- **Single Admin Email**: Only `bhoomerang983@gmail.com` can be admin
- **Automatic Role Assignment**: Roles are automatically assigned based on email
- **Secure Route Protection**: Admin routes are protected with role-based access control
- **Firestore Integration**: User roles are stored securely in Firestore
- **Real-time Updates**: Role changes are reflected immediately across the application

## 🏗️ Architecture

### 1. User Role Management (`lib/userRoles.ts`)

```typescript
// Hardcoded admin email - ONLY this email can be admin
export const ADMIN_EMAIL = "bhoomerang983@gmail.com";

export interface UserRole {
  uid: string;
  email: string;
  role: "admin" | "user";
  createdAt: Date;
  updatedAt: Date;
}
```

**Key Functions:**
- `determineUserRole(email)`: Returns role based on email comparison
- `createOrUpdateUserRole(uid, email)`: Creates/updates user in Firestore
- `getUserRole(uid)`: Retrieves user role from Firestore
- `isUserAdmin(uid)`: Checks if user is admin
- `validateAdminAccess(email)`: Security validation function

### 2. Authentication Context (`contexts/AuthContext.tsx`)

Provides authentication state and user role information throughout the application:

```typescript
interface AuthContextType {
  user: User | null;
  userRole: UserRole | null;
  isLoading: boolean;
  signOut: () => Promise<void>;
  isAdmin: boolean;
}
```

### 3. Route Protection (`components/AdminRoute.tsx`)

Protects admin routes by checking user authentication and role:

```typescript
<AdminRoute>
  {/* Admin-only content */}
</AdminRoute>
```

## 🔒 Security Features

### 1. Hardcoded Admin Email

The admin email is hardcoded in the source code and cannot be changed without code modification:

```typescript
export const ADMIN_EMAIL = "bhoomerang983@gmail.com";
```

### 2. Role Assignment Logic

Roles are automatically determined during authentication:

```typescript
export function determineUserRole(email: string): "admin" | "user" {
  return email === ADMIN_EMAIL ? "admin" : "user";
}
```

### 3. Firestore Security Rules

Firebase security rules ensure data integrity:

```javascript
// Users can only read/write their own data
// Role cannot be modified by users
allow update: if request.auth != null && 
               request.auth.uid == userId && 
               request.resource.data.role == resource.data.role;
```

### 4. Frontend Protection

Multiple layers of protection:
- **Component Level**: `AdminRoute` component
- **Context Level**: `useAuth` hook with `isAdmin` flag
- **Route Level**: Conditional rendering based on role

## 🚀 Usage Examples

### 1. Protecting Admin Routes

```typescript
import AdminRoute from "@/components/AdminRoute";

const AdminPage = () => {
  return (
    <AdminRoute>
      <div>Admin-only content</div>
    </AdminRoute>
  );
};
```

### 2. Conditional Rendering

```typescript
import { useAuth } from "@/contexts/AuthContext";

const Header = () => {
  const { isAdmin } = useAuth();
  
  return (
    <header>
      {isAdmin && (
        <Link href="/admin">Admin Dashboard</Link>
      )}
    </header>
  );
};
```

### 3. Role-Based API Access

```typescript
const { user, isAdmin } = useAuth();

if (!isAdmin) {
  toast.error("Admin access required");
  return;
}
```

## 📁 File Structure

```
├── lib/
│   ├── firebase.ts          # Firebase configuration + Firestore
│   └── userRoles.ts         # User role management functions
├── contexts/
│   └── AuthContext.tsx      # Authentication context provider
├── components/
│   ├── AdminRoute.tsx       # Route protection component
│   ├── Header.tsx           # Updated with role-based navigation
│   ├── SignIn.tsx           # Updated with role creation
│   └── NoAccess.tsx         # Updated with role creation
├── app/(client)/
│   ├── admin/               # New admin dashboard
│   │   └── page.tsx         # Protected admin page
│   ├── cart/page.tsx        # Updated to use AuthContext
│   ├── orders/page.tsx      # Updated to use AuthContext
│   └── wishlist/page.tsx    # Updated to use AuthContext
├── firestore.rules          # Firebase security rules
└── app/layout.tsx           # Updated with AuthProvider
```

## 🔄 Authentication Flow

1. **User Signs In**: Google OAuth via Firebase
2. **Role Determination**: Email is checked against `ADMIN_EMAIL`
3. **Firestore Update**: User role is created/updated in Firestore
4. **Context Update**: AuthContext is updated with user and role
5. **UI Update**: Components re-render based on new role

## 🛡️ Security Considerations

### 1. Email Verification

- Admin email is hardcoded and cannot be changed via UI
- Role assignment happens server-side during authentication
- No user input can modify admin privileges

### 2. Data Protection

- Users can only access their own data
- Admin role cannot be modified by users
- Firestore rules enforce access control

### 3. Route Protection

- Admin routes are protected at component level
- Unauthorized access shows "Access Denied" page
- Automatic redirects for unauthenticated users

## 🧪 Testing

### 1. Admin Access

1. Sign in with `bhoomerang983@gmail.com`
2. Verify admin dashboard is accessible
3. Verify admin links appear in header
4. Verify Sanity Studio access

### 2. User Access

1. Sign in with any other email
2. Verify admin dashboard shows "Access Denied"
3. Verify no admin links in header
4. Verify normal user functionality works

### 3. Unauthenticated Access

1. Sign out or don't sign in
2. Verify admin routes redirect to home
3. Verify protected content shows login prompts

## 🚨 Troubleshooting

### Common Issues

1. **Role Not Updating**: Check Firestore rules and authentication flow
2. **Admin Access Denied**: Verify email matches exactly
3. **Context Not Working**: Ensure `AuthProvider` wraps the app
4. **Firestore Errors**: Check Firebase configuration and rules

### Debug Steps

1. Check browser console for errors
2. Verify Firestore rules are deployed
3. Check authentication state in React DevTools
4. Verify user document exists in Firestore

## 🔮 Future Enhancements

1. **Role Hierarchy**: Multiple admin levels (super admin, moderator)
2. **Audit Logging**: Track admin actions and role changes
3. **Temporary Admin**: Time-limited admin access
4. **Admin Invites**: Secure admin invitation system
5. **Role Permissions**: Granular permission system

## 📞 Support

For issues with the admin system:
1. Check this documentation
2. Review Firebase console for errors
3. Check browser console for JavaScript errors
4. Verify environment variables are set correctly

---

**⚠️ Important**: Never modify the `ADMIN_EMAIL` constant without proper security review. This is the primary security mechanism of the admin system.
