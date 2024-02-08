import { doc, onSnapshot } from "firebase/firestore";
import React, { useContext, useEffect, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import { ChatContext } from "../context/ChatContext";
import { db } from "../firebase";

const Chats = ({ isCollapsed }) => {
  const [chats, setChats] = useState([]);

  const { currentUser } = useContext(AuthContext);
  const { dispatch } = useContext(ChatContext);

  useEffect(() => {
    const getChats = () => {
      const unsub = onSnapshot(doc(db, "userChats", currentUser.uid), (doc) => {
        setChats(doc.data());
      });

      return () => {
        unsub();
      };
    };

    currentUser.uid && getChats();
  }, [currentUser.uid]);

  const handleSelect = (u) => {
    dispatch({ type: "CHANGE_USER", payload: u });
  };

  const formatTime = (timestamp) => {
    const milliseconds =
      timestamp.seconds * 1000 + timestamp.nanoseconds / 1000000;
    const date = new Date(milliseconds);
    const options = { hour: "numeric", minute: "numeric", hour12: true };
    return date.toLocaleString("en-US", options);
  };

  return (
    <div className="chats">
      {chats &&
        Object.entries(chats)
          ?.sort((a, b) => b[1].date - a[1].date)
          .map((chat) => (
            <button
              className="userChat"
              key={chat[0]}
              onClick={() => handleSelect(chat[1].userInfo)}
            >
              <img src={chat[1].userInfo.photoURL} alt="" />
              {!isCollapsed && (
                <div className="userChatInfoContainer">
                  <div className="userChatInfo">
                    <span>{chat[1].userInfo.displayName}</span>
                    <p className="userChatInfoContent">
                      {chat[1].lastMessage
                        ? chat[1].lastMessage?.text.length <= 20
                          ? chat[1].lastMessage?.text
                          : `${chat[1].lastMessage?.text.slice(0, 20)}.....`
                        : "    "}
                    </p>
                  </div>
                  <p className="userChatInfoTime">
                    {chat[1].date && formatTime(chat[1].date)}
                  </p>
                </div>
              )}
            </button>
          ))}
    </div>
  );
};

export default Chats;
