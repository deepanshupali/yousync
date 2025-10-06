"use client";

import { useEffect, useState } from "react";
import { ClipLoader } from "react-spinners";

type Room = {
  id: string;
  title: string;
};

export default function ActiveRoom() {
  const [activeRoom, setActiveRoom] = useState<Room | null>(null);
  const [loading, setLoading] = useState(true);
  const [leaving, setLeaving] = useState(false);

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
    if (leaving) return;
    setLeaving(true);
    try {
      const res = await fetch("/api/rooms/leave", { method: "POST" });
      const data = await res.json();
      alert(data.message);
      setActiveRoom(null);
    } catch (err) {
      console.error("Error leaving room:", err);
      alert("Failed to leave room.");
    } finally {
      setLeaving(false);
    }
  }

  // Show a nice spinner during loading
  if (loading)
    return (
      <div className="flex justify-center items-center py-10">
        <ClipLoader color="#3B82F6" size={50} />
      </div>
    );

  return (
    <div className="p-6 border border-neutral-200 dark:border-neutral-800 rounded-lg bg-white dark:bg-neutral-900 shadow-lg mt-6">
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
            disabled={leaving}
            className="flex items-center justify-center gap-2 bg-red-600 text-white px-4 py-2 rounded mt-3 hover:bg-red-700 disabled:opacity-70 disabled:cursor-not-allowed transition-colors"
          >
            {leaving ? (
              <>
                <ClipLoader color="#ffffff" size={20} />
                <span>Leaving...</span>
              </>
            ) : (
              "Leave Room"
            )}
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
