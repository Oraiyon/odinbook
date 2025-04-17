import { useOutletContext } from "react-router-dom";
import styles from "../stylesheets/Admin.module.css";
import { useEffect, useState } from "react";
import AdminSearchUsers from "./AdminSearchUsers";
import AdminNavbar from "./AdminNavbar";

const Admin = () => {
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

  const [category, setCategory] = useState("users");

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

  if (user && user.admin) {
    return (
      <>
        <AdminNavbar user={user} />
        <div className={styles.admin_container}>
          <AdminSearchUsers
            user={user}
            category={category}
            setSearchedUsers={setSearchedUsers}
            searchedUsers={searchedUsers}
            searchedUsersList={searchedUsersList}
            fetchAllUsers={fetchAllUsers}
            fetchSearchedUsers={fetchSearchedUsers}
          />
        </div>
      </>
    );
  } else {
    window.location.href = "/login";
  }
};

export default Admin;
