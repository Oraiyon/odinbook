import { Link, useOutletContext } from "react-router-dom";
import styles from "../stylesheets/AdminSearchUsers.module.css";
import { useEffect, useState } from "react";
import AdminNavbar from "./AdminNavbar";

const AdminSearchUsers = () => {
  const [
    user,
    setUser,
    post,
    setPost,
    searchedUsers,
    setSearchedUsers,
    searchedUsersList,
    setSearchedUsersList
  ] = useOutletContext();

  const fetchAllUsers = async () => {
    try {
      const response = await fetch("/api/admin/search/users");
      const data = await response.json();
      setSearchedUsersList(data);
    } catch (error) {
      console.log(error);
    }
  };

  const fetchSearchedUsers = async () => {
    try {
      const response = await fetch(`/api/search/${searchedUsers}`);
      const data = await response.json();
      setSearchedUsersList(data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchAllUsers();
  }, []);

  useEffect(() => {
    if (searchedUsers) {
      fetchSearchedUsers();
    } else {
      fetchAllUsers();
    }
  }, [searchedUsers]);

  const [deletedUsers, setDeletedUsers] = useState([]);

  const handleSelectUser = (id) => {
    for (let i = 0; i < deletedUsers.length; i++) {
      if (deletedUsers[i] === id) {
        const newArray = deletedUsers.filter((item) => item !== id);
        setDeletedUsers(newArray);
        return;
      }
    }
    setDeletedUsers((d) => [...d, id]);
  };

  const handleUserDelete = async () => {
    try {
      for (let i = 0; i < deletedUsers.length; i++) {
        await fetch(`/api/admin/delete/${deletedUsers[i]}`, { method: "DELETE" });
        if (searchedUsers) {
          fetchSearchedUsers();
        } else {
          fetchAllUsers();
        }
      }
    } catch (error) {
      console.log(error);
    }
  };

  if (user && user.admin) {
    return (
      <div className={styles.admin_container}>
        <AdminNavbar user={user} />
        <div>
          <form className={styles.admin_form}>
            <label htmlFor="searchUser"></label>
            <input
              type="text"
              id="searchUser"
              placeholder="Search User"
              onChange={(e) => setSearchedUsers(e.target.value)}
            />
          </form>
          <button onClick={handleUserDelete}>Delete Selected Users</button>
          {searchedUsersList ? (
            <table className={styles.user_table}>
              <thead>
                <tr>
                  <th>Usernames</th>
                  <th>Posts</th>
                  <th>Comments</th>
                </tr>
              </thead>
              <tbody className={styles.table_body}>
                {searchedUsersList.map((user) => (
                  <tr
                    key={user.id}
                    className={deletedUsers.includes(user.id) ? styles.selected_user : ""}
                  >
                    <td className={styles.select_user}>
                      {!user.admin ? (
                        <input type="checkbox" onClick={() => handleSelectUser(user.id)} />
                      ) : (
                        <input type="checkbox" className={styles.hidden_checkbox} />
                      )}
                      <p>{user.username}</p>
                    </td>
                    <td>
                      <Link to={`/admin/${user.id}/${user.id}/Posts`}>{user.Posts.length}</Link>
                    </td>
                    <td>
                      <Link to={`/admin/${user.id}/${user.id}/comments`}>
                        {user.Comments.length}
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            ""
          )}
        </div>
      </div>
    );
  }
};

export default AdminSearchUsers;
