import { Link, useOutletContext } from "react-router-dom";
import styles from "../stylesheets/Account.module.css";
import BackHeader from "./BackHeader";
import Icon from "@mdi/react";
import { mdiAccountEdit, mdiDelete } from "@mdi/js";
import DeleteUserModal from "./DeleteUserModal";
import { useState } from "react";

const Account = () => {
  const [user, setUser, post, setPost] = useOutletContext();

  const [displayDeleteModal, setDisplayDeleteModal] = useState(false);

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

  if (user) {
    return (
      <div className={styles.settings_container}>
        <div>
          <BackHeader mode={"user"} user={user} />
          <div className={styles.settings_links}>
            <Link to={"/user/account/edit"}>
              <div>
                <Icon path={mdiAccountEdit}></Icon>
                <p>Edit Account Information</p>
              </div>
            </Link>
            <div className={styles.delete_account} onClick={() => setDisplayDeleteModal(true)}>
              <Icon path={mdiDelete}></Icon>
              <p>Delete Account</p>
            </div>
          </div>
        </div>
        <button onClick={logout}>Log Out</button>
        <DeleteUserModal
          user={user}
          displayDeleteModal={displayDeleteModal}
          setDisplayDeleteModal={setDisplayDeleteModal}
        />
      </div>
    );
  } else {
    window.location.href = "/login";
  }
};

export default Account;
