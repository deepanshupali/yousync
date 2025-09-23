import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { authOptions } from "../../auth/[...nextauth]/route";

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session || !session.user?.id) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  const { roomId } = await req.json();

  // Check if room exists
  const room = await prisma.room.findUnique({ where: { id: roomId } });
  if (!room) {
    return NextResponse.json({ error: "Room not found" }, { status: 404 });
  }

  // Check if user already in a room
  const existing = await prisma.membership.findUnique({
    where: { userId: session.user.id },
  });

  if (existing) {
    return NextResponse.json(
      { error: "You are already in another room" },
      { status: 400 }
    );
  }

  // Create membership
  const membership = await prisma.membership.create({
    data: {
      userId: session.user.id,
      roomId,
      role: room.adminId === session.user.id ? "admin" : "member",
    },
  });

  return NextResponse.json(membership);
}
