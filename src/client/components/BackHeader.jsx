import styles from "../stylesheets/BackHeader.module.css";
import Icon from "@mdi/react";
import { mdiArrowLeft } from "@mdi/js";
import { Link } from "react-router-dom";
import { useRef } from "react";

const BackHeader = (props) => {
  const linkRef = useRef(null);

  if (props.mode === "likes") {
    return (
      <div className={styles.backHeader_container}>
        <Icon path={mdiArrowLeft} onClick={() => props.displayLikesModal(props.post.Likes)} />
        <p>{props.post.text}</p>
      </div>
    );
  } else if (props.mode === "comments") {
    return (
      <div className={styles.backHeader_container}>
        <Icon path={mdiArrowLeft} onClick={() => props.displayCommentsModal(props.post.Comments)} />
        <p>{props.post.text}</p>
      </div>
    );
  } else if (props.mode === "profile") {
    // Use previousPage state?
    return (
      <div className={styles.backHeader_container_profile}>
        <div onClick={() => linkRef.current.click()}>
          <Icon path={mdiArrowLeft} />
          <Link to={props.previousPage} ref={linkRef} />
        </div>
        <p>{props.previousPage}</p>
      </div>
    );
  }
};

export default BackHeader;
