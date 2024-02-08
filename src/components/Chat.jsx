import React, { useContext } from "react";
// import { IconVideo } from "@tabler/icons-react";
import Messages from "./Messages";
import Input from "./Input";
import { ChatContext } from "../context/ChatContext";
import Logo from "../assets/BlinckConvoLogo.png";

const Chat = () => {
  const { data } = useContext(ChatContext);

  console.log(data.user);

  return (
    <div className="chat">
      {!data.user || Object.keys(data.user).length === 0 ? (
        <>
          <div
            style={{
              display: "flex",
              backgroundColor: "white",
              height: "100%",
              width: "100%",
              justifyContent: "center",
              alignItems: "center",
              flexDirection: "column",
            }}
          >
            <img src={Logo} style={{ height: "200px", userSelect: "none" }} />
            <div style={{ fontSize: "40px" }}>BlinkConvo</div>
          </div>
        </>
      ) : (
        <>
          <div className="chatInfoContainer" style={{ margin: 0, padding: 0 }}>
            <div className="chatInfo">
              <img src={data.user?.photoURL} />
              <span>{data.user?.displayName}</span>
            </div>

            {/* <div className="chatIcons">
              <IconVideo />
            </div> */}
            <div className="border" />
          </div>
          <Messages />
          <Input />
        </>
      )}
    </div>
  );
};

export default Chat;
