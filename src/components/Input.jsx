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
  const [file, setFile] = useState(null); // State to hold the selected file
  const [url, setUrl] = useState(""); // State to hold the URL of the selected image
  const [currFileExtension, setCurrFileExtension] = useState("");

  const { currentUser } = useContext(AuthContext);
  const { data } = useContext(ChatContext);

  function checkFileType(file) {
    var fileName = file.name;
    var fileExtension = fileName.split(".").pop().toLowerCase();

    var imageExtensions = ["jpg", "jpeg", "png", "gif", "bmp"];
    var videoExtensions = ["mp4", "avi", "mov", "mkv"];
    var audioExtensions = ["mp3", "wav", "ogg"];

    if (imageExtensions.indexOf(fileExtension) !== -1) {
      return "img";
    } else if (videoExtensions.indexOf(fileExtension) !== -1) {
      return "video";
    } else if (audioExtensions.indexOf(fileExtension) !== -1) {
      return "audio";
    } else {
      console.log("File type not supported");
      return null;
    }
  }

  const handleSend = async () => {
    if (file) {
      const fileType = checkFileType(file);
      setCurrFileExtension(fileType);
      if (fileType === "img") {
        await updateDoc(doc(db, "chats", data.chatId), {
          messages: arrayUnion({
            id: uuid(),
            text,
            senderId: currentUser.uid,
            date: Timestamp.now(),
            img: url,
          }),
        });
      } else if (fileType === "video") {
        await updateDoc(doc(db, "chats", data.chatId), {
          messages: arrayUnion({
            id: uuid(),
            text,
            senderId: currentUser.uid,
            date: Timestamp.now(),
            video: url,
          }),
        });
      } else if (fileType === "audio") {
        await updateDoc(doc(db, "chats", data.chatId), {
          messages: arrayUnion({
            id: uuid(),
            text,
            senderId: currentUser.uid,
            date: Timestamp.now(),
            audio: url,
          }),
        });
      }
    } else if (text) {
      await updateDoc(doc(db, "chats", data.chatId), {
        messages: arrayUnion({
          id: uuid(),
          text,
          senderId: currentUser.uid,
          date: Timestamp.now(),
        }),
      });
    }

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
    setUrl("");
    setFile(null);
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const Url = URL.createObjectURL(file);
      setFile(file);
      setUrl(Url);
      const fileType = checkFileType(file);
      setCurrFileExtension(fileType);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      handleSend();
    }
  };

  return (
    <>
      {file && (
        <>
          {currFileExtension === "img" && (
            <img
              src={url}
              alt="Selected Item"
              style={{
                height: "30px",
                position: "absolute",
                transform: "translate(20px, 25px)",
              }}
            />
          )}
          {currFileExtension === "video" && (
            <video
              src={url}
              alt="Selected Item"
              style={{
                height: "30px",
                position: "absolute",
                transform: "translate(20px, 25px)",
              }}
            />
          )}
          {currFileExtension === "audio" && (
            <audio
              src={url}
              alt="Selected Item"
              style={{
                height: "30px",
                position: "absolute",
                transform: "translate(20px, 25px)",
              }}
            />
          )}
        </>
      )}

      <div className="input" style={{ paddingBottom: 40, margin: 0 }}>
        <input
          type="text"
          placeholder={`${!url ? `Type something...` : ""}`}
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
