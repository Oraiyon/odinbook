import styles from "../stylesheets/PostModal.module.css";
import Icon from "@mdi/react";
import { Link } from "react-router-dom";
import { mdiDotsHorizontal, mdiCardsHeartOutline, mdiCommentOutline, mdiHeart } from "@mdi/js";
import DisplayDate from "./DisplayDate";
import { useEffect, useState } from "react";
import DisplayLoading from "./DisplayLoading";

const PostModal = (props) => {
  const [loading, setLoading] = useState(false);

  const deletePost = async (id) => {
    try {
      setLoading(true);
      let response;
      if (props.mode === "user") {
        response = await fetch(`/api/${props.user.id}/delete/${id}/user`, {
          method: "DELETE"
        });
      } else {
        response = await fetch(`/api/${props.user.id}/delete/${id}`, {
          method: "DELETE"
        });
      }
      const data = await response.json();
      if (data) {
        setLoading(false);
        props.setDisplayPostModal(null);
        props.setPostList(data);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const HandleLikedPost = (props) => {
    const [liked, setLiked] = useState(false);

    useEffect(() => {
      if (props.user) {
        for (const like of props.displayPostModal.Likes) {
          if (like.likedById === props.user.id) {
            setLiked(true);
            return;
          }
        }
      }
    }, []);

    return (
      <Icon path={liked ? mdiHeart : mdiCardsHeartOutline} className={styles.like_icon}></Icon>
    );
  };

  if (props.displayPostModal) {
    return (
      <div className={styles.post_modal} onClick={() => props.setDisplayPostModal(null)}>
        <div className={styles.post_edit} onClick={(e) => e.stopPropagation()}>
          <Icon path={mdiDotsHorizontal} onClick={() => props.setDisplayPostModal(null)} />
          <div className={styles.post_image}>
            <img src={props.displayPostModal.image} alt="" />
            <DisplayLoading loading={loading} />
          </div>
          <p>{props.displayPostModal.text}</p>
          <div className={styles.post_info}>
            <div>
              <HandleLikedPost user={props.user} displayPostModal={props.displayPostModal} />
              <p>{props.displayPostModal.Likes.length}</p>
            </div>
            <div>
              <Icon path={mdiCommentOutline}></Icon>
              <p>{props.displayPostModal.Comments.length}</p>
            </div>
          </div>
          <DisplayDate date={props.displayPostModal.postDate} />
          <div className={styles.post_modal_buttons}>
            <Link to={`/post/edit/${props.displayPostModal.id}`}>
              <button>Edit Post</button>
            </Link>
            <button onClick={() => deletePost(props.displayPostModal.id)}>Delete Post</button>
          </div>
        </div>
      </div>
    );
  }
};

export default PostModal;
