import { useRef } from "react";
import styles from "../stylesheets/EditAccount.module.css";
import { useOutletContext } from "react-router-dom";
import BackHeader from "./BackHeader";

const EditAccount = () => {
  const [user, setUser, post, setPost] = useOutletContext();

  const profilePictureRef = useRef(null);
  const usernameRef = useRef(null);

  const changeProfilePicture = async () => {
    try {
      const formData = new FormData();
      formData.append("id", user.id);
      formData.append("file", profilePictureRef.current.files[0]);
      const response = await fetch("/api/user/edit/picture", {
        method: "PUT",
        body: formData
      });
      const data = await response.json();
      setUser(data);
    } catch (error) {
      console.log(error);
    }
  };

  const editUsername = async () => {
    try {
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
      setUser(data);
    } catch (error) {
      console.log(error);
    }
  };

  const submitEdits = async (e) => {
    try {
      e.preventDefault();
      if (profilePictureRef.current.value) {
        changeProfilePicture();
      }
      if (usernameRef.current.value) {
        editUsername();
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleDefaultPicture = async (e) => {
    try {
      e.preventDefault();
      const response = await fetch("/api/user/edit/default", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          id: user.id
        })
      });
      const data = await response.json();
      setUser(data);
    } catch (error) {
      console.log(error);
    }
  };

  if (user) {
    return (
      <>
        <BackHeader mode={"settings"} user={user} />
        <form className={styles.edit_form} encType="multipart/form-data">
          <div>
            <label htmlFor="change_profile_picture">Change Profile Picture</label>
            <input type="file" id="change_profile_picture" ref={profilePictureRef} />
            {user.profilePicture ? (
              <button onClick={handleDefaultPicture}>Use Default Profile Picture</button>
            ) : (
              ""
            )}
            <label htmlFor="edit_username">Edit Username</label>
            <input
              type="text"
              id="edit_username"
              placeholder={user.username}
              className={styles.edit_username}
              ref={usernameRef}
            />
          </div>
          <button onClick={submitEdits}>Submit</button>
        </form>
      </>
    );
  } else {
    window.location.href = "/login";
  }
};

export default EditAccount;
