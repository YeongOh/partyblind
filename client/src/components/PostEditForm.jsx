import { faArrowLeft, faInfoCircle } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import useAuth from '../hooks/useAuth';
import useAxiosPrivate from '../hooks/useAxiosPrivate';

export default function PostEditForm({ post, onCancel }) {
  const [title, setTitle] = useState(post.title);
  const [text, setText] = useState(post.text);
  const { auth } = useAuth();
  const axiosPrivate = useAxiosPrivate();
  const navigate = useNavigate();
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    const username = auth?.username;

    try {
      const response = await axiosPrivate.put(
        '/post/' + post.id, //
        JSON.stringify({ title, text, username }),
        {
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );
      navigate(0);
    } catch (error) {
      if (!error?.response) {
        setError('No Server Response');
      } else if (error.response?.status === 401) {
        setError('Username does not match.');
      } else {
        setError(`Edit failed: ${error.message}`);
      }
    }
  };

  return (
    <section className='relative mx-auto mt-12 p-2 text-gray-700 sm:w-full md:w-2/3 lg:w-3/5 xl:w-1/2'>
      {error ? (
        <p className='text-red-500 font-semibold text-lg mb-8 text-center'>
          <FontAwesomeIcon icon={faInfoCircle} /> {error}
        </p>
      ) : (
        <h1 className='font-semibold text-lg mb-8 text-center'>
          Editing your post...
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
          value={title}
          name='title'
          type='text'
          placeholder='title'
          autoComplete='off'
          onChange={(e) => setTitle(e.target.value)}
          required
          className='shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline focus:border-gray-800'
        />
        <label
          className='block text-gray-700 text-m font-semibold my-2 ml-2'
          htmlFor='text'
        >
          Description
        </label>
        <textarea
          value={text}
          name='text'
          type='text'
          placeholder='...'
          autoComplete='off'
          onChange={(e) => setText(e.target.value)}
          required
          className='shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline focus:border-gray-800 h-56'
        />
        <button
          type='button'
          onClick={() => {
            const confirmCancel = window.confirm(
              'Do you really want to cancel?'
            );
            if (!confirmCancel) {
              return;
            }
            onCancel();
            // setError('');
          }}
          className='bg-white hover:bg-gray-100 text-gray-800 font-semibold py-2 w-full mt-4 border border-gray-400 rounded shadow w-20'
        >
          <FontAwesomeIcon icon={faArrowLeft} />
        </button>
        <button className='w-24 bg-red-500 hover:bg-red-600 text-white font-semibold py-2 px-4 border rounded shadow right-2 absolute mt-4'>
          EDIT
        </button>
      </form>
    </section>
  );
}
