import React, { useContext, useState } from "react";
import { IconX, IconPaperclip, IconSend2 } from "@tabler/icons-react";
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
  const [chosenFile, setChosenFile] = useState(null);
  const [chosenFilePreview, setChosenFilePreview] = useState(null);

  const { currentUser } = useContext(AuthContext);
  const { data } = useContext(ChatContext);

  console.log(chosenFile);

  const handleChosenFileChange = (e) => {
    const selectedFile = e.target.files[0];
    setChosenFile(selectedFile);
    setChosenFilePreview(URL.createObjectURL(selectedFile));
  };

  const handleSend = async () => {
    if (chosenFile) {
      const storageRef = ref(storage, uuid());

      const uploadTask = uploadBytesResumable(storageRef, chosenFile);

      uploadTask.on(
        (error) => {
          console.error(error);
        },
        () => {
          getDownloadURL(uploadTask.snapshot.ref).then(async (downloadURL) => {
            await updateDoc(doc(db, "chats", data.chatId), {
              messages: arrayUnion({
                id: uuid(),
                text,
                senderId: currentUser.uid,
                date: Timestamp.now(),
                [mediaType]: downloadURL,
              }),
            });
          });
        }
      );
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

    if (text) {
      const updateLastMessage = {
        [data.chatId + ".lastMessage"]: {
          text,
        },
        [data.chatId + ".date"]: serverTimestamp(),
      };

      await updateDoc(doc(db, "userChats", currentUser.uid), updateLastMessage);
      await updateDoc(doc(db, "userChats", data.user.uid), updateLastMessage);

      setText("");
      setChosenFile(null);
    }
    setChosenFilePreview(null);
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      handleSend();
    }
  };

  const handleDetachFile = () => {
    setChosenFile(null);
    setChosenFilePreview(null);
  };

  console.log(chosenFile ? chosenFile.type.split("/")[0] : "nothing chosen");
  const mediaType = chosenFile ? chosenFile.type.split("/")[0] : null;

  return (
    <div className="input" style={{ paddingBottom: 40, margin: 0 }}>
      {chosenFilePreview && mediaType ? (
        <div className="mediaShown" style={{ position: "relative" }}>
          {mediaType === "image" ? (
            <img
              src={chosenFilePreview}
              alt="Selected"
              style={{
                position: "absolute",
                height: 30,
                transform: "translate(10px, 0px)",
              }}
            />
          ) : mediaType === "video" ? (
            <video
              src={chosenFilePreview}
              alt="Selected"
              style={{
                position: "absolute",
                height: 30,
                transform: "translate(10px, 0px)",
              }}
            />
          ) : mediaType === "audio" ? (
            <audio
              controls
              src={chosenFilePreview}
              style={{
                position: "absolute",
                transform: "translate(10px, -15px)",
              }}
            />
          ) : null}
          <div
            style={{
              position: "absolute",
              transform: "translate(7px, -15px)",
              cursor: "pointer",
            }}
            onClick={handleDetachFile}
          >
            <IconX size={10} />
          </div>
        </div>
      ) : (
        <input
          type="text"
          placeholder={"Type something..."}
          onChange={(e) => setText(e.target.value)}
          onKeyPress={handleKeyPress}
          value={text}
          style={{ borderRadius: "50px", padding: "10px" }}
        />
      )}
      <div className="send">
        <input
          type="file"
          style={{ display: "none" }}
          id="file"
          onChange={handleChosenFileChange}
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
          <IconPaperclip />
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
  );
};

export default Input;
