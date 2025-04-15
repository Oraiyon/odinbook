import { useEffect } from "react";
import styles from "../stylesheets/Inbox.module.css";
import { useOutletContext } from "react-router-dom";
import ToProfile from "./ToProfile";

const Inbox = () => {
  const [user, setUser, post, setPost] = useOutletContext();

  useEffect(() => {}, []);

  if (user) {
    return (
      <div className={styles.inbox_container}>
        {user.Following.length
          ? user.Following.map((follower) => (
              <div key={follower.id} className={styles.follower_notification}>
                <ToProfile searchedUser={follower.sender} user={null} />
                <p>Followed You</p>
              </div>
            ))
          : ""}
      </div>
    );
  } else {
    window.location.href = "/login";
  }
};

export default Inbox;
