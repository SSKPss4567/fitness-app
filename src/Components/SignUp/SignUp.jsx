import React, { useRef, useState, useEffect } from 'react';
// import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
// import { faCheck, faTimes, faInfoCircle } from "@fortawesome/free-solid-svg-icons";
import { Link } from 'react-router-dom';
import classes from './SignUp.module.css'; 
import InnerButton from '../UI/Buttons/InnerButton/InnerButton';
import TextButton from '../UI/Buttons/TextButton/TextButton';
import TextInput from '../UI/Inputs/TextInput/TextInput';
import { InputNumber,Radio } from 'antd';
import { Form } from 'react-dom';


// import SimpleButton from '../UI/Buttons/SimpleButton/SimpleButton';
// import { registration } from '../../http/userAPI';

import PhoneInput from 'react-phone-input-2';
import 'react-phone-input-2/lib/style.css';


const FULLNAME_REGEX = /^[^\s][\p{L}\p{M}\. ]+$/u;
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PWD_REGEX = /^([^\t\n\s]).{7,24}$/;

export const SignUp = () => {
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
    const [success, setSuccess] = useState(false);
    const [isFocused, setIsFocused] = useState(false);
    const [phone,setPhone] = useState('');
    const [validPhone, setValidPhone] = useState(false);

    const options = [
        {
          label: 'м',
          value: true,
        },
        {
          label: 'ж',
          value: false,
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
        setValidMatch(pwd === matchPwd);
    }, [pwd, matchPwd]);

    useEffect(() => {
        setErrMsg('');
    }, [fullname, email, pwd, matchPwd]);

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
    
        
        const formData = new FormData(event.currentTarget);
        console.log(formData.get('fullname'));
        
    
        try {
            const response = await fetch('/api/register', {
                method: 'POST',
                body: formData,
            });
    
            if (!response.ok) {
                throw new Error('Ошибка регистрации');
            }
    
            const result = await response.json();
            console.log('Успешная регистрация:', result);
            setSuccess(true);
        } catch (error) {
            console.error('Ошибка:', error);
            setErrMsg(error.message);
        }
    };

    return (
        <>
        {success ? (
            <div className={classes.main_div}>
                <h1>Success!</h1>
                <p>
                    <Link className={classes.link} to="/signin">Sign In</Link>
                </p>
            </div>
        ) : (
        <div className={classes.main_div}>
            <div className={classes.reg_form_div}>
                <p ref={errRef} className={errMsg ? classes.errmsg : classes.offscreen} aria-live="assertive">{errMsg}</p>
                <h2 >Register</h2>
                <form className={classes.form} method="post" action="/api/register" onSubmit={handleSubmit}>

                    <div className={classes.form_section}>
                        <label className={classes.label} htmlFor="fullname">
                            Fullname:
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
                            4 to 24 characters. Must begin with a letter.
                        </p>
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
                    </div>

                    <div>

                        <label className={classes.label} htmlFor="phone">
                           Phone:
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

                    </div>

                    <div className={classes.form_section}>
                        <label className={classes.label} htmlFor="password">
                            Password:
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
                            8 to 24 characters.
                        </p>
                    </div>

                    <div className={classes.form_section}>
                        <label className={classes.label} htmlFor="confirm_pwd">
                            Confirm Password:
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
                            Must match the first password input field.
                        </p>
                    </div>

                    <div className={classes.age}>
                        <label className={classes.label} htmlFor="age">
                           Choose your age:
                        </label>
                        <InputNumber className={classes.input } min={1} max={100} defaultValue={1} id="age" name="age"/>
                    </div>

                    <div className={classes.sex}>
                        <label className={classes.label} htmlFor="sex">
                           Choose your sex:
                        </label>
                        <Radio.Group className={classes.sexRadio} block options={options} id="sex" name="sex"/>
                        
                    </div>
                    <div className={classes.form_section}>
                        <InnerButton style={{height : '39px', marginTop: '0.5rem',marginBottom: '0.5rem'}} disabled={!validName || !validEmail || !validPwd || !validMatch}>
                            Sign Up
                        </InnerButton>
                    </div>
                    {/* <button className={classes.button} disabled={!validName || !validEmail || !validPwd || !validMatch}>
                        Sign Up
                    </button> */}
                </form>

                <p>
                    Already registered? <br />
                    <Link className={classes.link} to="/signin">
                        <TextButton style={{marginTop: '0.2rem'}}>Sign In</TextButton>
                    </Link>
                </p>
            </div>
        </div>
        )}
        </>
    );
};

export default SignUp;
