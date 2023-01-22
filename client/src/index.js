import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import Home from './pages/Home';
import NewPost from './pages/NewPost';
import PostDetail from './pages/PostDetail';
import AllPosts from './pages/AllPosts';
import SignUp from './pages/SignUp';
import Login from './pages/Login';
import ProtectedRoute from './components/ProtectedRoute';

import TimeAgo from 'javascript-time-ago';

import en from 'javascript-time-ago/locale/en.json';
import NotFound from './pages/NotFound';
import { AuthContextProvider } from './context/AuthContext';
import { disableReactDevTools } from '@fvilers/disable-react-devtools';

import { QueryClient, QueryClientProvider } from 'react-query';
// import { ReactQueryDevtools } from 'react-query/devtools';

TimeAgo.addDefaultLocale(en);
TimeAgo.addLocale(en);

if (process.env.NODE_ENV === 'production') {
  disableReactDevTools();
}

const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    errorElement: <NotFound />,
    children: [
      { index: true, element: <Home /> },
      {
        path: '/post',
        element: <AllPosts />,
      },
      {
        path: '/post/:paramId',
        element: <PostDetail />,
      },
      // Need auth to write a post
      {
        path: '/post/write',
        element: (
          <ProtectedRoute>
            <NewPost />
          </ProtectedRoute>
        ),
      },
      // can't sign up or logged in when authed
      {
        path: '/signup',
        element: <SignUp />,
      },
      {
        path: '/login',
        element: <Login />,
      },
      {
        path: '*',
        element: <NotFound />,
      },
    ],
  },
]);

const queryClient = new QueryClient();

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <AuthContextProvider>
        <RouterProvider router={router} />
      </AuthContextProvider>
      {/* <ReactQueryDevtools initialIsOpen /> */}
    </QueryClientProvider>
  </React.StrictMode>
);
