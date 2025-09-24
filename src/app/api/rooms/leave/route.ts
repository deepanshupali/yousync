import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { authOptions } from "../../auth/[...nextauth]/route";

export async function POST() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  const userId = session.user.id;

  // check membership
  const membership = await prisma.membership.findUnique({ where: { userId } });
  if (!membership) {
    return NextResponse.json({ error: "Not in any room" }, { status: 400 });
  }

  // check if user is admin
  const room = await prisma.room.findUnique({
    where: { id: membership.roomId },
  });

  if (room?.adminId === userId) {
    // Admin leaving → delete room (cascade will clean memberships/messages)
    await prisma.room.delete({ where: { id: room.id } });
    return NextResponse.json({ message: "Room deleted (admin left)" });
  }

  // Member leaving → just delete membership
  await prisma.membership.delete({ where: { userId } });
  return NextResponse.json({ message: "Left the room" });
}
