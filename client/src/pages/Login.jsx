import React, { useEffect, useRef, useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
// import { useAuthContext } from '../context/AuthContext';
import axios from '../api/axios';
import { faInfoCircle } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import useAuth from '../hooks/useAuth';
import useInput from '../hooks/useInput';

const LOGIN_URL = '/auth/login';

export default function Login() {
  const { auth, setAuth, persist, setPersist } = useAuth({});
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || '/';

  const userRef = useRef();

  const [username, usernameAttributes] = useInput('login_username', ''); // useState();
  const [password, setPassword] = useState();
  const [error, setError] = useState('');

  useEffect(() => {
    userRef.current.focus();

    if (!localStorage.getItem('login_trust')) setPersist(true);
    // eslint-disable-next-line
  }, []);

  useEffect(() => {
    setError('');
  }, [username, password]);

  useEffect(() => {
    if (auth?.accessToken) {
      navigate(from, { replace: true });
    }
    // eslint-disable-next-line
  }, [auth]);

  const togglePersist = () => {
    setPersist((prev) => !prev);
  };

  useEffect(() => {
    localStorage.setItem('login_trust', persist);
  }, [persist]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        LOGIN_URL, //
        JSON.stringify({ username, password }),
        {
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );
      const accessToken = response?.data?.accessToken;
      // const roles = response?.data?.roles;
      setPassword('');
      setAuth({ username, accessToken });
    } catch (error) {
      if (!error?.response) {
        setError('No Server Response');
      } else if (error.response?.status === 400) {
        setError('Missing Username or Password.');
      } else if (error.response?.status === 401) {
        setError('Username or password is incorrect.');
      } else {
        setError(`Log in failed: ${error.message}`);
      }
    }
  };

  return (
    <>
      {/* {auth && <Navigate to='/' replace/>} */}

      <section className='w-60 mx-auto mt-20'>
        <form onSubmit={handleSubmit}>
          {error && (
            <p className='w-80 text-red-500 font-semibold mb-4'>
              <FontAwesomeIcon icon={faInfoCircle} /> {error}
            </p>
          )}
          <label
            className='block text-gray-700 text-m font-semibold mb-2'
            htmlFor='username'
          >
            Username
          </label>
          <input
            id='username'
            ref={userRef}
            autoComplete='off'
            type='text'
            placeholder='username'
            required
            // onChange={(e) => setUsername(e.target.value)}
            {...usernameAttributes}
            className='shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline focus:border-gray-800'
          />
          <label
            className='block text-gray-700 text-m font-semibold mb-2 mt-2'
            htmlFor='password'
          >
            Password
          </label>
          <input
            id='password'
            type='password'
            placeholder='password'
            required
            onChange={(e) => setPassword(e.target.value)}
            className='shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 mb-2 leading-tight focus:outline-none focus:shadow-outline focus:border-gray-800'
          />
          <div className='flex items-align my-1'>
            <input
              type='checkbox'
              id='persist'
              onChange={togglePersist}
              checked={persist}
            />
            <label
              htmlFor='persist'
              className='block text-gray-700 text-sm ml-2'
            >
              Trust this device?
            </label>
          </div>
          <button className='bg-white hover:bg-gray-100 text-gray-800 font-semibold py-2 w-full mt-2 border border-gray-400 rounded shadow'>
            Sign In
          </button>
        </form>

        <div className='mt-3 mr-2 text-right'>
          <p className='text-sm inline'> Need an account? </p>
          <Link className='text-sm font-semibold inline' to='/signup'>
            Sign Up
          </Link>
        </div>
      </section>
    </>
  );
}
