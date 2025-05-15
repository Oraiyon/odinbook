import { useEffect, useState } from "react";
import styles from "../stylesheets/PostList.module.css";
import ToProfile from "./ToProfile";
import { Link } from "react-router-dom";
import Icon from "@mdi/react";
import { mdiCardsHeartOutline, mdiCommentOutline, mdiHeart } from "@mdi/js";
import PostModal from "./PostModal";
import DisplayDate from "./DisplayDate";

const PostList = (props) => {
  const [postList, setPostList] = useState([]);
  const [displayPostModal, setDisplayPostModal] = useState(null);
  const [paginationSkip, setPaginationSkip] = useState(0);

  const paginationTake = 25;

  useEffect(() => {
    const getPosts = async () => {
      try {
        let response;
        if (props.mode === "search") {
          // For Search.jsx
          response = await fetch(`/api/get/posts/${paginationSkip}/${paginationTake}`);
        } else if (props.mode === "user" && props.user) {
          // For User.jsx
          response = await fetch(
            `/api/${props.user.id}/get/posts/${paginationSkip}/${paginationTake}`
          );
        } else if (props.mode === "profile" && props.userProfile) {
          // For Profile.jsx
          response = await fetch(
            `/api/${props.userProfile.id}/get/posts/${paginationSkip}/${paginationTake}`
          );
        } else if (props.mode === "feed") {
          // For Feed.jsx
          response = await fetch(
            `/api/${props.user.id}/get/following/posts/${paginationSkip}/${paginationTake}`
          );
        }
        const data = await response.json();
        if (data) {
          // CAUSES DOUBLES ON SAVING. RESET BY GOING TO OTHER ROUTE
          const newArray = [...postList, ...data];
          setPostList(newArray);
        }
      } catch (error) {
        console.log(error);
      }
    };
    getPosts();
  }, [paginationSkip]);

  const likePost = async (post) => {
    try {
      if (props.user) {
        const pathname = window.location.pathname.split("/");
        const pathtype = pathname[pathname.length - 1];
        const response = await fetch(
          `/api/${props.user.id}/like/post/${paginationSkip}/${paginationTake}`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json"
            },
            body: JSON.stringify({
              id: props.user.id,
              post: post.id,
              page: pathtype ? pathtype : "search",
              authorId: post.authorId
            })
          }
        );
        const data = await response.json();
        setPostList(data);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const HandleLikedPost = (props) => {
    const [liked, setLiked] = useState(false);

    useEffect(() => {
      if (props.user) {
        for (const like of props.post.Likes) {
          if (like.likedById === props.user.id) {
            setLiked(true);
            return;
          }
        }
      }
    }, []);

    return (
      <Icon
        path={liked ? mdiHeart : mdiCardsHeartOutline}
        onClick={() => likePost(props.post)}
        className={styles.like_icon}
      ></Icon>
    );
  };

  return (
    <>
      {postList && postList.length ? (
        <div className={styles.post_container}>
          {postList.map((post) => (
            <div key={post.id} className={styles.post_card} id={post.id}>
              <ToProfile
                searchedUser={post.author}
                user={props.user}
                setDisplayPostModal={setDisplayPostModal}
                post={post}
              />
              <img src={post.image} className={styles.post_image} onClick={() => likePost(post)} />
              <p>{post.text}</p>
              <div className={styles.post_info}>
                <div className={styles.post_clicks}>
                  <div className={styles.like_section}>
                    <HandleLikedPost user={props.user} post={post} />
                    <Link to={`/${post.id}/likes`}>
                      <p>{post.Likes.length}</p>
                    </Link>
                  </div>
                  <div className={styles.comments_section}>
                    <Link to={`/${post.id}/comments`}>
                      <Icon path={mdiCommentOutline} className={styles.post_icon}></Icon>
                      <p>{post.Comments.length}</p>
                    </Link>
                  </div>
                </div>
                <DisplayDate date={post.postDate} />
              </div>
            </div>
          ))}
          <PostModal
            user={props.user}
            displayPostModal={displayPostModal}
            setDisplayPostModal={setDisplayPostModal}
            setPostList={setPostList}
          />
          {postList.length >= paginationTake ? (
            <button onClick={() => setPaginationSkip((p) => p + paginationTake)}>
              Load More Posts
            </button>
          ) : (
            ""
          )}
        </div>
      ) : (
        <p className={styles.no_posts}>No Posts Found</p>
      )}
    </>
  );
};

export default PostList;
