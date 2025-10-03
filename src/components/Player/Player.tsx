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
  const extractVideoId = (url: string): string | undefined => {
    const regex =
      /(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/(?:[^\/\n\s]+\/\S+\/|(?:v|e(?:mbed)?)\/|\S*?[?&]v=)|youtu\.be\/)([a-zA-Z0-9_-]{11})/;
    const match = url.match(regex);
    return match ? match[1] : undefined;
  };

  return (
    <div>
      <YouTube
        opts={opts}
        videoId={extractVideoId(videoUrl)}
        onReady={onPlayerReady}
        // onPlay={() => {
        //   handlePlay();
        // }}
        // onPause={() => {
        //   handlePause();
        // }}
        style={{
          zIndex: localStorage.getItem("admin") === "true" ? 2 : 0,
        }}
      />
      <button onClick={() => playerRef.current?.playVideo()}>play</button>
      <button onClick={() => playerRef.current?.pauseVideo()}>pause</button>
    </div>
  );
}
