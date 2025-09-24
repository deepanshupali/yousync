import { notFound } from "next/navigation";
import { getRoom } from "./RoomData";
import RoomClient from "@/components/WatchParty/RoomClient";

export default async function RoomPage({
  params,
}: {
  params: { roomId: string };
}) {
  const room = await getRoom(params.roomId);

  if (!room) return notFound();

  return <RoomClient room={room} />;
}
