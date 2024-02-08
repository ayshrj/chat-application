import React, { useContext, useEffect, useRef, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import { ChatContext } from "../context/ChatContext";
import VideoPlayer from "./VideoPlayer";
import ImagePlayer from "./ImagePlayer";
import AudioPlayer from "./AudioPlayer";

const Message = ({ message, prevId }) => {
  const { currentUser } = useContext(AuthContext);
  const { data } = useContext(ChatContext);
  // const [openModal, setOpenModal] = useState(true);

  const ref = useRef();

  useEffect(() => {
    ref.current?.scrollIntoView({ behavior: "smooth" });
  }, [message]);

  const formatTime = (timestamp) => {
    const milliseconds =
      timestamp.seconds * 1000 + timestamp.nanoseconds / 1000000;
    const date = new Date(milliseconds);
    const options = { hour: "numeric", minute: "numeric", hour12: true };
    return date.toLocaleString("en-US", options);
  };

  return (
    <div
      ref={ref}
      className={`message ${message.senderId === currentUser.uid && "owner"}`}
    >
      <div className="messageInfo">
        {prevId === null || prevId !== message.senderId ? (
          <img
            src={
              message.senderId === currentUser.uid
                ? currentUser.photoURL
                : data.user.photoURL
            }
            alt=""
          />
        ) : (
          <div></div>
        )}
      </div>

      <div className="messageContent">
        <div
          className="messageContentText"
          style={{
            borderRadius:
              prevId === null || prevId !== message.senderId
                ? message.senderId === currentUser.uid
                  ? "5px 0px 5px 5px"
                  : "0px 5px 5px 5px"
                : "5px",
            backgroundColor:
              message.senderId === currentUser.uid ? "#4399FF" : "#DCE8FF",
          }}
        >
          {message.text}
          {message.img && <ImagePlayer imageSrc={message.img} />}
          {message.video && <VideoPlayer videoSrc={message.video} />}
          {message.audio && <AudioPlayer audioSrc={message.audio} />}

          <div
            className="messageContentTime"
            style={{
              right: message.senderId === currentUser.uid ? 5 : "",
              left: message.senderId === currentUser.uid ? "" : 5,
            }}
          >
            {formatTime(message.date)}
          </div>
        </div>
      </div>
      {/* {openModal && (
        <div className="modal" onClick={() => setOpenModal(false)}>
          <div className="modal-content">
            <img src={message.img} alt="" />
          </div>
        </div>
      )} */}
    </div>
  );
};

export default Message;
