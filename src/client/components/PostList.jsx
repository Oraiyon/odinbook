import { useEffect, useRef, useState } from "react";
import styles from "../stylesheets/PostList.module.css";
import BackHeader from "./BackHeader";
import ToProfile from "./ToProfile";

const PostList = (props) => {
  const [postList, setPostList] = useState([]);
  const [postComments, setPostComments] = useState([]);

  const commentInputRef = useRef(null);

  useEffect(() => {
    const getPosts = async () => {
      try {
        let response;
        if (props.mode === "search") {
          response = await fetch("/api/get/posts");
        } else if (props.mode === "profile") {
          response = await fetch(`/api/${props.userProfile.id}/get/posts`);
        } else if (props.mode === "feed" && props.user) {
          response = await fetch(`/api/${props.user.id}/get/following/posts`);
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

  const displayLikesModal = () => {
    if (!props.displayLikes) {
      props.setDisplayLikes(true);
      if (props.mode === "profile") {
        props.setDisplayBackHeader(false);
      }
    } else {
      props.setDisplayLikes(false);
      if (props.mode === "profile") {
        props.setDisplayBackHeader(true);
      }
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
        if (props.mode === "profile") {
          props.setDisplayBackHeader(false);
        }
      } else {
        props.setDisplayComments(false);
        if (props.mode === "profile") {
          props.setDisplayBackHeader(true);
        }
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
                {props.mode !== "profile" ? (
                  <ToProfile searchedUser={post.author} />
                ) : (
                  <ToProfile searchedUser={post.author} mode={"profile"} />
                )}
                <p onClick={() => likePost(post.id)}>{post.text}</p>
                <p onClick={displayLikesModal}>
                  {post.Likes.length} {post.Likes.length !== 1 ? "Likes" : "Like"}
                </p>
                <p onClick={() => displayCommentsModal(post.id)}>
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
                  post.Likes.map((like) => (
                    <div key={like.id} className={styles.like_card}>
                      {props.mode !== "profile" ? (
                        <ToProfile searchedUser={like.likedBy} />
                      ) : (
                        <ToProfile
                          searchedUser={like.likedBy}
                          mode={"profile"}
                          post={post}
                          displayLikesModal={() => displayLikesModal(post.id)}
                        />
                      )}
                    </div>
                  ))
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
                          {props.mode !== "profile" ? (
                            <ToProfile searchedUser={comment.author} />
                          ) : (
                            <ToProfile
                              searchedUser={comment.author}
                              mode={"profile"}
                              post={post}
                              displayCommentsModal={() => displayCommentsModal(post.id)}
                            />
                          )}
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
