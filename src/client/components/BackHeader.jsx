import styles from "../stylesheets/BackHeader.module.css";
import Icon from "@mdi/react";
import { mdiArrowLeft } from "@mdi/js";
import { useNavigate } from "react-router-dom";
import { useRef } from "react";

const BackHeader = (props) => {
  const linkRef = useRef(null);

  const navigate = useNavigate();
  // Find way to go back to "/" when hard coding url
  // For example, when directly going to /likes url, go back goes to browser homepage
  if (props.mode === "likes" || props.mode === "comments") {
    return (
      <div className={styles.backHeader_container}>
        <Icon path={mdiArrowLeft} onClick={() => navigate(-1)} />
        <p>{props.post}</p>
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
  } else if (props.mode === "settings") {
    return (
      <div className={styles.backHeader_container_profile}>
        <Icon path={mdiArrowLeft} onClick={() => navigate(-1)} />
        <p>Settings</p>
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
