// app/watchparty/[roomId]/page.tsx
import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";

export default async function RoomPage({
  params,
}: {
  params: { roomId: string };
}) {
  const room = await prisma.room.findUnique({
    where: { id: params.roomId },
  });

  if (!room) return notFound();

  return (
    <div className="flex items-center justify-center h-screen flex-col">
      <h1 className="text-2xl font-bold">Welcome to Room: {room.id}</h1>
      <p className="text-lg text-neutral-600">Room Name: {room.title}</p>
    </div>
  );
}
