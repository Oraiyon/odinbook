import { Link, useOutletContext } from "react-router-dom";
import styles from "../stylesheets/AdminUserComments.module.css";
import BackHeader from "./BackHeader";
import { useEffect, useState } from "react";
import DisplayDate from "./DisplayDate";

const AdminUserComments = () => {
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

  const [userInfo, setUserInfo] = useState("");
  const [commentList, setCommentList] = useState([]);
  const [deletedCommentIds, setDeletedCommentIds] = useState([]);

  const fetchUserComments = async () => {
    try {
      const response = await fetch(
        `/api/admin/search/${window.location.pathname.split("/")[3]}/comment/user`
      );
      const data = await response.json();
      setCommentList(data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await fetch(`/api/${window.location.pathname.split("/")[3]}/profile`);
        const data = await response.json();
        setUserInfo(data);
      } catch (error) {
        console.log(error);
      }
    };
    fetchUser();
    fetchUserComments();
  }, []);

  const handleSelectPost = (e, id) => {
    e.stopPropagation();
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
        fetchUserComments();
      } else {
        const response = await fetch(`/api/admin/search/${userInfo.id}/${text}/comment`);
        const data = await response.json();
        setCommentList(data);
      }
    } catch (error) {
      console.log(error);
    }
  };

  if (user && user.admin) {
    return (
      <div className={styles.adminUserComments_container}>
        <BackHeader />
        {userInfo ? <h1>{userInfo.username}'s Comments</h1> : ""}
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
        <div className={styles.adminUserComments_button}>
          <button onClick={handleCommentDelete}>Delete Selected Comments</button>
        </div>
        <div className={styles.adminUserComments_list}>
          {commentList.length ? (
            commentList.map((comment) => (
              <Link key={comment.id} to={`/admin/${user.id}/post/${comment.postId}`}>
                <input type="checkbox" onClick={(e) => handleSelectPost(e, comment.id)} />
                <p>{comment.text}</p>
                <DisplayDate date={comment.commentDate} />
              </Link>
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

export default AdminUserComments;
