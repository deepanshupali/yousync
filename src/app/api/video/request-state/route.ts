import { pusher } from "@/lib/pusher";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { roomId } = await req.json();

    // Broadcast to the room’s channel asking admin to resend video state
    await pusher.trigger(`room-${roomId}`, "request-video-state", {});
    console.log("Requested video state for room:", roomId);

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Error in /api/video/request-state:", err);
    return NextResponse.json(
      { error: "Failed to request video state" },
      { status: 500 }
    );
  }
}
