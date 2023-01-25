const express = require('express');
const router = express.Router();
const postController = require('../controllers/postController');
const ROLES_LIST = require('../config/roles_list');
const verifyRoles = require('../middlewares/verifyRoles');
const verifyJWT = require('../middlewares/verifyJWT');

router.get('/', postController.getAllPosts);

router.post('/', verifyJWT, postController.createPost);

router.get('/:id', postController.getPost);

router.put('/:id', verifyJWT, postController.updatePost);

router.put('/:id/like', verifyJWT, postController.likePost);

router.post('/:id/comment', verifyJWT, postController.commentPost);

router.put('/:id/comment/:commentId', postController.updateComment);

router.delete('/:id/comment/:commentId', postController.deleteComment);

router.delete('/:id', postController.deletePost);

module.exports = router;
