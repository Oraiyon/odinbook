import styles from "../stylesheets/PostList.module.css";

const PostList = (props) => {
  return (
    <div className={styles.post_container}>
      {props.postList
        ? props.postList.map((post) => (
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
