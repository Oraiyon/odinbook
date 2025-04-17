import { useOutletContext } from "react-router-dom";
import styles from "../stylesheets/AdminPosts.module.css";
import BackHeader from "./BackHeader";
import { useEffect, useState } from "react";

const AdminPosts = () => {
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
      const response = await fetch(`/api/${window.location.pathname.split("/")[3]}/get/posts`);
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

  const handleSelectPost = (id) => {
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
      <div className={styles.adminPosts_container}>
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
        <div className={styles.adminPosts_info}>
          <p>Posts To Be Deleted: {deletedPostIds.length}</p>
          <button onClick={handlePostDelete}>Delete</button>
          <div className={styles.postList}>
            {postList.map((post) => (
              <div key={post.id}>
                <input type="checkbox" onClick={() => handleSelectPost(post.id)} />
                <img src={post.image} alt="" />
                <p>{post.text}</p>
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

export default AdminPosts;
