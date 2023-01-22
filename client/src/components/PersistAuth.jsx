import { Outlet } from 'react-router-dom';
import { useState, useEffect, useRef } from 'react';
import useRefreshToken from '../hooks/useRefreshToken';
import useAuth from '../hooks/useAuth';

import React from 'react';

export default function PersistAuth() {
  const [isLoading, setIsLoading] = useState(true);
  const refresh = useRefreshToken();
  const { auth, persist } = useAuth();

  // for strict mode in dev
  const effectRan = useRef(false);

  useEffect(() => {
    const verifyRefreshToken = async () => {
      try {
        // get a new access token
        await refresh();
      } catch (error) {
        console.error(error);
      } finally {
        setIsLoading(false);
      }
    };
    // if persist login is set to false, do not refresh login
    if (!persist) {
      setIsLoading(false);
      return;
    }

    if (!effectRan.current) {
      // on refresh a page, memory containing auth info is gone
      console.log('ran');
      !auth?.accessToken ? verifyRefreshToken() : setIsLoading(false);

      return () => {
        effectRan.current = true;
      };
    }
  }, []);

  useEffect(() => {}, [isLoading]);

  return (
    <>
      {isLoading ? (
        <section className='max-w-8xl mx-auto w-2/3 mt-12'>
          <p className='text-gray-800 text-xl font-semibold mb-8 text-center'>
            Relogging in...
          </p>
        </section>
      ) : (
        <Outlet />
      )}
    </>
  );
}
