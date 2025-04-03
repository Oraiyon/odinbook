import { useOutletContext } from "react-router-dom";
import styles from "../stylesheets/Admin.module.css";
import { useEffect, useRef, useState } from "react";

const Admin = () => {
  const [user, setUser] = useOutletContext();

  const [searchedUsers, setSearchedUsers] = useState(null);
  const [searchedUsersList, setSearchedUsersList] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [selectedUserPostList, setSelectedUserPostList] = useState([]);
  const [selectedUserCommentList, setSelectedUserCommentList] = useState([]);

  useEffect(() => {
    const fetchSearchedUsers = async () => {
      try {
        const response = await fetch(`/api/search/${searchedUsers}`);
        const data = await response.json();
        setSearchedUsersList(data);
      } catch (error) {
        console.log(error);
      }
    };
    const fetchSelectedUser = async () => {
      try {
        const response = await fetch(`/api/admin/${user.id}/get/${selectedUser.id}`);
        const data = await response.json();
        console.log(data);
        if (data) {
          setSelectedUserPostList(data.postList);
          setSelectedUserCommentList(data.commentList);
        }
      } catch (error) {
        console.log(error);
      }
    };

    if (searchedUsers) {
      fetchSearchedUsers();
    } else {
      setSelectedUser(null);
    }
    if (selectedUser) {
      fetchSelectedUser();
    }
  }, [searchedUsers, selectedUser]);

  if (user && user.admin) {
    return (
      <div className={styles.admin_container}>
        <h1>Admin</h1>
        <form className={styles.admin_form}>
          <label htmlFor="searchUser"></label>
          <input
            type="text"
            id="searchUser"
            placeholder="Search User"
            onChange={(e) => setSearchedUsers(e.target.value)}
          />
        </form>
        {searchedUsers && searchedUsersList ? (
          <>
            <h2>Selected User: {selectedUser ? selectedUser.username : ""} </h2>
            <div>
              {searchedUsersList.map((user) => (
                <div
                  key={user.id}
                  onClick={() => setSelectedUser(user)}
                  className={
                    selectedUser && selectedUser.id === user.id
                      ? styles.selected_user
                      : styles.unselected_user
                  }
                >
                  {user.username}
                </div>
              ))}
            </div>
          </>
        ) : (
          ""
        )}
        {selectedUser ? (
          <>
            <div>Posts</div>
            <div>Comments</div>
          </>
        ) : (
          ""
        )}
      </div>
    );
  } else {
    window.location.href = "/login";
  }
};

export default Admin;
