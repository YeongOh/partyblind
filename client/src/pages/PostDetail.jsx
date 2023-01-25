import React, { useState } from 'react';
import { useLocation, useNavigate, useLoaderData } from 'react-router-dom';
import useAxiosPrivate from '../hooks/useAxiosPrivate';
import ReactTimeAgo from 'react-time-ago';

import { faArrowLeft, faInfoCircle } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import useAuth from '../hooks/useAuth';
import PostDetailLike from '../components/PostDetailLike';
import PostDetailComment from '../components/PostDetailComment';

const EDIT_URL = '/post/';
const DELETE_URL = '/post/';

export default function PostDetail() {
  // null check - if the user refreshes a page, or directly writes a link
  const { state } = useLocation();
  // const secondPost = useLoaderData();
  const { post } = state || {};
  // console.log(secondPost);

  const { id, title, username, createdAt, text, numberOfLikes, comments } =
    post;

  const [isEditing, setIsEditing] = useState(false);
  const navigate = useNavigate();
  const [newPost, setNewPost] = useState({ title, text });
  const { auth } = useAuth();
  const [error, setError] = useState('');

  const axiosPrivate = useAxiosPrivate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewPost((newPost) => ({ ...newPost, [name]: value }));
  };

  const handleDelete = async (e) => {
    // add alert
    e.preventDefault();
    const confirmDelete = window.confirm('Do you really want to delete?');
    if (!confirmDelete) {
      return;
    }
    // Delete username verification not working
    // Delete method says req.body as undefined
    // const username = auth?.username;
    try {
      await axiosPrivate.delete(
        DELETE_URL + id, //
        // JSON.stringify({ username }),
        {
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );
      navigate('/');
    } catch (error) {
      if (!error?.response) {
        setError('No Server Response');
      } else if (error.response?.status === 401) {
        setError('Username does not match.');
      } else {
        setError(`DELETE failed: ${error.message}`);
      }
    }
  };

  const handleEdit = async (e) => {
    e.preventDefault();
    const title = newPost.title;
    const text = newPost.text;
    const username = auth?.username;

    try {
      const response = await axiosPrivate.put(
        EDIT_URL + id, //
        JSON.stringify({ title, text, username }),
        {
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );
      setIsEditing(false);
      const post = response?.data;
      navigate(`/post/${post.id}`, { state: { post } }); // not needed
    } catch (error) {
      if (!error?.response) {
        setError('No Server Response');
      } else if (error.response?.status === 401) {
        setError('Username does not match.');
      } else {
        setError(`Edit failed: ${error.message}`);
      }
    }
  };

  return (
    <>
      {error && (
        <p className='text-red-500 text-lg font-semibold mt-8 text-center'>
          <FontAwesomeIcon icon={faInfoCircle} /> {error}
        </p>
      )}
      {!isEditing && (
        <>
          <section className='relative mx-auto mt-12 p-2 text-gray-700 sm:w-full md:w-2/3 lg:w-3/5 xl:w-1/2'>
            <h1 className='text-2xl my-5 whitespace-pre-wrap truncate'>
              {title}
            </h1>
            <div className='border-b p-2 flex justify-between items-center text-md text-gray-500'>
              <span className='font-semibold'>{username}</span>
              <ReactTimeAgo date={createdAt} locale='en-US' />
            </div>
            <p className='my-12 whitespace-pre-wrap truncate'>{text}</p>
            <PostDetailLike postId={id} numberOfLikes={numberOfLikes} />
            <div className='border-b mt-20'>
              <button
                type='button'
                className='bg-white hover:bg-gray-100 text-gray-800 font-semibold py-2 border border-gray-400 rounded shadow w-24 text-xs absolute mt-4'
                onClick={() => navigate('/')}
              >
                <FontAwesomeIcon icon={faArrowLeft} />
              </button>
              {auth?.username === username && (
                <div className='absolute right-2 mt-4'>
                  <button
                    className='bg-white hover:bg-gray-100 text-gray-800 font-semibold py-2 border border-gray-400 rounded shadow w-24 text-xs'
                    onClick={() => setIsEditing(true)}
                  >
                    EDIT
                  </button>
                  <button
                    className='ml-4 bg-gray-200 hover:bg-red-400 hover:text-white text-gray-800 font-semibold py-2 w-24 border border-gray-400 rounded shadow text-xs'
                    onClick={handleDelete}
                  >
                    DELETE
                  </button>
                </div>
              )}
            </div>
          </section>
          <PostDetailComment
            postUsername={username}
            postComments={comments}
            postId={id}
          />
        </>
      )}

      {isEditing && (
        <section className='relative mx-auto mt-12 p-2 text-gray-700 sm:w-full md:w-2/3 lg:w-3/5 xl:w-1/2'>
          <h1 className='font-semibold text-lg mb-8 text-center'>
            Editing your post...
          </h1>
          <form onSubmit={handleEdit}>
            <label
              className='block text-gray-700 text-m font-semibold mb-2 ml-2'
              htmlFor='title'
            >
              Title
            </label>
            <input
              value={newPost.title}
              name='title'
              type='text'
              placeholder='title'
              autoComplete='off'
              onChange={handleChange}
              required
              className='shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline focus:border-gray-800'
            />
            <label
              className='block text-gray-700 text-m font-semibold my-2 ml-2'
              htmlFor='text'
            >
              Description
            </label>
            <textarea
              value={newPost.text}
              name='text'
              type='text'
              placeholder='...'
              autoComplete='off'
              onChange={handleChange}
              required
              className='shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline focus:border-gray-800 h-56'
            />
            <button
              type='button'
              onClick={() => {
                const confirmCancel = window.confirm(
                  'Do you really want to cancel?'
                );
                if (!confirmCancel) {
                  return;
                }
                setIsEditing(false);
                setError('');
              }}
              className='bg-white hover:bg-gray-100 text-gray-800 font-semibold py-2 w-full mt-4 border border-gray-400 rounded shadow w-20'
            >
              <FontAwesomeIcon icon={faArrowLeft} />
            </button>
            <button className='w-24 bg-red-500 hover:bg-red-600 text-white font-semibold py-2 px-4 border rounded shadow right-2 absolute mt-4'>
              EDIT
            </button>
          </form>
        </section>
      )}
    </>
  );
}
