// components/WatchParty/RoomClient.tsx
"use client";

import { RoomWithMembers } from "@custom-types/index";

export default function RoomClient({
  roomInfo,
}: {
  roomInfo: RoomWithMembers;
}) {
  async function leaveRoom() {
    const res = await fetch("/api/rooms/leave", { method: "POST" });
    const data = await res.json();
    alert(data.message);
    window.location.href = "/watchparty"; // redirect to dashboard or home
  }

  return (
    <div className="flex items-center justify-center h-screen flex-col">
      <h1 className="text-2xl font-bold">Welcome to Room: {roomInfo.title}</h1>
      <p className="text-lg text-neutral-600">Room ID: {roomInfo.id}</p>

      <h2 className="mt-4 text-xl font-semibold">Members:</h2>
      <ul className="list-disc list-inside">
        {roomInfo.memberships.map((member) => (
          <li key={member.id}>
            {member.user.name ?? "Anonymous"} ({member.role})
          </li>
        ))}
      </ul>

      <button
        onClick={leaveRoom}
        className="mt-6 px-4 py-2 bg-red-600 text-white rounded"
      >
        Leave Room
      </button>
    </div>
  );
}
