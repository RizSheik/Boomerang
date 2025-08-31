"use client";

import { useAuth } from "@/contexts/AuthContext";
import { ADMIN_EMAIL } from "@/lib/userRoles";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Shield, AlertTriangle } from "lucide-react";

interface AdminRouteProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

export default function AdminRoute({ children, fallback }: AdminRouteProps) {
  const { user, userRole, isLoading, isAdmin } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !user) {
      // User not logged in, redirect to home
      router.push("/");
    }
  }, [user, isLoading, router]);

  // Show loading while checking authentication
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    );
  }

  // User not logged in
  if (!user) {
    return null; // Will redirect in useEffect
  }

  // User is not admin
  if (!isAdmin) {
    if (fallback) {
      return <>{fallback}</>;
    }

    return (
      <div className="flex items-center justify-center min-h-screen p-4">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-red-100">
              <AlertTriangle className="h-8 w-8 text-red-600" />
            </div>
            <CardTitle className="text-xl font-bold text-red-600">
              Access Denied
            </CardTitle>
          </CardHeader>
          <CardContent className="text-center space-y-4">
            <p className="text-muted-foreground">
              You don't have permission to access this area. Only administrators can view this content.
            </p>
            <div className="text-sm text-muted-foreground">
              <p>Your email: <span className="font-medium">{user.email}</span></p>
              <p>Admin email: <span className="font-medium">{ADMIN_EMAIL}</span></p>
            </div>
            <Button onClick={() => router.push("/")} className="w-full">
              Return to Home
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  // User is admin, show protected content
  return (
    <div className="min-h-screen bg-background">
      <div className="border-b bg-muted/50">
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Shield className="h-4 w-4 text-green-600" />
            <span className="font-medium text-green-600">Admin Access Granted</span>
            <span className="text-muted-foreground">•</span>
            <span>{user.email}</span>
          </div>
        </div>
      </div>
      {children}
    </div>
  );
}
