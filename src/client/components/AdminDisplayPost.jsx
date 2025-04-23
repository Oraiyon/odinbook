import { useEffect, useState } from "react";
import BackHeader from "./BackHeader";
import { useOutletContext } from "react-router-dom";
import styles from "../stylesheets/AdminDisplayPost.module.css";
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
  const [displayComments, setDisplayComments] = useState([]);

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const postId = window.location.href.split("/");
        const response = await fetch(`/api/get/${postId[postId.length - 1]}`);
        const data = await response.json();
        // console.log(data);
        setDisplayPost(data);
        setDisplayComments(data.Comments);
      } catch (error) {
        console.log(error);
      }
    };
    fetchPost();
  }, []);

  const handleCommentSearch = async (text) => {
    try {
      if (!text) {
        setDisplayComments(displayPost.Comments);
      } else {
        const response = await fetch(`/api/admin/search/post/${displayPost.id}/comment/${text}`);
        const data = await response.json();
        setDisplayComments(data);
      }
    } catch (error) {
      console.log(error);
    }
  };

  if (user && user.admin) {
    return (
      <div className={styles.adminDisplayPost_container}>
        <BackHeader />
        {displayPost && displayComments ? (
          <div className={styles.post_container}>
            <label htmlFor="comments_search"></label>
            <input
              type="text"
              id="comments_search"
              placeholder="Search Comment"
              onChange={(e) => handleCommentSearch(e.target.value)}
            />
            <button>Delete Post</button>
            <p>{displayPost.author.username}</p>
            <img src={displayPost.image}></img>
            <p>{displayPost.text}</p>
            <div>
              {displayComments.map((comment) => (
                <div key={comment.id} className={styles.comment}>
                  <p>{comment.author.username}</p>
                  <p>{comment.text}</p>
                  <DisplayDate date={comment.commentDate} />
                </div>
              ))}
            </div>
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
