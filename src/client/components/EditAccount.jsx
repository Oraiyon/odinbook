import { useRef } from "react";
import styles from "../stylesheets/EditAccount.module.css";
import { Link, useOutletContext } from "react-router-dom";
import BackHeader from "./BackHeader";

const EditAccount = () => {
  const [user, setUser, post, setPost] = useOutletContext();

  if (user) {
    return (
      <div className={styles.editAccount_container}>
        <BackHeader mode={"account"} user={user} />
        <button>
          <Link to="/user/account/edit/picture">Edit Profile Picture</Link>
        </button>
        <button>
          <Link to="/user/account/edit/username">Edit Username</Link>
        </button>
        <button>
          <Link to="/user/account/edit/password">Edit Password</Link>
        </button>
      </div>
    );
  } else {
    window.location.href = "/login";
  }
};

export default EditAccount;
