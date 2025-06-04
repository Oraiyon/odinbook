import { Link, useOutletContext } from "react-router-dom";
import styles from "../stylesheets/AdminAllComments.module.css";
import { useEffect, useState } from "react";
import DisplayDate from "./DisplayDate";
import AdminNavbar from "./AdminNavbar";

const AdminAllComments = () => {
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

  const [commentList, setCommentList] = useState([]);
  const [deletedCommentIds, setDeletedCommentIds] = useState([]);

  const fetchAllComments = async () => {
    try {
      const response = await fetch("/api/admin/get/all/comments");
      const data = await response.json();
      setCommentList(data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchAllComments();
  }, []);

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

  const handleCommentSearch = async (text) => {
    try {
      if (!text) {
        fetchAllComments();
      } else {
        const response = await fetch(`/api/admin/get/all/comments/search/${text}`);
        const data = await response.json();
        console.log(data);
        setCommentList(data);
      }
    } catch (error) {
      console.log(error);
    }
  };

  if (user && user.admin) {
    return (
      <div className={styles.adminComments_container}>
        <AdminNavbar user={user} />
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
          {commentList.length ? (
            commentList.map((comment) => (
              <div key={comment.id} className={styles.comment_card}>
                <div>
                  <input type="checkbox" onClick={() => handleSelectPost(comment.id)} />
                  <Link to={`/admin/${user.id}/${comment.authorId}/comments`}>
                    {comment.author.username}
                  </Link>
                </div>
                <Link to={`/admin/${user.id}/post/${comment.postId}`}>
                  <p>{comment.text}</p>
                  <DisplayDate date={comment.commentDate} />
                </Link>
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

export default AdminAllComments;
