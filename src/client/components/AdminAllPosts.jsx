import { useEffect, useRef, useState } from "react";
import styles from "../stylesheets/AdminAllPosts.module.css";
import { Link, useOutletContext } from "react-router-dom";
import AdminNavbar from "./AdminNavbar";

const AdminAllPosts = () => {
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

  const postLinkRef = useRef(null);

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
        const response = await fetch("/api/admin/get/posts");
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

  const handleSelectPost = (e, post) => {
    e.stopPropagation();
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
          <p>Posts Selected: {deletedPosts.length}</p>
          <button onClick={handlePostDelete}>Delete Selected Posts</button>
          <div className={styles.postList}>
            {postList.length ? (
              postList.map((post) => (
                <div key={post.id}>
                  <div>
                    <Link to={`/admin/${user.id}/${post.authorId}/posts`}>
                      {post.author.username}
                    </Link>
                    <input type="checkbox" onClick={(e) => handleSelectPost(e, post)} />
                  </div>
                  <Link to={`/admin/${user.id}/post/${post.id}`}>
                    <img src={post.image} alt="" />
                  </Link>
                  <p>{post.text}</p>
                </div>
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

export default AdminAllPosts;
