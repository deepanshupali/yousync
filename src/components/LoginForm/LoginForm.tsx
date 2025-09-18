"use client";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { signIn } from "next-auth/react";

export function LoginForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div className={cn("flex flex-col gap-6 ", className)} {...props}>
      <Card className="dark:bg-[#283240]">
        <CardHeader>
          <CardTitle className="text-center text-3xl font-extrabold">
            Login
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form>
            <div className="flex flex-col gap-6">
              <div className="grid gap-3">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="m@example.com"
                  className="py-5"
                  required
                />
              </div>
              <div className="grid gap-3">
                <div className="flex items-center">
                  <Label htmlFor="password">Password</Label>
                  <a
                    href="#"
                    className="ml-auto text-blue-500 text-sm underline-offset-4 hover:underline"
                  >
                    Forgot your password?
                  </a>
                </div>
                <Input
                  className="py-5"
                  id="password"
                  type="password"
                  required
                />
              </div>
              <div className="flex flex-col gap-3">
                <Button
                  type="submit"
                  className="w-full bg-blue-500 text-white hover:bg-blue-600"
                >
                  Login
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  className="w-full bg-green-500 text-white hover:bg-green-600"
                  onClick={() => signIn("google")}
                >
                  Login with Google
                </Button>
              </div>
            </div>
            <div className="mt-4 text-center text-sm">
              Don&apos;t have an account?{" "}
              <a
                href="#"
                className="text-blue-500 underline underline-offset-4 hover:underline"
              >
                Sign up
              </a>
            </div>
          </form>
        </CardContent>
      </Card>
      <div className="flex justify-center">
        <Button
          type="button"
          variant="outline"
          className="w-full max-w-s bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500 text-white font-bold uppercase  shadow-lg transform hover:scale-105 transition-transform duration-300"
        >
          🚀 Try for Free! No Card / Sign Up Needed 🎉
        </Button>
      </div>
    </div>
  );
}
