import { useEffect, useState } from "react";
import styles from "../stylesheets/AdminSearchPosts.module.css";

const AdminSearchPost = (props) => {
  const [postList, setPostList] = useState([]);
  const [deletedPostIds, setDeletedPostIds] = useState([]);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await fetch(`/api/admin/search/post/${props.searchedText}/text`);
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
    if (props.searchedText) {
      fetchPosts();
    } else {
      fetchAllPosts();
    }
  }, [props.searchedText]);

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
          const response = await fetch(`/api/${selectedUser.id}/delete/${deletedPostIds[i]}`, {
            method: "DELETE"
          });
          data = await response.json();
        }
        setSelectedUserPostList(data);
        setDeletedPostIds([]);
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className={styles.search_post_container}>
      <form className={styles.admin_form}>
        <label htmlFor="searchPost"></label>
        <input
          type="text"
          id="searchPost"
          placeholder="Search Post"
          onChange={(e) => props.setSearchedText(e.target.value)}
        />
      </form>
      <p>Posts To Be Deleted: {deletedPostIds.length}</p>
      <button onClick={handlePostDelete}>Delete</button>
      <div className={styles.postList}>
        {postList.map((post) => (
          <div
            key={post.id}
            className={deletedPostIds.includes(post.id) ? styles.selected_post_card : ""}
            onClick={() => handleSelectPost(post.id)}
          >
            <p>{post.author.username}</p>
            <img src={post.image} alt="" />
            <p>{post.text}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdminSearchPost;
