import React, { useRef, useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import classes from './SignUp.module.css'; 
import InnerButton from '../UI/Buttons/InnerButton/InnerButton';
import TextButton from '../UI/Buttons/TextButton/TextButton';
import TextInput from '../UI/Inputs/TextInput/TextInput';
import { InputNumber,Radio } from 'antd';
import { Form } from 'react-dom';
import { registerUser } from '../../http/dataApi';
import { useStores } from '../../Store/StoreProvider';

import PhoneInput from 'react-phone-input-2';
import 'react-phone-input-2/lib/style.css';


const FULLNAME_REGEX = /^[^\s][\p{L}\p{M}\. ]+$/u;
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PWD_REGEX = /^([^\t\n\s]).{7,24}$/;

export const SignUp = () => {
    const navigate = useNavigate();
    const { userStore } = useStores();
    const fullnameRef = useRef();
    const errRef = useRef();

    const [fullname, setFullname] = useState('');
    const [validName, setValidName] = useState(false);
    const [fullnameFocus, setFullnameFocus] = useState(false);

    const [email, setEmail] = useState('');
    const [validEmail, setValidEmail] = useState(false);
    const [emailFocus, setEmailFocus] = useState(false);

    const [pwd, setPwd] = useState('');
    const [validPwd, setValidPwd] = useState(false);
    const [pwdFocus, setPwdFocus] = useState(false);

    const [matchPwd, setMatchPwd] = useState('');
    const [validMatch, setValidMatch] = useState(false);
    const [matchFocus, setMatchFocus] = useState(false);

    const [errMsg, setErrMsg] = useState('');
    const [isFocused, setIsFocused] = useState(false);
    const [phone,setPhone] = useState('');
    const [validPhone, setValidPhone] = useState(false);
    const [age, setAge] = useState(null);
    const [gender, setGender] = useState(null);
    
    // Ошибки для каждого поля
    const [fieldErrors, setFieldErrors] = useState({
        full_name: '',
        email: '',
        password: '',
        age: '',
        gender: '',
        phone: ''
    });

    const options = [
        {
          label: 'м',
          value: 'M',
        },
        {
          label: 'ж',
          value: 'F',
        },
    ]

    useEffect(() => {
        fullnameRef.current.focus();
    }, []);

    useEffect(() => {
        setValidName(FULLNAME_REGEX.test(fullname));
    }, [fullname]);

    useEffect(() => {
        setValidEmail(EMAIL_REGEX.test(email));
    }, [email]);

    useEffect(() => {
        setValidPwd(PWD_REGEX.test(pwd));
        setValidMatch(pwd === matchPwd && pwd.length > 0);
    }, [pwd, matchPwd]);

    useEffect(() => {
        setErrMsg('');
        setFieldErrors({
            full_name: '',
            email: '',
            password: '',
            age: '',
            gender: '',
            phone: ''
        });
    }, [fullname, email, pwd, matchPwd, age, gender, phone]);

    // useEffect(() => {
    //     api.get('/api/getcsrf')
    //     .then((res) => {
    //         console.log('CSRF token set');
    //     })
    //     .catch((err) => {
    //         console.error('Error setting CSRF token:', err);
    //     });
    // }, [errMsg]);

    const handleSubmit = async (event) => {
        event.preventDefault(); 
    
        // Проверка валидности всех полей
        if (!validName || !validEmail || !validPwd || !validMatch) {
            setErrMsg('Пожалуйста, заполните все поля корректно');
            return;
        }
    
        try {
            const userData = {
                email: email,
                password: pwd,
                full_name: fullname,
                age: age,
                gender: gender,
                phone: phone
            };

            const result = await registerUser(userData);
            console.log('Успешная регистрация:', result);
            
            // Обновляем userStore с данными зарегистрированного пользователя
            if (result.user) {
                userStore.setUser({
                    ...result.user,
                    role: "user"
                });
                localStorage.setItem("user", JSON.stringify(userStore.user));
            }
            
            // Мгновенное перенаправление на главную страницу
            navigate('/');
        } catch (error) {
            console.error('Ошибка регистрации:', error);
            
            // Обработка ошибок валидации от сервера
            if (error.errors) {
                const newFieldErrors = {
                    full_name: '',
                    email: '',
                    password: '',
                    age: '',
                    gender: '',
                    phone: ''
                };
                
                // Преобразуем ошибки Django в формат для отображения
                Object.keys(error.errors).forEach(field => {
                    if (Array.isArray(error.errors[field])) {
                        newFieldErrors[field] = error.errors[field].join(', ');
                    } else {
                        newFieldErrors[field] = error.errors[field];
                    }
                });
                
                setFieldErrors(newFieldErrors);
                setErrMsg('Пожалуйста, исправьте ошибки в форме');
            } else {
                setErrMsg(error.message || 'Ошибка регистрации');
            }
            
            if (errRef.current) {
                errRef.current.focus();
            }
        }
    };

    return (
        <div className={classes.main_div}>
            <div className={classes.reg_form_div}>
                <p ref={errRef} className={errMsg ? classes.errmsg : classes.offscreen} aria-live="assertive">{errMsg}</p>
                <h2 >Регистрация</h2>
                <form className={classes.form} method="post" action="/api/register" onSubmit={handleSubmit}>

                    <div className={classes.form_section}>
                        <label className={classes.label} htmlFor="fullname">
                            Полное имя:
                            <span className={validName ? classes.valid : classes.hide}>
                                {/* <FontAwesomeIcon icon={faCheck} /> */}
                            </span>
                            <span className={validName || !fullname ? classes.hide : classes.invalid}>
                                {/* <FontAwesomeIcon icon={faTimes} /> */}
                            </span>
                        </label>
                        <TextInput
                            type="text"
                            id="name"
                            name="name"
                            ref={fullnameRef}
                            autoComplete="off"
                            onChange={(e) => setFullname(e.target.value)}
                            value={fullname}
                            required
                            aria-invalid={validName ? "false" : "true"}
                            aria-describedby="uidnote"
                            onFocus={() => setFullnameFocus(true)}
                            onBlur={() => setFullnameFocus(false)}
                        
                        />
                        <p id="uidnote" className={fullnameFocus && fullname && !validName ? classes.instructions : classes.offscreen}>
                            {/* <FontAwesomeIcon icon={faInfoCircle} /> */}
                            От 4 до 24 символов. Должно начинаться с буквы.
                        </p>
                        {fieldErrors.full_name && (
                            <p className={classes.field_error}>{fieldErrors.full_name}</p>
                        )}
                    </div>

                    <div className={classes.form_section}>
                        <label className={classes.label} htmlFor="email">
                            Email:
                            <span className={validEmail ? classes.valid : classes.hide}>
                                {/* <FontAwesomeIcon icon={faCheck} /> */}
                            </span>
                            <span className={validEmail || !email ? classes.hide : classes.invalid}>
                                {/* <FontAwesomeIcon icon={faTimes} /> */}
                            </span>
                        </label>
                        <TextInput
                            // className={classes.input}
                            type="email"
                            id="email"
                            name="email"
                            onChange={(e) => setEmail(e.target.value)}
                            value={email}
                            required
                            aria-invalid={validEmail ? "false" : "true"}
                            aria-describedby="emailnote"
                            onFocus={() => setEmailFocus(true)}
                            onBlur={() => setEmailFocus(false)}
                        
                        />
                        {fieldErrors.email && (
                            <p className={classes.field_error}>{fieldErrors.email}</p>
                        )}
                    </div>

                    <div>

                        <label className={classes.label} htmlFor="phone">
                           Телефон:
                        </label>

                        <PhoneInput
                            containerStyle={{
                                border: isFocused ? '1px solid var(--gray)' : '1px solid #ccc',
                                borderRadius: '0px',
                                display: 'flex',
                                alignItems: 'center',
                                transition: 'border-color 0.3s ease, box-shadow 0.3s ease'
                            }}
                            inputStyle={{
                                border: 'none',
                                boxShadow: 'none',
                                borderRadius: '0px',
                                height: '40px',
                                flex: 1,
                            }}
                            buttonStyle={{
                                border: 'none',
                                boxShadow: 'none',
                                borderRadius: '0px',
                                height: '40px',
                                display: 'flex',
                                alignItems: 'center',
                            }}
                            country={'ru'}
                            name="phone_number"
                            value={phone}
                            onChange={(value) => setPhone(value)}
                            placeholder="Введите номер телефона"
                            id="phone_number"
                            onFocus={() => setIsFocused(true)}
                            onBlur={() => setIsFocused(false)}
                        />
                        {fieldErrors.phone && (
                            <p className={classes.field_error}>{fieldErrors.phone}</p>
                        )}

                    </div>

                    <div className={classes.form_section}>
                        <label className={classes.label} htmlFor="password">
                            Пароль:
                            {/* <FontAwesomeIcon icon={faCheck} className={validPwd ? classes.valid : classes.hide} /> */}
                            {/* <FontAwesomeIcon icon={faTimes} className={validPwd || !pwd ? classes.hide : classes.invalid} /> */}
                        </label>

                        <TextInput
                            type="password"
                            id="password"
                            name="password"
                            onChange={(e) => setPwd(e.target.value)}
                            value={pwd}
                            required
                            aria-invalid={validPwd ? "false" : "true"}
                            aria-describedby="pwdnote"
                            onFocus={() => setPwdFocus(true)}
                            onBlur={() => setPwdFocus(false)}
                            
                        />
                        <p id="pwdnote" className={pwdFocus && !validPwd ? classes.instructions : classes.offscreen}>
                            {/* <FontAwesomeIcon icon={faInfoCircle} /> */}
                            От 8 до 24 символов.
                        </p>
                        {fieldErrors.password && (
                            <p className={classes.field_error}>{fieldErrors.password}</p>
                        )}
                    </div>

                    <div className={classes.form_section}>
                        <label className={classes.label} htmlFor="confirm_pwd">
                            Подтвердите пароль:
                            {/* <FontAwesomeIcon icon={faCheck} className={validMatch && matchPwd ? classes.valid : classes.hide} /> */}
                            {/* <FontAwesomeIcon icon={faTimes} className={validMatch || !matchPwd ? classes.hide : classes.invalid} /> */}
                        </label>
                        <TextInput
                            type="password"
                            id="confirm_pwd"
                            name="password"
                            onChange={(e) => setMatchPwd(e.target.value)}
                            value={matchPwd}
                            required
                            aria-invalid={validMatch ? "false" : "true"}
                            aria-describedby="confirmnote"
                            onFocus={() => setMatchFocus(true)}
                            onBlur={() => setMatchFocus(false)}
                            
                        />
                        <p id="confirmnote" className={matchFocus && !validMatch ? classes.instructions : classes.offscreen}>
                            {/* <FontAwesomeIcon icon={faInfoCircle} /> */}
                            Пароли должны совпадать.
                        </p>
                    </div>

                    <div className={classes.age}>
                        <label className={classes.label} htmlFor="age">
                           Выберите ваш возраст:
                        </label>
                        <InputNumber 
                            className={classes.input} 
                            min={14} 
                            max={120} 
                            defaultValue={18} 
                            id="age" 
                            name="age"
                            onChange={(value) => setAge(value)}
                        />
                        {fieldErrors.age && (
                            <p className={classes.field_error}>{fieldErrors.age}</p>
                        )}
                    </div>

                    <div className={classes.sex}>
                        <label className={classes.label} htmlFor="sex">
                           Выберите ваш пол:
                        </label>
                        <Radio.Group 
                            className={classes.sexRadio} 
                            block 
                            options={options} 
                            id="sex" 
                            name="sex"
                            onChange={(e) => setGender(e.target.value)}
                        />
                        {fieldErrors.gender && (
                            <p className={classes.field_error}>{fieldErrors.gender}</p>
                        )}
                        
                    </div>
                    <div className={classes.form_section}>
                        <InnerButton style={{height : '39px', marginTop: '0.5rem',marginBottom: '0.5rem'}} disabled={!validName || !validEmail || !validPwd || !validMatch}>
                            Зарегистрироваться
                        </InnerButton>
                    </div>
                    {/* <button className={classes.button} disabled={!validName || !validEmail || !validPwd || !validMatch}>
                        Sign Up
                    </button> */}
                </form>

                <p>
                    Уже зарегистрированы? <br />
                    <Link className={classes.link} to="/signin">
                        <TextButton style={{marginTop: '0.2rem'}}>Войти</TextButton>
                    </Link>
                </p>
            </div>
        </div>
    );
};

export default SignUp;
