import React, { useContext, useState } from "react";
import { IconPhotoPlus, IconSend2 } from "@tabler/icons-react";
import { AuthContext } from "../context/AuthContext";
import { ChatContext } from "../context/ChatContext";
import {
  arrayUnion,
  doc,
  serverTimestamp,
  Timestamp,
  updateDoc,
} from "firebase/firestore";
import { db, storage } from "../firebase";
import { v4 as uuid } from "uuid";
import { getDownloadURL, ref, uploadBytesResumable } from "firebase/storage";

const Input = () => {
  const [text, setText] = useState("");
  const [imgUrl, setImgUrl] = useState(""); // State to hold the URL of the selected image

  const { currentUser } = useContext(AuthContext);
  const { data } = useContext(ChatContext);

  const handleSend = async () => {
    if (imgUrl) {
      // If there's an image URL, handle sending image message
      await updateDoc(doc(db, "chats", data.chatId), {
        messages: arrayUnion({
          id: uuid(),
          text,
          senderId: currentUser.uid,
          date: Timestamp.now(),
          img: imgUrl, // Use the image URL here
        }),
      });
    } else if (text) {
      // If no image URL, handle sending text message
      await updateDoc(doc(db, "chats", data.chatId), {
        messages: arrayUnion({
          id: uuid(),
          text,
          senderId: currentUser.uid,
          date: Timestamp.now(),
        }),
      });
    }

    // Clear input fields after sending message
    await updateDoc(doc(db, "userChats", currentUser.uid), {
      [data.chatId + ".lastMessage"]: {
        text,
      },
      [data.chatId + ".date"]: serverTimestamp(),
    });

    await updateDoc(doc(db, "userChats", data.user.uid), {
      [data.chatId + ".lastMessage"]: {
        text,
      },
      [data.chatId + ".date"]: serverTimestamp(),
    });

    setText("");
    setImgUrl("");
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file); // Create URL for the selected image
      setImgUrl(imageUrl); // Set the image URL in the state
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      handleSend();
    }
  };

  return (
    <>
      {imgUrl && (
        <img
          src={imgUrl}
          alt="Selected Image"
          style={{
            maxWidth: "100%",
            maxHeight: "300px",
            position: "absolute",
            height: 30,
            transform: "translate(20px, 25px)",
          }}
        />
      )}
      <div className="input" style={{ paddingBottom: 40, margin: 0 }}>
        <input
          type="text"
          placeholder={`${!imgUrl ? `Type something...` : ""}`}
          onChange={(e) => setText(e.target.value)}
          onKeyPress={handleKeyPress}
          value={text}
          style={{ borderRadius: "50px", padding: "10px" }}
        />
        <div className="send">
          <input
            type="file"
            style={{ display: "none" }}
            id="file"
            onChange={handleFileChange}
          />
          <label
            htmlFor="file"
            style={{
              height: "24px",
              cursor: "pointer",
              color: "#b1b1b1",
              transform: "translate(4px, 15px)",
            }}
          >
            <IconPhotoPlus />
          </label>
          <button
            onClick={handleSend}
            style={{
              display: "flex",
              alignContent: "center",
              alignItems: "center",
              justifyContent: "center",
              justifyItems: "center",
            }}
          >
            <div>
              <IconSend2
                size={15}
                style={{
                  transform: "translateY(2px)",
                }}
              />
            </div>
          </button>
        </div>
      </div>
    </>
  );
};

export default Input;
