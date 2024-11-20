import { useOutletContext } from "react-router-dom";
import PostList from "./PostList";
import { useEffect, useState } from "react";
import styles from "../stylesheets/Profile.module.css";

const Profile = () => {
  const [user, setUser, previousPage, setPreviousPage] = useOutletContext();

  const [userProfile, setUserProfile] = useState(null);
  const [displayLikes, setDisplayLikes] = useState(false);
  const [displayComments, setDisplayComments] = useState(false);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await fetch(`/api/${window.location.pathname.split("/")[1]}/profile`);
        const data = await response.json();
        setUserProfile(data);
      } catch (error) {
        console.log(error);
      }
    };
    fetchUser();
  }, []);

  return (
    <div className={styles.profile_container}>
      {userProfile ? (
        <>
          <PostList
            // Change user to something else
            // Can still like even if not logged in.
            // Liking when in /:id/profile
            user={null}
            displayLikes={displayLikes}
            setDisplayLikes={setDisplayLikes}
            displayComments={displayComments}
            setDisplayComments={setDisplayComments}
            mode={"profile"}
            userProfile={userProfile}
          />
        </>
      ) : (
        ""
      )}
    </div>
  );
};

export default Profile;
