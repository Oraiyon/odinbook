import { Link } from "react-router-dom";
import styles from "../stylesheets/ToProfile.module.css";

const ToProfile = (props) => {
  return (
    <div className={styles.user_card}>
      <Link to={`${props.user.id}/profile`}>{props.user.username}</Link>
    </div>
  );
};

export default ToProfile;
