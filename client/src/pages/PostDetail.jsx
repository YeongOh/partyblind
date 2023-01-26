import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import useAxiosPrivate from '../hooks/useAxiosPrivate';

import {
  faArrowLeft,
  faEdit,
  faInfoCircle,
  faTrash,
  faTrashAlt,
} from '@fortawesome/free-solid-svg-icons';
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
            <h1 className='text-3xl font-bold my-5 whitespace-pre-wrap truncate'>
              {post.title}
            </h1>
            <div className='border-b p-4 flex justify-between items-center text-lg text-gray-500'>
              <span className='font-semibold'>{post.username}</span>

              {Number.isInteger(post?.createdAt) && (
                <ReactTimeAgo date={post.createdAt} locale='en-US' />
              )}
            </div>
            <p className='my-12 whitespace-pre-wrap truncate text-xl h-96'>
              {post.text}
            </p>

            {error && (
              <p className='text-red-500 text-lg font-semibold mt-8 text-center'>
                <FontAwesomeIcon icon={faInfoCircle} /> {error}
              </p>
            )}
            <div className='flex justify-between items-center border-t pt-10'>
              <div>
                <button
                  type='button'
                  className='p-3 hover:bg-gray-300 rounded-full font-semibold text-md w-24 text-2xl'
                  onClick={() => navigate('/')}
                >
                  <FontAwesomeIcon icon={faArrowLeft} />
                </button>
                <PostDetailLike
                  postId={id}
                  numberOfLikes={post.numberOfLikes}
                  likedUsernames={post.likedUsernames}
                />
              </div>
              {auth?.username === post.username && (
                <div>
                  <button
                    className='p-3 hover:bg-gray-300 rounded-full font-semibold text-md w-24 text-2xl mr-2'
                    onClick={() => setIsEditing(true)}
                  >
                    <FontAwesomeIcon icon={faEdit} />
                  </button>
                  <button
                    onClick={handleDelete}
                    className='p-3 hover:bg-gray-300 rounded-full font-semibold text-md w-24 text-2xl'
                  >
                    <FontAwesomeIcon icon={faTrashAlt} />
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
