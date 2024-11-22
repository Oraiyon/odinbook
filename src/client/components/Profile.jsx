import { useOutletContext } from "react-router-dom";
import PostList from "./PostList";
import { useEffect, useState } from "react";
import styles from "../stylesheets/Profile.module.css";
import BackHeader from "./BackHeader";
import Follows from "./Follows";

const Profile = () => {
  const [user, setUser, previousPage, setPreviousPage] = useOutletContext();

  const [userProfile, setUserProfile] = useState(null);
  const [displayLikes, setDisplayLikes] = useState(false);
  const [displayComments, setDisplayComments] = useState(false);
  const [displayBackHeader, setDisplayBackHeader] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await fetch(`/api/${window.location.pathname.split("/")[1]}/profile`);
        const data = await response.json();
        setUserProfile(data);
        // console.log(data);
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
          {displayBackHeader ? (
            <>
              <BackHeader mode={"profile"} previousPage={previousPage} />
              <Follows userProfile={user} />
            </>
          ) : (
            ""
          )}
          {!user ? (
            <PostList
              user={null}
              displayLikes={displayLikes}
              setDisplayLikes={setDisplayLikes}
              displayComments={displayComments}
              setDisplayComments={setDisplayComments}
              mode={"profile"}
              userProfile={userProfile}
              setDisplayBackHeader={setDisplayBackHeader}
            />
          ) : (
            ""
          )}
        </>
      ) : (
        ""
      )}
    </div>
  );
};

export default Profile;
