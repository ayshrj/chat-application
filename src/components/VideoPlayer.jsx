import React, { useState } from "react";
import { IconSquareRoundedX } from "@tabler/icons-react";

const VideoPlayer = ({ videoSrc }) => {
  const [modalOpen, setModalOpen] = useState(false);

  const openModal = () => {
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
  };

  return (
    <div>
      <video src={videoSrc} autoPlay loop muted onClick={openModal} />
      {modalOpen && (
        <div className="modal">
          <div className="modal-content">
            <span className="close" onClick={closeModal}>
              &times;
            </span>
            <video
              src={videoSrc}
              autoPlay
              controls
              onClick={(e) => e.stopPropagation()}
            />
            <button
              className="close-button"
              onClick={closeModal}
              style={{
                position: "absolute",
                transform: "translate(-30px)",
                background: "none",
                border: 0,
                color: "#4399FF",
              }}
            >
              <IconSquareRoundedX />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default VideoPlayer;
