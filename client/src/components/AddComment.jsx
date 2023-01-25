import { faInfoCircle } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React, { useEffect, useState } from 'react';
import { axiosPrivate } from '../api/axios';
import useAuth from '../hooks/useAuth';

export default function AddComment({ postId, onAdd }) {
  const [commentInput, setCommentInput] = useState('');
  const [focus, setFocus] = useState(false);
  const { auth } = useAuth();
  const [error, setError] = useState('');

  useEffect(() => setError(''), [commentInput]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const username = auth?.username;
    try {
      const response = await axiosPrivate.put(
        '/post/' + postId + '/comment', //
        JSON.stringify({ text: commentInput, username }),
        {
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );
      setCommentInput('');
      const newComment = { ...response.data };
      onAdd(newComment);
    } catch (error) {
      if (!error?.response) {
        setError('No Server Response');
      } else if (error.response?.status === 400) {
        setError('Please comment less than 100 words!');
      } else if (error.response?.status === 403) {
        setError('Please login to comment!');
      } else {
        setError(`Comment failed: ${error.message}`);
      }
    }
  };

  return (
    <>
      {error && (
        <p className='text-red-500 text-md font-semibold mb-2 text-center'>
          <FontAwesomeIcon icon={faInfoCircle} /> {error}
        </p>
      )}
      <form className='mb-2' onSubmit={handleSubmit}>
        <input
          value={commentInput}
          type='text'
          placeholder='Add comment!'
          autoComplete='off'
          onChange={(e) => setCommentInput(e.target.value)}
          required
          onFocus={() => setFocus(true)}
          onBlur={() => setTimeout(() => setFocus(false), 100)}
          className='shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline focus:border-gray-800'
        />
        {focus && (
          <div>
            <button className='float-right w-24 bg-red-500 hover:bg-red-600 text-white text-xs font-semibold py-2 px-4 border rounded shadow mt-2 ml-4'>
              COMMENT
            </button>
            <button
              onClick={() => setCommentInput('')}
              type='button'
              className='float-right w-24 hover:bg-gray-200 text-gray-700 text-xs font-semibold py-2 px-4 mt-2'
            >
              CANCEL
            </button>
          </div>
        )}
      </form>
    </>
  );
}
