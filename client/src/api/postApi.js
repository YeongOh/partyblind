export async function getPosts() {
  const response = await fetch('http://localhost:4000/post');
  if (!response.ok) {
    throw Error('Did not receive expected data');
  }
  const posts = await response.json();
  console.log(posts);
  return posts;
}

export async function login(username, password) {
  const response = await fetch('http://localhost:4000/auth/login', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include', // to use Cookies
    body: JSON.stringify({
      username,
      password,
    }),
  });
  if (!response.ok) {
    throw Error('Login failed');
  }

  return response;
}

export async function logout() {
  const res = await fetch('http://localhost:4000/auth/logout', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include', // to use Cookies
  });
  return res;
}

export async function createPost(title, text, username) {
  const post = await fetch('http://localhost:4000/post', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      title,
      text,
      username,
    }),
  }).then((response) => response.json());
  console.log(post);
  return post;
}

export async function deletePost(id) {
  const response = fetch(`http://localhost:4000/post/${id}`, {
    method: 'DELETE',
  });
  return response;
}

export async function editPost(id, title, text) {
  const post = await fetch(`http://localhost:4000/post/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      title,
      text,
    }),
  }).then((response) => response.json());
  return post;
}
