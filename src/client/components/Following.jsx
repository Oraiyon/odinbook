import styles from "../stylesheets/Following.module.css";
import { useEffect, useState } from "react";
import { useOutletContext } from "react-router-dom";
import ToProfile from "./ToProfile";
import BackHeader from "./BackHeader";

const Following = () => {
  const [user, setUser, post, setPost] = useOutletContext();

  const [userFollowing, setUserFollowing] = useState([]);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await fetch(`/api/${window.location.pathname.split("/")[1]}/following`);
        const data = await response.json();
        setUserFollowing(data);
      } catch (error) {
        console.log(error);
      }
    };
    fetchUser();
  }, []);

  const HandleUnfollowButton = (props) => {
    const [following, setFollowing] = useState(true);

    const handleUnfollow = async () => {
      try {
        const response = await fetch(
          `/api/delete/follow/${props.user.id}/${props.userProfile.receiverId}`,
          {
            method: "DELETE"
          }
        );
        const data = await response.json();
        if (data) {
          setFollowing(false);
        }
      } catch (error) {
        console.log(error);
      }
    };

    const handleFollow = async () => {
      try {
        const response = await fetch("/api/send/follow", {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            sender: props.user.id,
            receiver: props.userProfile.receiverId
          })
        });
        const data = await response.json();
        if (data) {
          setFollowing(true);
        }
      } catch (error) {
        console.log(error);
      }
    };

    if (props.user) {
      if (following) {
        return <button onClick={handleUnfollow}>Unfollow</button>;
      } else {
        return <button onClick={handleFollow}>Follow</button>;
      }
    }
  };

  if (userFollowing.length) {
    return (
      <>
        <div className={styles.following_container}>
          <BackHeader mode={"profile"} />
          <div className={styles.following_list}>
            {userFollowing.map((follow) => (
              <div key={follow.id} className={styles.following_card}>
                <ToProfile searchedUser={follow} user={null} />
                <HandleUnfollowButton user={user} setUser={setUser} userProfile={follow} />
              </div>
            ))}
          </div>
        </div>
      </>
    );
  } else {
    return (
      <>
        <div className={styles.following_container}>
          <BackHeader mode={"profile"} />
          <p>No Followed Accounts</p>
        </div>
      </>
    );
  }
};

export default Following;
