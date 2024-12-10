import { Link } from "react-router-dom";
import styles from "../stylesheets/ToProfile.module.css";

const ToProfile = (props) => {
  if (props.mode !== "profile") {
    // Not linking to /user
    return (
      <div className={styles.user_card}>
        {!props.user ? (
          <Link to={`/${props.searchedUser.id}/profile`}>{props.searchedUser.username}</Link>
        ) : (
          <Link to={`/user`}>{props.user.username}</Link>
        )}
      </div>
    );
  } else {
    return (
      <div className={styles.user_card}>
        <p>{props.searchedUser.username}</p>
      </div>
    );
  }
};

export default ToProfile;
