import { useRef, useState } from "react";
import styles from "../stylesheets/Signup.module.css";
import { Link } from "react-router-dom";

const Signup = () => {
  const [invalidUsername, setInvalidUsername] = useState("");
  const [invalidPassword, setInvalidPassword] = useState("");
  const [invalidConfirmPassword, setInvalidConfirmPassword] = useState("");

  const usernameInputRef = useRef(null);
  const passwordInputRef = useRef(null);
  const confirmPasswordInputRef = useRef(null);
  const loginLinkRef = useRef(null);

  const submitSignup = async (e) => {
    try {
      e.preventDefault();
      validateSignupInputs();
      if (!invalidUsername || !invalidPassword || !invalidConfirmPassword) {
        const response = await fetch("/signup", {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            username: usernameInputRef.current.value,
            password: passwordInputRef.current.value,
            confirmPassword: confirmPasswordInputRef.current.value
          })
        });
        const data = await response.json();
        if (data === "User Created") {
          loginLinkRef.current.click();
        } else if (data === "Username Already Taken") {
          setInvalidUsername(data);
        } else {
          console.log(data);
        }
      }
    } catch (error) {
      console.log(error);
    }
  };

  const validateSignupInputs = () => {
    if (usernameInputRef.current.value.length < 3) {
      setInvalidUsername("Username must be atleast 3 characters long.");
    } else if (usernameInputRef.current.value > 20) {
      setInvalidUsername("Username must be atmost 20 characters long.");
    } else {
      setInvalidUsername("");
    }
    if (passwordInputRef.current.value.length < 6) {
      setInvalidPassword("Password must be atleast 6 characters long.");
    } else {
      setInvalidPassword("");
    }
    if (passwordInputRef.current.value !== confirmPasswordInputRef.current.value) {
      setInvalidConfirmPassword("Confirm Password must match your Password.");
    } else {
      setInvalidConfirmPassword("");
    }
  };

  return (
    <div className={styles.signup_container}>
      <h1>Sign Up</h1>
      <form onSubmit={submitSignup} className={styles.signup_form}>
        <div>
          <label htmlFor="username">Username</label>
          <input type="text" id="username" name="username" ref={usernameInputRef} />
          <p>{invalidUsername}</p>
        </div>
        <div>
          <label htmlFor="password">Password</label>
          <input type="password" id="password" name="password" ref={passwordInputRef} />
          <p>{invalidPassword}</p>
        </div>
        <div>
          <label htmlFor="confirmPassword">Confirm Password</label>
          <input
            type="password"
            id="confirmPassword"
            name="confirmPassword"
            ref={confirmPasswordInputRef}
          />
          <p>{invalidConfirmPassword}</p>
        </div>
        <button>Sign up</button>
      </form>
      <p>
        Already have an account?{" "}
        <Link to={"/login"} ref={loginLinkRef}>
          Log In!
        </Link>{" "}
      </p>
    </div>
  );
};

export default Signup;
