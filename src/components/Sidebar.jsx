import React from "react";
import Navbar from "./Navbar";
import Search from "./Search";
import Chats from "./Chats";

const Sidebar = () => {
  return (
    <div className="sidebar">
      <Navbar />
      <Search />
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
      <Chats />
    </div>
  );
};

export default Sidebar;
