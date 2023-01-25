import {
  faInfoCircle,
  faPencil,
  faTrashAlt,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React, { useState } from 'react';
import ReactTimeAgo from 'react-time-ago';
import { axiosPrivate } from '../api/axios';
import useAuth from '../hooks/useAuth';

export default function Comment({ comment, postUsername, postId, onDelete }) {
  //   const [isEditing, setIsEditing] = useState(false);
  const [error, setError] = useState('');
  const { auth } = useAuth();
  const isSameUser = auth?.username === comment.commentUsername;

  const handleUpdate = async () => {
    setError('Edit is a next TO-DO list!');
  };

  const handleDelete = async () => {
    const confirmDelete = window.confirm('Do you really want to delete?');
    if (!confirmDelete) {
      return;
    }
    try {
      const response = await axiosPrivate.delete(
        '/post/' + postId + '/comment/' + comment._id,
        {
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );
      onDelete(comment);
    } catch (error) {
      if (error?.response?.status === 401) {
        setError('User authentication failed.');
      } else {
        setError('An unexpected error occured!');
      }
    }
  };

  return (
    <li key={comment._id} className='my-4 ml-1'>
      <div className='text-sm text-gray-500 mb-1'>
        <span className='font-semibold'>{comment.commentUsername}</span>
        {comment.commentUsername === postUsername && (
          <span className='font-semibold text-blue-400 ml-2'>OP</span>
        )}
        <ReactTimeAgo
          className='mx-3'
          date={comment?.commentTime}
          locale='en-US'
          timeStyle='twitter'
        />
        {isSameUser && (
          <>
            <FontAwesomeIcon
              onClick={handleUpdate}
              icon={faPencil}
              className='cursor-pointer mx-1 hover:text-red-500'
            />
            <FontAwesomeIcon
              onClick={handleDelete}
              icon={faTrashAlt}
              className='cursor-pointer mx-2 hover:text-red-500'
            />
          </>
        )}
      </div>
      <span className='whitespace-pre-wrap truncate'>
        {comment.commentText}
      </span>
      {error && (
        <p className='text-red-500 text-md font-semibold mt-2'>
          <FontAwesomeIcon icon={faInfoCircle} /> {error}
        </p>
      )}
    </li>
  );
}
