import { useEffect, useRef, useState } from "react";
import styles from "../stylesheets/PostList.module.css";
import BackHeader from "./BackHeader";

const PostList = (props) => {
  // props.user for displaying following posts or separate component?
  const [postList, setPostList] = useState([]);
  const [postComments, setPostComments] = useState([]);

  const commentInputRef = useRef(null);

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

  const DisplayDate = (props) => {
    const date = new Date(props.date);
    const options = {
      month: "short",
      day: "numeric",
      year: "numeric"
    };
    return <p>{date.toLocaleDateString("en-us", options)}</p>;
  };

  const displayLikesModal = () => {
    if (!props.displayLikes) {
      props.setDisplayLikes(true);
    } else {
      props.setDisplayLikes(false);
    }
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

  const displayCommentsModal = async (id) => {
    try {
      if (!props.displayComments) {
        const response = await fetch(`/api/get/${id}/comments`);
        const data = await response.json();
        setPostComments(data);
        props.setDisplayComments(true);
      } else {
        props.setDisplayComments(false);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const sendComment = async (id) => {
    try {
      const response = await fetch("/api/post/create/comment", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          author: props.user.id,
          text: commentInputRef.current.value,
          post: id
        })
      });
      const data = await response.json();
      setPostComments(data);
      commentInputRef.current.value = "";
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <>
      {postList ? (
        postList.map((post) => (
          <div key={post.id} className={styles.post_container}>
            {!props.displayLikes && !props.displayComments ? (
              <div className={styles.post_card}>
                <p>{post.author.username}</p>
                <p onClick={() => likePost(post.id)}>{post.text}</p>
                <p onClick={displayLikesModal}>
                  {post.Likes.length} {post.Likes.length !== 1 ? "Likes" : "Like"}
                </p>
                <p onClick={displayCommentsModal}>
                  View {post._count.Comments} {post._count.Comments !== 1 ? "Comments" : "Comment"}
                </p>
                <DisplayDate date={post.postDate} />
              </div>
            ) : (
              ""
            )}
            {props.displayLikes ? (
              <div className={styles.likes_container}>
                <BackHeader
                  post={post}
                  displayLikesModal={() => displayLikesModal(post.id)}
                  mode={"likes"}
                />
                {post.Likes.length ? (
                  post.Likes.map((like) => <p key={like.id}>{like.likedBy.username}</p>)
                ) : (
                  <p>No likes.</p>
                )}
              </div>
            ) : (
              ""
            )}
            {props.displayComments ? (
              <div className={styles.comments_container}>
                <div>
                  <BackHeader
                    post={post}
                    displayCommentsModal={displayCommentsModal}
                    mode={"comments"}
                  />
                  {postComments.length ? (
                    postComments.map((comment) => (
                      <div key={comment.id} className={styles.comment_card}>
                        <div>
                          <p>{comment.author.username}</p>
                          <DisplayDate date={comment.commentDate} />
                        </div>
                        <p>{comment.text}</p>
                      </div>
                    ))
                  ) : (
                    <p>No Comments.</p>
                  )}
                </div>
                {props.user ? (
                  <div>
                    <label htmlFor="commentInput"></label>
                    <input
                      type="text"
                      id="commentInput"
                      placeholder="Add a comment"
                      name="text"
                      ref={commentInputRef}
                    />
                    <button onClick={() => sendComment(post.id)}>Send</button>
                  </div>
                ) : (
                  ""
                )}
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
