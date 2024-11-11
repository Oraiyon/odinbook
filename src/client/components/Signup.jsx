import { useRef } from "react";
import styles from "../stylesheets/Signup.module.css";

const Signup = () => {
  const usernameInputRef = useRef(null);
  const passwordInputRef = useRef(null);
  const confirmPasswordInputRef = useRef(null);

  const submitSignup = async (e) => {
    try {
      e.preventDefault();
      // Validate here
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
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <>
      <h1>Sign up</h1>
      <form onSubmit={submitSignup}>
        <div className={styles.username_input}>
          <label htmlFor="username">Username</label>
          <input type="text" id="username" name="username" ref={usernameInputRef} />
        </div>
        <div className={styles.password_input}>
          <label htmlFor="password">Password</label>
          <input type="password" id="password" name="password" ref={passwordInputRef} />
        </div>
        <div className={styles.confirm_password_input}>
          <label htmlFor="confirmPassword">Confirm Password</label>
          <input
            type="password"
            id="confirmPassword"
            name="confirmPassword"
            ref={confirmPasswordInputRef}
          />
        </div>
        <button>Sign up</button>
      </form>
    </>
  );
};

export default Signup;
