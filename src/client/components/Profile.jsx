import { Link, useOutletContext } from "react-router-dom";
import PostList from "./PostList";
import { useEffect, useRef, useState } from "react";
import styles from "../stylesheets/Profile.module.css";
import BackHeader from "./BackHeader";
import ProfileHeader from "./ProfileHeader";

const Profile = () => {
  const [user, setUser, post, setPost] = useOutletContext();

  const [userProfile, setUserProfile] = useState(null);
  const [updateUserInfo, setUpdateUserInfo] = useState(false);

  const linkToUserRef = useRef(null);

  useEffect(() => {
    const fetchUserProfile = async () => {
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
    const fetchUser = async () => {
      try {
        const response = await fetch(`/api/${user.id}/profile`);
        const data = await response.json();
        setUser(data);
      } catch (error) {
        console.log(error);
      }
    };
    fetchUserProfile();
    if (user) {
      fetchUser();
    }
  }, [updateUserInfo]);

  return (
    <div className={styles.profile_container}>
      {userProfile ? (
        <>
          <BackHeader mode={"profile"} />
          <ProfileHeader
            user={user}
            userProfile={userProfile}
            setUpdateUserInfo={setUpdateUserInfo}
          />
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
