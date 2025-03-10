import { useOutletContext } from "react-router-dom";
import styles from "../stylesheets/Search.module.css";
import { useEffect, useRef, useState } from "react";
import PostList from "./PostList";
import ToProfile from "./ToProfile";
import Icon from "@mdi/react";
import { mdiMagnify } from "@mdi/js";

const Search = () => {
  const [user, setUser, post, setPost] = useOutletContext();

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
        <label htmlFor="searchBar">Search</label>
        <Icon path={mdiMagnify}></Icon>
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
          {searchedUsersList.map((searchedUser) => (
            <div key={searchedUser.id} className={styles.search_card}>
              <ToProfile searchedUser={searchedUser} user={user} mode={"search"} />
            </div>
          ))}
        </div>
      ) : (
        <PostList user={user} mode={"search"} post={post} setPost={setPost} />
      )}
    </div>
  );
};

export default Search;
