import { useOutletContext } from "react-router-dom";
import styles from "../stylesheets/Admin.module.css";
import { useEffect, useState } from "react";
import AdminSearchUsers from "./AdminSearchUsers";
import AdminSearchPost from "./AdminSearchPosts";

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
  const [searchedText, setSearchedText] = useState("");

  const fetchAllUsers = async () => {
    try {
      const response = await fetch("/api/admin/search/users");
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
    const fetchSearchedUsers = async () => {
      try {
        const response = await fetch(`/api/search/${searchedUsers}`);
        const data = await response.json();
        setSearchedUsersList(data);
      } catch (error) {
        console.log(error);
      }
    };
    if (searchedUsers) {
      fetchSearchedUsers();
    } else {
      fetchAllUsers();
    }
  }, [searchedUsers]);

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

  const handleCategory = () => {
    if (category === "users") {
      setCategory("posts");
    } else if (category === "posts") {
      setCategory("users");
      fetchAllUsers();
    }
    setSearchedUsersList([]);
    setSearchedUsers(null);
    setSearchedText("");
  };

  if (user && user.admin) {
    return (
      <>
        <div className={styles.admin_header}>
          <h1>Admin</h1>
          <button onClick={logout}>Logout</button>
        </div>
        <nav className={styles.admin_nav}>
          <button
            onClick={handleCategory}
            className={category === "users" ? styles.selected_category : ""}
          >
            Users
          </button>
          <button
            onClick={handleCategory}
            className={category === "posts" ? styles.selected_category : ""}
          >
            Posts
          </button>
        </nav>
        <div className={styles.admin_container}>
          {category === "users" ? (
            <AdminSearchUsers
              category={category}
              setSearchedUsers={setSearchedUsers}
              searchedUsers={searchedUsers}
              searchedUsersList={searchedUsersList}
            />
          ) : (
            <AdminSearchPost
              category={category}
              searchedText={searchedText}
              setSearchedText={setSearchedText}
            />
          )}
        </div>
      </>
    );
  } else {
    window.location.href = "/login";
  }
};

export default Admin;
