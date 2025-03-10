import { Link, useOutletContext } from "react-router-dom";
import styles from "../stylesheets/Login.module.css";
import { useEffect, useRef, useState } from "react";
import Icon from "@mdi/react";
import { mdiEye, mdiEyeOff } from "@mdi/js";

const Login = () => {
  const [user, setUser] = useOutletContext();

  const [invalidLogin, setInvalidLogin] = useState(null);
  const [revealPassword, setRevealPassword] = useState(false);

  const usernameInputRef = useRef(null);
  const passwordInputRef = useRef(null);
  const signupLinkRef = useRef(null);
  const toUserRef = useRef(null);

  useEffect(() => {
    if (user) {
      toUserRef.current.click();
    }
  }, [user]);

  const submitLogin = async (e) => {
    try {
      e.preventDefault();
      const response = await fetch("/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          username: usernameInputRef.current.value,
          password: passwordInputRef.current.value
        })
      });
      const data = await response.json();
      if (data) {
        setUser(data);
      } else {
        setInvalidLogin("Invalid Username or Password");
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className={styles.login_container}>
      <h1>Log In</h1>
      <form className={styles.login_form}>
        <div>
          <label htmlFor="username">Username</label>
          <input type="text" id="username" name="username" ref={usernameInputRef} />
        </div>
        <div>
          <label htmlFor="password">Password</label>
          <div className={styles.login_password}>
            <input
              type={!revealPassword ? "password" : "text"}
              id="password"
              name="password"
              ref={passwordInputRef}
            />
            <div onClick={() => setRevealPassword((r) => !r)}>
              <Icon path={!revealPassword ? mdiEye : mdiEyeOff}></Icon>
            </div>
          </div>
        </div>
        <p>{invalidLogin}</p>
        <button onClick={submitLogin}>Log In</button>
      </form>
      <p>Don't have have an account?</p>
      <Link to={"/signup"} ref={signupLinkRef}>
        Sign Up!
      </Link>
      {user ? <Link to={`/feed`} ref={toUserRef}></Link> : ""}
    </div>
  );
};

export default Login;
