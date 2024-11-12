import { useState } from "react";
import Navbar from "./Navbar";
import { Outlet } from "react-router-dom";

function App() {
  const [user, setUser] = useState(null);

  return (
    <>
      <Outlet context={[user, setUser]} />
      <Navbar user={user} />
    </>
  );
}

export default App;
