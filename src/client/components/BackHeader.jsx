import styles from "../stylesheets/BackHeader.module.css";
import Icon from "@mdi/react";
import { mdiArrowLeft } from "@mdi/js";
import { useNavigate } from "react-router-dom";

const BackHeader = (props) => {
  const navigate = useNavigate();

  // Find way to go back to "/" when hard coding url
  // For example, when directly going to /likes url, go back goes to browser homepage
  if (props.mode === "likes" || props.mode === "comments") {
    return (
      <div className={styles.backHeader_container}>
        <Icon path={mdiArrowLeft} onClick={() => navigate(-1)} />
        <p>{props.post.text}</p>
      </div>
    );
  } else if (props.mode === "profile") {
    return (
      <div className={styles.backHeader_container_profile}>
        <Icon path={mdiArrowLeft} onClick={() => navigate(-1)} />
        <p>
          {window.location.pathname.split("/")[2] === "followers" ||
          window.location.pathname.split("/")[2] === "following"
            ? "Profile"
            : ""}
        </p>
      </div>
    );
  } else if (props.mode === "user") {
    return (
      <div className={styles.backHeader_container_profile}>
        <Icon path={mdiArrowLeft} onClick={() => navigate(-1)} />
        <p>{props.user.username}</p>
      </div>
    );
  } else if (props.mode === "Account") {
    return (
      <div className={styles.backHeader_container_profile}>
        <Icon path={mdiArrowLeft} onClick={() => navigate(-1)} />
        <p>Account</p>
      </div>
    );
  } else {
    return (
      <div className={styles.backHeader_container_profile}>
        <Icon path={mdiArrowLeft} onClick={() => navigate(-1)} />
      </div>
    );
  }
};

export default BackHeader;
