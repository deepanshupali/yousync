"use client";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { signIn } from "next-auth/react";
import { FcGoogle } from "react-icons/fc";
import { Sparkles } from "lucide-react";

export function LoginForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
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
            onClick={() => signIn("google")}
            className="w-full flex items-center justify-center gap-2 py-6 text-lg font-semibold border border-neutral-300 dark:border-neutral-700 hover:bg-neutral-100 dark:hover:bg-neutral-800"
          >
            <FcGoogle className="text-2xl" />
            Continue with Google
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
            className="w-full bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500 text-white font-bold py-6 rounded-xl shadow-lg flex items-center justify-center gap-2 transform hover:scale-105 transition-transform duration-300"
            onClick={() => signIn("guest")}
          >
            <Sparkles className="w-5 h-5" />
            Try for Free! 🎉 No Login
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
