import { useOutletContext } from "react-router-dom";
import BackHeader from "./BackHeader";
import { useRef, useState } from "react";
import styles from "../stylesheets/EditUsername.module.css";

const EditUsername = () => {
  const [user, setUser, post, setPost] = useOutletContext();

  const [usernameError, setUsernameError] = useState("");

  const usernameRef = useRef(null);

  const editUsername = async (e) => {
    try {
      e.preventDefault();
      if (usernameRef.current.value.length >= 3 && usernameRef.current.value.length <= 20) {
        const response = await fetch("/api/user/edit/username", {
          method: "PUT",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            id: user.id,
            username: usernameRef.current.value
          })
        });
        const data = await response.json();
        if (data) {
          usernameRef.current.value = "";
          setUsernameError("");
          setUser(data);
        }
        return;
      }
      setUsernameError("Username Is Invalid");
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className={styles.editUsername_container}>
      <BackHeader mode={null} user={user} />
      <form>
        <div>
          <label htmlFor="edit_username">Edit Username</label>
          <input type="text" id="edit_username" placeholder={user.username} ref={usernameRef} />
          <p>{usernameError}</p>
        </div>
        <button onClick={(e) => editUsername(e)}>Change Username</button>
      </form>
    </div>
  );
};

export default EditUsername;
