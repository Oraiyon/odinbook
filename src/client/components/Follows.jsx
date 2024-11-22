import styles from "../stylesheets/Follows.module.css";

const Follows = (props) => {
  return (
    <header className={styles.header_container}>
      <h1>{props.userProfile.username}</h1>
      <div className={styles.follow_container}>
        <div className={styles.followers_container}>
          <p>Followers</p>
          <p>{props.userProfile.FollowedBy.length}</p>
        </div>
        <div className={styles.following_container}>
          <p>Following</p>
          <p>{props.userProfile.Following.length}</p>
        </div>
      </div>
    </header>
  );
};

export default Follows;
