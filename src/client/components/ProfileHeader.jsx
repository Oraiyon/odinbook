import { useEffect, useRef, useState } from "react";
import styles from "../stylesheets/ProfileHeader.module.css";
import Follows from "./Follows";
import { Link } from "react-router-dom";
import DisplayProfilePicture from "./DisplayProfilePicture";
import Icon from "@mdi/react";
import { mdiDotsHorizontal } from "@mdi/js";

const ProfileHeader = (props) => {
  const [alreadyFollowing, setAlreadyFollowing] = useState(false);

  const settingsLinkRef = useRef(null);

  useEffect(() => {
    const fetchFollow = async () => {
      try {
        const response = await fetch(`/api/${props.user.id}/following/${props.userProfile.id}`);
        const data = await response.json();
        if (data) {
          setAlreadyFollowing(true);
        }
      } catch (error) {
        console.log(error);
      }
    };
    if (props.user) {
      fetchFollow();
    }
  }, []);

  const handleFollow = async () => {
    try {
      const response = await fetch("/api/send/follow", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          sender: props.user.id,
          receiver: props.userProfile.id
        })
      });
      const data = await response.json();
      if (data) {
        setAlreadyFollowing(true);
        props.setUpdateUserInfo((u) => !u);
        props.setUser(data);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleUnfollow = async () => {
    try {
      const response = await fetch(`/api/delete/follow/${props.user.id}/${props.userProfile.id}`, {
        method: "DELETE"
      });
      const data = await response.json();
      if (data) {
        setAlreadyFollowing(false);
        props.setUpdateUserInfo((u) => !u);
        props.setUser(data);
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <header className={styles.header_container}>
      <div className={styles.header_user_info}>
        <h1>{props.userProfile.username}</h1>
        {props.mode === "user" ? (
          <Icon
            path={mdiDotsHorizontal}
            onClick={() => settingsLinkRef.current.click()}
            className={styles.header_settings_icon}
          />
        ) : (
          <p className={styles.header_settings_icon}></p>
        )}
        <DisplayProfilePicture user={props.userProfile} />
        <Follows user={props.user} userProfile={props.userProfile} />
      </div>
      {props.user ? (
        <>
          <button onClick={alreadyFollowing ? handleUnfollow : handleFollow}>
            {alreadyFollowing ? "Unfollow" : "Follow"}
          </button>
        </>
      ) : (
        ""
      )}
      <Link to={"/user/settings"} ref={settingsLinkRef} />
    </header>
  );
};

export default ProfileHeader;
