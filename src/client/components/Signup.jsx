import { useRef } from "react";
import styles from "../stylesheets/Signup.module.css";
import { Link } from "react-router-dom";

const Signup = () => {
  const usernameInputRef = useRef(null);
  const passwordInputRef = useRef(null);
  const confirmPasswordInputRef = useRef(null);
  const invalidUsernameRef = useRef(null);
  const invalidPasswordRef = useRef(null);
  const invalidConfirmPasswordRef = useRef(null);

  const submitSignup = async (e) => {
    try {
      e.preventDefault();
      validateSignupInputs();
      if (
        !usernameInputRef.current.value ||
        !passwordInputRef.current.value ||
        passwordInputRef.current.value !== confirmPasswordInputRef.current.value
      ) {
        await fetch("/signup", {
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
      }
    } catch (error) {
      console.log(error);
    }
  };

  const validateSignupInputs = () => {
    if (!usernameInputRef.current.value || usernameInputRef.current.value.length < 3) {
      invalidUsernameRef.current.innerText = "Username must be atleast 3 characters long.";
    } else if (usernameInputRef.current.value > 20) {
      invalidUsernameRef.current.innerText = "Username must be atmost 20 characters long.";
    } else {
      invalidUsernameRef.current.innerText = "";
    }
    if (!passwordInputRef.current.value || passwordInputRef.current.value.length < 3) {
      invalidPasswordRef.current.innerText = "Password must be atleast 6 characters long.";
    } else {
      invalidPasswordRef.current.innerText = "";
    }
    if (passwordInputRef.current.value !== confirmPasswordInputRef.current.value) {
      invalidConfirmPasswordRef.current.innerText = "Confirm Password must match your Password.";
    } else {
      invalidConfirmPasswordRef.current.innerText = "";
    }
  };

  return (
    <div className={styles.signup_container}>
      <h1>Sign up</h1>
      <form onSubmit={submitSignup} className={styles.signup_form}>
        <div>
          <label htmlFor="username">Username</label>
          <input type="text" id="username" name="username" ref={usernameInputRef} />
          <p ref={invalidUsernameRef}></p>
        </div>
        <div>
          <label htmlFor="password">Password</label>
          <input type="password" id="password" name="password" ref={passwordInputRef} />
          <p ref={invalidPasswordRef}></p>
        </div>
        <div>
          <label htmlFor="confirmPassword">Confirm Password</label>
          <input
            type="password"
            id="confirmPassword"
            name="confirmPassword"
            ref={confirmPasswordInputRef}
          />
          <p ref={invalidConfirmPasswordRef}></p>
        </div>
        <button>Sign up</button>
      </form>
      <p>
        Already have an account? <Link to={"/login"}>Login!</Link>
      </p>
    </div>
  );
};

export default Signup;
