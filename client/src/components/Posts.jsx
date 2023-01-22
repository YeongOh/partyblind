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
        console.log('fetcheed');
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

  return (
    <section className='max-w-8xl mx-auto w-2/3 mt-12'>
      {error && (
        <h1 className='text-red-500 text-xl font-semibold mb-8 text-center'>{`${error}`}</h1>
      )}
      {isLoading && !error && (
        <h1 className='text-gray-800 text-xl font-semibold mb-8 text-center'>
          Loading Posts...
        </h1>
      )}
      <ul className='grid grid-cols-2'>
        {posts && posts.map((post) => <Post key={post.id} post={post} />)}
      </ul>
    </section>
  );
}
