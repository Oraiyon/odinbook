import { Link } from "react-router-dom";
import styles from "../stylesheets/ToProfile.module.css";
import BackHeader from "./BackHeader";

const ToProfile = (props) => {
  if (props.mode === "profile") {
    //
    return (
      <div className={styles.user_card}>
        {/* <Link to={`/${props.user.id}/profile`}>{props.user.username}</Link> */}
        <BackHeader mode={"profile"} user={props.user.username} />
      </div>
    );
  } else {
    return (
      <div className={styles.user_card}>
        <Link to={`/${props.user.id}/profile`}>{props.user.username}</Link>
      </div>
    );
  }
};

export default ToProfile;
