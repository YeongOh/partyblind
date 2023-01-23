import { faComment, faThumbsUp } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React from 'react';
import { useNavigate } from 'react-router-dom';
import ReactTimeAgo from 'react-time-ago';

export default function Post({ post }) {
  const { id, title, username, createdAt, text, numberOfLikes, comments } =
    post;
  const navigate = useNavigate();

  // showText ? show text : show only title
  const handleClick = () => {
    navigate(`/post/${id}`, { state: { post } });
  };

  return (
    <li
      onClick={handleClick}
      className='cursor-pointer border relative flex flex-col justify-between h-60 p-5 min-w-0'
    >
      <h1 className='text-xl text-gray-800 truncate'>{title}</h1>
      <span className='text-sm text-gray-800 truncate opacity-70'>{text}</span>
      <div className='flex justify-between items-center text-sm text-gray-500'>
        <div className='font-semibold'>
          <span>{username}</span>
          {numberOfLikes > 0 && (
            <span className='ml-2 text-red-500'>
              <FontAwesomeIcon icon={faThumbsUp} /> {numberOfLikes}
            </span>
          )}
          {comments.length !== 0 && (
            <span className='ml-2 text-gray-600'>
              <FontAwesomeIcon icon={faComment} /> {comments.length}
            </span>
          )}
        </div>
        <ReactTimeAgo className='opacity-80' date={createdAt} locale='en-US' />
      </div>
    </li>
  );
}
