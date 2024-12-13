import { useEffect, useRef, useState } from "react";
import styles from "../stylesheets/PostList.module.css";
import ToProfile from "./ToProfile";
import { Link } from "react-router-dom";

const PostList = (props) => {
  const [postList, setPostList] = useState([]);

  const commentsLink = useRef(null);
  const likesLink = useRef(null);

  useEffect(() => {
    const getPosts = async () => {
      try {
        let response;
        if (props.mode === "search") {
          response = await fetch("/api/get/posts");
          // For User.jsx
        } else if (props.mode === "profile" && props.user) {
          response = await fetch(`/api/${props.user.id}/get/posts`);
          // For Profile.jsx
        } else if (props.mode === "profile" && props.userProfile) {
          response = await fetch(`/api/${props.userProfile.id}/get/posts`);
        }
        const data = await response.json();
        setPostList(data);
      } catch (error) {
        console.log(error);
      }
    };
    getPosts();
  }, []);

  const DisplayDate = (props) => {
    const date = new Date(props.date);
    const options = {
      month: "short",
      day: "numeric",
      year: "numeric"
    };
    return <p className={styles.post_date}>{date.toLocaleDateString("en-us", options)}</p>;
  };

  const displayLikes = (post) => {
    props.setPost(post);
    likesLink.current.click();
  };

  const likePost = async (postId) => {
    try {
      if (props.user) {
        const response = await fetch(`/api/${props.user.id}/like/post`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            id: props.user.id,
            post: postId,
            page: "search"
          })
        });
        const data = await response.json();
        setPostList(data);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const displayComments = async (post) => {
    props.setPost(post);
    commentsLink.current.click();
  };

  return (
    <>
      {postList && postList.length ? (
        postList.map((post) => (
          <div key={post.id} className={styles.post_container}>
            {!props.displayLikes && !props.displayComments ? (
              <div className={styles.post_card}>
                {props.mode !== "profile" ? (
                  <ToProfile searchedUser={post.author} user={props.user} />
                ) : (
                  <ToProfile searchedUser={post.author} mode={"profile"} />
                )}
                <p onClick={() => likePost(post.id)}>{post.text}</p>
                <p onClick={() => displayLikes(post)}>
                  {post.Likes.length} {post.Likes.length !== 1 ? "Likes" : "Like"}
                </p>
                <Link to={`/${post.id}/likes`} ref={likesLink} />
                <p onClick={() => displayComments(post)}>
                  View {post._count.Comments} {post._count.Comments !== 1 ? "Comments" : "Comment"}
                </p>
                <Link to={`/${post.id}/comments`} ref={commentsLink} />
                <DisplayDate date={post.postDate} />
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
