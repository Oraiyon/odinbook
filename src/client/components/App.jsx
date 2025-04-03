import { useState } from "react";
import Navbar from "./Navbar";
import { Outlet } from "react-router-dom";
import styles from "../stylesheets/App.module.css";

function App() {
  const [user, setUser] = useState(null);
  const [post, setPost] = useState(null);
  const [searchedUsers, setSearchedUsers] = useState(null);
  const [searchedUsersList, setSearchedUsersList] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [selectedUserPostList, setSelectedUserPostList] = useState([]);
  const [selectedUserCommentList, setSelectedUserCommentList] = useState([]);

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
          setSearchedUsersList,
          selectedUser,
          setSelectedUser,
          selectedUserPostList,
          setSelectedUserPostList,
          selectedUserCommentList,
          setSelectedUserCommentList
        ]}
      />
      {user && user.admin ? "" : <Navbar user={user} />}
    </div>
  );
}

export default App;
