const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const refreshTokenController = require('../controllers/refreshTokenController');
const registerController = require('../controllers/registerController');
const logoutController = require('../controllers/logoutController');
// const verifyJWT = require('../middlewares/verifyJWT');

router.post('/signup', registerController.registerNewUser);

router.post('/login', authController.login);

router.get('/refresh', refreshTokenController.handleRefreshToken);

router.post('/logout', logoutController.logout);

module.exports = router;
