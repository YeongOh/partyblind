import { faArrowLeft, faInfoCircle } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React, { useState } from 'react';
import { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { logout } from '../api/postApi';
import useAuth from '../hooks/useAuth';
import useAxiosPrivate from '../hooks/useAxiosPrivate';
import useInput from '../hooks/useInput';

const CREATE_POST_URL = '/post';

export default function NewPost() {
  const { auth, setAuth } = useAuth();
  const navigate = useNavigate();
  const axiosPrivate = useAxiosPrivate();

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
    <section className='w-1/2 mx-auto mt-12 relative'>
      {error ? (
        <p className='text-red-500 text-lg font-semibold mb-8 text-center'>
          <FontAwesomeIcon icon={faInfoCircle} /> {error}
        </p>
      ) : (
        <h1 className='font-semibold text-lg mb-8 text-center'>
          Create your post!
        </h1>
      )}
      <form onSubmit={handleSubmit}>
        <label
          className='block text-gray-700 text-m font-semibold mb-2 ml-2'
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
          // onChange={(e) => setTitle(e.target.value)}
          className='shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline focus:border-gray-800'
        />
        <label
          className='block text-gray-700 text-m font-semibold my-2 ml-2'
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
          // onChange={(e) => setText(e.target.value)}
          className='shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline focus:border-gray-800 h-56'
        />
        <div>
          <button
            type='button'
            onClick={goBack}
            className='bg-white hover:bg-gray-100 text-gray-800 font-semibold py-2 w-full mt-4 border border-gray-400 rounded shadow w-20'
          >
            <FontAwesomeIcon icon={faArrowLeft} />
          </button>
          <button className='w-24 bg-red-500 hover:bg-red-600 text-white font-semibold py-2 px-4 border rounded shadow right-2 absolute mt-4'>
            POST
          </button>
        </div>
      </form>
    </section>
  );
}
