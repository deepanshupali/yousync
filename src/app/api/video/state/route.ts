// // src/app/api/video/state/route.ts
// import { NextResponse } from "next/server";
// import { prisma } from "@/lib/prisma";

// export async function GET(req: Request) {
//   const { searchParams } = new URL(req.url);
//   const roomId = searchParams.get("roomId");

//   if (!roomId) {
//     return NextResponse.json({ error: "roomId is required" }, { status: 400 });
//   }

//   const state = await prisma.videoState.findUnique({
//     where: { roomId },
//   });

//   if (!state) {
//     return NextResponse.json({ videoUrl: null });
//   }

//   return NextResponse.json({ videoUrl: state.source });
// }

import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { pusher } from "@/lib/pusher"; // make sure you have this

// ✅ GET video state (new joiners, reloads)
export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const roomId = searchParams.get("roomId");

  if (!roomId) {
    return NextResponse.json({ error: "roomId is required" }, { status: 400 });
  }

  const state = await prisma.videoState.findUnique({
    where: { roomId },
  });

  if (!state) {
    return NextResponse.json({ videoUrl: null, playing: false, position: 0 });
  }

  return NextResponse.json({
    videoUrl: state.source,
    playing: state.playing,
    position: state.position,
  });
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
    const updatedState = await prisma.videoState.update({
      where: { roomId },
      data: {
        ...(playing !== undefined && { playing }),
        ...(position !== undefined && { position }),
      },
    });

    // 🔔 broadcast to all clients in the room
    await pusher.trigger(`room-${roomId}`, "video-state-updated", {
      playing: updatedState.playing,
      position: updatedState.position,
    });

    return NextResponse.json({ success: true, state: updatedState });
  } catch (err) {
    console.error("Error updating video state:", err);
    return NextResponse.json(
      { error: "Failed to update video state" },
      { status: 500 }
    );
  }
}
