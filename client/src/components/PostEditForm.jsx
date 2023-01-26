import {
  faArrowLeft,
  faEdit,
  faInfoCircle,
} from '@fortawesome/free-solid-svg-icons';
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
        <h1 className='font-semibold mb-8 text-center text-3xl'>
          Editing your post!
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
          value={title}
          name='title'
          type='text'
          placeholder='title'
          autoComplete='off'
          onChange={(e) => setTitle(e.target.value)}
          required
          className='text-2xl font-bold shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline focus:border-gray-800'
        />
        <label
          className='block text-gray-700 text-xl font-semibold my-2 ml-2'
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
          className='text-xl shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline focus:border-gray-800 h-96'
        />
        <div className='flex items-center justify-between mt-4'>
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
            className='p-3 bg-gray-300 rounded-full font-semibold text-md w-24 text-2xl'
          >
            <FontAwesomeIcon icon={faArrowLeft} />
          </button>
          <button className='p-3 hover:text-white hover:bg-red-500 bg-gray-300 rounded-full font-semibold text-md w-24 text-2xl'>
            <FontAwesomeIcon icon={faEdit} />
          </button>
        </div>
      </form>
    </section>
  );
}
