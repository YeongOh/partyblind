import { faInfoCircle, faThumbsUp } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React, { useEffect, useState } from 'react';
import { axiosPrivate } from '../api/axios';
import useAuth from '../hooks/useAuth';

export default function PostDetailLike({ postId, numberOfLikes }) {
  const [likes, setLikes] = useState(numberOfLikes);
  const [error, setError] = useState('');
  const [errorVisible, setErrorVisible] = useState(true);
  const { auth } = useAuth();

  // TODO: a user cannot like his own post

  useEffect(() => {
    setTimeout(() => setErrorVisible(false), 5 * 1000);
  }, [error]);

  const handleClick = async (e) => {
    e.preventDefault();
    const username = auth?.username;
    try {
      const response = await axiosPrivate.put(
        '/post/' + postId + '/like', //
        JSON.stringify({ username }),
        {
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );
      setLikes(response.data);
    } catch (error) {
      if (!error?.response) {
        setError('No Server Response');
      } else if (error.response?.status === 401) {
        setError('You already liked this post.');
      } else {
        setError(`Like failed: ${error.message}`);
      }
    }
  };

  return (
    <div className='text-center mt-20'>
      <button
        onClick={handleClick}
        className='bg-white hover:bg-gray-100 text-red-500 font-semibold text-s py-2 w-24 border border-gray-400 rounded shadow'
      >
        <FontAwesomeIcon icon={faThumbsUp} className='ml-r' /> {likes || 0}
      </button>
      {error && errorVisible && (
        <p className='text-red-500 text-md font-semibold mt-2'>
          <FontAwesomeIcon icon={faInfoCircle} /> {error}
        </p>
      )}
    </div>
  );
}
