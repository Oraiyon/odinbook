import { useOutletContext } from "react-router-dom";
import styles from "../stylesheets/Comments.module.css";
import ToProfile from "./ToProfile";
import BackHeader from "./BackHeader";
import { useEffect, useRef, useState } from "react";
import DisplayDate from "./DisplayDate";

const Comments = () => {
  const [user, setUser, post, setPost] = useOutletContext();

  const [postComments, setPostComments] = useState(null);
  const [commentWarning, setCommentWarning] = useState(false);
  const [commentLength, setCommentLength] = useState(0);

  const commentInputRef = useRef(null);

  useEffect(() => {
    const fetchComments = async () => {
      try {
        const response = await fetch(`/api/get/${window.location.pathname.split("/")[1]}/comments`);
        const data = await response.json();
        setPostComments(data);
      } catch (error) {
        console.log(error);
      }
    };
    const fetchPost = async () => {
      try {
        const response = await fetch(`/api/get/${window.location.pathname.split("/")[1]}`);
        const data = await response.json();
        setPost(data);
      } catch (error) {
        console.log(error);
      }
    };
    fetchComments();
    fetchPost();
  }, []);

  useEffect(() => {
    if (commentLength >= 100) {
      setCommentWarning(true);
    } else {
      setCommentWarning(false);
    }
  }, [commentLength]);

  const sendComment = async (id) => {
    try {
      if (commentInputRef.current.value && commentInputRef.current.value.length <= 100) {
        const response = await fetch("/api/post/create/comment", {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            author: user.id,
            text: commentInputRef.current.value,
            post: id
          })
        });
        const data = await response.json();
        if (data) {
          setPostComments(data);
          setCommentLength(0);
          commentInputRef.current.value = "";
        } else {
          setCommentWarning(true);
        }
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className={styles.comments_container}>
      <div>
        {post ? <BackHeader post={post} mode={"comments"} /> : ""}
        {postComments && postComments.length ? (
          postComments.map((comment) => (
            <div key={comment.id} className={styles.comment_card}>
              <ToProfile
                searchedUser={comment.author}
                user={user}
                mode={"comments"}
                comment={comment}
                setPostComments={setPostComments}
              />
              <div>
                <p>{comment.text}</p>
                <DisplayDate date={comment.commentDate} />
              </div>
            </div>
          ))
        ) : (
          <p>No Comments</p>
        )}
      </div>
      {user ? (
        <div className={styles.post_comment}>
          {commentWarning ? (
            <p className={styles.comment_warning}>COMMENTS CANNOT EXCEED 100 CHARACTERS</p>
          ) : (
            ""
          )}
          <p className={commentLength < 100 ? styles.comment_length : styles.comment_length_error}>
            {commentLength}/100
          </p>
          <label htmlFor="commentInput"></label>
          <input
            type="text"
            id="commentInput"
            placeholder="Add a comment"
            name="text"
            ref={commentInputRef}
            onChange={() => setCommentLength(commentInputRef.current.value.length)}
          />
          <button onClick={() => sendComment(post.id)}>Post Comment</button>
        </div>
      ) : (
        ""
      )}
    </div>
  );
};

export default Comments;
