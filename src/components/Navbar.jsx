import React, { useContext } from "react";
import { signOut } from "firebase/auth";
import { auth } from "../firebase";
import { AuthContext } from "../context/AuthContext";
import { IconLogout } from "@tabler/icons-react";

const Navbar = () => {
  const { currentUser } = useContext(AuthContext);

  return (
    <div className="navbar">
      <div className="user">
        <img src={currentUser.photoURL} alt="" />
        <span style={{ textShadow: "0 4px 8px rgba(0, 0, 0, 0.2)" }}>
          {currentUser.displayName}
        </span>
      </div>
      <button onClick={() => signOut(auth)}>
        <IconLogout size={15} color="#545454" />
      </button>
    </div>
  );
};

export default Navbar;
