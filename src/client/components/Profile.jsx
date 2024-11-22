import { useOutletContext } from "react-router-dom";
import PostList from "./PostList";
import { useEffect, useState } from "react";
import styles from "../stylesheets/Profile.module.css";
import BackHeader from "./BackHeader";

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
              <header>
                <h1>{userProfile.username}</h1>
                <div className={styles.follow_container}>
                  <div className={styles.followers_container}>
                    <p>Followers</p>
                    <p>{userProfile.FollowedBy.length}</p>
                  </div>
                  <div className={styles.following_container}>
                    <p>Following</p>
                    <p>{userProfile.Following.length}</p>
                  </div>
                </div>
              </header>
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
            // <PostList
            //   user={user}
            //   displayLikes={displayLikes}
            //   setDisplayLikes={setDisplayLikes}
            //   displayComments={displayComments}
            //   setDisplayComments={setDisplayComments}
            //   mode={"profile"}
            //   userProfile={userProfile}
            //   setDisplayBackHeader={setDisplayBackHeader}
            // />
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
