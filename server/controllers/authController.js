const User = require('../models/Users');
const argon2 = require('argon2');
const jwt = require('jsonwebtoken');

const login = async (req, res) => {
  const cookies = req.cookies;

  // TODO: add exp_date key in refreshTokens in DB,
  // at login clear up the expired refresh tokens

  const { username, password } = req.body;

  if (!username || !password)
    return res
      .status(400)
      .json({ message: 'Username and password are required' });

  const foundUser = await User.findOne({ username }).exec();

  if (!foundUser)
    return res
      .status(401)
      .json({ message: 'Username or password is not correct.' });

  const isValidPassword = await argon2.verify(foundUser.password, password);

  if (isValidPassword) {
    // add filter(Boolean) to eliminiate nulls
    const roles = Object.values(foundUser.roles).filter(Boolean);

    const accessToken = jwt.sign(
      {
        UserInfo: {
          username: foundUser.username,
          roles,
        },
      },
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: '120s' }
    );
    const newRefreshToken = jwt.sign(
      { username: foundUser.username },
      process.env.REFRESH_TOKEN_SECRET,
      { expiresIn: '15m' }
    );

    // when login, if the user had refresh token in cookie,
    // delete it from the database
    const newRefreshTokenArray = !cookies?.jwt
      ? foundUser.refreshToken
      : foundUser.refreshToken.filter((rt) => rt !== cookies.jwt);

    if (cookies?.jwt) {
      /*
      1) User logins but never uses token and does not logout
      2) RT is stolen
      3) if 1 & 2, reuse detection is needed to clear all RTs when user logs in
      */
      const stolenRefreshToken = cookies.jwt;
      const foundToken = await User.findOne({ stolenRefreshToken }).exec();

      // Detected refresh token reuse
      if (!foundToken) {
        console.log('attempted refresh token reuse at login');
        // Clear out all previous refresh tokens
        newRefreshTokenArray = [];
      }
    }

    res.clearCookie('jwt', {
      httpOnly: true,
      sameSite: 'None',
      secure: true,
    });

    // Saving refresh Token with current user and in cookie
    foundUser.refreshToken = [...newRefreshTokenArray, newRefreshToken];
    const username = foundUser.username;
    const result = await foundUser.save();

    res.cookie('jwt', newRefreshToken, {
      httpOnly: true,
      sameSite: 'None',
      secure: true,
      maxAge: 24 * 60 * 10 * 1000, // 1 day
    });

    // Send access token in json
    return res.status(200).json({ username, accessToken });
  } else {
    return res
      .status(401)
      .json({ message: 'Username or password is not correct.' });
  }
};

module.exports = {
  login,
};
