// "use client";
/* eslint-disable @typescript-eslint/no-explicit-any */
// import { useEffect, useRef } from "react";
// import YouTube, { YouTubeProps } from "react-youtube";

// export default function Player({
//   videoUrl,
//   roomId,
//   isAdmin,
//   playing,
//   position,
// }: {
//   videoUrl: string;
//   roomId: string;
//   isAdmin: boolean;
//   playing: boolean;
//   position: number;
// }) {
//   const playerRef = useRef<any>(null);
//   const opts = {
//     height: "500",
//     width: "1000",
//   };
//   const onPlayerReady: YouTubeProps["onReady"] = (event) => {
//     playerRef.current = event.target;
//   };
//   const extractVideoId = (url: string): string | undefined => {
//     const regex =
//       /(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/(?:[^\/\n\s]+\/\S+\/|(?:v|e(?:mbed)?)\/|\S*?[?&]v=)|youtu\.be\/)([a-zA-Z0-9_-]{11})/;
//     const match = url.match(regex);
//     return match ? match[1] : undefined;
//   };
//   // When Pusher sends updated position → seek
//   useEffect(() => {
//     if (playerRef.current && typeof position === "number") {
//       playerRef.current.seekTo(position, "seconds");
//     }
//   }, [position]);

//   const updateState = async (playing: boolean, pos?: number) => {
//     if (!isAdmin) return; // only admin updates state
//     await fetch("/api/video/state", {
//       method: "PATCH",
//       headers: { "Content-Type": "application/json" },
//       body: JSON.stringify({
//         roomId,
//         playing,
//         position: pos ?? playerRef.current?.getCurrentTime(),
//       }),
//     });
//   };

//   return (
//     <div>
//       <YouTube
//         opts={opts}
//         videoId={extractVideoId(videoUrl)}
//         onReady={onPlayerReady}
//         onPlay={() => updateState(true)}
//         onPause={() => updateState(false)}
//         onSeek={(pos) => updateState(playing, pos)}
//         style={{
//           zIndex: localStorage.getItem("admin") === "true" ? 2 : 0,
//         }}
//       />
//       <button onClick={() => playerRef.current?.playVideo()}>play</button>
//       <button onClick={() => playerRef.current?.pauseVideo()}>pause</button>
//     </div>
//   );
// }

"use client";

"use client";

import React, { useEffect, useRef } from "react";
import YouTube, { YouTubeProps } from "react-youtube";

export default function Player({
  videoUrl,
  roomId,
  isAdmin,
  playing,
  position,
}: {
  videoUrl: string;
  roomId: string;
  isAdmin: boolean;
  playing: boolean;
  position: number;
}) {
  const playerRef = useRef<any>(null);

  function getVideoId(url: string): string | null {
    try {
      const u = new URL(url);
      if (u.hostname.includes("youtu.be")) return u.pathname.slice(1);
      if (u.hostname.includes("youtube.com")) return u.searchParams.get("v");
      return null;
    } catch {
      return null;
    }
  }

  const videoId = getVideoId(videoUrl) || "";

  // 🔄 Sync seek with tolerance
  useEffect(() => {
    if (playerRef.current && position != null) {
      const current = playerRef.current.getCurrentTime();
      if (Math.abs(current - position) > 0.5) {
        playerRef.current.seekTo(position, true);
      }
    }
  }, [position]);

  // 🔄 Sync play/pause externally
  useEffect(() => {
    if (!playerRef.current) return;
    const state = playerRef.current.getPlayerState();
    if (playing && state !== YouTube.PlayerState.PLAYING) {
      playerRef.current.playVideo();
    }
    if (!playing && state === YouTube.PlayerState.PLAYING) {
      playerRef.current.pauseVideo();
    }
  }, [playing]);

  // 🔄 Update DB & Pusher (admin only)
  const updateState = async (newPlaying: boolean, pos?: number) => {
    if (!isAdmin) return;
    await fetch("/api/video/state", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        roomId,
        playing: newPlaying,
        position: pos ?? playerRef.current?.getCurrentTime(),
      }),
    });
  };

  const opts: YouTubeProps["opts"] = {
    width: "100%",
    height: "100%",
    playerVars: {
      autoplay: 0,
      controls: isAdmin ? 1 : 0, // hide controls for members
      disablekb: isAdmin ? 0 : 1, // block keyboard shortcuts for members
    },
  };

  const onReady: YouTubeProps["onReady"] = (event) => {
    playerRef.current = event.target;
  };

  const onStateChange: YouTubeProps["onStateChange"] = (event) => {
    if (!playerRef.current) return;

    const currentTime = playerRef.current.getCurrentTime();

    if (isAdmin) {
      // ✅ Admin controls video + updates DB
      switch (event.data) {
        case YouTube.PlayerState.PLAYING:
          updateState(true, currentTime);
          break;
        case YouTube.PlayerState.PAUSED:
          updateState(false, currentTime);
          break;
        case YouTube.PlayerState.BUFFERING:
          if (Math.abs(currentTime - position) > 1) {
            updateState(true, currentTime);
          }
          break;
        case YouTube.PlayerState.ENDED:
          updateState(false, currentTime);
          break;
      }
    } else {
      // ❌ Member tried to change video → force them back
      switch (event.data) {
        case YouTube.PlayerState.PLAYING:
          if (!playing) playerRef.current.pauseVideo(); // force pause
          break;
        case YouTube.PlayerState.PAUSED:
          if (playing) playerRef.current.playVideo(); // force play
          break;
        case YouTube.PlayerState.BUFFERING:
          playerRef.current.seekTo(position, true); // force back to synced time
          break;
      }
    }
  };

  return (
    <div className="w-full h-full">
      <YouTube
        videoId={videoId}
        opts={opts}
        onReady={onReady}
        onStateChange={onStateChange}
        className="w-full h-full"
      />
    </div>
  );
}
