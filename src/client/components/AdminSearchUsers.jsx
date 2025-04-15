import { Link } from "react-router-dom";
import styles from "../stylesheets/AdminSearchUsers.module.css";

const AdminSearchUsers = (props) => {
  const handleUserDelete = async (id) => {
    try {
      await fetch(`/api/admin/delete/${id}`, { method: "DELETE" });
      props.setSearchedUsers(searchedUsers);
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
              <th>Username</th>
              <th>Posts</th>
              <th>Comments</th>
              <th>Delete</th>
            </tr>
          </thead>
          <tbody>
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
                    <button onClick={() => handleUserDelete(user.id)}>Delete</button>
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
