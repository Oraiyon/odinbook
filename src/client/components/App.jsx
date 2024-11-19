import { useState } from "react";
import Navbar from "./Navbar";
import { Outlet } from "react-router-dom";
import styles from "../stylesheets/App.module.css";

function App() {
  const [user, setUser] = useState(null);

  return (
    <div className={styles.app_container}>
      <Outlet context={[user, setUser]} />
      <Navbar user={user} />
    </div>
  );
}

export default App;
