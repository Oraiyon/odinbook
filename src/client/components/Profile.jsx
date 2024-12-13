import { Link, useOutletContext } from "react-router-dom";
import PostList from "./PostList";
import { useEffect, useRef, useState } from "react";
import styles from "../stylesheets/Profile.module.css";
import BackHeader from "./BackHeader";
import ProfileHeader from "./ProfileHeader";

const Profile = () => {
  const [user, setUser, post, setPost] = useOutletContext();

  const [userProfile, setUserProfile] = useState(null);

  const linkToUserRef = useRef(null);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await fetch(`/api/${window.location.pathname.split("/")[1]}/profile`);
        const data = await response.json();
        setUserProfile(data);
        if (user && userProfile && user.id === userProfile.id) {
          linkToUserRef.current.click();
        }
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
          <BackHeader mode={"profile"} />
          <ProfileHeader user={user} userProfile={userProfile} />
          <PostList
            user={null}
            mode={"profile"}
            post={post}
            setPost={setPost}
            userProfile={userProfile}
          />
          <Link to={"/user"} ref={linkToUserRef} />
        </>
      ) : (
        ""
      )}
    </div>
  );
};

export default Profile;
