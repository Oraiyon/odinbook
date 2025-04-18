import { useEffect, useState } from "react";
import styles from "../stylesheets/AdminSearchPosts.module.css";
import { Link, useOutletContext } from "react-router-dom";
import BackHeader from "./BackHeader";
import AdminNavbar from "./AdminNavbar";

const AdminSearchPost = () => {
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

  const [postList, setPostList] = useState([]);
  const [deletedPosts, setDeletedPosts] = useState([]);
  const [deletePostsId, setDeletedPostsId] = useState([]);
  const [searchedText, setSearchedText] = useState("");

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await fetch(`/api/admin/search/post/${searchedText}/text`);
        const data = await response.json();
        setPostList(data);
      } catch (error) {
        console.log(error);
      }
    };
    const fetchAllPosts = async () => {
      try {
        const response = await fetch("/api/get/posts");
        const data = await response.json();
        setPostList(data);
      } catch (error) {
        console.log(error);
      }
    };
    if (searchedText) {
      fetchPosts();
    } else {
      fetchAllPosts();
    }
  }, [searchedText]);

  const handleSelectPost = (post) => {
    for (let i = 0; i < deletedPosts.length; i++) {
      if (deletedPosts[i].id === post.id) {
        const newArray = deletedPosts.filter((item) => item.id !== post.id);
        const newArrayId = deletePostsId.filter((item) => item !== post.id);
        setDeletedPosts(newArray);
        setDeletedPostsId(newArrayId);
        return;
      }
    }
    setDeletedPosts((d) => [...d, post]);
    setDeletedPostsId((d) => [...d, post.id]);
  };

  const handlePostDelete = async () => {
    try {
      if (deletedPosts.length) {
        let data;
        for (let i = 0; i < deletedPosts.length; i++) {
          const response = await fetch(
            `/api/${deletedPosts[i].authorId}/delete/${deletedPosts[i].id}`,
            {
              method: "DELETE"
            }
          );
          data = await response.json();
        }
        setPostList(data);
        setDeletedPosts([]);
      }
    } catch (error) {
      console.log(error);
    }
  };

  if (user && user.admin) {
    return (
      <div className={styles.search_post_container}>
        <AdminNavbar user={user} />
        <div>
          <form className={styles.admin_form}>
            <label htmlFor="searchPost"></label>
            <input
              type="text"
              id="searchPost"
              placeholder="Search Post"
              onChange={(e) => setSearchedText(e.target.value)}
            />
          </form>
          <p>Posts To Be Deleted: {deletedPosts.length}</p>
          <button onClick={handlePostDelete}>Delete</button>
          <div className={styles.postList}>
            {postList.map((post) => (
              <div key={post.id}>
                <div>
                  <p>{post.author.username}</p>
                  <input type="checkbox" onClick={() => handleSelectPost(post)} />
                </div>
                <img src={post.image} alt="" />
                <p>{post.text}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }
};

export default AdminSearchPost;
