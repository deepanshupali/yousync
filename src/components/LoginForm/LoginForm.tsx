"use client";

import React, { useState } from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { signIn } from "next-auth/react";
import { FcGoogle } from "react-icons/fc";
import { Sparkles } from "lucide-react";
import { ClipLoader } from "react-spinners";

export function LoginForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const [googleLoading, setGoogleLoading] = useState(false);
  const [guestLoading, setGuestLoading] = useState(false);

  async function handleGoogleLogin() {
    if (googleLoading) return;
    setGoogleLoading(true);
    try {
      await signIn("google");
    } catch (err) {
      console.error("Google sign-in error:", err);
      setGoogleLoading(false);
    }
  }

  async function handleGuestLogin() {
    if (guestLoading) return;
    setGuestLoading(true);
    try {
      await signIn("guest");
    } catch (err) {
      console.error("Guest sign-in error:", err);
      setGuestLoading(false);
    }
  }

  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center gap-6 w-full max-w-md mx-auto",
        className
      )}
      {...props}
    >
      <Card className="w-full shadow-xl dark:bg-[#283240] border-0 rounded-2xl">
        <CardHeader className="text-center space-y-2">
          <CardTitle
            className="text-3xl font-extrabold tracking-tight 
             bg-gradient-to-r from-purple-600 to-blue-500 dark:from-purple-400 dark:to-blue-300 
             bg-clip-text text-transparent"
          >
            Welcome Back 🎬
          </CardTitle>

          <p className="text-sm text-neutral-600 dark:text-neutral-400">
            Sign in to start your watch party
          </p>
        </CardHeader>

        <CardContent className="flex flex-col gap-4">
          {/* Google Login */}
          <Button
            type="button"
            variant="outline"
            onClick={handleGoogleLogin}
            disabled={googleLoading || guestLoading}
            className="w-full flex items-center justify-center gap-3 py-6 text-lg font-semibold border border-neutral-300 dark:border-neutral-700 hover:bg-neutral-100 dark:hover:bg-neutral-800 disabled:opacity-70 transition-colors"
          >
            {googleLoading ? (
              <>
                <ClipLoader color="#3B82F6" size={22} />
                <span>Signing in...</span>
              </>
            ) : (
              <>
                <FcGoogle className="text-2xl" />
                Continue with Google
              </>
            )}
          </Button>

          {/* Divider */}
          <div className="flex items-center gap-2 text-neutral-400 text-xs uppercase">
            <div className="flex-1 h-px bg-neutral-300 dark:bg-neutral-700"></div>
            or
            <div className="flex-1 h-px bg-neutral-300 dark:bg-neutral-700"></div>
          </div>

          {/* Free Trial */}
          <Button
            type="button"
            onClick={handleGuestLogin}
            disabled={guestLoading || googleLoading}
            className="w-full bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500 text-white font-bold py-6 rounded-xl shadow-lg flex items-center justify-center gap-3 transform hover:scale-105 transition-transform duration-300 disabled:opacity-70"
          >
            {guestLoading ? (
              <>
                <ClipLoader color="#ffffff" size={22} />
                <span>Starting trial...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-5 h-5" />
                Try for Free! 🎉 No Login
              </>
            )}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
