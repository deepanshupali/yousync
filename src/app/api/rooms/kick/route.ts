import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { authOptions } from "../../auth/[...nextauth]/route";
import { pusher } from "@/lib/pusher";

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  const { roomId, userId } = await req.json();

  // Check if room exists
  const room = await prisma.room.findUnique({ where: { id: roomId } });
  if (!room)
    return NextResponse.json({ error: "Room not found" }, { status: 404 });

  // Only admin can kick
  if (room.adminId !== session.user.id) {
    return NextResponse.json({ error: "Not authorized" }, { status: 403 });
  }

  // Cannot kick self (admin)
  if (userId === session.user.id) {
    return NextResponse.json(
      { error: "You can't kick yourself" },
      { status: 400 }
    );
  }

  // Remove user membership
  await prisma.membership.delete({
    where: { userId },
  });

  // Realtime notify kicked user
  const d = await pusher.trigger(`room-${roomId}`, "member-kicked", {
    userId,
    message: "You were removed by the admin",
  });
  console.log("Member kicked event triggered", session.user.id);

  return NextResponse.json({ message: "User removed from room" });
}
