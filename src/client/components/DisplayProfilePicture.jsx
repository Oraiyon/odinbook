import Icon from "@mdi/react";
import { mdiAccountCircle } from "@mdi/js";
import styles from "../stylesheets/DisplayProfilePicture.module.css";

const DisplayProfilePicture = (props) => {
  if (!props.user.profilePicture) {
    return <Icon path={mdiAccountCircle} className={styles.default_picture} />;
  } else {
    return <img src={props.user.profilePicture} className={styles.profile_picture} />;
  }
};

export default DisplayProfilePicture;
