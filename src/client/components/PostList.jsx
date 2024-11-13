import { useEffect, useState } from "react";
import styles from "../stylesheets/PostList.module.css";

const PostList = (props) => {
  // props.user for following or separate component?
  const [postList, setPostList] = useState([]);

  useEffect(() => {
    const getPosts = async () => {
      try {
        const response = await fetch("/api/get/posts");
        const data = await response.json();
        setPostList(data);
      } catch (error) {
        console.log(error);
      }
    };
    getPosts();
  }, []);

  return (
    <div className={styles.post_container}>
      {postList
        ? postList.map((post) => (
            <div key={post.id} className={styles.post_card}>
              <p>{post.author.username}</p>
              <p>{post.text}</p>
              <p>{post.Likes.length} Likes</p>
              <p>{post.Comments.length} Comments</p>
            </div>
          ))
        : ""}
    </div>
  );
};

export default PostList;
