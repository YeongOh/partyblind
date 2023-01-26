import { faComment, faThumbsUp } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React from 'react';
import { useNavigate } from 'react-router-dom';
import ReactTimeAgo from 'react-time-ago';

export default function Post({ post }) {
  const { id, title, username, createdAt, numberOfLikes, comments } = post;
  const navigate = useNavigate();

  // showText ? show text : show only title
  const handleClick = () => {
    // navigate(`/post/${id}`, { state: { post } });
    navigate(`/post/${id}`, { state: { post } });
  };

  return (
    <li
      onClick={handleClick}
      className='cursor-pointer hover:bg-gray-100 relative flex justify-between p-3'
    >
      <div>
        <span className='text-md truncate mr-4'>{title}</span>
        {comments.length !== 0 && (
          <span className='text-gray-600'>
            <FontAwesomeIcon icon={faComment} /> {comments.length}
          </span>
        )}
        {numberOfLikes > 0 && (
          <span className='ml-2 text-red-500'>
            <FontAwesomeIcon icon={faThumbsUp} /> {numberOfLikes}
          </span>
        )}
      </div>
      <div>
        <span className='font-semibold'>{username}</span>
        {Number.isInteger(createdAt) && (
          <ReactTimeAgo
            className='mx-2'
            date={createdAt}
            locale='en-US'
            timeStyle='twitter'
          />
        )}
      </div>
    </li>
  );
}
