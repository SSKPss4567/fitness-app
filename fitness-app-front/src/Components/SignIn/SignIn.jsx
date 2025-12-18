import React, { useRef, useState, useEffect } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import classes from "./SignIn.module.css";
import InnerButton from "../UI/Buttons/InnerButton/InnerButton";
import TextButton from "../UI/Buttons/TextButton/TextButton";
import TextInput from "../UI/Inputs/TextInput/TextInput";
import { observer } from "mobx-react";
import { useStores } from "../../Store/StoreProvider";
import { loginUser } from "../../http/dataApi";

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PWD_REGEX = /^([^\t\n\s]).{7,24}$/;

export const SignIn = observer(() => {
  const { userStore } = useStores();
  const { isLoggedIn, user } = userStore;
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const emailRef = useRef();
  const errRef = useRef();

  const [email, setEmail] = useState("");
  const [validEmail, setValidEmail] = useState(false);
  const [emailFocus, setEmailFocus] = useState(false);

  const [pwd, setPwd] = useState("");
  const [validPwd, setValidPwd] = useState(false);
  const [pwdFocus, setPwdFocus] = useState(false);

  const [errMsg, setErrMsg] = useState("");
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validEmail || !validPwd) {
      setErrMsg("Пожалуйста, заполните все поля корректно");
      return;
    }
    
    setLoading(true);
    setErrMsg("");
    
    try {
      const result = await loginUser(email, pwd);
      console.log('Успешный вход:', result);
      
      // Обновляем userStore с данными пользователя
      if (result.user) {
        userStore.setUser({
          ...result.user,
          role: "user"
        });
        localStorage.setItem("user", JSON.stringify(userStore.user));
      }
      
      // Перенаправление на страницу из параметра next или на главную
      const nextUrl = searchParams.get('next');
      navigate(nextUrl || '/');
    } catch (error) {
      console.error('Ошибка входа:', error);
      
      // Обработка ошибок валидации от формы
      if (error.errors) {
        // Если есть конкретные ошибки полей, показываем первую
        const firstError = Object.values(error.errors)[0];
        if (Array.isArray(firstError)) {
          setErrMsg(firstError[0]);
        } else {
          setErrMsg(firstError);
        }
      } else if (error.message.includes('401')) {
        setErrMsg('Неверный email или пароль');
      } else {
        setErrMsg(error.message || 'Ошибка входа');
      }
      
      if (errRef.current) {
        errRef.current.focus();
      }
    } finally {
      setLoading(false);
    }
  };


  useEffect(() => {
    if (isLoggedIn && user && user.id) {
      navigate("/");
    }
  }, [isLoggedIn, user, navigate]);

  return (
    <>
      {!isLoggedIn && (
        <div className={classes.main_div}>
          <div className={classes.reg_form_div}>
            <p
              ref={errRef}
              className={errMsg ? classes.errmsg : classes.offscreen}
              aria-live="assertive"
            >
              {errMsg}
            </p>
            <h2>Вход</h2>
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
                  Введите корректный email адрес.
                </p>
              </div>

              <div>
                <label className={classes.label} htmlFor="password">
                  Пароль:
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
                  Пароль должен содержать от 8 до 24 символов.
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
                  {loading ? "Вход..." : "Войти"}
                </InnerButton>
              </div>
            </form>

            <p>
              Нет аккаунта? <br />
              <Link to="/signup">
                <TextButton>Зарегистрироваться</TextButton>
              </Link>
            </p>
          </div>
        </div>
      )}
    </>
  );
});

export default SignIn;