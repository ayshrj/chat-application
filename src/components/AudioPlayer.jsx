import React, { useState, useRef } from "react";

const AudioPlayer = ({ src }) => {
  const audioRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);

  const togglePlay = () => {
    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play();
    }
    setIsPlaying(!isPlaying);
  };

  return (
    <div>
      <audio ref={audioRef} src={src} />
      <button
        onClick={togglePlay}
        style={{ borderRadius: "9px", border: "none", padding: "9px" }}
      >
        {isPlaying ? "Pause" : "Play"}
      </button>
    </div>
  );
};

export default AudioPlayer;
