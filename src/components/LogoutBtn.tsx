"use client";
import React, { useState } from "react";
import { signOut } from "next-auth/react";
import { Button } from "./ui/button";
import { LogOut } from "lucide-react";
import { ClipLoader } from "react-spinners";

export default function LogoutButton() {
  const [loading, setLoading] = useState(false);

  async function handleLogout() {
    if (loading) return;
    setLoading(true);
    try {
      await signOut({ callbackUrl: "/login" });
    } catch (err) {
      console.error("Logout error:", err);
      setLoading(false);
    }
  }

  return (
    <Button
      variant="outline"
      onClick={handleLogout}
      disabled={loading}
      className="flex items-center justify-center gap-2 border-neutral-300 dark:border-neutral-700 hover:bg-neutral-100 dark:hover:bg-neutral-800 disabled:opacity-70 transition-colors"
    >
      {loading ? (
        <>
          <ClipLoader color="#3B82F6" size={20} />
          <span>Signing out...</span>
        </>
      ) : (
        <>
          <LogOut className="w-4 h-4" />
          Logout
        </>
      )}
    </Button>
  );
}
