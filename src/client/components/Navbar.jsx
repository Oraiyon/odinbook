import { Link } from "react-router-dom";
import styles from "../stylesheets/Navbar.module.css";

const Navbar = (props) => {
  if (props.user) {
  } else {
    return (
      <nav className={styles.navbar_container}>
        <Link to={"/signup"}>Signup</Link>
        <Link to={"/login"}>Login</Link>
      </nav>
    );
  }
};

export default Navbar;
