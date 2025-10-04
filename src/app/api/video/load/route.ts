// src/app/api/video/load/route.ts
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma"; // make sure prisma client is exported from lib
import { pusher } from "@/lib/pusher"; // server instance for triggering events

export async function POST(req: Request) {
  try {
    const { roomId, videoUrl } = await req.json();

    if (!roomId || !videoUrl) {
      return NextResponse.json(
        { error: "roomId and videoUrl are required" },
        { status: 400 }
      );
    }

    // Upsert (create or update) video state for this room
    const updatedState = await prisma.videoState.upsert({
      where: { roomId },
      update: { source: videoUrl, playing: false, position: 0 },
      create: {
        roomId,
        source: videoUrl,
        playing: false,
        position: 0,
      },
    });

    // if (updatedState.source === videoUrl) {
    //   return NextResponse.json({ success: true, state: updatedState });
    // }

    // 🔔 Notify others in the room via Pusher
    await pusher.trigger(`room-${roomId}`, "video-loaded", {
      videoUrl,
    });

    return NextResponse.json({ success: true, videoUrl: updatedState });
  } catch (error) {
    console.error("Error loading video:", error);
    return NextResponse.json(
      { error: "Failed to load video" },
      { status: 500 }
    );
  }
}
