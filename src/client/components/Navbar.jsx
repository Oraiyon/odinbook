import { Link } from "react-router-dom";
import styles from "../stylesheets/Navbar.module.css";

const Navbar = (props) => {
  if (!props.user) {
    return (
      <nav className={styles.navbar_container}>
        <Link to={"/signup"}>Sign Up</Link>
        <Link to={"/"}>Search</Link>
        <Link to={"/login"}>Log In</Link>
      </nav>
    );
  } else {
    return (
      <nav className={styles.navbar_container}>
        <Link to={"/feed"}>Feed</Link>
        <Link to={"/"}>Search</Link>
        <Link to={"/post"}>Post</Link>
        <Link to={"/inbox"}>Inbox</Link>
        <Link to={"/user"}>User</Link>
      </nav>
    );
  }
};

export default Navbar;
