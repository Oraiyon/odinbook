import { useOutletContext } from "react-router-dom";
import styles from "../stylesheets/EditPassword.module.css";
import BackHeader from "./BackHeader";
import { useRef } from "react";

const EditPassword = () => {
  const [user, setUser, post, setPost] = useOutletContext();

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
      if (data) {
        currentPassword.current.value = "";
        newPassword.current.value = "";
        setUser(data);
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
            <input type="password" id="current_password" ref={currentPassword} />
            <label htmlFor="new_password">New Password</label>
            <input type="password" id="new_password" ref={newPassword} />
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
