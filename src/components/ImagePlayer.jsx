import React, { useState } from "react";
import { IconSquareRoundedX } from "@tabler/icons-react";

const ImagePlayer = ({ imageSrc }) => {
  const [modalOpen, setModalOpen] = useState(false);

  const openModal = () => {
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
  };

  return (
    <div>
      <img
        src={imageSrc}
        alt="Image"
        onClick={openModal}
        style={{ cursor: "pointer" }}
      />
      {modalOpen && (
        <div className="modal">
          <div className="modal-content">
            <img src={imageSrc} alt="Image" />
            <button
              className="close-button"
              onClick={closeModal}
              style={{
                position: "absolute",
                right: 0,
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

export default ImagePlayer;
