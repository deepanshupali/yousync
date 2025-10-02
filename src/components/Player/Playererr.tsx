// import ReactPlayer from "react-player";
// import {
//   MediaController,
//   MediaControlBar,
//   MediaTimeRange,
//   MediaTimeDisplay,
//   MediaVolumeRange,
//   MediaPlaybackRateButton,
//   MediaPlayButton,
//   MediaSeekBackwardButton,
//   MediaSeekForwardButton,
//   MediaMuteButton,
//   MediaFullscreenButton,
// } from "media-chrome/react";
// import { useRef } from "react";
// import { on } from "events";

// type ReactPlayerRef = {
//   seekTo: (amount: number, type?: "seconds" | "fraction") => void;
//   getCurrentTime: () => number;
//   getDuration: () => number;
//   // eslint-disable-next-line @typescript-eslint/no-explicit-any
//   getInternalPlayer: () => any;
// };

// export default function Player({ videoUrl }: { videoUrl: string }) {
//   const playerRef = useRef<ReactPlayerRef | null>(null);
//   const isAdmin = true;
//   // eslint-disable-next-line @typescript-eslint/no-explicit-any
//   const onPlayerReady = (event: any) => {
//     playerRef.current = event.target;
//     console.log("Player is ready:", event);
//   };

//   const handlePlay = () => {
//     const internalPlayer = playerRef.current?.getInternalPlayer();
//     console.log("internalPlayer:", internalPlayer);

//     if (internalPlayer?.playVideo) {
//       internalPlayer.playVideo(); // YouTube
//     } else if (internalPlayer?.play) {
//       internalPlayer.play(); // HTML5
//     }
//   };

//   const handlePause = () => {
//     const internalPlayer = playerRef.current?.getInternalPlayer();
//     if (internalPlayer?.pauseVideo) {
//       internalPlayer.pauseVideo(); // YouTube
//     } else if (internalPlayer?.pause) {
//       internalPlayer.pause(); // HTML5
//     }
//   };
//   return (
//     <div>
//       <MediaController
//         style={{
//           width: "100%",
//           aspectRatio: "16/9",
//         }}
//       >
//         {isAdmin ? (
//           <ReactPlayer
//             slot="media"
//             src={videoUrl}
//             controls={false}
//             style={{
//               width: "100%",
//               height: "100%",
//             }}
//             onReady={onPlayerReady}
//           ></ReactPlayer>
//         ) : (
//           <div
//             style={{
//               // pointerEvents: isAdmin ? "auto" : "none",
//               width: "100%",
//               height: "100%",
//             }}
//           >
//             <ReactPlayer
//               // eslint-disable-next-line @typescript-eslint/no-explicit-any
//               ref={playerRef as any}
//               slot="media"
//               src={videoUrl}
//               controls={false}
//               style={{
//                 width: "100%",
//                 height: "100%",
//               }}
//             ></ReactPlayer>
//           </div>
//         )}

//         <MediaControlBar>
//           {isAdmin && (
//             <>
//               <MediaPlayButton />
//               <MediaSeekBackwardButton seekOffset={10} />
//               <MediaSeekForwardButton />
//               <MediaTimeRange />
//               <MediaTimeDisplay showDuration />
//               <MediaMuteButton />
//               <MediaVolumeRange />
//               <MediaPlaybackRateButton />
//             </>
//           )}
//           {/* 👇 Fullscreen button for everyone */}

//           <MediaFullscreenButton />
//         </MediaControlBar>
//       </MediaController>
//       <div style={{ marginTop: "1rem" }}>
//         <button onClick={handlePlay}>▶️ Play (ref)</button>
//         <button onClick={handlePause}>⏸️ Pause (ref)</button>
//       </div>
//     </div>
//   );
// }
