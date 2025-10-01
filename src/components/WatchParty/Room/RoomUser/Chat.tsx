"use client";

import { useEffect, useRef, useState } from "react";
import {
  Card,
  CardHeader,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { pusherClient } from "@/lib/pusherClient";

export interface User {
  id: string;
  name: string;
  email: string | null;
  provider: string;
  image: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface Message {
  id: string;
  text: string;
  roomId: string;
  userId: string;
  createdAt: string;
  user: User;
  sender: string;
}

export default function ChatBox({
  roomId,
  userId,
}: {
  roomId: string;
  userId: string;
}) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMsg, setNewMsg] = useState("");
  const scrollRef = useRef<HTMLDivElement>(null);

  // Scroll to bottom function
  const scrollToBottom = () => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  // Load old messages + listen for realtime updates
  useEffect(() => {
    async function fetchMessages() {
      const res = await fetch(`/api/msg/${roomId}`);
      const data = await res.json();
      console.log("Fetched messages:", data);
      setMessages(
        data.map((m: Message) => ({
          id: m.id,
          text: m.text,
          userId: m.userId,
          sender: m.user?.name ?? "Guest",
          createdAt: m.createdAt,
        }))
      );
    }

    fetchMessages();
    let channel = pusherClient.channel(`room-${roomId}`);
    if (!channel) {
      channel = pusherClient.subscribe(`room-${roomId}`);
    }

    // const channel = pusherClient.subscribe(`room-${roomId}`);
    channel.bind("message-new", (data: Message) => {
      setMessages((prev) => [...prev, data]);
    });

    return () => {
      channel.unbind("message-new");
    };
  }, [roomId]);

  // Scroll to bottom whenever messages change
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Send message
  async function sendMessage() {
    if (!newMsg.trim()) return;
    console.log("Sending message:", { roomId, userId, text: newMsg });
    await fetch("/api/msg", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ roomId, userId, text: newMsg }),
    });
    setNewMsg("");
  }

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader className="font-bold text-lg">Live Chat</CardHeader>
      <CardContent className="p-0">
        <ScrollArea className="h-60 p-4 space-y-2">
          {messages.map((m) => {
            return (
              <div key={m.id} className="p-2 text-white rounded-md">
                <span className="font-semibold">
                  {m.userId === userId ? "You" : m.sender}{" "}
                </span>
                {m.text}
              </div>
            );
          })}
          <div ref={scrollRef} /> {/* 👈 Always scroll here */}
        </ScrollArea>
      </CardContent>
      <CardFooter className="flex gap-2">
        <Input
          value={newMsg}
          onChange={(e) => setNewMsg(e.target.value)}
          placeholder="Type a message..."
          className="flex-1"
        />
        <Button onClick={sendMessage}>Send</Button>
      </CardFooter>
    </Card>
  );
}
