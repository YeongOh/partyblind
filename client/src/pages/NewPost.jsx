import {
  faArrowLeft,
  faInfoCircle,
  faPen,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React, { useState } from 'react';
import { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import useAuth from '../hooks/useAuth';
import useAxiosPrivate from '../hooks/useAxiosPrivate';
import useInput from '../hooks/useInput';
import useLogout from '../hooks/useLogout';

const CREATE_POST_URL = '/post';

export default function NewPost() {
  const { auth, setAuth } = useAuth();
  const navigate = useNavigate();
  const axiosPrivate = useAxiosPrivate();
  const logout = useLogout();

  const location = useLocation();
  const from = location.state?.from?.pathname || '/';

  // const [title, setTitle] = useState('');
  // const [text, setText] = useState('');
  const [title, titleAttributes] = useInput('post_title', '');
  const [text, textAttributes] = useInput('post_text', '');
  const [error, setError] = useState('');

  useEffect(() => {
    setError('');
  }, [title, text]);

  const goBack = () => {
    navigate(from, { replace: true });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const username = auth?.username;
    try {
      const response = await axiosPrivate.post(
        CREATE_POST_URL, //
        JSON.stringify({ title, text, username }),
        {
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );
      localStorage.removeItem('post_title');
      localStorage.removeItem('post_text');
      const post = response.data;
      navigate(`/post/${post.id}`, { state: { post } });
    } catch (error) {
      if (!error?.response) {
        setError('No Server Response');
      } else if (error.response?.status === 400) {
        setError('Title or text is missing.');
      } else if (error.response?.status === 403) {
        setError('You are not logged in.');
        // navigate to login page
        console.log(error.message);
        setAuth({});
        logout();
        console.log('refresh token expired');
        navigate('/login', { state: { from: location }, replace: true });
      } else {
        setError(`Post failed: ${error.message}`);
      }
    }
  };

  return (
    <section className='mx-auto mt-12 relative sm:w-full md:w-2/3 lg:w-3/5 xl:w-1/2'>
      {error ? (
        <p className='text-red-500 text-lg font-semibold mb-8 text-center'>
          <FontAwesomeIcon icon={faInfoCircle} /> {error}
        </p>
      ) : (
        <h1 className='font-semibold text-3xl mb-8 text-center'>
          Create your post!
        </h1>
      )}
      <form onSubmit={handleSubmit}>
        <label
          className='block text-gray-700 text-xl font-semibold mb-2 ml-2'
          htmlFor='title'
        >
          Title
        </label>
        <input
          name='title'
          type='text'
          placeholder='title'
          autoComplete='off'
          required
          {...titleAttributes}
          className='text-2xl font-bold shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline focus:border-gray-800'
        />
        <label
          className='block text-gray-700 text-xl font-semibold my-2 ml-2'
          htmlFor='text'
        >
          Description
        </label>
        <textarea
          name='text'
          type='text'
          autoComplete='off'
          required
          {...textAttributes}
          className='text-xl shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline focus:border-gray-800 h-96'
        />
        <div className='flex items-center justify-between mt-4'>
          <button
            type='button'
            onClick={goBack}
            className='p-3 bg-gray-300 rounded-full font-semibold text-md w-24 text-2xl'
          >
            <FontAwesomeIcon icon={faArrowLeft} />
          </button>
          <button className='p-3 hover:text-white hover:bg-red-500 bg-gray-300 rounded-full font-semibold text-md w-24 text-2xl'>
            <FontAwesomeIcon icon={faPen} />
          </button>
        </div>
      </form>
    </section>
  );
}
