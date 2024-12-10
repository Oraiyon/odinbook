import styles from "../stylesheets/BackHeader.module.css";
import Icon from "@mdi/react";
import { mdiArrowLeft } from "@mdi/js";
import { Link, useNavigate } from "react-router-dom";
import { useRef } from "react";

const BackHeader = (props) => {
  const linkRef = useRef(null);

  const navigate = useNavigate();

  if (props.mode === "likes" || props.mode === "comments") {
    return (
      <div className={styles.backHeader_container}>
        <Icon path={mdiArrowLeft} onClick={() => navigate(-1)} />
        <p>{props.post}</p>
      </div>
    );
  } else if (props.mode === "profile") {
    return (
      <div className={styles.backHeader_container_profile}>
        <Icon path={mdiArrowLeft} onClick={() => navigate(-1)} />
      </div>
    );
  }
};

export default BackHeader;
