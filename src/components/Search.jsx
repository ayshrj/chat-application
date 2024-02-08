import React, { useContext, useState } from "react";
import {
  collection,
  query,
  where,
  getDocs,
  setDoc,
  doc,
  updateDoc,
  serverTimestamp,
  getDoc,
} from "firebase/firestore";
import { db } from "../firebase";
import { AuthContext } from "../context/AuthContext";
import { IconSearch } from "@tabler/icons-react";

const Search = ({ isCollapsed }) => {
  const [username, setUsername] = useState("");
  const [user, setUser] = useState(null);
  const [err, setErr] = useState(false);

  const { currentUser } = useContext(AuthContext);

  const handleSearch = async () => {
    const q = query(
      collection(db, "users"),
      where("displayName", "==", username)
    );

    try {
      const querySnapshot = await getDocs(q);
      querySnapshot.forEach((doc) => {
        setUser(doc.data());
      });
    } catch (err) {
      setErr(true);
    }
  };

  const handleKey = (e) => {
    e.code === "Enter" && handleSearch();
  };

  const handleSelect = async () => {
    //check whether the group(chats in firestore) exists, if not create
    const combinedId =
      currentUser.uid > user.uid
        ? currentUser.uid + user.uid
        : user.uid + currentUser.uid;
    try {
      const res = await getDoc(doc(db, "chats", combinedId));

      if (!res.exists()) {
        //create a chat in chats collection
        await setDoc(doc(db, "chats", combinedId), { messages: [] });

        //create user chats
        await updateDoc(doc(db, "userChats", currentUser.uid), {
          [combinedId + ".userInfo"]: {
            uid: user.uid,
            displayName: user.displayName,
            photoURL: user.photoURL,
          },
          [combinedId + ".date"]: serverTimestamp(),
        });

        await updateDoc(doc(db, "userChats", user.uid), {
          [combinedId + ".userInfo"]: {
            uid: currentUser.uid,
            displayName: currentUser.displayName,
            photoURL: currentUser.photoURL,
          },
          [combinedId + ".date"]: serverTimestamp(),
        });
      }
    } catch (err) {}

    setUser(null);
    setUsername("");
  };
  return (
    <div className="search">
      <div className="searchForm">
        {!isCollapsed ? (
          <>
            <span style={{ position: "absolute", left: 33, top: 78 }}>
              <IconSearch size={10} color={"#A6918A"} />
            </span>

            <input
              type="text"
              placeholder="Find a user"
              onKeyDown={handleKey}
              onChange={(e) => setUsername(e.target.value)}
              value={username}
              id="search-box"
              style={{ paddingLeft: 30 }}
            />
          </>
        ) : (
          <>
            <span style={{ position: "absolute", left: 33, top: 78 }}>
              <IconSearch size={10} color={"#A6918A"} />
            </span>
            <div
              style={{
                backgroundColor: "white",
                border: "1px solid #000",
                color: "rgb(166, 145, 145)",
                outline: "none",
                width: "32%",
                height: "16px",
                borderRadius: "50px",
                padding: "10px",
                boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)",
              }}
            ></div>
          </>
        )}
      </div>
      {err && <span>User not found!</span>}
      {user && (
        <div className="userChatSearching" onClick={handleSelect}>
          <img src={user.photoURL} alt="" />
          <div className="userChatInfo">
            <span style={{ color: "#4399ff" }}>{user.displayName}</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default Search;
