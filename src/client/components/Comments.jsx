import { useOutletContext } from "react-router-dom";
import styles from "../stylesheets/Comments.module.css";
import ToProfile from "./ToProfile";
import BackHeader from "./BackHeader";
import { useEffect, useRef, useState } from "react";

const Comments = () => {
  const [user, setUser, post, setPost] = useOutletContext();

  const [postComments, setPostComments] = useState(null);

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
    fetchComments();
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
    <div className={styles.comments_container}>
      <div>
        {postComments ? <BackHeader post={postComments[0].post.text} mode={"comments"} /> : ""}
        {postComments && postComments.length ? (
          postComments.map((comment) => (
            <div key={comment.id} className={styles.comment_card}>
              <div>
                {/* {props.mode !== "profile" ? (
                  <ToProfile searchedUser={comment.author} user={user}/>
                ) : (
                  <ToProfile
                    searchedUser={comment.author}
                    mode={"profile"}
                    post={post}
                  />
                )} */}
                <ToProfile searchedUser={comment.author} user={user} />
                <DisplayDate date={comment.commentDate} />
              </div>
              <p>{comment.text}</p>
            </div>
          ))
        ) : (
          <p>No Comments.</p>
        )}
      </div>
      {user ? (
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
  );
};

export default Comments;
