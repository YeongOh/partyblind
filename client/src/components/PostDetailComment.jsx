import { faInfoCircle } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React, { useEffect, useState } from 'react';
import ReactTimeAgo from 'react-time-ago';
import { axiosPrivate } from '../api/axios';
import useAuth from '../hooks/useAuth';

export default function PostDetailComment({ postId, postUsername, comments }) {
  const [error, setError] = useState('');
  const { auth } = useAuth();

  const [commentInput, setCommentInput] = useState('');
  const [focus, setFocus] = useState(false);

  useEffect(() => setError(''), [commentInput]);

  const onComment = async (e) => {
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
      const newComment = response.data;
      const tempKey = new Date().getTime();
      // fix key error
      comments.push({ id: tempKey, ...newComment });
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
    <section className='relative mx-auto p-2 text-gray-700 mt-20 sm:w-full md:w-2/3 lg:w-3/5 xl:w-1/2'>
      {error && (
        <p className='text-red-500 text-md font-semibold mb-2 text-center'>
          <FontAwesomeIcon icon={faInfoCircle} /> {error}
        </p>
      )}
      <form className='mb-2' onSubmit={onComment}>
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
      <ul className='mt-6'>
        {comments.length === 0 && 'Be the first to comment!'}
        {comments &&
          comments
            .sort((a, b) => b.commentTime - a.commentTime)
            .map((comment) => (
              <li key={comment._id} className='my-4 ml-1'>
                <div className='text-sm text-gray-500 mb-1'>
                  <span className='font-semibold'>
                    {comment.commentUsername}
                  </span>
                  {comment.commentUsername === postUsername && (
                    <span className='font-semibold text-blue-400 ml-2'>OP</span>
                  )}
                  <ReactTimeAgo
                    className='ml-4'
                    date={comment?.commentTime}
                    locale='en-US'
                    timeStyle='twitter'
                  />
                </div>
                <span className='whitespace-pre-wrap truncate'>
                  {comment.commentText}
                </span>
              </li>
            ))}
      </ul>
    </section>
  );
}
