"use client";

import { Button } from "@/components/ui/button";
import { useState } from "react";
import { IoIosCopy } from "react-icons/io";
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
    <div>
      <span className="font-mono text-sm bg-muted px-2 py-1 rounded mr-2">
        Room ID: <strong>{text}</strong>
      </span>
      <Button
        onClick={handleCopy}
        variant={copied ? "secondary" : "default"}
        size="icon"
        title={copied ? "Copied!" : "Copy Room ID"}
      >
        <IoIosCopy />
      </Button>
    </div>
  );
}
