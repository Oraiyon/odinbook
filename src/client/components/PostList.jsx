import { useEffect, useState } from "react";
import styles from "../stylesheets/PostList.module.css";
import Icon from "@mdi/react";
import { mdiArrowLeft } from "@mdi/js";

const PostList = (props) => {
  // props.user for displaying following posts or separate component?
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

  const DisplayPostDate = (props) => {
    const date = new Date(props.postDate);
    const options = {
      month: "short",
      day: "numeric",
      year: "numeric"
    };
    return <p>{date.toLocaleDateString("en-us", options)}</p>;
  };

  const displayLikesModal = (likes) => {
    if (likes.length) {
      if (!props.displayLikes) {
        props.setDisplayLikes(true);
      } else {
        props.setDisplayLikes(false);
      }
    }
  };

  return (
    <>
      {postList ? (
        postList.map((post) => (
          <div key={post.id} className={styles.post_container}>
            {!props.displayLikes ? (
              <div className={styles.post_card}>
                <p>{post.author.username}</p>
                <p>{post.text}</p>
                <p onClick={() => displayLikesModal(post.Likes)}>
                  {post.Likes.length} {post.Likes.length !== 1 ? "Likes" : "Like"}
                </p>
                <p>View {post.Comments.length} comments</p>
                <DisplayPostDate postDate={post.postDate} />
              </div>
            ) : (
              ""
            )}
            {props.displayLikes ? (
              <div className={styles.likes_container}>
                <div>
                  <Icon path={mdiArrowLeft} onClick={() => displayLikesModal()} />
                  <p>{post.text}</p>
                </div>
              </div>
            ) : (
              ""
            )}
          </div>
        ))
      ) : (
        <p>No posts found</p>
      )}
    </>
  );
};

export default PostList;
