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
            `/api/admin/${user.id}/delete/comment/${deletedCommentIds[i]}/post/${displayPost.id}`,
            {
              method: "DELETE"
            }
          );
          data = await response.json();
        }
        if (data) {
          setDisplayComments(data);
          setDeletedCommentIds([]);
        }
      }
    } catch (error) {
      console.log(error);
    }
  };

  if (user && user.admin) {
    return (
      <div className={styles.adminComments_container}>
        <BackHeader />
        <form>
          <label htmlFor="comments_search"></label>
          <input
            type="text"
            name="comments_search"
            id="comments_search"
            placeholder="Search Comments"
            onChange={(e) => handleCommentSearch(e.target.value)}
          />
        </form>
        <p>Comments Selected: {deletedCommentIds.length ? deletedCommentIds.length : 0}</p>
        <div className={styles.adminComments_button}>
          <button onClick={handleCommentDelete}>Delete Selected Comments</button>
        </div>
        <div className={styles.adminComments_list}>
          {displayComments.length ? (
            displayComments.map((comment) => (
              <div key={comment.id} className={styles.comment_card}>
                <div>
                  <input type="checkbox" onClick={() => handleSelectPost(comment.id)} />
                  <p>{comment.author.username}</p>
                </div>
                <div>
                  <p>{comment.text}</p>
                  <DisplayDate date={comment.commentDate} />
                </div>
              </div>
            ))
          ) : (
            <p>No Comments</p>
          )}
        </div>
      </div>
    );
  } else {
    window.location.href = "/login";
  }
};

export default AdminDisplayComments;
