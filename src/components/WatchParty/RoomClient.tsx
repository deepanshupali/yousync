"use client";

import { useEffect, useState } from "react";
import { pusherClient } from "@/lib/pusherClient";
import { MembershipWithUser, RoomWithMembers } from "@custom-types/index";

export default function RoomClient({
  roomInfo,
}: {
  roomInfo: RoomWithMembers;
}) {
  const [members, setMembers] = useState<MembershipWithUser[]>(
    roomInfo.memberships
  );

  useEffect(() => {
    const channel = pusherClient.subscribe(`room-${roomInfo.id}`);

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
  }, [roomInfo.id]);

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

      <h2 className="text-xl mt-4 mb-2">Members:</h2>
      <ul className="list-disc list-inside mb-6">
        {members.map((m) => (
          <li key={m.id}>
            {m.user.name ?? "Anonymous"} ({m.role})
          </li>
        ))}
      </ul>

      <button
        onClick={leaveRoom}
        className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
      >
        Leave Room
      </button>
    </div>
  );
}
