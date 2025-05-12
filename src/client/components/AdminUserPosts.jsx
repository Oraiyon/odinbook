import { Link, useOutletContext } from "react-router-dom";
import styles from "../stylesheets/AdminUserPosts.module.css";
import BackHeader from "./BackHeader";
import { useEffect, useState } from "react";

const AdminUserPosts = () => {
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
  const [postList, setPostList] = useState([]);
  const [deletedPostIds, setDeletedPostIds] = useState([]);

  const fetchUserPosts = async () => {
    try {
      const response = await fetch(
        `/api/admin/${window.location.pathname.split("/")[3]}/get/user/posts`
      );
      const data = await response.json();
      setPostList(data);
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
    fetchUserPosts();
  }, []);

  const handleSelectPost = (e, id) => {
    e.stopPropagation();
    for (let i = 0; i < deletedPostIds.length; i++) {
      if (deletedPostIds[i] === id) {
        const newArray = deletedPostIds.filter((item) => item !== id);
        setDeletedPostIds(newArray);
        return;
      }
    }
    setDeletedPostIds((d) => [...d, id]);
  };

  const handlePostDelete = async () => {
    try {
      if (deletedPostIds.length) {
        let data;
        for (let i = 0; i < deletedPostIds.length; i++) {
          const response = await fetch(`/api/${userInfo.id}/delete/${deletedPostIds[i]}/user`, {
            method: "DELETE"
          });
          data = await response.json();
        }
        setPostList(data);
        setDeletedPostIds([]);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handlePostSearch = async (text) => {
    try {
      if (!text) {
        fetchUserPosts();
      } else {
        const response = await fetch(`/api/admin/search/${userInfo.id}/${text}`);
        const data = await response.json();
        setPostList(data);
      }
    } catch (error) {
      console.log(error);
    }
  };

  if (user && user.admin) {
    return (
      <div className={styles.adminUserPosts_container}>
        <BackHeader />
        {userInfo ? <h1>{userInfo.username}'s Posts</h1> : ""}
        <form>
          <label htmlFor="post_search"></label>
          <input
            type="text"
            name="post_search"
            id="post_search"
            placeholder="Search Posts"
            onChange={(e) => handlePostSearch(e.target.value)}
          />
        </form>
        <div className={styles.adminUserPosts_info}>
          <p>Posts Selected: {deletedPostIds.length}</p>
          <button onClick={handlePostDelete}>Delete Selected Posts</button>
          <div className={styles.postList}>
            {postList.length ? (
              postList.map((post) => (
                <Link key={post.id} to={`/admin/${user.id}/post/${post.id}`}>
                  <input type="checkbox" onClick={(e) => handleSelectPost(e, post.id)} />
                  <img src={post.image} alt="" />
                  <p>{post.text}</p>
                </Link>
              ))
            ) : (
              <p>No Posts</p>
            )}
          </div>
        </div>
      </div>
    );
  } else {
    window.location.href = "/login";
  }
};

export default AdminUserPosts;
