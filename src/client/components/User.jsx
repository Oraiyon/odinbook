import { useOutletContext } from "react-router-dom";
import PostList from "./PostList";
import ProfileHeader from "./ProfileHeader";
import styles from "../stylesheets/User.module.css";
import { useEffect } from "react";

const User = () => {
  const [user, setUser, post, setPost] = useOutletContext();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await fetch(`/api/${user.id}/profile`);
        const data = await response.json();
        setUser(data);
      } catch (error) {
        console.log(error);
      }
    };
    if (user) {
      fetchUser();
    }
  }, []);

  if (user) {
    return (
      <div className={styles.user_container}>
        <ProfileHeader userProfile={user} />
        <PostList user={user} mode={"profile"} post={post} setPost={setPost} userProfile={null} />
      </div>
    );
  } else {
    return <p></p>;
  }
};

export default User;
