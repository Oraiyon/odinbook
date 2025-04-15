import Icon from "@mdi/react";
import { mdiAutorenew } from "@mdi/js";
import styles from "../stylesheets/DisplayLoading.module.css";

const DisplayLoading = (props) => {
  if (props.loading) {
    return <Icon path={mdiAutorenew} className={styles.loading_icon}></Icon>;
  }
};

export default DisplayLoading;
