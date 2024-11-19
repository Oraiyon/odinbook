import styles from "../stylesheets/ToProfile.module.css";

const ToProfile = (props) => {
  const toUser = () => {
    console.log(props.user);
  };

  return (
    <p onClick={toUser} className={styles.user_card}>
      {props.user.username}
    </p>
  );
};

export default ToProfile;
