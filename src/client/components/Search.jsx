import { useOutletContext } from "react-router-dom";
import styles from "../stylesheets/Search.module.css";
import { useEffect, useState } from "react";
import PostList from "./PostList";

const Search = () => {
  const [user, setUser] = useOutletContext();

  const [postList, setPostList] = useState([]);

  useEffect(() => {
    const getPosts = async () => {
      try {
        const response = await fetch("/api/get/posts");
        const data = await response.json();
        setPostList(data);
      } catch (error) {
        console.log(error);
      }
    };
    getPosts();
  }, []);

  return (
    <div className={styles.search_container}>
      <div className={styles.searchBar}>
        <label htmlFor="searchBar"></label>
        <input type="text" id="searchBar" name="searchBar" placeholder="Search Username" />
      </div>
      <PostList user={user} postList={postList} />
    </div>
  );
};

export default Search;
