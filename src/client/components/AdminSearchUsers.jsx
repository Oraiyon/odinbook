import { Link } from "react-router-dom";
import styles from "../stylesheets/AdminSearchUsers.module.css";
import { useState } from "react";

const AdminSearchUsers = (props) => {
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
        if (props.searchedUsers) {
          props.fetchSearchedUsers();
        } else {
          props.fetchAllUsers();
        }
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <>
      <form className={styles.admin_form}>
        <label htmlFor="searchUser"></label>
        <input
          type="text"
          id="searchUser"
          placeholder="Search User"
          onChange={(e) => props.setSearchedUsers(e.target.value)}
        />
      </form>
      <button onClick={handleUserDelete}>Delete Selected Users</button>
      {props.searchedUsersList ? (
        <table className={styles.user_table}>
          <thead>
            <tr>
              <th>Usernames</th>
              <th>Posts</th>
              <th>Comments</th>
            </tr>
          </thead>
          <tbody className={styles.table_body}>
            {props.searchedUsersList.map((user) => (
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
                  <Link to={`/admin/${user.id}/Posts`}>{user.Posts.length}</Link>
                </td>
                <td>
                  <Link to={`/admin/${user.id}/comments`}>{user.Comments.length}</Link>
                </td>
                {/* {!user.admin ? (
                  <td>
                    <button
                      onClick={() => handleUserDelete(user.id)}
                      className={styles.admin_user_delete_button}
                    >
                      <Icon path={mdiDelete}></Icon>
                    </button>
                  </td>
                ) : (
                  ""
                )} */}
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        ""
      )}
    </>
  );
};

export default AdminSearchUsers;
