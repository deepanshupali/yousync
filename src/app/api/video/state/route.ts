// src/app/api/video/state/route.ts
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

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
    return NextResponse.json({ videoUrl: null });
  }

  return NextResponse.json({ videoUrl: state.source });
}
