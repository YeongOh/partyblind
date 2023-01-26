import { faInfoCircle, faThumbsUp } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React, { useEffect, useState } from 'react';
import { axiosPrivate } from '../api/axios';
import useAuth from '../hooks/useAuth';

export default function PostDetailLike({
  postId,
  numberOfLikes,
  likedUsernames,
}) {
  const [likes, setLikes] = useState(numberOfLikes);
  const [error, setError] = useState('');
  const [errorVisible, setErrorVisible] = useState(true);
  const { auth } = useAuth();
  const [alreadyLiked, setAlreadyLiked] = useState(
    likedUsernames
      ? likedUsernames.find((username) => username === auth?.username)
      : ''
  );

  // when a page is refreshed, alreadyLiked is false due to auth context being a bit slow

  const alreadyLikedClass = alreadyLiked
    ? 'bg-red-500 text-white'
    : 'bg-gray-300 text-gray-700';

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
      setAlreadyLiked(username);
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
    <>
      {error && errorVisible && (
        <span className='text-red-500 text-md font-semibold left-10 bottom-20 absolute'>
          <FontAwesomeIcon icon={faInfoCircle} /> {error}
        </span>
      )}
      <button
        onClick={handleClick}
        className={`p-3 hover:bg-red-500 hover:text-white rounded-full font-semibold w-24 text-2xl mx-2 ${alreadyLikedClass}`}
      >
        <FontAwesomeIcon icon={faThumbsUp} /> {likes || 0}
      </button>
    </>
  );
}
