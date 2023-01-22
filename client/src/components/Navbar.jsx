import React from 'react';
import { Link } from 'react-router-dom';
import useAuth from '../hooks/useAuth';
import useLogout from '../hooks/useLogout';

export default function Navbar() {
  const { auth } = useAuth();
  const logout = useLogout();

  const handleLogout = async () => {
    await logout();
  };

  return (
    <nav className='border-b border-zinc-300 mb-4 p-4'>
      <div className='max-w-8xl mx-auto'>
        <div className='flex justify-around items-center'>
          <div>
            <Link className='text-2xl bg-white font-semibold' to='/'>
              <span className='text-gray-800'>Party</span>
              <span className='text-red-500'>Blind</span>
            </Link>
            <Link
              className='ml-5 text-lg bg-white text-gray-800 font-semibold'
              to='/'
            >
              Home
            </Link>
          </div>
          <Link to='/'></Link>
          <div className='flex items-center'>
            <Link to='/post/write'>
              <button className='w-24 bg-red-500 hover:bg-red-600 text-white font-semibold py-2 px-4 mr-4 border rounded shadow mr-2'>
                POST
              </button>
            </Link>
            {!auth?.accessToken && (
              <Link to='/login'>
                <button className='w-24 bg-white hover:bg-gray-100 text-gray-800 font-semibold py-2 px-4 border border-gray-400 rounded shadow'>
                  LOG IN
                </button>
              </Link>
            )}
            {auth?.accessToken && (
              <button
                className='bg-white hover:bg-gray-100 text-gray-800 font-semibold py-2 px-4 border border-gray-400 rounded shadow'
                onClick={handleLogout}
              >
                LOG OUT
              </button>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}