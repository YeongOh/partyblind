const Post = require('../models/Posts');
const uuid = require('uuid');
const jwt = require('jsonwebtoken');

const getAllPosts = async (req, res) => {
  const posts = await Post.find().sort({ createdAt: -1 });
  if (!posts) return res.status(204).json({ message: 'No posts found' });
  return res.json(posts);
};

const createPost = async (req, res) => {
  if (!req?.body?.title || !req?.body?.text || !req?.body?.username)
    return res.status(400).json({ message: 'one of the fields is missing' });
  const { title, text, username } = req.body;
  const id = uuid.v4();

  const createdAt = new Date().getTime();

  try {
    const post = await Post.create({
      id,
      title,
      text,
      createdAt,
      username,
      numberOfLikes: 0,
    });
    return res.status(201).json(post);
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
};

const updatePost = async (req, res) => {
  if (!req?.params?.id)
    return res.status(400).json({ message: 'id parameter is required' });
  const id = req.params.id;

  if (!req?.body?.title || !req?.body?.text)
    return res.status(400).json({ message: 'one of the fields is missing' });
  const { title, text } = req.body;

  const post = await Post.findOne({ id }).exec();

  const username = post.username;

  if (req?.body?.username !== username) {
    return res.status(401).json({ message: 'Username does not match.' });
  }

  if (post) {
    post.title = title;
    post.text = text;
    const result = await post.save();
    res.status(200).json(post);
  } else {
    res.status(404).json({ message: `Post ${id} not found` });
  }
};

const deletePost = async (req, res) => {
  if (!req?.params?.id)
    return res.status(400).json({ message: 'id parameter is required' });

  const id = req.params.id;

  const post = await Post.findOne({ id }).exec();
  verifyUsername(req, res, post.username);

  const result = await Post.deleteOne({ id });
  res.sendStatus(204);
};

const getPost = async (req, res) => {
  if (!req?.params?.id)
    return res.status(400).json({ message: 'id parameter is required' });

  const id = req.params.id;
  const post = await Post.findOne({ id }).exec();
  if (post) {
    res.status(200).json(post);
  } else {
    res.status(404).json({ message: `Post ${id} not found` });
  }
};

const likePost = async (req, res) => {
  if (!req?.params?.id)
    return res.status(400).json({ message: 'id parameter is required' });

  const id = req.params.id;
  const post = await Post.findOne({ id }).exec();

  const username = req.body.username;
  const match = post.likedUsernames?.find((element) => element === username);

  if (match)
    return res.status(401).json({ message: `user already liked this post.` });

  // if the post does not have numberOfLikes property - post was created before implementing like
  if (!post.numberOfLikes) post.numberOfLikes = 0;

  post.numberOfLikes++;

  post.likedUsernames.push(username);
  const result = await post.save();
  if (post) {
    return res.status(200).json(post.numberOfLikes);
  }
  return res.status(404).json({ message: `Post ${id} not found` });
};

const commentPost = async (req, res) => {
  if (!req?.params?.id)
    return res.status(401).json({ message: 'Invalid attempt' });

  if (!req?.body?.text || !req?.body?.username)
    return res.status(401).json({ message: 'Invalid attempt' });

  if (req.body.text.length > 100)
    return res
      .status(400)
      .json({ message: 'Please comment less than 100 words!' });

  const id = req.params.id;
  const post = await Post.findOne({ id }).exec();
  const username = req.body.username;
  const text = req.body.text;
  const commentTime = new Date().getTime();

  const commentId = uuid.v4();

  const newComment = {
    commentUsername: username,
    commentText: text,
    commentTime,
    _id: commentId,
  };

  if (!post.comments) {
    post.comments = [];
  }

  // post.comments.unshift(newComment);
  post.comments.push(newComment);
  const result = await post.save();

  if (post) {
    return res.status(200).json(newComment);
  }
  return res.status(404).json({ message: `Post ${id} not found` });
};

const deleteComment = async (req, res) => {
  if (!req?.params?.id || !req?.params?.commentId) {
    return res.status(400).json({ message: 'Invalid attempt' });
  }
  const postId = req.params.id;
  const commentId = req.params.commentId;

  const post = await Post.findOne({ id: postId }).exec();
  if (!post) {
    console.log('cant find the post');
    return res.status(400).json({ message: 'Invalid attempt' });
  }

  const deleted = post.comments.find((item) => item._id === commentId);

  // if (!deleted) {
  //   console.log('cant find the comment');
  //   return res.status(400).json({ message: 'comment does not exist' });
  // }
  if (!verifyUsername(req, res, deleted.commentUsername))
    return res.status(401).json({ message: 'user verification failed' });

  const newComments = post.comments.filter((item) => item._id !== commentId);
  post.comments = newComments;

  const result = await post.save();

  return res.sendStatus(200);
};

const updateComment = async (req, res) => {
  if (!req?.params?.id)
    return res.status(401).json({ message: 'Invalid attempt' });

  if (!req?.body?.updateText)
    return res.status(401).json({ message: 'Invalid attempt' });

  if (req.body.updateText.length > 100)
    return res
      .status(400)
      .json({ message: 'Please comment less than 100 words!' });

  const postId = req.params.id;
  const commentId = req.params.commentId;
  const updateText = req.body.updateText;

  const post = await Post.findOne({ id: postId }).exec();

  const comment = post.comments.find((item) => item._id === commentId);

  if (!verifyUsername(req, res, comment.commentUsername))
    return res.status(401).json({ message: 'user verification failed' });

  const commentEdited = {
    ...comment,
    commentText: updateText,
    isEdited: true,
  };

  if (!post.comments) {
    post.comments = [];
  }

  const newCommentArray = post.comments.filter(
    (item) => item._id !== commentId
  );

  post.comments = [...newCommentArray, commentEdited];
  const result = await post.save();

  if (post) {
    return res.sendStatus(200);
  }
  return res.status(404).json({ message: `Post ${id} not found` });
};

const verifyUsername = (req, res, username) => {
  const authHeader = req.headers.authorization || req.headers.Authorization;
  if (!authHeader?.startsWith('Bearer ')) {
    console.log('JWT error 401');
    return false;
    // return res.status(401).json({ message: 'Incorrect authorizaiton header.' });
  }

  const token = authHeader.split(' ')[1];
  let match = false;

  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (error, decoded) => {
    if (error) {
      console.log('expired access token, need a new token.');
      return false;
      // return res.sendStatus(403); // invalid token
    }
    match = username === decoded.UserInfo.username;
  });
  if (!match) {
    console.log('username does not match');
    return false;
    // return res.status(401).json({ message: 'username does not match.' });
  }
  return true;
};

module.exports = {
  getAllPosts,
  createPost,
  updatePost,
  deletePost,
  getPost,
  likePost,
  commentPost,
  deleteComment,
  updateComment,
};
