import { useOutletContext } from "react-router-dom";
import styles from "../stylesheets/Search.module.css";
import { useEffect, useRef, useState } from "react";
import PostList from "./PostList";

const Search = () => {
  const [user, setUser] = useOutletContext();

  const [searchedUsername, setSearchedUsername] = useState(null);
  const [searchedUsersList, setSearchedUsersList] = useState(null);

  const searchBarRef = useRef(null);

  useEffect(() => {
    const getUsers = async () => {
      try {
        const response = await fetch(`/api/search/${searchedUsername}`);
        const data = await response.json();
        setSearchedUsersList(data);
      } catch (error) {
        console.log(error);
      }
    };
    if (searchedUsername) {
      getUsers();
    }
  }, [searchedUsername]);

  return (
    <div className={styles.search_container}>
      <div className={styles.searchBar}>
        <label htmlFor="searchBar"></label>
        <input
          type="text"
          id="searchBar"
          name="searchBar"
          placeholder="Search Username"
          ref={searchBarRef}
          onChange={() => setSearchedUsername(searchBarRef.current.value)}
        />
      </div>
      {searchedUsername && searchedUsersList ? (
        <div className={styles.searchUserList_container}>
          {searchedUsersList.map((user) => (
            <div key={user.id} className={styles.searchUser_card}>
              <p>{user.username}</p>
            </div>
          ))}
        </div>
      ) : (
        <PostList user={user} />
      )}
    </div>
  );
};

export default Search;
