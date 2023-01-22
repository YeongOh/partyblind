import React from 'react';

export default function NotFound() {
  return (
    <section className='w-2/5 mx-auto mt-12 relative'>
      <h1 className='font-semibold text-red-500 text-lg mb-8 text-center'>
        This URL does not exist or <br />
        Unexpected Error occured. <br />
        <br />
        Sorry for your inconvenience.
      </h1>
    </section>
  );
}
