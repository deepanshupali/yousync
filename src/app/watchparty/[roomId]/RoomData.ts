// app/watchparty/[roomId]/RoomData.ts
import { prisma } from "@/lib/prisma";

export async function getRoom(roomId: string) {
  return await prisma.room.findUnique({
    where: { id: roomId },
  });
}
