"use client";

import { useEffect, useState } from "react";
import { pusherClient } from "@/lib/pusherClient";
import { MembershipWithUser, RoomWithMembers } from "@custom-types/index";
import CopyButton from "./Room/CopyBtn";
import OnlineUsers from "./Room/RoomUser/OnlineUser";
import ChatBox from "./Room/RoomUser/Chat";

export default function RoomClient({
  roomInfo,
  currentUserId,
}: {
  roomInfo: RoomWithMembers;
  currentUserId: string;
}) {
  const [members, setMembers] = useState<MembershipWithUser[]>(
    roomInfo.memberships
  );

  useEffect(() => {
    const channel = pusherClient.subscribe(`room-${roomInfo.id}`);

    channel.bind(
      "member-kicked",
      (data: { userId: string; message: string }) => {
        // Remove kicked user from members list for everyone
        setMembers((prev) => prev.filter((m) => m.userId !== data.userId));

        // Agar current user kick hua hai, tabhi redirect karo
        if (data.userId === currentUserId) {
          alert(data.message);
          setTimeout(() => {
            window.location.href = "/watchparty";
          }, 500);
        }
      }
    );

    // Admin deleted room
    channel.bind("room-deleted", (data: { message: string }) => {
      alert(data.message);
      window.location.href = "/watchparty";
    });

    // Member joined
    channel.bind(
      "member-joined",
      (data: { membership: MembershipWithUser }) => {
        setMembers((prev) => [...prev, data.membership]);
      }
    );

    // Member left
    channel.bind("member-left", (data: { userId: string }) => {
      setMembers((prev) => prev.filter((m) => m.userId !== data.userId));
    });

    return () => {
      pusherClient.unsubscribe(`room-${roomInfo.id}`);
    };
  }, [roomInfo.id, currentUserId]);

  // Leave room button action
  async function leaveRoom() {
    const res = await fetch("/api/rooms/leave", { method: "POST" });
    const data = await res.json();
    if (res.ok) {
      if (data.redirect) {
        window.location.href = data.redirect;
      } else {
        alert(data.message);
      }
    } else {
      alert(data.error || "Something went wrong");
    }
  }

  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <h1 className="text-2xl font-bold mb-4">
        Welcome to Room: {roomInfo.title}
      </h1>
      <CopyButton text={roomInfo.id} />

      <h2 className="text-xl mt-4 mb-2">Members:</h2>
      <OnlineUsers
        members={members}
        roomInfo={roomInfo}
        currentUserId={currentUserId}
      />
      <ChatBox roomId={roomInfo.id} userId={currentUserId} />

      <button
        onClick={leaveRoom}
        className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
      >
        Leave Room
      </button>
    </div>
  );
}
