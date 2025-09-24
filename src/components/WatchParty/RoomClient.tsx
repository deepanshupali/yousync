"use client";

export default function RoomClient({
  room,
}: {
  room: { id: string; title: string };
}) {
  async function leaveRoom() {
    const res = await fetch("/api/rooms/leave", { method: "POST" });
    const data = await res.json();
    alert(data.message);
    window.location.href = "/watchparty"; // 👈 redirect
  }

  return (
    <div className="flex items-center justify-center h-screen flex-col">
      <h1 className="text-2xl font-bold">Welcome to Room: {room.id}</h1>
      <p className="text-lg text-neutral-600">Room Name: {room.title}</p>
      <button
        onClick={leaveRoom}
        className="mt-6 px-4 py-2 bg-red-600 text-white rounded"
      >
        Leave Room
      </button>
    </div>
  );
}
