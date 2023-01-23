import axios from 'axios';
const BASE_URL = 'https://partyblind-api.onrender.com';
// const BASE_URL = 'http://localhost:4000';

export default axios.create({
  baseURL: BASE_URL,
  withCredentials: true, // allows cross-site Access-control
});

// interceptors for jwt tokens
export const axiosPrivate = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
});

export async function getPosts() {
  try {
    const response = await axios.get(BASE_URL + '/post');
    return response.data;
  } catch (error) {
    if (!error?.response) {
      throw new Error('No Server Response');
    }
    throw new Error(`Fetching failed: ${error.message}`);
  }
}

export async function createPost(title, text, username) {
  try {
    const response = await axiosPrivate.post(
      BASE_URL + '/post', //
      JSON.stringify({ title, text, username }),
      {
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );
    const post = response.data;
    return post;
  } catch (error) {
    if (!error?.response) {
      throw new Error('No Server Response');
    } else if (error.response?.status === 400) {
      throw new Error('Title or text is missing.');
    } else if (error.response?.status === 403) {
      console.log('refresh token expired');
      throw new Error('You are not logged in.');
    }
    throw new Error(`Post failed: ${error.message}`);
  }
}

// old fetch functions for reference

// await fetch('http://localhost:4000/auth/signup', {
//   method: 'POST',
//   headers: {
//     'Content-Type': 'application/json',
//   },
//   body: JSON.stringify({
//     username,
//     password,
//   }),
// })
//   .then(() => {
//     return navigate('/signup/complete');
//   })
//   .catch(setError);
