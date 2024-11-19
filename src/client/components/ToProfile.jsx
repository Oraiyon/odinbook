const ToProfile = (props) => {
  const toUser = () => {
    console.log(props.user);
  };

  return <p onClick={toUser}>{props.user.username}</p>;
};

export default ToProfile;
