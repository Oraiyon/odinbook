import styles from "../stylesheets/ToProfile.module.css";

const ToProfile = (props) => {
  const toUser = () => {
    console.log(props.user);
  };

  return (
    <div onClick={toUser} className={styles.user_card}>
      <p>{props.user.username}</p>
    </div>
  );
};

export default ToProfile;
