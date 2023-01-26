import { faPen } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import useAuth from '../hooks/useAuth';
import useLogout from '../hooks/useLogout';

export default function Navbar() {
  const { auth } = useAuth();
  const logout = useLogout();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate(0);
  };

  const mobile = 'py-2 px-4 sm:w-20 md:w-24 sm:text-s md:text-md';

  return (
    <nav className='border-b border-zinc-300 mb-4 p-4'>
      <div className='max-w-8xl mx-auto'>
        <div className='flex justify-evenly items-center'>
          <div>
            <Link className='text-3xl font-bold bg-white font-semibold' to='/'>
              <span className='text-gray-800'>Party</span>
              <span className='text-red-500'>Blind</span>
            </Link>
            <Link
              className='hover:bg-gray-100 p-3 w-24 rounded ml-5 text-xl bg-white text-gray-800 font-semibold'
              to='/'
            >
              Home
            </Link>
          </div>
          <Link to='/'></Link>
          <div className='flex items-center h-12'>
            <Link to='/post/write'>
              <button className='bg-red-500 hover:bg-red-600 text-white font-semibold py-2 text-xl w-24 rounded shadow'>
                <FontAwesomeIcon icon={faPen} />
              </button>
            </Link>
            {!auth?.accessToken && (
              <Link to='/login'>
                <button className='bg-white hover:bg-gray-100 text-gray-800 font-semibold py-2 text-xl w-24 border border-gray-400 rounded shadow ml-4'>
                  Login
                </button>
              </Link>
            )}
            {auth?.accessToken && (
              <button
                className='bg-white hover:bg-gray-100 text-gray-800 font-semibold py-2 text-xl w-24 border border-gray-400 rounded shadow ml-4'
                onClick={handleLogout}
              >
                Logout
              </button>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
