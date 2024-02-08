import React, { useState } from "react";
import { IconSquareRoundedX } from "@tabler/icons-react";

const AudioPlayer = ({ audioSrc }) => {
  const [modalOpen, setModalOpen] = useState(false);

  const openModal = () => {
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
  };

  return (
    <div>
      <audio
        src={audioSrc}
        controls
        onClick={openModal}
        style={{ cursor: "pointer" }}
      />
      {modalOpen && (
        <div className="modal">
          <div className="modal-content">
            <span className="close" onClick={closeModal}>
              &times;
            </span>
            <audio src={audioSrc} controls />
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

export default AudioPlayer;
