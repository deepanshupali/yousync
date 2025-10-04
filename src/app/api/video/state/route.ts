import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { pusher } from "@/lib/pusher"; // make sure you have this

// ✅ GET video state (new joiners, reloads)
export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const roomId = searchParams.get("roomId");

    if (!roomId) {
      return NextResponse.json(
        { error: "roomId is required" },
        { status: 400 }
      );
    }

    const state = await prisma.videoState.findUnique({
      where: { roomId },
    });

    // No state yet → return defaults
    if (!state) {
      return NextResponse.json({
        videoUrl: null,
        playing: false,
        position: 0,
      });
    }

    // Calculate drift (if video is playing, add elapsed time since last update)
    let position = state.position;
    if (state.playing && state.updatedAt) {
      const elapsed = (Date.now() - state.updatedAt.getTime()) / 1000;
      position += elapsed;
    }

    return NextResponse.json({
      videoUrl: state.source,
      playing: state.playing,
      position,
    });
  } catch (err) {
    console.error("Error fetching video state:", err);
    return NextResponse.json(
      { error: "Failed to fetch video state" },
      { status: 500 }
    );
  }
}

// ✅ PATCH video state (admin play/pause/seek)
export async function PATCH(req: Request) {
  try {
    const { roomId, playing, position } = await req.json();

    if (!roomId) {
      return NextResponse.json(
        { error: "roomId is required" },
        { status: 400 }
      );
    }

    // update state in DB
    const updatedState = await prisma.videoState.upsert({
      where: { roomId },
      update: {
        ...(playing !== undefined && { playing }),
        ...(position !== undefined && { position }),
      },
      create: {
        roomId,
        source: "", // placeholder, will be set via /api/video/load
        playing: playing ?? false,
        position: position ?? 0,
      },
    });
    // 🔔 broadcast to all clients in the room
    await pusher.trigger(`room-${roomId}`, "video-state-updated", {
      playing: updatedState.playing,
      position: updatedState.position,
    });
    console.log("Updated video state for room:", roomId, updatedState);

    return NextResponse.json({ success: true, state: updatedState });
  } catch (err) {
    console.error("Error updating video state:", err);
    return NextResponse.json(
      { error: "Failed to update video state" },
      { status: 500 }
    );
  }
}
