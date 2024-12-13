import { Link, useOutletContext } from "react-router-dom";

const Feed = () => {
  const [user, setUser, previousPage, setPreviousPage] = useOutletContext();

  return (
    <>
      <h1>{user.username}</h1>
    </>
  );
};

export default Feed;
