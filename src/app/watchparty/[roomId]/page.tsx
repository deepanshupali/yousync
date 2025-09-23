// app/watchparty/[roomId]/page.tsx
export default function RoomPage({ params }: { params: { roomId: string } }) {
  return (
    <div className="flex items-center justify-center h-screen">
      <h1 className="text-2xl font-bold">Welcome to Room: {params.roomId}</h1>
    </div>
  );
}
