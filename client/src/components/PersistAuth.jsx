import { Outlet } from 'react-router-dom';
import { useState, useEffect, useRef } from 'react';
import useRefreshToken from '../hooks/useRefreshToken';
import useAuth from '../hooks/useAuth';

import React from 'react';

export default function PersistAuth() {
  // const [isLoading, setIsLoading] = useState(false);
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
        console.error('You are not logged in.');
      }
    };
    // if persist login is set to false, do not refresh login
    if (!persist) return;

    if (!effectRan.current) {
      // on refresh a page, memory containing auth info is gone
      if (!auth?.accessToken) verifyRefreshToken();

      return () => {
        effectRan.current = true;
      };
    }
  }, []);

  return (
    <>
      <Outlet />
    </>
  );
}
