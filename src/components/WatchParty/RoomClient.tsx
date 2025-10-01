"use client";

import { useEffect, useState } from "react";
import { pusherClient } from "@/lib/pusherClient";
import { MembershipWithUser, RoomWithMembers } from "@custom-types/index";
import { Button } from "../ui/button";
import { IoIosArrowBack } from "react-icons/io";
import { FaUserFriends } from "react-icons/fa";
import CopyButton from "./Room/CopyBtn";
import { ImExit } from "react-icons/im";
import { Separator } from "@/components/ui/separator";
import OnlineUsers from "./Room/RoomUser/OnlineUser";
import ChatBox from "./Room/RoomUser/Chat";
// import ChatBox from "@/components/WatchParty/ChatBox";

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
  const [showChat, setShowChat] = useState(true);

  useEffect(() => {
    const channel = pusherClient.subscribe(`room-${roomInfo.id}`);

    // 👤 Member joined
    channel.bind(
      "member-joined",
      (data: { membership: MembershipWithUser }) => {
        setMembers((prev) => [...prev, data.membership]);
      }
    );

    // 👋 Member left
    channel.bind("member-left", (data: { userId: string }) => {
      setMembers((prev) => prev.filter((m) => m.userId !== data.userId));
    });

    // ❌ Member kicked
    channel.bind(
      "member-kicked",
      (data: { userId: string; message: string }) => {
        if (data.userId === currentUserId) {
          alert(data.message);
          window.location.href = "/watchparty";
        } else {
          setMembers((prev) => prev.filter((m) => m.userId !== data.userId));
        }
      }
    );

    // 🗑️ Room deleted
    channel.bind("room-deleted", (data: { message: string }) => {
      alert(data.message);
      window.location.href = "/watchparty";
    });

    return () => {
      pusherClient.unsubscribe(`room-${roomInfo.id}`);
    };
  }, [roomInfo.id, currentUserId]);

  // 👢 Kick member (admin only)
  async function kickUser(userId: string) {
    await fetch("/api/rooms/kick", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ roomId: roomInfo.id, userId }),
    });
  }

  // 🚪 Leave room
  async function leaveRoom() {
    const res = await fetch("/api/rooms/leave", { method: "POST" });
    const data = await res.json();
    if (res.ok) {
      if (data.redirect) {
        window.location.href = data.redirect;
      } else {
        alert(data.message);
        window.location.href = "/watchparty";
      }
    } else {
      alert(data.error || "Something went wrong");
    }
  }

  return (
    <div className="flex  md:flex-row h-screen border-amber-300 border-4">
      {/* // Left side: Video player and room info */}
      <div className="flex flex-col flex-[0.8]">
        <div className="flex items-center justify-between p-4 border-b border-amber-300">
          <div className="flex items-center space-x-4">
            <Button variant="secondary" size="icon" className="size-8">
              <IoIosArrowBack />
            </Button>

            <h1 className="text-2xl font-bold">Room: {roomInfo.title}</h1>
            <Button variant="secondary" className="">
              <FaUserFriends />
              <span className="ml-1">{members.length}</span>
            </Button>
          </div>

          <div className="flex items-center space-x-2">
            <CopyButton text={roomInfo.id} />
            <button
              onClick={() => setShowChat((prev) => !prev)}
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
            >
              {showChat ? "Hide Chat" : "Show Chat"}
            </button>
            <Button onClick={leaveRoom} variant="destructive">
              <ImExit /> Leave
            </Button>
          </div>
        </div>
        <div className="flex-1 bg-black flex items-center justify-center">
          <pre>{JSON.stringify(members, null, 2)}</pre>
          {/* <ReactPlayer
             src="https//:www.youtube.com/watch?v=U7TfazPhdKE"
             controls
             width="100%"
             height="100%"
           /> */}
        </div>
      </div>
      {/* right side */}
      {/* Right side: Chat and online users */}
      <div className="border-l border-amber-300 flex flex-col flex-[0.2] p-7 ">
        <div className="flex ">
          <Button
            onClick={() => setShowChat(() => true)}
            variant="ghost"
            className="rounded-none flex-1"
          >
            Messages
          </Button>

          <Button
            onClick={() => setShowChat(() => false)}
            variant="ghost"
            className="rounded-none flex-1"
          >
            Participants
          </Button>
        </div>
        <Separator className="my-4 border-1" />
        <div className="flex flex-col flex-[0.2]">
          {showChat ? (
            <ChatBox roomId={roomInfo.id} userId={currentUserId} />
          ) : (
            <OnlineUsers
              members={members}
              currentUserId={currentUserId}
              roomInfo={roomInfo}
              kickUser={kickUser}
            />
          )}
          {/* <OnlineUsers
            members={members}
            currentUserId={currentUserId}
            roomInfo={roomInfo}
            kickUser={kickUser}
          /> */}
        </div>
      </div>
    </div>
  );
}
