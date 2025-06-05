import { useOutletContext } from "react-router-dom";
import styles from "../stylesheets/EditPassword.module.css";
import BackHeader from "./BackHeader";
import { useRef, useState } from "react";

const EditPassword = () => {
  const [user, setUser, post, setPost] = useOutletContext();

  const [currentPasswordError, setCurrentPasswordError] = useState("");
  const [newPasswordError, setNewPasswordError] = useState("");

  const currentPassword = useRef(null);
  const newPassword = useRef(null);

  const changePassword = async (e) => {
    try {
      e.preventDefault();
      const response = await fetch("/api/user/edit/password", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          id: user.id,
          currentPassword: currentPassword.current.value,
          newPassword: newPassword.current.value
        })
      });
      const data = await response.json();
      if (typeof data === "string" && data === "No Match") {
        setCurrentPasswordError("Incorrect Current Password");
        setNewPasswordError("");
      }
      if (typeof data === "string" && data === "Invalid") {
        setCurrentPasswordError("");
        setNewPasswordError("Password must be at least 6 characters long.");
      }
      if (Array.isArray(data)) {
        currentPassword.current.value = "";
        newPassword.current.value = "";
        setUser(data);
        setCurrentPasswordError("");
        setNewPasswordError("");
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleRevealPassword = (e) => {
    e.preventDefault();
    if (currentPassword.current.type !== "text") {
      currentPassword.current.type = "text";
    } else {
      currentPassword.current.type = "password";
    }
  };

  if (user) {
    return (
      <div className={styles.editPassword_container}>
        <BackHeader mode={null} user={user} />
        <form>
          <div>
            <label htmlFor="current_password">Current Password</label>
            <input type="password" id="current_password" ref={currentPassword} />
            <button onClick={(e) => handleRevealPassword(e)}>Show</button>
            <p>{currentPasswordError}</p>
            <label htmlFor="new_password">New Password</label>
            <input type="password" id="new_password" ref={newPassword} />
            <p>{newPasswordError}</p>
          </div>
          <button onClick={(e) => changePassword(e)}>Change Password</button>
        </form>
      </div>
    );
  } else {
    window.location.href = "/login";
  }
};

export default EditPassword;
