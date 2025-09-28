"use client";

import { useEffect, useState } from "react";

type Room = {
  id: string;
  title: string;
};

export default function ActiveRoom() {
  const [activeRoom, setActiveRoom] = useState<Room | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchRoom() {
      try {
        const res = await fetch("/api/rooms/activerooms");
        const data = await res.json();
        if (data.membership) {
          setActiveRoom(data.membership.room);
        }
      } catch (err) {
        console.error("Error fetching active room:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchRoom();
  }, []);

  async function leaveRoom() {
    try {
      const res = await fetch("/api/rooms/leave", { method: "POST" });
      const data = await res.json();
      alert(data.message);
      setActiveRoom(null);
    } catch (err) {
      console.error("Error leaving room:", err);
    }
  }

  if (loading) return <p className="p-6">Loading...</p>;

  return (
    <div className="p-6">
      {activeRoom ? (
        <div className="p-4 border rounded-md bg-neutral-100 dark:bg-neutral-800">
          <h2 className="text-lg font-bold text-neutral-900 dark:text-neutral-100">
            Active Room: {activeRoom.title}
          </h2>
          <p className="text-sm text-neutral-600 dark:text-neutral-400">
            Room ID: {activeRoom.id}
          </p>
          <button
            onClick={leaveRoom}
            className="bg-red-600 text-white px-4 py-2 rounded mt-2 hover:bg-red-700"
          >
            Leave Room
          </button>
        </div>
      ) : (
        <p className="text-neutral-700 dark:text-neutral-300">
          No active room. Create or join one.
        </p>
      )}
    </div>
  );
}
