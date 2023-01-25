import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export default function NotFound() {
  const navigate = useNavigate();

  useEffect(() => {
    setTimeout(() => navigate('/'), 2000);
  }, []);

  return (
    <section className='w-2/5 mx-auto mt-12 relative'>
      <h1 className='font-semibold text-red-500 text-lg mb-8 text-center'>
        Unexpected Error occured. <br />
        <br />
        <h1 className='text-blue-500'>You will be redirected to Home.</h1>
      </h1>
    </section>
  );
}
