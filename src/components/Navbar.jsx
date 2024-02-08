import React, { useContext } from "react";
import { signOut } from "firebase/auth";
import { auth } from "../firebase";
import DefaultProfilePic from "https://firebasestorage.googleapis.com/v0/b/chat-app-878be.appspot.com/o/DefaultProfilePic.jpg?alt=media&token=d0cc0ba3-8c4b-4420-ae85-495435ff6ae8";
import { AuthContext } from "../context/AuthContext";
import { IconLogout } from "@tabler/icons-react";

const Navbar = ({ isCollapsed }) => {
  const { currentUser } = useContext(AuthContext);

  return (
    <div className="navbar">
      <div className="user">
        <img src={currentUser.photoURL} alt="" />
        {!isCollapsed && (
          <span style={{ textShadow: "0 4px 8px rgba(0, 0, 0, 0.2)" }}>
            {currentUser.displayName}
          </span>
        )}
      </div>
      {!isCollapsed && (
        <button onClick={() => signOut(auth)}>
          <IconLogout size={15} color="#545454" />
        </button>
      )}
    </div>
  );
};

export default Navbar;
