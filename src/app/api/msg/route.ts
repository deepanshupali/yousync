import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { pusher } from "@/lib/pusher";

export async function POST(req: NextRequest) {
  try {
    const { roomId, userId, text } = await req.json();
    console.log("Received message:", { roomId, userId, text });
    if (!roomId || !text) {
      return NextResponse.json({ error: "Missing fields" }, { status: 400 });
    }

    const message = await prisma.message.create({
      data: { roomId, userId, text },
      include: { user: true },
    });

    await pusher.trigger(`room-${roomId}`, "message-new", {
      id: message.id,
      text: message.text,
      sender: message.user?.name ?? "Guest",
      createdAt: message.createdAt,
      userId: message.userId,
    });

    return NextResponse.json(message);
  } catch (err) {
    console.error("Message error:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
