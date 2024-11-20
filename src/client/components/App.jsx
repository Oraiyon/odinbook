import { useState } from "react";
import Navbar from "./Navbar";
import { Outlet } from "react-router-dom";
import styles from "../stylesheets/App.module.css";

function App() {
  const [user, setUser] = useState(null);
  const [displayLikes, setDisplayLikes] = useState(false);
  const [displayComments, setDisplayComments] = useState(false);

  return (
    <div className={styles.app_container}>
      <Outlet
        context={[
          user,
          setUser,
          displayLikes,
          setDisplayLikes,
          displayComments,
          setDisplayComments
        ]}
      />
      <Navbar user={user} />
    </div>
  );
}

export default App;
