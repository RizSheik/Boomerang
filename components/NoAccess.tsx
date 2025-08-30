import React from "react";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "./ui/card";
import Logo from "./Logo";
import { Button } from "./ui/button";
import { signInWithPopup } from "firebase/auth";
import { auth, googleProvider } from "@/lib/firebase";

const NoAccess = ({
  details = "Log in to view your cart items and checkout. Don't miss out on your favorite products!",
}: {
  details?: string;
}) => {
  return (
    <div className="flex items-center justify-center py-12 md:py-32 p-4">
      <Card className="w-full max-w-md p-5 bg-card border border-border">
        <CardHeader className="flex items-center flex-col">
          <Logo />
          <CardTitle className="text-2xl font-bold text-center">
            Welcome Back!
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-center font-medium text-muted-foreground">{details}</p>
          <Button
            className="w-full"
            size="lg"
            onClick={async () => {
              try {
                await signInWithPopup(auth, googleProvider);
              } catch (e) {
                console.error("Firebase sign-in failed", e);
              }
            }}
          >
            Sign in with Google
          </Button>
        </CardContent>
        <CardFooter className="flex flex-col space-y-2">
          <div className="text-sm text-muted-foreground text-center">
            Don&rsquo;t have an account?
          </div>
          <Button
            variant="outline"
            className="w-full"
            size="lg"
            onClick={async () => {
              try {
                await signInWithPopup(auth, googleProvider);
              } catch (e) {
                console.error("Firebase sign-up failed", e);
              }
            }}
          >
            Continue with Google
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default NoAccess;
