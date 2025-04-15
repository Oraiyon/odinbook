import { useOutletContext } from "react-router-dom";
import PostList from "./PostList";
import { useEffect, useState } from "react";
import styles from "../stylesheets/Profile.module.css";
import BackHeader from "./BackHeader";
import ProfileHeader from "./ProfileHeader";

const Profile = () => {
  const [user, setUser, post, setPost] = useOutletContext();

  const [userProfile, setUserProfile] = useState(null);
  const [updateUserInfo, setUpdateUserInfo] = useState(false);

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const response = await fetch(`/api/${window.location.pathname.split("/")[1]}/profile`);
        const data = await response.json();
        setUserProfile(data);
      } catch (error) {
        console.log(error);
      }
    };
    fetchUserProfile();
  }, [updateUserInfo]);

  return (
    <div className={styles.profile_container}>
      {userProfile ? (
        <>
          <BackHeader mode={"profile"} />
          <ProfileHeader
            user={user}
            setUser={setUser}
            userProfile={userProfile}
            setUpdateUserInfo={setUpdateUserInfo}
          />
          <PostList
            user={user}
            mode={"profile"}
            post={post}
            setPost={setPost}
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
