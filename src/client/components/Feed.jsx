import { useOutletContext } from "react-router-dom";
import PostList from "./PostList";
import styles from "../stylesheets/Feed.module.css";

const Feed = () => {
  const [user, setUser, post, setPost] = useOutletContext();

  if (user) {
    return (
      <div className={styles.feed_container}>
        <PostList user={user} mode={"feed"} post={post} setPost={setPost} userProfile={null} />
      </div>
    );
  } else {
    window.location.href = "/login";
  }
};

export default Feed;
