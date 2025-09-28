"use client";

import { useState } from "react";

type CopyButtonProps = {
  text: string; // The text to copy
  label?: string; // Optional label for the button
};

export default function CopyButton({ text, label = "Copy" }: CopyButtonProps) {
  const [copied, setCopied] = useState(false);

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500); // Reset after 1.5 sec
    } catch (err) {
      console.error("Failed to copy: ", err);
    }
  }

  return (
    <button
      onClick={handleCopy}
      className={`px-3 py-1 rounded text-white text-sm ${
        copied ? "bg-green-500" : "bg-blue-500 hover:bg-blue-600"
      }`}
    >
      {copied ? "Copied!" : label}
    </button>
  );
}
