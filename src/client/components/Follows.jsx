import { useEffect } from "react";
import styles from "../stylesheets/Follows.module.css";

const Follows = (props) => {
  useEffect(() => {
    // console.log(props.followers);
  }, []);

  return (
    <div className={styles.follow_container}>
      <div className={styles.followers_container}>
        <p>Followers</p>
        <p>{props.followers.length}</p>
      </div>
      <div className={styles.following_container}>
        <p>Following</p>
        <p>{props.following.length}</p>
      </div>
    </div>
  );
};

export default Follows;
