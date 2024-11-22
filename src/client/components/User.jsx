import { useOutletContext } from "react-router-dom";
import PostList from "./PostList";
import { useState } from "react";
import Follows from "./Follows";
import styles from "../stylesheets/User.module.css";

const User = () => {
  const [user, setUser, previousPage, setPreviousPage] = useOutletContext();

  const [userProfile, setUserProfile] = useState(null);
  const [displayLikes, setDisplayLikes] = useState(false);
  const [displayComments, setDisplayComments] = useState(false);
  const [displayBackHeader, setDisplayBackHeader] = useState(true);

  if (user) {
    return (
      <div className={styles.user_container}>
        <Follows userProfile={user} />
        <PostList
          user={user}
          displayLikes={displayLikes}
          setDisplayLikes={setDisplayLikes}
          displayComments={displayComments}
          setDisplayComments={setDisplayComments}
          mode={"profile"}
          userProfile={user}
          setDisplayBackHeader={setDisplayBackHeader}
        />
      </div>
    );
  } else {
    return <p></p>;
  }
};

export default User;
