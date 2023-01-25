import React from 'react';
import { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from '../api/axios';
import {
  faCheck,
  faTimes,
  faInfoCircle,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

const USERNAME_REGEX = /^[A-z][A-z0-9-_]{3,23}$/;
const PASSWORD_REGEX =
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%]).{8,24}$/;
const REGISTER_URL = '/auth/signup';

export default function SignUp() {
  // allows us to set the focus on user input when the component loads
  const userRef = useRef();

  const [username, setUsername] = useState('');
  const [validUsername, setValidUsername] = useState(false);
  const [usernameFocus, setUsernameFocus] = useState(false);

  const [password, setPassword] = useState('');
  const [validPassword, setValidPassword] = useState(false);
  const [passwordFocus, setPasswordFocus] = useState(false);

  const [confirmPassword, setConfirmPassword] = useState('');
  const [validConfirmPassword, setValidConfirmPassword] = useState(false);
  const [confirmPasswordFocus, setConfirmPasswordFocus] = useState(false);

  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const usernameBorder = validUsername
    ? 'border-green-400 focus:border-green-400'
    : 'focus:border-gray-800';

  const passwordBorder = validPassword
    ? 'border-green-400 focus:border-green-400'
    : 'focus:border-gray-800';

  const confirmPasswordBorder = validConfirmPassword
    ? 'border-green-400 focus:border-green-400'
    : 'focus:border-gray-800';

  const disableRegisterButton =
    validUsername && validPassword && validConfirmPassword && !error
      ? ''
      : 'opacity-50 cursor-not-allowed';

  useEffect(() => {
    userRef.current.focus();
  }, []);

  useEffect(() => {
    const result = USERNAME_REGEX.test(username);
    setValidUsername(result);
  }, [username]);

  useEffect(() => {
    const result = PASSWORD_REGEX.test(password);
    setValidPassword(result);
    const isMatching = password === confirmPassword && password;
    setValidConfirmPassword(isMatching);
  }, [password, confirmPassword]);

  useEffect(() => {
    setError('');
  }, [username, password, confirmPassword]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    // check inputs again (button could be enabled with JS hack)
    const v1 = USERNAME_REGEX.test(username);
    const v2 = PASSWORD_REGEX.test(password);
    if (!v1 || !v2) {
      setError('Invalid Entry');
      return;
    }

    try {
      await axios.post(
        REGISTER_URL, //
        JSON.stringify({ username, password }),
        {
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );
      setPassword('');
      setConfirmPassword('');
      setSuccess(true);
    } catch (error) {
      if (!error?.response) {
        setError('No Server Response');
      } else if (error.response?.status === 409) {
        setError('Username already exists.');
        setValidUsername(false);
      } else {
        setError(`Registration failed: ${error.message}`);
      }
    }
  };

  return (
    <>
      {success ? (
        <section className='w-96 mx-auto'>
          <h1 className='font-semibold'>Welcome to PartyBlind, {username}!</h1>
        </section>
      ) : (
        <section className='w-60 mx-auto'>
          <form onSubmit={handleSubmit}>
            <h1 className='font-semibold md:text-xl md:my-10 sm:my-10 text-center'>
              Create your new account!
            </h1>
            {error && (
              <p className='text-red-500 font-semibold mb-4'>{`${error}`}</p>
            )}
            <label
              className='block text-gray-700 text-m font-semibold mb-2'
              htmlFor='username'
            >
              Username
              {validUsername && (
                <FontAwesomeIcon className='text-green-400' icon={faCheck} />
              )}
              {username && !validUsername && (
                <FontAwesomeIcon className='text-red-400' icon={faTimes} />
              )}
            </label>
            <input
              id='username'
              ref={userRef}
              autoComplete='off'
              type='text'
              placeholder='username'
              required
              className={`shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline ${usernameBorder}`}
              onChange={(e) => setUsername(e.target.value)}
              onFocus={() => setUsernameFocus(true)}
              onBlur={() => setUsernameFocus(false)}
            />
            {usernameFocus && username && !validUsername && (
              <p className='w-96 text-red-500 mt-2 text-sm'>
                <FontAwesomeIcon icon={faInfoCircle} /> 4 to 24 characters.{' '}
                <br />
                Must begin with a letter. <br />
                Letters, numbers, underscore, hyphens allowed.
              </p>
            )}

            <label
              className='block text-gray-700 text-m font-semibold mb-2 mt-2'
              htmlFor='password'
            >
              Password
              {validPassword && validConfirmPassword && (
                <FontAwesomeIcon className='text-green-400' icon={faCheck} />
              )}
              {password &&
                confirmPassword &&
                (!validPassword || !validConfirmPassword) && (
                  <FontAwesomeIcon className='text-red-400' icon={faTimes} />
                )}
            </label>
            <input
              id='password'
              type='password'
              placeholder='password'
              required
              className={`shadow appearance-none border rounded w-full py-2 px-3 mb-2 text-gray-700 leading-tight focus:outline-none focus:shadow-outline ${passwordBorder}`}
              onChange={(e) => setPassword(e.target.value)}
              onFocus={() => setPasswordFocus(true)}
              onBlur={() => setPasswordFocus(false)}
            />
            {passwordFocus && password && !validPassword && (
              <p className='w-96 text-red-500 mb-2 text-sm'>
                <FontAwesomeIcon icon={faInfoCircle} /> 8 to 24 characters.{' '}
                <br />
                Must include uppercase and lowercase letters, a number and a
                special character Letters. <br />
                Allowed special characters: ! @ # $ %
              </p>
            )}

            <input
              id='confirmPassword'
              type='password'
              placeholder='confirm password'
              required
              className={`shadow appearance-none border rounded w-full py-2 px-3 mb-2 text-gray-700 leading-tight focus:outline-none focus:shadow-outline ${confirmPasswordBorder}`}
              onChange={(e) => setConfirmPassword(e.target.value)}
              onFocus={() => setConfirmPasswordFocus(true)}
              onBlur={() => setConfirmPasswordFocus(false)}
            />
            {!validConfirmPassword &&
              confirmPasswordFocus &&
              password &&
              confirmPassword && (
                <p className='w-96 text-red-500 text-sm'>
                  <FontAwesomeIcon icon={faInfoCircle} /> Must match the first
                  password.
                </p>
              )}

            <button
              disabled={
                validUsername && validPassword && validConfirmPassword && !error
                  ? false
                  : true
              }
              className={`bg-white hover:bg-gray-100 text-gray-800 font-semibold py-2 w-full mt-4 border border-gray-400 rounded shadow ${disableRegisterButton}`}
            >
              Sign Up
            </button>
          </form>
          <div className='mt-3 mr-2 text-right'>
            <p className='text-sm inline'> Already registered? </p>
            <Link className='text-sm font-semibold inline' to='/login'>
              Sign In
            </Link>
          </div>
        </section>
      )}
    </>
  );
}
