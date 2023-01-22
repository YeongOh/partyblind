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

  console.log(`requested creater: ${req?.body?.username}`);
  console.log(`post creater: ${username}`);

  if (req?.body?.username !== username) {
    console.log(!req?.body?.username !== username);
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

  const authHeader = req.headers.authorization || req.headers.Authorization;
  if (!authHeader?.startsWith('Bearer ')) {
    console.log('JWT error 401');
    return res.status(401).json({ message: 'Incorrect authorizaiton header.' });
  }

  const token = authHeader.split(' ')[1];
  let match = false;

  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (error, decoded) => {
    if (error) {
      console.log('expired access token, need a new token.');
      return res.sendStatus(403); // invalid token
    }
    match = post.username === decoded.UserInfo.username;
  });
  if (!match)
    return res.status(401).json({ message: 'username does not match.' });

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

module.exports = {
  getAllPosts,
  createPost,
  updatePost,
  deletePost,
  getPost,
};
