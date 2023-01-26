import {
  faInfoCircle,
  faPencil,
  faRemove,
  faTrash,
  faTrashAlt,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React, { useEffect, useRef, useState } from 'react';
import ReactTimeAgo from 'react-time-ago';
import useAuth from '../hooks/useAuth';
import useAxiosPrivate from '../hooks/useAxiosPrivate';

export default function Comment({
  comment,
  postUsername,
  postId,
  onDelete,
  onEdit,
}) {
  const [isEditing, setIsEditing] = useState(false);
  const [updateText, setUpdateText] = useState(comment.commentText);
  const [error, setError] = useState('');
  const { auth } = useAuth();
  const isSameUser = auth?.username === comment.commentUsername;
  const userRef = useRef();
  const axiosPrivate = useAxiosPrivate();

  const handleUpdate = async (e) => {
    e.preventDefault();
    setIsEditing(false);
    try {
      const response = await axiosPrivate.put(
        '/post/' + postId + '/comment/' + comment._id, //
        JSON.stringify({ updateText }),
        {
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );
      const newComment = {
        ...comment,
        commentText: updateText,
        isEdited: true,
      };
      onEdit(newComment);
    } catch (error) {
      if (!error?.response) {
        setError('No Server Response');
      } else if (error.response?.status === 400) {
        setError('Please use less than 100 words!');
      } else if (error.response?.status === 401) {
        setError('Authentication failed. Please try again or Refresh!');
      } else {
        setError(`Comment failed: ${error.message}`);
      }
    }
  };

  const toggleEdit = () => {
    setIsEditing((prev) => !prev);
    setUpdateText(comment.commentText);
  };

  useEffect(() => {
    if (isEditing) {
      userRef.current.focus();
    }
  }, [isEditing]);

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
        setError('Authentication failed. Please try again or Refresh!');
      } else {
        setError('An unexpected error occured!');
      }
    }
  };

  return (
    <li key={comment._id} className='my-4 ml-1'>
      <div className='text-md text-gray-500 mb-1 flex items-center justify-between'>
        <div>
          <span className='font-semibold'>{comment.commentUsername}</span>
          {comment.commentUsername === postUsername && (
            <span className='font-semibold text-blue-400 ml-2'>OP</span>
          )}
          {Number.isInteger(comment.commentTime) && (
            <ReactTimeAgo
              className='ml-3'
              date={comment.commentTime}
              locale='en-US'
              timeStyle='twitter'
            />
          )}
          {comment.isEdited && <span> (edited)</span>}
        </div>
        <div>
          {isSameUser && !isEditing && (
            <>
              <FontAwesomeIcon
                onClick={toggleEdit}
                icon={faPencil}
                className='cursor-pointer mx-1 hover:text-red-500 text-xl'
              />
              <FontAwesomeIcon
                onClick={handleDelete}
                icon={faTrash}
                className='cursor-pointer mx-6 hover:text-red-500 text-xl'
              />
            </>
          )}
        </div>
      </div>
      {!isEditing ? (
        <span className='whitespace-pre-wrap truncate'>
          {comment.commentText}
        </span>
      ) : (
        <form onSubmit={handleUpdate}>
          <input
            id='updateText'
            ref={userRef}
            type='text'
            placeholder='Write something!'
            autoComplete='off'
            value={updateText}
            onChange={(e) => setUpdateText(e.target.value)}
            className='border-b-2 border-gray-400 py-1 w-5/6 text-md focus:outline-none focus:shadow-outline focus:border-gray-800 focus:border-b-2'
          />
          <div className='mt-3 mb-6 flex justify-end w-full text-md'>
            <button
              className='p-3 hover:bg-gray-300 rounded-full font-semibold'
              type='button'
              onClick={toggleEdit}
            >
              Cancel
            </button>
            <button className='py-3 px-5 bg-gray-300 rounded-full hover:bg-red-500 hover:text-white font-semibold mx-6'>
              Save
            </button>
          </div>
        </form>
      )}
      {error && (
        <p className='text-red-500 text-md font-semibold mt-2'>
          <FontAwesomeIcon icon={faInfoCircle} /> {error}
        </p>
      )}
    </li>
  );
}
