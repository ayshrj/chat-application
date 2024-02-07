import React, { useState, useContext } from "react";
import Navbar from "./Navbar";
import Search from "./Search";
import Chats from "./Chats";
import { signOut } from "firebase/auth";
import { auth } from "../firebase";
import { AuthContext } from "../context/AuthContext";
import { IconArrowLeft, IconArrowRight, IconLogout } from "@tabler/icons-react";

const Sidebar = () => {
  const [isCollapsed, setIsCollapsed] = useState(true);
  const { currentUser } = useContext(AuthContext);

  return (
    <div className="sidebar" style={{ flex: !isCollapsed ? 1 : "" }}>
      <Navbar isCollapsed={isCollapsed} />
      <Search isCollapsed={isCollapsed} />
      <div
        style={{
          width: "80%",
          backgroundColor: "gray",
          height: "0.2px",
          marginLeft: "10%",
          marginBottom: "4px",
          padding: 0,
          userSelect: "none",
        }}
      />
      <Chats isCollapsed={isCollapsed} />
      <div
        onClick={() => setIsCollapsed(!isCollapsed)}
        style={{
          color: "rgb(84, 84, 84)",
          position: "absolute",
          bottom: 80,
          right: 0,
        }}
      >
        {!isCollapsed ? <IconArrowLeft /> : <IconArrowRight />}
      </div>
      {isCollapsed && (
        <button onClick={() => signOut(auth)} className="iconlogout">
          <IconLogout size={15} color="#545454" />
        </button>
      )}
    </div>
  );
};

export default Sidebar;
