import { Link } from "react-router-dom";
import styles from "../stylesheets/AdminNavbar.module.css";

const AdminNavbar = (props) => {
  const logout = async () => {
    try {
      const response = await fetch("/logout");
      const data = await response.json();
      if (data) {
        window.location.href = "/";
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <>
      <div className={styles.admin_header}>
        <h1>Admin</h1>
        <button onClick={logout}>Logout</button>
      </div>
      <nav className={styles.admin_nav}>
        <button>
          <Link to={`/admin/${props.user.id}`}>Users</Link>
        </button>
        <button>
          <Link to={`/admin/${props.user.id}/posts`}>Posts</Link>
        </button>
        <button>
          <Link to={`/admin/${props.user.id}/comments`}>Comments</Link>
        </button>
      </nav>
    </>
  );
};

export default AdminNavbar;
