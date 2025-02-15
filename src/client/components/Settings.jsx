import { Link, useOutletContext } from "react-router-dom";
import styles from "../stylesheets/Settings.module.css";
import BackHeader from "./BackHeader";
import Icon from "@mdi/react";
import { mdiAccountEdit } from "@mdi/js";

const Settings = () => {
  const [user, setUser, post, setPost] = useOutletContext();

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
            <Link to={"/user/settings/edit"}>
              <div>
                <Icon path={mdiAccountEdit}></Icon>
                <p>Edit Account Information</p>
              </div>
            </Link>
          </div>
        </div>
        <button onClick={logout}>Log Out</button>
      </div>
    );
  } else {
    window.location.href = "/login";
  }
};

export default Settings;
