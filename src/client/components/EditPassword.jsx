import { useOutletContext } from "react-router-dom";
import styles from "../stylesheets/EditPassword.module.css";
import BackHeader from "./BackHeader";
import { useRef, useState } from "react";
import Icon from "@mdi/react";
import { mdiEye, mdiEyeOff } from "@mdi/js";

const EditPassword = () => {
  const [user, setUser, post, setPost] = useOutletContext();

  const [currentPasswordError, setCurrentPasswordError] = useState("");
  const [newPasswordError, setNewPasswordError] = useState("");
  const [confirmNewPasswordError, setConfirmNewPasswordError] = useState("");
  const [revealPassword, setRevealPassword] = useState(false);

  const currentPassword = useRef(null);
  const newPassword = useRef(null);
  const confirmNewPassword = useRef(null);

  const changePassword = async (e) => {
    try {
      e.preventDefault();
      if (
        currentPassword.current.value &&
        newPassword.current.value &&
        confirmNewPassword.current.value
      ) {
        const response = await fetch("/api/user/edit/password", {
          method: "PUT",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            id: user.id,
            currentPassword: currentPassword.current.value,
            newPassword: newPassword.current.value,
            confirmNewPassword: confirmNewPassword.current.value
          })
        });
        const data = await response.json();
        if (!data.id) {
          if (!data.passwordMatch) {
            setCurrentPasswordError("Incorrect Current Password");
          } else {
            setCurrentPasswordError("");
          }
          if (!data.passwordLength) {
            setNewPasswordError("Password must be at least 6 characters long.");
          } else {
            setNewPasswordError("");
          }
          if (!data.passwordConfirm) {
            setConfirmNewPasswordError("Confirm New Password Must Match New Password");
          } else {
            setConfirmNewPasswordError("");
          }
        } else {
          currentPassword.current.value = "";
          newPassword.current.value = "";
          confirmNewPassword.current.value = "";
          setUser(data);
          setCurrentPasswordError("");
          setNewPasswordError("");
          setConfirmNewPasswordError("");
        }
      }
    } catch (error) {
      console.log(error);
    }
  };

  if (user) {
    return (
      <div className={styles.editPassword_container}>
        <BackHeader mode={null} user={user} />
        <form>
          <div>
            <label htmlFor="current_password">Current Password</label>
            <div>
              <input
                type={revealPassword ? "text" : "password"}
                id="current_password"
                ref={currentPassword}
                placeholder="Enter Your Password"
              />
              <div onClick={() => setRevealPassword((r) => !r)}>
                <Icon path={!revealPassword ? mdiEye : mdiEyeOff}></Icon>
              </div>
            </div>
            <p>{currentPasswordError}</p>
            <label htmlFor="new_password">New Password</label>
            <input type="password" id="new_password" ref={newPassword} />
            <p>{newPasswordError}</p>
            <label htmlFor="confirm_new_password">Confirm New Password</label>
            <input type="password" id="confirm_new_password" ref={confirmNewPassword} />
            <p>{confirmNewPasswordError}</p>
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
