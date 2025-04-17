import { useOutletContext } from "react-router-dom";
import styles from "../stylesheets/AdminComments.module.css";
import BackHeader from "./BackHeader";
import { useEffect, useState } from "react";
import DisplayDate from "./DisplayDate";

const AdminComments = () => {
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
        `/api/admin/search/${window.location.pathname.split("/")[2]}/comment/user`
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
        const response = await fetch(`/api/${window.location.pathname.split("/")[2]}/profile`);
        const data = await response.json();
        setUserInfo(data);
      } catch (error) {
        console.log(error);
      }
    };
    fetchUser();
    fetchUserComments();
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
      <div className={styles.adminComments_container}>
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
        <div className={styles.adminComments_button}>
          <button onClick={handleCommentDelete}>Delete</button>
        </div>
        <div className={styles.adminComments_list}>
          {commentList.map((comment) => (
            <div key={comment.id}>
              <input type="checkbox" onClick={() => handleSelectPost(comment.id)} />
              <p>{comment.text}</p>
              <DisplayDate date={comment.commentDate} />
            </div>
          ))}
        </div>
      </div>
    );
  } else {
    window.location.href = "/login";
  }
};

export default AdminComments;
