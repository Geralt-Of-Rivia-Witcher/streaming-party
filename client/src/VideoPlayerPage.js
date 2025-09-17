import { useRef, useEffect } from "react";
import { io } from "socket.io-client";
import "./VideoPlayerPage.css";

const socket = io(process.env.REACT_APP_BACKEND_URL);

const VideoPlayerPage = ({ url, onBack }) => {
  const videoRef = useRef(null);
  const isRemoteAction = useRef(false);

  // Emit sync event on play/pause/seek
  const emitSync = (currentTime, isPlaying) => {
    if (!isRemoteAction.current) {
      socket.emit("sync", { currentTime, isPlaying });
    }
  };

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const handlePlay = () => {
      emitSync(video.currentTime, true);
    };
    const handlePause = () => {
      emitSync(video.currentTime, false);
    };
    const handleSeeked = () => {
      emitSync(video.currentTime, !video.paused);
    };

    video.addEventListener("play", handlePlay);
    video.addEventListener("pause", handlePause);
    video.addEventListener("seeked", handleSeeked);

    socket.on("sync", ({ currentTime, isPlaying }) => {
      if (video) {
        isRemoteAction.current = true;
        video.currentTime = currentTime;
        if (isPlaying) {
          video.play();
        } else {
          video.pause();
        }
        setTimeout(() => {
          isRemoteAction.current = false;
        }, 500);
      }
    });

    return () => {
      video.removeEventListener("play", handlePlay);
      video.removeEventListener("pause", handlePause);
      video.removeEventListener("seeked", handleSeeked);
      socket.off("sync");
    };
  }, []);

  return (
    <div className="video-player-fullscreen">
      <button className="back-btn" onClick={onBack}>
        Back
      </button>
      <video
        ref={videoRef}
        src={url}
        controls
        autoPlay
        className="video-player"
        style={{ width: "100vw", height: "100vh", background: "#000" }}
      >
        <track kind="subtitles" srcLang="en" label="English" default />
      </video>
    </div>
  );
};

export default VideoPlayerPage;
