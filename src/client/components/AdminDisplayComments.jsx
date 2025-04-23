import { useOutletContext } from "react-router-dom";
import styles from "../stylesheets/AdminDisplayComments.module.css";
import { useEffect, useState } from "react";
import BackHeader from "./BackHeader";
import DisplayDate from "./DisplayDate";

const AdminDisplayComments = () => {
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
  const [deletedCommentIds, setDeletedCommentIds] = useState([]);

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const postId = window.location.href.split("/");
        const response = await fetch(`/api/get/${postId[postId.length - 2]}`);
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

  const handleSelectPost = (id) => {
    for (let i = 0; i < deletedCommentIds.length; i++) {
      if (deletedCommentIds[i] === id) {
        const newArray = deletedCommentIds.filter((item) => item !== id);
        setDeletedCommentIds(newArray);
        return;
      }
    }
    setDeletedCommentIds((d) => [...d, id]);
  };

  const handleCommentDelete = async () => {
    try {
      if (deletedCommentIds.length) {
        let data;
        for (let i = 0; i < deletedCommentIds.length; i++) {
          const response = await fetch(
            `/api/admin/${user.id}/delete/comment/${deletedCommentIds[i]}`,
            {
              method: "DELETE"
            }
          );
          data = await response.json();
        }
        if (data) {
          setCommentList(data);
          setDeletedCommentIds([]);
        }
      }
    } catch (error) {
      console.log(error);
    }
  };

  if (user && user.admin) {
    return (
      <div className={styles.adminDisplayComments_container}>
        <BackHeader />
        <div className={styles.comment_section}>
          <label htmlFor="comments_search"></label>
          <input
            type="text"
            id="comments_search"
            placeholder="Search Comment"
            onChange={(e) => handleCommentSearch(e.target.value)}
          />
          <button onClick={handleCommentDelete}>Delete Selected Comments</button>
          <div className={styles.comment_list}>
            {displayComments.map((comment) => (
              <div key={comment.id} className={styles.comment}>
                <div>
                  <input type="checkbox" onClick={() => handleSelectPost(comment.id)} />
                  <p>{comment.author.username}</p>
                </div>
                <p>{comment.text}</p>
                <DisplayDate date={comment.commentDate} />
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  } else {
    window.location.href = "/login";
  }
};

export default AdminDisplayComments;
