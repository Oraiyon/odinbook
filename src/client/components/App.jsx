import { useState } from "react";
import Navbar from "./Navbar";
import { Outlet } from "react-router-dom";
import styles from "../stylesheets/App.module.css";

function App() {
  const [user, setUser] = useState(null);
  const [post, setPost] = useState(null);
  // Admin states
  const [searchedUsers, setSearchedUsers] = useState(null);
  const [searchedUsersList, setSearchedUsersList] = useState([]);

  return (
    <div className={styles.app_container}>
      <Outlet
        context={[
          user,
          setUser,
          post,
          setPost,
          searchedUsers,
          setSearchedUsers,
          searchedUsersList,
          setSearchedUsersList
        ]}
      />
      <Navbar user={user} />
    </div>
  );
}

export default App;
