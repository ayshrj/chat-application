import React, { useState } from "react";
import { IconSquareRoundedX } from "@tabler/icons-react";

const ImagePlayer = ({ src }) => {
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
        src={src}
        alt="Image"
        onClick={openModal}
        style={{ cursor: "pointer" }}
      />
      {modalOpen && (
        <div className="modal">
          <div className="modal-content">
            <img src={src} alt="Image" />
            <button
              className="close-button"
              onClick={closeModal}
              style={{
                position: "absolute",
                top: 2,
                right: 2,
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
