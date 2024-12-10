import { useOutletContext } from "react-router-dom";
import PostList from "./PostList";
import { useState } from "react";
import Follows from "./Follows";
import styles from "../stylesheets/User.module.css";

const User = () => {
  const [user, setUser, post, setPost] = useOutletContext();

  // const [userProfile, setUserProfile] = useState(null);
  const [displayBackHeader, setDisplayBackHeader] = useState(true);

  if (user) {
    return (
      <div className={styles.user_container}>
        {displayBackHeader ? <Follows userProfile={user} /> : ""}
        <PostList
          user={user}
          mode={"profile"}
          post={post}
          setPost={setPost}
          userProfile={null}
          // setDisplayBackHeader={setDisplayBackHeader}
        />
      </div>
    );
  } else {
    return <p></p>;
  }
};

export default User;
