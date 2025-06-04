import { useEffect, useState } from "react";
import styles from "../stylesheets/Inbox.module.css";
import { useOutletContext } from "react-router-dom";
import ToProfile from "./ToProfile";

const Inbox = () => {
  const [user, setUser, post, setPost] = useOutletContext();

  const [inbox, setInbox] = useState([]);

  useEffect(() => {
    const fetchInbox = async () => {
      try {
        const response = await fetch(`/api/${user.id}/inbox`);
        const data = await response.json();
        setInbox(data);
      } catch (error) {
        console.log(error);
      }
    };
    if (user) {
      fetchInbox();
    }
  }, []);

  if (user) {
    return (
      <div className={styles.inbox_container}>
        {inbox.length
          ? inbox.map((follower) => (
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
