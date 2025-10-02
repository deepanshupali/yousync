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
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
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

  const scrollToBottom = () => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    async function fetchMessages() {
      const res = await fetch(`/api/msg/${roomId}`);
      const data = await res.json();
      setMessages(
        data.map((m: Message) => ({
          id: m.id,
          text: m.text,
          userId: m.userId,
          sender: m.user?.name ?? "Guest",
          createdAt: m.createdAt,
          user: m.user,
        }))
      );
    }

    fetchMessages();

    let channel = pusherClient.channel(`room-${roomId}`);
    if (!channel) {
      channel = pusherClient.subscribe(`room-${roomId}`);
    }

    channel.bind("message-new", (data: Message) => {
      setMessages((prev) => [...prev, data]);
    });

    return () => {
      channel.unbind("message-new");
    };
  }, [roomId]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  async function sendMessage() {
    if (!newMsg.trim()) return;
    await fetch("/api/msg", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ roomId, userId, text: newMsg }),
    });
    setNewMsg("");
  }

  return (
    // <Card className="w-full max-w-md mx-auto h- flex flex-col">
    <Card className="w-full h-full flex flex-col ">
      <CardHeader className="font-bold text-lg border-b">Live Chat</CardHeader>
      <CardContent className="flex-1 p-4">
        <ScrollArea className="h-full pr-2 space-y-3">
          {messages.map((m) => {
            const isMe = m.userId === userId;
            return (
              <div
                key={m.id}
                className={`flex items-end gap-2 ${
                  isMe ? "justify-end" : "justify-start"
                }`}
              >
                {!isMe && (
                  <Avatar className="h-8 w-8 m-1">
                    <AvatarImage src={m.user?.image ?? ""} alt={m.sender} />
                    <AvatarFallback>
                      {m.sender.slice(0, 2).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                )}
                <div
                  className={`max-w-xs px-3 py-2 rounded-2xl text-sm shadow mb-2 ${
                    isMe
                      ? "bg-blue-600 text-white rounded-br-none"
                      : "bg-muted text-foreground rounded-bl-none"
                  }`}
                >
                  {!isMe && (
                    <span className="block text-xs text-muted-foreground mb-1">
                      {m.sender}
                    </span>
                  )}
                  <span>{m.text}</span>
                  <span className="block text-[10px] text-muted-foreground mt-1 text-right">
                    {new Date(m.createdAt).toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </span>
                </div>
                {isMe && (
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={m.user?.image ?? ""} alt="You" />
                    <AvatarFallback>YOU</AvatarFallback>
                  </Avatar>
                )}
              </div>
            );
          })}
          <div ref={scrollRef} />
        </ScrollArea>
      </CardContent>
      <CardFooter className="flex gap-2 border-t p-2">
        <Input
          value={newMsg}
          onChange={(e) => setNewMsg(e.target.value)}
          placeholder="Type a message..."
          className="flex-1 rounded-full"
          onKeyDown={(e) => e.key === "Enter" && sendMessage()}
        />
        <Button
          onClick={sendMessage}
          className="rounded-full px-6"
          disabled={!newMsg.trim()}
        >
          Send
        </Button>
      </CardFooter>
    </Card>
  );
}
