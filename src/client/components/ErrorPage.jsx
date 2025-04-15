import styles from "../stylesheets/ErrorPage.module.css";
import { Link } from "react-router-dom";

const ErrorPage = () => {
  return (
    <div className={styles.error_page_container}>
      <h1>ERROR</h1>
      <p>PAGE NOT FOUND</p>
      <button>
        <Link to="/">Go Home</Link>
      </button>
    </div>
  );
};

export default ErrorPage;
