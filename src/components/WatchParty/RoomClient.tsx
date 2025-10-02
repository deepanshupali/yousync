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
import ReactPlayer from "react-player";
import { BsYoutube } from "react-icons/bs";
import { Input } from "../ui/input";
import Player from "../Player/Player";

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
  const [youtubeLink, setYoutubeLink] = useState("");
  const [videoUrl, setVideoUrl] = useState("");

  const handleLoad = () => {
    setVideoUrl(youtubeLink); // update player URL only when button is clicked
  };
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
  function navtowatchparty() {
    window.location.href = "/watchparty";
  }

  return (
    <div className="flex  md:flex-row h-screen  border-amber-300 border-4">
      {/* // Left side: Video player and room info */}
      <div className="flex flex-col flex-[0.8]">
        <div className="flex items-center justify-between p-4 border-b border-amber-300">
          <div className="flex items-center space-x-4">
            <Button
              onClick={navtowatchparty}
              variant="secondary"
              size="icon"
              className="size-8 cursor-pointer"
            >
              <IoIosArrowBack />
            </Button>

            <h1 className="text-2xl font-bold">Room: {roomInfo.title}</h1>
            <Button variant="secondary" className="cursor-pointer">
              <FaUserFriends />
              <span className="ml-1">{members.length}</span>
            </Button>
          </div>
          {/* YouTube Link Input */}
          <div className="relative flex items-center w-1/3">
            <BsYoutube
              className="absolute left-3 top-1/2 transform -translate-y-1/2 text-red-600"
              size={20}
            />
            <Input
              value={youtubeLink}
              onChange={(e) => setYoutubeLink(e.target.value)}
              type="text"
              placeholder="Enter Youtube link"
              className="pl-10" // add padding so text doesn't overlap icon
            />
            <Button onClick={handleLoad} className="ml-2">
              Load
            </Button>
          </div>

          <div className="flex items-center space-x-2">
            <CopyButton text={roomInfo.id} />

            <Button
              onClick={leaveRoom}
              variant="destructive"
              className="cursor-pointer"
            >
              <ImExit /> Leave
            </Button>
          </div>
        </div>
        <div
          className="flex-1 bg-black flex items-center justify-center
        p-20"
        >
          {videoUrl ? (
            <Player videoUrl={videoUrl} />
          ) : (
            // <div
            //   style={{ position: "relative", width: "100%", height: "100%" }}
            // >
            //   <Player videoUrl={videoUrl} />
            //   <div
            //     style={{
            //       position: "absolute",
            //       top: 0,
            //       left: 0,
            //       width: "100%",
            //       height: "100%",
            //       background: "transparent",
            //       zIndex: 2,
            //     }}
            //     tabIndex={-1} // prevent focus
            //   />
            // </div>
            // <div
            //   style={{ position: "relative", width: "100%", height: "100%" }}
            // >
            //   <ReactPlayer
            //     src={videoUrl}
            //     controls={false}
            //     width="100%"
            //     height="100%"
            //     config={{
            //       youtube: {
            //         disablekb: 1,
            //         enablejsapi: 1,
            //         modestbranding: 1,
            //         rel: 0,
            //       },
            //     }}
            //   />
            //   <div
            //     style={{
            //       position: "absolute",
            //       top: 0,
            //       left: 0,
            //       width: "100%",
            //       height: "100%",
            //       background: "transparent",
            //       zIndex: 2,
            //     }}
            //     tabIndex={-1} // prevent focus
            //   />
            // </div>
            <div className="text-white text-center">
              <h2 className="text-3xl mb-4">No video loaded</h2>
              <p className="text-lg">
                Please enter a YouTube link to start watching.
              </p>
            </div>
          )}
          {/* Overlay to block clicks */}
          {/* <div className="absolute inset-0 bg-transparent cursor-not-allowed"></div> */}
        </div>
      </div>
      {/* right side */}
      {/* Right side: Chat and online users */}
      <div className="border-l border-amber-300 flex flex-col flex-[0.2] ">
        <div className="flex pt-3 pb-3 px-4 justify-around">
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
        <Separator className="my-4 border-1 mt-0" />
        <div className="flex-1 flex flex-col px-4 pb-4">
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
