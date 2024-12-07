import { Link } from "react-router-dom";
import styles from "../stylesheets/ToProfile.module.css";

const ToProfile = (props) => {
  const handleModals = () => {
    if (props.displayLikesModal) {
      props.displayLikesModal();
    } else if (props.displayCommentsModal) {
      props.displayCommentsModal();
    }
  };

  if (props.mode !== "profile") {
    return (
      <div className={styles.user_card}>
        {!props.user ? (
          <Link to={`/${props.searchedUser.id}/profile`}>{props.searchedUser.username}</Link>
        ) : (
          <Link to={`/profile`}>{props.user.username}</Link>
        )}
      </div>
    );
  } else {
    return (
      <div className={styles.user_card}>
        <p onClick={handleModals}>{props.searchedUser.username}</p>
      </div>
    );
  }
};

export default ToProfile;
