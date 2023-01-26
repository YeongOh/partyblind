import { useState } from 'react';
import AddComment from './AddComment';
import Comment from './Comment';

export default function PostDetailComment({
  postId,
  postUsername,
  postComments,
}) {
  const [comments, setComments] = useState(postComments);

  let sortedComments;
  if (postComments)
    sortedComments = [...comments].sort(
      (a, b) => b.commentTime - a.commentTime
    );

  const handleAdd = (newComment) => {
    setComments((prev) => [...prev, newComment]);
  };

  const handleEdit = (newComment) => {
    setComments(
      comments.map((prev) => (prev._id === newComment._id ? newComment : prev))
    );
  };

  const handleDelete = async (deletedComment) => {
    setComments(comments.filter((prev) => prev._id !== deletedComment._id));
  };

  return (
    <section className='relative mx-auto p-2 text-gray-700 m-12 sm:w-full md:w-2/3 lg:w-3/5 xl:w-1/2'>
      <AddComment onAdd={handleAdd} postId={postId} />
      <ul className='mt-10'>
        {comments?.length === 0 && (
          <span className='font-semibold ml-2'>
            Be the first one to comment!
          </span>
        )}
        {comments &&
          sortedComments.map((comment) => (
            <Comment
              key={comment._id}
              comment={comment}
              postUsername={postUsername}
              postId={postId}
              onDelete={handleDelete}
              onEdit={handleEdit}
            />
          ))}
      </ul>
    </section>
  );
}
