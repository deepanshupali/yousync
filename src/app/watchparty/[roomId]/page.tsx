// app/watchparty/[roomId]/page.tsx
import { notFound } from "next/navigation";
import { getRoomWithMembers } from "./RoomData";
import RoomClient from "@/components/WatchParty/RoomClient";

export default async function RoomPage({
  params,
}: {
  params: Promise<{ roomId: string }>;
}) {
  const { roomId } = await params;
  const roomInfo = await getRoomWithMembers(roomId);

  if (!roomInfo) return notFound();

  return <RoomClient roomInfo={roomInfo} />;
}
