import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import useAxiosPrivate from '../hooks/useAxiosPrivate';

import { faArrowLeft, faInfoCircle } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import useAuth from '../hooks/useAuth';
import PostDetailLike from '../components/PostDetailLike';
import CommentSection from '../components/CommentSection';
import axios from '../api/axios';
import ReactTimeAgo from 'react-time-ago';
import PostEditForm from '../components/PostEditForm';

export default function PostDetail() {
  const [post, setPost] = useState({});
  const { paramId } = useParams();
  const id = paramId;

  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { auth } = useAuth();
  const [error, setError] = useState('');

  const axiosPrivate = useAxiosPrivate();

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        setIsLoading(true);
        const response = await axios.get(`/post/${paramId}`);
        setPost(response.data);
      } catch (error) {
        if (!error?.response) {
          setError('No Server Response');
        } else {
          setError(`Fetching failed: ${error.message}`);
        }
      } finally {
        setIsLoading(false);
      }
    };
    fetchPosts();
  }, []);

  const handleDelete = async (e) => {
    // add alert
    e.preventDefault();
    const confirmDelete = window.confirm('Do you really want to delete?');
    if (!confirmDelete) {
      return;
    }
    try {
      await axiosPrivate.delete('/post/' + post.id, {
        headers: {
          'Content-Type': 'application/json',
        },
      });
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

  return (
    <>
      {isLoading && (
        <h1 className='text-gray-800 text-xl mb-8 text-center mt-12 mx-auto sm:w-full md:w-4/5 lg:w-3/4 xl:w-2/3'>
          Loading a post!
        </h1>
      )}
      {!isLoading && !isEditing && (
        <>
          <section className='relative mx-auto mt-12 p-2 text-gray-700 sm:w-full md:w-2/3 lg:w-3/5 xl:w-1/2'>
            <h1 className='text-2xl my-5 whitespace-pre-wrap truncate'>
              {post.title}
            </h1>
            <div className='border-b p-2 flex justify-between items-center text-md text-gray-500'>
              <span className='font-semibold'>{post.username}</span>

              {Number.isInteger(post?.createdAt) && (
                <ReactTimeAgo date={post.createdAt} locale='en-US' />
              )}
            </div>
            <p className='my-12 whitespace-pre-wrap truncate'>{post.text}</p>
            <PostDetailLike postId={id} numberOfLikes={post.numberOfLikes} />
            {error && (
              <p className='text-red-500 text-lg font-semibold mt-8 text-center'>
                <FontAwesomeIcon icon={faInfoCircle} /> {error}
              </p>
            )}
            <div className='border-b mt-20'>
              <button
                type='button'
                className='bg-white hover:bg-gray-100 text-gray-800 font-semibold py-2 border border-gray-400 rounded shadow w-24 text-xs absolute mt-4'
                onClick={() => navigate('/')}
              >
                <FontAwesomeIcon icon={faArrowLeft} />
              </button>
              {auth?.username === post.username && (
                <div className='absolute right-2 mt-4'>
                  <button
                    className='bg-white hover:bg-gray-100 text-gray-800 font-semibold py-2 border border-gray-400 rounded shadow w-24 text-xs'
                    onClick={() => setIsEditing(true)}
                  >
                    EDIT
                  </button>
                  <button
                    onClick={handleDelete}
                    className='ml-4 bg-gray-200 hover:bg-red-400 hover:text-white text-gray-800 font-semibold py-2 w-24 border border-gray-400 rounded shadow text-xs'
                  >
                    DELETE
                  </button>
                </div>
              )}
            </div>
          </section>
          <CommentSection
            postUsername={post.username}
            postComments={post.comments}
            postId={id}
          />
        </>
      )}
      {!isLoading && isEditing && (
        <PostEditForm post={post} onCancel={() => setIsEditing(false)} />
      )}
    </>
  );
}
