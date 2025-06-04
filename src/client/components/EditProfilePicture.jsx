import { useRef } from "react";
import { useOutletContext } from "react-router-dom";
import BackHeader from "./BackHeader";
import styles from "../stylesheets/EditProfilePicture.module.css";

const EditProfilePicture = () => {
  const [user, setUser, post, setPost] = useOutletContext();

  const profilePictureRef = useRef(null);

  const changeProfilePicture = async (e) => {
    try {
      e.preventDefault();
      if (profilePictureRef.current.value) {
        const formData = new FormData();
        formData.append("id", user.id);
        formData.append("file", profilePictureRef.current.files[0]);
        const response = await fetch("/api/user/edit/picture", {
          method: "PUT",
          body: formData
        });
        const data = await response.json();
        if (data) {
          profilePictureRef.current.value = "";
          setUser(data);
        }
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
      <div className={styles.editProfilePicture_container}>
        <BackHeader mode={null} user={user} />
        <form>
          <div>
            <label htmlFor="change_profile_picture">Change Profile Picture</label>
            <input type="file" id="change_profile_picture" ref={profilePictureRef} />
          </div>
          <div className={styles.edit_buttons}>
            {user.profilePicture ? (
              <button onClick={handleDefaultPicture}>Use Default Profile Picture</button>
            ) : (
              ""
            )}
            <button onClick={(e) => changeProfilePicture(e)}>Submit Profile Picture</button>
          </div>
        </form>
      </div>
    );
  } else {
    window.location.href = "/login";
  }
};

export default EditProfilePicture;
