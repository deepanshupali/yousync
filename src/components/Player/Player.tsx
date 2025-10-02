/* eslint-disable @typescript-eslint/no-explicit-any */
import { useRef } from "react";
import YouTube, { YouTubeProps } from "react-youtube";

export default function Player({ videoUrl }: { videoUrl: string }) {
  const playerRef = useRef<any>(null);
  const opts = {
    height: "500",
    width: "1000",
  };
  const onPlayerReady: YouTubeProps["onReady"] = (event) => {
    playerRef.current = event.target;
  };
  return (
    <div>
      <YouTube
        opts={opts}
        videoId={videoUrl.split("v=")[1]}
        onReady={onPlayerReady}
        onPlay={() => {
          handlePlay();
        }}
        onPause={() => {
          handlePause();
        }}
        style={{
          zIndex: localStorage.getItem("admin") === "true" ? 2 : 0,
        }}
      />
    </div>
  );
}
