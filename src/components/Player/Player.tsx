/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { pusherClient } from "@/lib/pusherClient";
import { channel } from "diagnostics_channel";
import React, { use, useEffect, useRef, useState } from "react";
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
  const containerRef = useRef<HTMLDivElement>(null); // ✅ wrapper for fullscreen
  const [isReady, setIsReady] = useState(false);
  const hasInitialized = useRef(false);

  // const onReady: YouTubeProps["onReady"] = (event) => {
  //   console.log("Player ready, setting ref");
  //   playerRef.current = event.target;
  //   if (!isAdmin) event.target.mute();
  //   setIsReady(true);
  // };

  function getVideoId(url: string): string | null {
    if (!url) return null; // ✅ prevents empty string crash
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
  const onReady: YouTubeProps["onReady"] = async (event) => {
    console.log("🎥 Player ready, setting ref");
    playerRef.current = event.target;

    try {
      const iframe = await event.target.getIframe();
      console.log("✅ Iframe ready:", iframe);
      if (!isAdmin) event.target.mute();
      setIsReady(true);

      // ✅ Sync position immediately on ready
      if (position > 0) {
        console.log(`⏩ Seeking to ${position}s on ready`);
        event.target.seekTo(position, true);
      }

      // ✅ Handle autoplay for members/admins
      if (playing) {
        event.target.playVideo();
      } else {
        event.target.pauseVideo();
      }
    } catch (err) {
      console.warn("⚠️ Failed to get iframe:", err);
    }
  };
  // useEffect(() => {
  //   const handleVisibilityChange = async () => {
  //     if (!playerRef.current || !isReady) return;

  //     if (document.visibilityState === "visible") {
  //       console.log("🟢 Tab visible again — fetching latest video state");

  //       try {
  //         // Fetch latest position and play state from backend
  //         const res = await fetch(`/api/video/state?roomId=${roomId}`);
  //         const data = await res.json();

  //         if (res.ok && data) {
  //           const player = playerRef.current;
  //           player.seekTo(data.position, true);

  //           if (data.playing) {
  //             player.playVideo();
  //           } else {
  //             player.pauseVideo();
  //           }

  //           if (!isAdmin) player.mute();
  //         }
  //       } catch (err) {
  //         console.warn("Failed to refresh video state:", err);
  //       }
  //     } else {
  //       console.log("🔴 Tab hidden — pausing locally");
  //       playerRef.current.pauseVideo();
  //     }
  //   };

  //   document.addEventListener("visibilitychange", handleVisibilityChange);
  //   return () =>
  //     document.removeEventListener("visibilitychange", handleVisibilityChange);
  // }, [isReady, roomId, isAdmin]);

  useEffect(() => {
    if (!isReady || !playerRef.current) return;
    if (!hasInitialized.current) {
      hasInitialized.current = true;
      return; // skip the first automatic resync after onReady
    }
    const player = playerRef.current;

    console.log(player);
    const iframe = player.getIframe?.();

    if (!iframe) {
      console.warn("⏳ Iframe not ready during sync");
      return;
    }
    console.log("Syncing player. Playing:", playing, "Position:", position);

    try {
      const current = player.getCurrentTime?.() || 0;
      const diff = Math.abs(current - position);

      if (diff > 1) player.seekTo(position, true);

      const state = player.getPlayerState?.();
      if (playing && state !== YouTube.PlayerState.PLAYING) {
        player.playVideo();
      } else if (!playing && state === YouTube.PlayerState.PLAYING) {
        player.pauseVideo();
      }
    } catch (err) {
      console.warn("Sync skipped due to player issue:", err);
    }
  }, [isReady, playing, position]);

  useEffect(() => {
    console.log(playing, position);
  }, []);

  // useEffect(() => {
  //   console.log("Syncing player. Playing:", playing, "Position:", position);
  //   if (!playerRef.current) return;

  //   // ⚙️ Validate that the iframe still exists before calling any API methods
  //   const iframe = playerRef.current.getIframe?.();

  //   if (!iframe) return;

  //   const timer = setTimeout(() => {
  //     try {
  //       const current = playerRef.current.getCurrentTime?.();

  //       if (typeof current !== "number") return;

  //       const difference = Math.abs(current - position);

  //       if (difference > 1) {
  //         playerRef.current.seekTo(position, true);
  //       }

  //       const state = playerRef.current.getPlayerState?.();
  //       if (playing && state !== YouTube.PlayerState.PLAYING) {
  //         playerRef.current.playVideo();
  //       } else if (!playing && state === YouTube.PlayerState.PLAYING) {
  //         playerRef.current.pauseVideo();
  //       }
  //     } catch (e) {
  //       console.warn("Sync effect skipped due to invalid player:", e);
  //     }
  //   }, 150); // ⏱ small delay to let iframe stabilize

  //   return () => clearTimeout(timer);
  // }, [playing, position]);
  const updateState = async (newPlaying: boolean, pos?: number) => {
    console.log("isAdmin:", isAdmin);
    if (!isAdmin) return;
    console.log("Updating state. Playing:", newPlaying, "Position:", pos);
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
  // useEffect(() => {
  //   let channel = pusherClient.channel(`room-${roomId}`);
  //   if (isAdmin) {
  //     if (!channel) {
  //       channel = pusherClient.subscribe(`room-${roomId}`);
  //     }
  //     channel.bind("request-video-state", () => {
  //       console.log("Received request for video state", playerRef);
  //       updateState(playing, playerRef.current?.getCurrentTime());
  //     });
  //   }
  //   return () => {
  //     if (isAdmin) {
  //       channel.unbind("request-video-state");
  //     }
  //     try {
  //       if (playerRef.current) {
  //         playerRef.current.destroy();
  //       }
  //     } catch (e) {
  //       console.warn("Player cleanup failed", e);
  //     }
  //   };
  // }, [roomId, isAdmin]);

  // 🔄 Update DB & Pusher (admin only)

  const opts: YouTubeProps["opts"] = {
    width: "100%",
    height: "100%",
    playerVars: {
      autoplay: 0,
      mute: 0, // required for autoplay to work on most browsers
      controls: isAdmin ? 1 : 0, // hide controls for members
      disablekb: isAdmin ? 0 : 1, // block keyboard shortcuts for members
    },
  };

  // const onReady: YouTubeProps["onReady"] = (event) => {
  //   playerRef.current = event.target;
  // };

  const onStateChange: YouTubeProps["onStateChange"] = (event) => {
    if (!playerRef.current) return;

    const currentTime = playerRef.current.getCurrentTime();

    if (isAdmin) {
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
      switch (event.data) {
        case YouTube.PlayerState.PLAYING:
          console.log("Member playing");
          if (!playing) playerRef.current.pauseVideo();
          break;
        case YouTube.PlayerState.PAUSED:
          if (playing) playerRef.current.playVideo();
          break;
        case YouTube.PlayerState.BUFFERING:
          playerRef.current.seekTo(position, true);
          break;
      }
    }
  };

  // 🔳 Custom fullscreen toggle
  const handleFullscreen = () => {
    if (containerRef.current) {
      if (containerRef.current.requestFullscreen) {
        containerRef.current.requestFullscreen();
      }
    }
  };
  // if (!videoUrl || !getVideoId(videoUrl)) {
  //   return (
  //     <div className="flex items-center justify-center w-full h-full bg-black text-white">
  //       <p>No video loaded</p>
  //     </div>
  //   );
  // }

  return (
    <div ref={containerRef} className="relative w-full h-full bg-black">
      <YouTube
        videoId={videoId}
        opts={opts}
        onReady={onReady}
        onStateChange={onStateChange}
        className="w-full h-full"
      />

      {/* 🎬 Custom fullscreen button for members */}
      {!isAdmin && (
        <button
          onClick={handleFullscreen}
          className="absolute bottom-4 right-4 z-20 bg-black/60 text-white px-3 py-1 rounded hover:bg-black/80"
        >
          Fullscreen
        </button>
      )}
    </div>
  );
}
