import { faInfoCircle } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useState } from 'react';
import axios, { axiosPrivate } from '../api/axios';
import useAuth from '../hooks/useAuth';

import AddComment from './AddComment';
import Comment from './Comment';

export default function PostDetailComment({
  postId,
  postUsername,
  postComments,
}) {
  const [comments, setComments] = useState(postComments);
  const [error, setError] = useState('');
  const { auth } = useAuth();

  const handleAdd = (newComment) => {
    setComments((prev) => [...prev, newComment]);
  };

  const handleDelete = async (deletedComment) => {
    setComments(comments.filter((prev) => prev._id !== deletedComment._id));
  };

  return (
    <section className='relative mx-auto p-2 text-gray-700 mt-20 sm:w-full md:w-2/3 lg:w-3/5 xl:w-1/2'>
      <AddComment onAdd={handleAdd} postId={postId} />
      <ul className='mt-6'>
        {comments.length === 0 && 'Be the first to comment!'}
        {comments &&
          comments
            .sort((a, b) => b.commentTime - a.commentTime)
            .map((comment) => (
              <Comment
                key={comment._id}
                comment={comment}
                postUsername={postUsername}
                postId={postId}
                onDelete={handleDelete}
              />
            ))}
      </ul>
    </section>
  );
}
