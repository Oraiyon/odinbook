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
    setSearchedUsersList,
    selectedUser,
    setSelectedUser,
    selectedUserPostList,
    setSelectedUserPostList,
    selectedUserCommentList,
    setSelectedUserCommentList
  ] = useOutletContext();

  const [deletedPostIds, setDeletedPostIds] = useState([]);

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
          const res = await fetch(`/api/${selectedUser.id}/delete/${deletedPostIds[i]}/user`, {
            method: "DELETE"
          });
          data = await res.json();
        }
        setSelectedUserPostList(data);
        setDeletedPostIds([]);
      }
    } catch (error) {
      console.log(error);
    }
  };

  if (user && user.admin && selectedUser) {
    return (
      <div className={styles.adminPosts_container}>
        <BackHeader />
        <div className={styles.adminPosts_info}>
          <h1>{selectedUser.username}'s Posts</h1>
          <div className={styles.delete_posts}>
            <p>Posts To Be Deleted: {deletedPostIds.length}</p>
            <button onClick={handlePostDelete}>Delete</button>
          </div>
          <div className={styles.postList}>
            {selectedUserPostList.map((post) => (
              <div
                className={deletedPostIds.includes(post.id) ? styles.selected_post_card : ""}
                key={post.id}
                onClick={() => handleSelectPost(post.id)}
              >
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
