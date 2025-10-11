"use client";

import React from "react";
import ThemeToggleButton from "@/components/ThemeToggle/ThemeToggleButton";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";
import { FcGoogle } from "react-icons/fc";
import { Sparkles } from "lucide-react";

const Nav = () => {
  return (
    <nav className="flex items-center justify-between px-5 py-4 md:px-10 md:py-6 border-b border-neutral-200 dark:border-neutral-800 bg-white/70 dark:bg-neutral-900/70 backdrop-blur-md sticky top-0 z-50 shadow-sm">
      {/* Logo */}
      <Link href="/" className="flex items-center gap-2 group">
        <Image
          src="/yousync.png"
          alt="YouSync Logo"
          width={160}
          height={35}
          className="h-9 w-auto md:h-10 md:w-40 transition-transform duration-300 group-hover:scale-105"
          priority
        />
      </Link>

      {/* Right side actions */}
      <div className="flex items-center gap-3 md:gap-4">
        <ThemeToggleButton />
        <Link
          href="/about"
          className="hidden sm:flex items-center gap-2 bg-white border border-neutral-300 dark:bg-neutral-800 dark:border-neutral-700 px-4 py-2 rounded-xl text-sm md:text-base font-medium hover:bg-neutral-100 dark:hover:bg-neutral-700 transition-all shadow-sm"
        >
          About Us
        </Link>
        {/* Login button group */}
        {/* <div className="flex items-center gap-2">
          <Link
            href="/login"
            className="hidden sm:flex items-center gap-2 bg-white border border-neutral-300 dark:bg-neutral-800 dark:border-neutral-700 px-4 py-2 rounded-xl text-sm md:text-base font-medium hover:bg-neutral-100 dark:hover:bg-neutral-700 transition-all shadow-sm"
          >
            <FcGoogle className="text-lg" />
            Google Login
          </Link>

          <Link href="/login">
            <Button className="flex items-center gap-2 bg-gradient-to-r from-blue-500 to-indigo-500 text-white font-semibold hover:from-blue-600 hover:to-indigo-600 text-sm md:text-base px-4 md:px-6 py-2 md:py-3 rounded-xl shadow-md transition-all">
              <Sparkles className="w-4 h-4" />
              Try Free
            </Button>
          </Link>
        </div> */}
      </div>
    </nav>
  );
};

export default Nav;
