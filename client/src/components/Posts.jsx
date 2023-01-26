import React from 'react';
import { useEffect, useState } from 'react';
import Post from './Post';
import axios from '../api/axios';

export default function Posts() {
  const [posts, setPosts] = useState([]);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    setIsLoading(true);
    const fetchPosts = async () => {
      try {
        const response = await axios.get('/post');
        setIsLoading(false);
        setPosts(response.data);
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

  const postItems = posts.map((post) => <Post key={post.id} post={post} />);

  return (
    <section className='max-w-8xl mt-12 mx-auto sm:w-full md:w-4/5 lg:w-3/5 xl:w-2/5'>
      {error && (
        <h1 className='text-red-500 text-xl font-semibold mb-8 text-center'>{`${error}`}</h1>
      )}
      {isLoading && !error && (
        <h1 className='text-gray-800 text-xl mb-8 text-center'>
          Loading Posts...
        </h1>
      )}
      <ul className='divide-y border-l-2 border-r-2 border-t-2 border-b-2'>
        {postItems}
      </ul>
    </section>
  );
}
