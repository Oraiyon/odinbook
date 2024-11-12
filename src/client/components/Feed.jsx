import { Link, useOutletContext } from "react-router-dom";

const Feed = () => {
  const [user, setUser] = useOutletContext();

  return (
    <>
      <h1>{user.username}</h1>
    </>
  );
};

export default Feed;
