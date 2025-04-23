import { useEffect, useState } from "react";
import BackHeader from "./BackHeader";
import { Link, useOutletContext } from "react-router-dom";
import styles from "../stylesheets/AdminDisplayPost.module.css";
import Icon from "@mdi/react";
import { mdiCommentOutline } from "@mdi/js";
import DisplayDate from "./DisplayDate";

const AdminDisplayPost = () => {
  const [
    user,
    setUser,
    post,
    setPost,
    searchedUsers,
    setSearchedUsers,
    searchedUsersList,
    setSearchedUsersList
  ] = useOutletContext();

  const [displayPost, setDisplayPost] = useState(null);

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const postId = window.location.href.split("/");
        const response = await fetch(`/api/get/${postId[postId.length - 1]}`);
        const data = await response.json();
        setDisplayPost(data);
      } catch (error) {
        console.log(error);
      }
    };
    fetchPost();
  }, []);

  if (user && user.admin) {
    return (
      <div className={styles.adminDisplayPost_container}>
        <BackHeader />
        {displayPost ? (
          <div className={styles.post_container}>
            <button>Delete Post</button>
            <h1>{displayPost.author.username}</h1>
            <img src={displayPost.image}></img>
            <p>{displayPost.text}</p>
            <Link to={`/admin/${user.id}/post/${displayPost.id}/comments`}>
              <Icon path={mdiCommentOutline} className={styles.post_icon}></Icon>
              <p>{displayPost.Comments.length}</p>
            </Link>
            <DisplayDate date={displayPost.postDate} />
          </div>
        ) : (
          ""
        )}
      </div>
    );
  } else {
    window.location.href = "/login";
  }
};

export default AdminDisplayPost;
