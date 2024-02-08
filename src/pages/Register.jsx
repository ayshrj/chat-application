import React, { useState } from "react";
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { auth, db, storage } from "../firebase";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { doc, setDoc } from "firebase/firestore";
import { useNavigate, Link } from "react-router-dom";
import Logo from "../assets/BlinkConvoLogo.png";
import DefaultProfilePic from "../assets/DefaultProfilePic.jpg";
import { IconUserPlus } from "@tabler/icons-react";

const Register = () => {
  const [err, setErr] = useState(false);
  const [loading, setLoading] = useState(false);
  const [avatarFile, setAvatarFile] = useState(null);
  const [displayName, setDisplayName] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    setLoading(true);
    e.preventDefault();
    const displayName = e.target[0].value;
    const email = e.target[1].value;
    const password = e.target[2].value;
    const file = avatarFile; // Accessing file from state

    try {
      const res = await createUserWithEmailAndPassword(auth, email, password);

      let downloadURL = DefaultProfilePic;

      if (file) {
        const date = new Date().getTime();
        const storageRef = ref(storage, `${displayName + date}`);

        await uploadBytesResumable(storageRef, file).then(async () => {
          downloadURL = await getDownloadURL(storageRef);
        });
      }

      await updateProfile(res.user, {
        displayName,
        photoURL: downloadURL,
      });

      await setDoc(doc(db, "users", res.user.uid), {
        uid: res.user.uid,
        displayName,
        email,
        photoURL: downloadURL,
      });

      await setDoc(doc(db, "userChats", res.user.uid), {});
      navigate("/");
    } catch (err) {
      console.log(err);
      setErr(true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="formContainer">
      <div className="formWrapper">
        <span className="logo">
          <img src={Logo} alt="Logo" />
          <div>BlinkConvo</div>
        </span>
        <span className="title">Register</span>
        <form onSubmit={handleSubmit}>
          <input
            required
            type="text"
            placeholder="Name"
            value={displayName}
            onChange={(event) => {
              const inputValue = event.target.value;
              const filteredValue = inputValue.replace(/[^a-zA-Z0-9\s]/g, "");
              setDisplayName(filteredValue);
            }}
          />
          <input required type="email" placeholder="Email" />
          <input required type="password" placeholder="Password" />
          <input
            style={{ display: "none" }}
            type="file"
            id="file"
            onChange={(e) => setAvatarFile(e.target.files[0])} // Update file state on change
          />
          <label htmlFor="file" style={{ justifyContent: "center" }}>
            <div
              style={{
                margin: "-1px",
                padding: 0,
                border: `2px solid ${avatarFile ? "#4399FF" : "#FFF"}`,
                borderRadius: "30px",
                color: `${avatarFile ? "#FFF" : "#4399FF"}`,
                backgroundColor: `${!avatarFile ? "#FFF" : "#4399FF"}`,
              }}
            >
              <IconUserPlus />
            </div>
            <span>
              {!avatarFile
                ? "Add an avatar"
                : "Want to change avatar? Click again"}
            </span>
          </label>
          <button disabled={loading}>Sign up</button>
          {loading && <div className="loading"></div>}
          {err && <span>Something went wrong</span>}
        </form>
        <p>
          Already have an account? <Link to="/login">Login</Link>
        </p>
      </div>
    </div>
  );
};

export default Register;
