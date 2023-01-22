import React from 'react';
import { useNavigate } from 'react-router-dom';
import ReactTimeAgo from 'react-time-ago';

export default function Post({ post }) {
  const { id, title, username, createdAt, text } = post;
  const navigate = useNavigate();

  // showText ? show text : show only title
  const handleClick = () => {
    navigate(`/post/${id}`, { state: { post } });
  };

  return (
    <li
      onClick={handleClick}
      className='cursor-pointer border relative flex flex-col justify-between h-60 p-5 m-2'
    >
      <h1 className='text-xl text-gray-800 truncate'>{title}</h1>
      <span className='text-sm text-gray-800 truncate opacity-70'>{text}</span>
      <div className='flex justify-between items-center text-sm text-gray-500 opacity-60'>
        <span>{username}</span>
        <ReactTimeAgo date={createdAt} locale='en-US' />
      </div>
    </li>
  );
}
