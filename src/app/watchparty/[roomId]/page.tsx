// app/watchparty/[roomId]/page.tsx
import { notFound } from "next/navigation";
import { getRoomWithMembers } from "./RoomData";
import RoomClient from "@/components/WatchParty/RoomClient";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export default async function RoomPage({
  params,
}: {
  params: Promise<{ roomId: string }>;
}) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) return notFound();

  const { roomId } = await params;
  const roomInfo = await getRoomWithMembers(roomId);

  if (!roomInfo) return notFound();

  return <RoomClient roomInfo={roomInfo} currentUserId={session.user.id} />;
}
