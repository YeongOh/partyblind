import { faInfoCircle } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React, { useEffect, useState } from 'react';
import useAuth from '../hooks/useAuth';
import useAxiosPrivate from '../hooks/useAxiosPrivate';

export default function AddComment({ postId, onAdd }) {
  const [commentInput, setCommentInput] = useState('');
  const [focus, setFocus] = useState(false);
  const { auth } = useAuth();
  const [error, setError] = useState('');
  const axiosPrivate = useAxiosPrivate();

  useEffect(() => setError(''), [commentInput]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const username = auth?.username;
    try {
      const response = await axiosPrivate.post(
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
      } else if (error.response?.status === 401) {
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
          <div className='mt-3 mb-6 flex justify-end w-full'>
            <button
              onClick={() => setCommentInput('')}
              type='button'
              className='p-3 hover:bg-gray-300 rounded-full font-semibold text-md'
            >
              Cancel
            </button>
            <button className='py-3 px-5 bg-gray-300 rounded-full hover:bg-red-500 hover:text-white font-semibold ml-4'>
              Comment
            </button>
          </div>
        )}
      </form>
    </>
  );
}
