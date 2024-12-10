import { useOutletContext } from "react-router-dom";
import styles from "../stylesheets/Likes.module.css";
import BackHeader from "./BackHeader";
import ToProfile from "./ToProfile";
import { useEffect } from "react";

const Likes = () => {
  const [user, setUser, post, setPost] = useOutletContext();

  // GET post or likes?
  useEffect(() => {
    const fetchLikes = async () => {
      try {
        const response = await fetch(`/api/get/${window.location.pathname.split("/")[1]}`);
        const data = await response.json();
        setPost(data);
      } catch (error) {
        console.log(error);
      }
    };
    if (!post) {
      fetchLikes();
    }
  }, []);

  return (
    <div className={styles.likes_container}>
      {post ? <BackHeader post={post.text} mode={"likes"} /> : ""}
      {post && post.Likes.length ? (
        post.Likes.map((like) => (
          <div key={like.id} className={styles.like_card}>
            {/* {props.mode !== "profile" ? (
              <ToProfile searchedUser={like.likedBy} user={user} />
            ) : (
              <ToProfile
                searchedUser={like.likedBy}
                mode={"profile"}
                post={post}
              />
            )} */}
            <ToProfile searchedUser={like.likedBy} user={user} />
          </div>
        ))
      ) : (
        <p>No likes.</p>
      )}
    </div>
  );
};

export default Likes;
