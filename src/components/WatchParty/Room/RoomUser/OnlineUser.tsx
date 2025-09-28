import { MembershipWithUser, RoomWithMembers } from "@custom-types/index";

const OnlineUsers: React.FC<{
  members: MembershipWithUser[];
  roomInfo: RoomWithMembers;
  currentUserId: string;
}> = ({ members, roomInfo, currentUserId }) => {
  async function kickUser(userId: string) {
    await fetch("/api/rooms/kick", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ roomId: roomInfo.id, userId }),
    });
  }
  return (
    <div className="p-4 space-y-4">
      <ul>
        {members.map((m) => (
          <li key={m.id}>
            {m.user.name} ({m.role})
            {roomInfo.adminId === currentUserId &&
              m.userId !== currentUserId && (
                <button
                  onClick={() => kickUser(m.userId)}
                  className="ml-4 bg-red-500 text-white px-2 py-1 rounded"
                >
                  Kick
                </button>
              )}
          </li>
        ))}
      </ul>
    </div>
  );
};
export default OnlineUsers;
