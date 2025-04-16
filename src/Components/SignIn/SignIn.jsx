import React, { useRef, useState, useEffect } from "react";
import { Link } from "react-router-dom";
import classes from "./SignIn.module.css";
import InnerButton from "../UI/Buttons/InnerButton/InnerButton";
import TextButton from "../UI/Buttons/TextButton/TextButton";
import TextInput from "../UI/Inputs/TextInput/TextInput";
import { observer } from "mobx-react";
import { useStores } from "../../Store/StoreProvider";

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PWD_REGEX = /^([^\t\n\s]).{7,24}$/;

export const SignIn = observer(() => {
  const { userStore } = useStores();
  const { setUser, setAuth, fetchUserOrders, signIn } = userStore;
  const emailRef = useRef();
  const errRef = useRef();

  const [email, setEmail] = useState("");
  const [validEmail, setValidEmail] = useState(false);
  const [emailFocus, setEmailFocus] = useState(false);

  const [pwd, setPwd] = useState("");
  const [validPwd, setValidPwd] = useState(false);
  const [pwdFocus, setPwdFocus] = useState(false);

  const [errMsg, setErrMsg] = useState("");
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    emailRef.current.focus();
  }, []);

  useEffect(() => {
    setValidEmail(EMAIL_REGEX.test(email));
  }, [email]);

  useEffect(() => {
    setValidPwd(PWD_REGEX.test(pwd));
  }, [pwd]);

  useEffect(() => {
    setErrMsg("");
  }, [email, pwd]);

  // const handleSubmit = async (e) => {
  //     e.preventDefault();
  //     if (!validEmail || !validPwd) {
  //         setErrMsg("Invalid Entry");
  //         return;
  //     }
  //     setLoading(true);
  //     try {
  //         const response = await login(email, pwd);
  //         console.log(response);
  //         const { accessToken, currentUser } = response.data;
  //         console.log(toJS(currentUser), accessToken);
  //         // setUser({ ...currentUser });
  //         // setAuth(accessToken);
  //         // fetchCart(currentUser.user_id);
  //         // fetchUserOrders();
  //         // setSuccess(true);
  //         // resetForm();
  //     } catch (err) {
  //         setErrMsg(getErrorMessage(err));
  //         errRef.current.focus();
  //     } finally {
  //         setLoading(false);
  //     }
  // };

  //   ТЕСТОВАЯ ВЕРСИЯ КОТОРАЯ РАБОТАЕТ С МОКОВЫМИ ДАННЫМИ
  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validEmail || !validPwd) {
      setErrMsg("Invalid Entry");
      return;
    }
    // setLoading(true);
    signIn(email, pwd);
    setSuccess(true);
    // resetForm();

    // try {
    // } catch (err) {
    //     setErrMsg(getErrorMessage(err));
    //     errRef.current.focus();
    // } finally {
    //     // setLoading(false);
    // }
  };

  const getErrorMessage = (error) => {
    if (!error.response) return "No Server Response";
    switch (error.response.status) {
      case 400:
        return "Missing Email or Password";
      case 401:
        return "Unauthorized";
      default:
        return "Login Failed";
    }
  };

  const resetForm = () => {
    setEmail("");
    setPwd("");
  };

  return (
    <>
      {success ? (
        <div className={classes.main_div}>
          <h1 className={classes.h1}>You're logged in</h1>
          <Link to="/">Shop</Link>
        </div>
      ) : (
        <div className={classes.main_div}>
          <div className={classes.reg_form_div}>
            <p
              ref={errRef}
              className={errMsg ? classes.errmsg : classes.offscreen}
              aria-live="assertive"
            >
              {errMsg}
            </p>
            <h2>Login</h2>
            <form className={classes.form}>
              <div>
                <label className={classes.label} htmlFor="email">
                  Email:
                </label>
                <TextInput
                  ref={emailRef}
                  type="email"
                  id="email"
                  className={classes.input}
                  onChange={(e) => setEmail(e.target.value)}
                  value={email}
                  isRequired={true}
                  aria-invalid={validEmail ? "false" : "true"}
                  ariaDescribedby="emailnote"
                  onFocus={() => setEmailFocus(true)}
                  onBlur={() => setEmailFocus(false)}
                />
                <p
                  id="emailnote"
                  className={
                    emailFocus && !validEmail
                      ? classes.instructions
                      : classes.offscreen
                  }
                >
                  Enter a valid email address.
                </p>
              </div>

              <div>
                <label className={classes.label} htmlFor="password">
                  Password:
                </label>
                <TextInput
                  type="password"
                  id="password"
                  className={classes.input}
                  onChange={(e) => setPwd(e.target.value)}
                  value={pwd}
                  isRequired={true}
                  aria-invalid={validPwd ? "false" : "true"}
                  ariaDescribedby="pwdnote"
                  onFocus={() => setPwdFocus(true)}
                  onBlur={() => setPwdFocus(false)}
                />
                <p
                  id="pwdnote"
                  className={
                    pwdFocus && !validPwd
                      ? classes.instructions
                      : classes.offscreen
                  }
                >
                  Password must be 8 to 24 characters.
                </p>
              </div>

              <div
                className={classes.submit_button_box}
                style={{ marginBottom: "0.7rem" }}
              >
                <InnerButton
                  disabled={!validEmail || !validPwd || loading}
                  onClick={handleSubmit}
                >
                  {loading ? "Signing In..." : "Sign In"}
                </InnerButton>
              </div>
            </form>

            <p>
              Don't have an account? <br />
              <Link to="/signup">
                <TextButton>Sign Up</TextButton>
              </Link>
            </p>
          </div>
        </div>
      )}
    </>
  );
});

export default SignIn;