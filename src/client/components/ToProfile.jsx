import { Link } from "react-router-dom";
import styles from "../stylesheets/ToProfile.module.css";
import DisplayProfilePicture from "./DisplayProfilePicture";
import Icon from "@mdi/react";
import { mdiDotsHorizontal, mdiDelete } from "@mdi/js";

const ToProfile = (props) => {
  const DisplayPostHeader = () => {
    const deleteComment = async () => {
      try {
        const response = await fetch(
          `/api/${props.user.id}/delete/${props.comment.postId}/${props.comment.id}`,
          { method: "DELETE" }
        );
        const data = await response.json();
        if (data) {
          props.setPostComments(data);
        }
      } catch (error) {
        console.log(error);
      }
    };

    const DisplaySettings = () => {
      if (props.mode === "search" || props.mode === "likes") {
        return;
      } else if (props.mode === "comments" && props.comment.text !== "---Comment Deleted---") {
        return (
          <Icon
            path={mdiDelete}
            onClick={deleteComment}
            className={styles.header_delete_icon}
          ></Icon>
        );
      } else if (props.mode === "comments" && props.comment.text === "---Comment Deleted---") {
        return "";
      } else {
        return (
          <Icon
            path={mdiDotsHorizontal}
            onClick={() => props.setDisplayPostModal(props.post)}
          ></Icon>
        );
      }
    };

    return (
      <div className={styles.post_header}>
        <Link to={`/user`}>
          <div className={styles.user_card}>
            <DisplayProfilePicture user={props.searchedUser} />
            <p>{props.searchedUser.username}</p>
          </div>
        </Link>
        <DisplaySettings />
      </div>
    );
  };

  if (props.searchedUser.sender || props.searchedUser.receiver) {
    return (
      <>
        {!props.user || props.user.username !== props.searchedUser.username ? (
          <Link
            to={`/${props.searchedUser.sender ? props.searchedUser.sender.id : props.searchedUser.receiver.id}/profile`}
          >
            <div className={styles.user_card}>
              <DisplayProfilePicture
                user={
                  props.searchedUser.sender
                    ? props.searchedUser.sender
                    : props.searchedUser.receiver
                }
              />
              <p>
                {props.searchedUser.sender
                  ? props.searchedUser.sender.username
                  : props.searchedUser.receiver.username}
              </p>
            </div>
          </Link>
        ) : (
          <DisplayPostHeader />
        )}
      </>
    );
  } else {
    return (
      <>
        {!props.user || props.user.username !== props.searchedUser.username ? (
          <Link to={`/${props.searchedUser.id}/profile`}>
            <div className={styles.user_card}>
              <DisplayProfilePicture user={props.searchedUser} />
              <p>{props.searchedUser.username}</p>
            </div>
          </Link>
        ) : (
          <DisplayPostHeader />
        )}
      </>
    );
  }
};

export default ToProfile;
