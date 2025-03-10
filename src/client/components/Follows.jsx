import { useEffect } from "react";
import styles from "../stylesheets/Follows.module.css";
import { Link } from "react-router-dom";

const Follows = (props) => {
  useEffect(() => {}, []);

  return (
    <div className={styles.follow_container}>
      <Link to={`/${props.userProfile.id}/followers`}>
        <div className={styles.followers_container}>
          <p>Followers</p>
          <p>{props.userProfile.Following.length}</p>
        </div>
      </Link>
      <Link to={`/${props.userProfile.id}/following`}>
        <div className={styles.following_container}>
          <p>Following</p>
          <p>{props.userProfile.Followers.length}</p>
        </div>
      </Link>
    </div>
  );
};

export default Follows;
