import styles from "../stylesheets/BackHeader.module.css";
import Icon from "@mdi/react";
import { mdiArrowLeft } from "@mdi/js";

const BackHeader = (props) => {
  return (
    <div className={styles.backHeader_container}>
      <Icon path={mdiArrowLeft} onClick={() => props.displayLikesModal(props.post.Likes)} />
      <p>{props.post.text}</p>
    </div>
  );
};

export default BackHeader;
