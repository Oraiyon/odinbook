import { Link } from "react-router-dom";
import styles from "../stylesheets/AdminSearchUsers.module.css";
import Icon from "@mdi/react";
import { mdiDelete } from "@mdi/js";

const AdminSearchUsers = (props) => {
  const handleUserDelete = async (id) => {
    try {
      await fetch(`/api/admin/delete/${id}`, { method: "DELETE" });
      if (props.searchedUsers) {
        props.fetchSearchedUsers();
      } else {
        props.fetchAllUsers();
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
              <tr key={user.id}>
                <td>{user.username}</td>
                <td>
                  <Link to={`/admin/${user.id}/posts`}>{user.Posts.length}</Link>
                </td>
                <td>
                  <Link to={`/admin/${user.id}/comments`}>{user.Comments.length}</Link>
                </td>
                {!user.admin ? (
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
                )}
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
