import { useEffect, useState } from "react";
import { useOutletContext } from "react-router-dom";
import styles from "../stylesheets/Followers.module.css";
import ToProfile from "./ToProfile";
import BackHeader from "./BackHeader";

const Followers = () => {
  const [user, setUser, post, setPost] = useOutletContext();

  const [userFollowers, setUserFollowers] = useState([]);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await fetch(`/api/${window.location.pathname.split("/")[1]}/followers`);
        const data = await response.json();
        setUserFollowers(data);
      } catch (error) {
        console.log(error);
      }
    };
    fetchUser();
  }, []);

  if (userFollowers.length) {
    return (
      <>
        <div className={styles.followers_container}>
          <BackHeader mode={"profile"} />
          <div className={styles.followers_list}>
            {userFollowers.map((follow) => (
              <div key={follow.id} className={styles.followers_card}>
                <ToProfile searchedUser={follow} user={null} />
              </div>
            ))}
          </div>
        </div>
      </>
    );
  } else {
    return (
      <>
        <div className={styles.followers_container}>
          <BackHeader mode={"profile"} />
          <p>No Followers</p>
        </div>
      </>
    );
  }
};

export default Followers;
