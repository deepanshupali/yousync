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
import { BsYoutube } from "react-icons/bs";
import { Input } from "../ui/input";
import Player from "../Player/Player";
import { ClipLoader } from "react-spinners";

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
  const [isAdmin] = useState(roomInfo.adminId === currentUserId);
  const [showChat, setShowChat] = useState(true);
  const [youtubeLink, setYoutubeLink] = useState("");
  const [videoUrl, setVideoUrl] = useState("");
  const [isLoadingVideo, setIsLoadingVideo] = useState(false);
  const [isLeaving, setIsLeaving] = useState(false);

  const [videoState, setVideoState] = useState({
    playing: false,
    position: 0,
  });

  const handleLoad = async () => {
    if (!youtubeLink.trim() || isLoadingVideo) return;
    setIsLoadingVideo(true);
    try {
      const res = await fetch("/api/video/load", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ roomId: roomInfo.id, videoUrl: youtubeLink }),
      });
      const data = await res.json();
      if (!res.ok) alert(data.error || "Something went wrong");
    } catch (err) {
      console.error(err);
      alert("Failed to load video");
    } finally {
      setIsLoadingVideo(false);
    }
  };

  useEffect(() => {
    const channel = pusherClient.subscribe(`room-${roomInfo.id}`);

    channel.bind("member-joined", (data: { membership: MembershipWithUser }) =>
      setMembers((prev) => [...prev, data.membership])
    );
    channel.bind("member-left", (data: { userId: string }) =>
      setMembers((prev) => prev.filter((m) => m.userId !== data.userId))
    );
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
    channel.bind("room-deleted", (data: { message: string }) => {
      alert(data.message);
      window.location.href = "/watchparty";
    });
    channel.bind("video-loaded", (data: { videoUrl: string }) =>
      setVideoUrl(data.videoUrl)
    );
    // channel.bind(
    //   "video-state-updated",
    //   (data: { playing: boolean; position: number }) =>
    //     setVideoState({ playing: data.playing, position: data.position })
    // );
    channel.bind(
      "video-state-updated",
      (data: { playing: boolean; position: number }) => {
        // 👉 Admin already knows the state (they caused it),
        // so ignore Pusher updates on admin side to avoid loops.
        if (isAdmin) return;

        setVideoState({ playing: data.playing, position: data.position });
      }
    );

    return () => pusherClient.unsubscribe(`room-${roomInfo.id}`);
  }, [roomInfo.id, currentUserId]);

  useEffect(() => {
    async function fetchVideoState() {
      try {
        const res = await fetch(`/api/video/state?roomId=${roomInfo.id}`);
        const data = await res.json();
        if (res.ok && data.videoUrl) {
          setVideoUrl(data.videoUrl);
          setVideoState({ playing: data.playing, position: data.position });
        }
      } catch (err) {
        console.error("Failed to fetch video state:", err);
      }
    }
    fetchVideoState();
  }, [roomInfo.id]);

  async function kickUser(userId: string) {
    await fetch("/api/rooms/kick", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ roomId: roomInfo.id, userId }),
    });
  }

  async function leaveRoom() {
    if (isLeaving) return;
    setIsLeaving(true);
    try {
      const res = await fetch("/api/rooms/leave", { method: "POST" });
      const data = await res.json();
      if (res.ok) {
        window.location.href = data.redirect || "/watchparty";
      } else {
        alert(data.error || "Something went wrong");
      }
    } catch (err) {
      console.error(err);
      alert("Failed to leave room");
    } finally {
      setIsLeaving(false);
    }
  }

  function navToWatchParty() {
    window.location.href = "/watchparty";
  }

  return (
    <div className="flex flex-col md:flex-row h-screen bg-neutral-50 dark:bg-neutral-950 text-neutral-900 dark:text-neutral-100 transition-colors">
      {/* Left: Video and header */}
      <div className="flex flex-col flex-[0.8] border-b md:border-b-0 md:border-r border-neutral-200 dark:border-neutral-800">
        {/* Header */}
        <div className="flex flex-wrap items-center justify-between p-4 border-b border-neutral-200 dark:border-neutral-800 bg-white/60 dark:bg-neutral-900/60 backdrop-blur-sm">
          <div className="flex items-center gap-3">
            <Button
              onClick={navToWatchParty}
              variant="ghost"
              size="icon"
              className="rounded-lg"
            >
              <IoIosArrowBack className="text-xl" />
            </Button>
            <h1 className="text-xl font-bold">Room: {roomInfo.title}</h1>
            <Button
              variant="outline"
              className="flex items-center gap-1 text-sm"
            >
              <FaUserFriends />
              <span>{members.length}</span>
            </Button>
          </div>

          {isAdmin && (
            <div className="flex items-center gap-2 w-full sm:w-1/2 lg:w-1/3 mt-3 sm:mt-0">
              <div className="relative flex-grow">
                <BsYoutube className="absolute left-3 top-1/2 -translate-y-1/2 text-red-600" />
                <Input
                  value={youtubeLink}
                  onChange={(e) => setYoutubeLink(e.target.value)}
                  placeholder="YouTube link"
                  className="   pl-10 pr-3"
                />
              </div>
              <Button
                onClick={handleLoad}
                disabled={isLoadingVideo}
                className="flex items-center gap-2 whitespace-nowrap"
              >
                {isLoadingVideo ? (
                  <>
                    <ClipLoader size={18} color="#fff" />
                    Loading
                  </>
                ) : (
                  "Load"
                )}
              </Button>
            </div>
          )}

          <div className="flex items-center gap-2 mt-3 sm:mt-0">
            <CopyButton text={roomInfo.id} />
            <Button
              onClick={leaveRoom}
              variant="destructive"
              disabled={isLeaving}
              className="flex items-center gap-2"
            >
              {isLeaving ? (
                <>
                  <ClipLoader size={18} color="#fff" />
                  Leaving...
                </>
              ) : (
                <>
                  <ImExit />
                  Leave
                </>
              )}
            </Button>
          </div>
        </div>

        {/* Player */}
        <div className="flex-1 bg-black flex items-center justify-center p-6 md:p-10">
          {videoUrl ? (
            <Player
              videoUrl={videoUrl}
              roomId={roomInfo.id}
              isAdmin={isAdmin}
              playing={videoState.playing}
              position={videoState.position}
            />
          ) : (
            <div className="text-white text-center space-y-3">
              <h2 className="text-2xl font-semibold">No video loaded</h2>
              <p className="text-base opacity-80">
                Enter a YouTube link to start your watch party.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Right: Chat / Users */}
      <div className="flex flex-col flex-[0.2] bg-white/70 dark:bg-neutral-900/70 backdrop-blur-sm border-t md:border-t-0 md:border-l border-neutral-200 dark:border-neutral-800">
        <div className="flex">
          <Button
            onClick={() => setShowChat(true)}
            variant={showChat ? "secondary" : "ghost"}
            className="flex-1 rounded-none"
          >
            Messages
          </Button>
          <Button
            onClick={() => setShowChat(false)}
            variant={!showChat ? "secondary" : "ghost"}
            className="flex-1 rounded-none"
          >
            Participants
          </Button>
        </div>
        <Separator className="my-0" />
        <div className="flex-1 flex flex-col px-3 py-3 overflow-y-auto">
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
        </div>
      </div>
    </div>
  );
}
