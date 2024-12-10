import { useOutletContext } from "react-router-dom";
import styles from "../stylesheets/Likes.module.css";
import BackHeader from "./BackHeader";
import ToProfile from "./ToProfile";
import { useEffect } from "react";

const Likes = () => {
  const [user, setUser, post, setPost] = useOutletContext();

  return (
    <div className={styles.likes_container}>
      <BackHeader post={post.text} mode={"likes"} />
      {post.Likes.length ? (
        post.Likes.map((like) => (
          <div key={like.id} className={styles.like_card}>
            {/* {props.mode !== "profile" ? (
              <ToProfile searchedUser={like.likedBy} />
            ) : (
              <ToProfile
                searchedUser={like.likedBy}
                mode={"profile"}
                post={post}
              />
            )} */}
            <ToProfile searchedUser={like.likedBy} />
          </div>
        ))
      ) : (
        <p>No likes.</p>
      )}
    </div>
  );
};

export default Likes;
