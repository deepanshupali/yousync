// app/watchparty/[roomId]/RoomData.ts
import { prisma } from "@/lib/prisma";
import { RoomWithMembers } from "@custom-types/index";

export async function getRoomWithMembers(
  roomId: string
): Promise<RoomWithMembers | null> {
  return await prisma.room.findUnique({
    where: { id: roomId },
    include: {
      memberships: {
        include: { user: true }, // 👈 nested user info
      },
    },
  });
}
