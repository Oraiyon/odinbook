import styles from "../stylesheets/DisplayDate.module.css";

const DisplayDate = (props) => {
  const date = new Date(props.date);
  const options = {
    month: "short",
    day: "numeric",
    year: "numeric"
  };
  return <p className={styles.post_date}>{date.toLocaleDateString("en-us", options)}</p>;
};

export default DisplayDate;
