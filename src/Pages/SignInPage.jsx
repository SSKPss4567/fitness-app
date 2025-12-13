import React, { useState, useEffect } from 'react';
import SignIn from '../Components/SignIn/SignIn';

const SignInPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [name, setName] = useState('');
  const [sex, setSex] = useState('');
  const [age, setAge] = useState('');
  const [type, setType] = useState('user');
  const [error, setError] = useState(null);
  const [csrfToken, setCsrfToken] = useState('');
  const [data, setData] = useState(null);

  useEffect(() => {
    fetch('/api/getcsrf', {
      method: 'GET',
      credentials: 'same-origin',
    })
      .then((response) => {
        const token = response.headers.get('X-CSRFToken');
        if (token) {
          setCsrfToken(token);
          console.log('CSRF token received:', token);
        } else {
          console.error('CSRF token not found in headers');
        }
      })
      .catch((error) => {
        console.error('Error fetching CSRF token:', error);
      });
  }, []);

  const validateInputs = () => {
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const phonePattern = /^\+\d+$/;
    const namePattern = /^[A-Za-zА-Яа-яЁё\s]+$/;
    const agePattern = /^(?:[1-9][0-9]?|100)$/;
    const validSex = ['мужской', 'женский'];
    const validType = ['user', 'coach'];

    if (!emailPattern.test(email)) return 'Некорректный email';
    if (!phonePattern.test(phoneNumber)) return 'Некоррект';
    if (!namePattern.test(name)) return 'буквы';
    if (!validSex.includes(sex)) return '"мужской" или "женский"';
    if (!agePattern.test(age)) return 'от 1 до 100';
    if (!validType.includes(type)) return '';
    return null;
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setError(null);

    const validationError = validateInputs();
    if (validationError) {
      setError(validationError);
      return;
    }

    try {
      const response = await fetch('http://localhost:5000/api/register', {
        method: 'POST',
        credentials: 'same-origin',
        headers: {
          'Content-Type': 'application/json',
          'X-CSRFToken': csrfToken,
        },
        body: JSON.stringify({ email, password, phone_number: phoneNumber, name, sex, age, type })
      });
      
      const data = await response.json();
      if (response.ok && data.register === true) {
        console.log('Registration successful', data);
      } else {
        setError('Registration failed');
      }
    } catch (err) {
      setError('Server error');
    }
  };

  return (
    <SignIn 
      email={email} 
      setEmail={setEmail} 
      password={password} 
      setPassword={setPassword} 
      phoneNumber={phoneNumber} 
      setPhoneNumber={setPhoneNumber} 
      name={name} 
      setName={setName} 
      sex={sex} 
      setSex={setSex} 
      age={age} 
      setAge={setAge} 
      type={type} 
      setType={setType} 
      handleRegister={handleRegister} 
      error={error}
      csrfToken={csrfToken}
    />
  );
};

export default SignInPage;
