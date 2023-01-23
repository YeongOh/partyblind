const User = require('../models/Users');
const jwt = require('jsonwebtoken');

// Delete the old refresh token, send the new ones, detect any reuse of refresh tokens
// multiple refresh tokens are used to allow multiple device connections
const handleRefreshToken = async (req, res) => {
  const cookies = req.cookies;

  if (!cookies?.jwt) return res.sendStatus(401);

  const refreshToken = cookies.jwt;

  // after getting the token, delete it from the cookie
  // each refresh token can only be used once
  res.clearCookie('jwt', {
    httpOnly: true,
    sameSite: 'None',
    secure: true,
  });

  const foundUser = await User.findOne({ refreshToken }).exec();
  // Detected refresh token reuse
  // decode jwt, if the username is in the database, clear all refresh tokens
  if (!foundUser) {
    jwt.verify(
      refreshToken,
      process.env.REFRESH_TOKEN_SECRET,
      async (error, decoded) => {
        if (error) return res.sendStatus(403);
        const hackedUser = await User.findOne({
          username: decoded.username,
        }).exec();
        hackedUser.refreshToken = [];
        const result = await hackedUser.save();
        console.log(
          `detected refresh token reuse - deleting all refresh tokens of ${decoded.username}`
        );
      }
    );
    return res.sendStatus(403);
  }
  // filtering out old refresh token (deleting the token that just has been used)
  const newRefreshTokenArray = foundUser.refreshToken.filter(
    (rt) => rt !== refreshToken
  );
  // evaluate jwt
  jwt.verify(
    refreshToken,
    process.env.REFRESH_TOKEN_SECRET,
    async (error, decoded) => {
      // Identifying the old refresh token getting mongoDB

      //  the token has expired
      if (error) {
        console.log('detected expired refresh token');
        foundUser.refreshToken = [...newRefreshTokenArray];
        const result = await foundUser.save();
      }
      if (error || foundUser.username !== decoded.username)
        return res.sendStatus(403);

      // Refresh token is still valid
      const roles = Object.values(foundUser.roles).filter(Boolean);
      const username = foundUser.username;

      const accessToken = jwt.sign(
        {
          UserInfo: {
            username: decoded.username,
            roles,
          },
        },
        process.env.ACCESS_TOKEN_SECRET,
        { expiresIn: '120s' }
      );

      const newRefreshToken = jwt.sign(
        { username: foundUser.username },
        process.env.REFRESH_TOKEN_SECRET,
        { expiresIn: '1d' }
      );
      foundUser.refreshToken = [...newRefreshTokenArray, newRefreshToken];
      const result = await foundUser.save();
      res.cookie('jwt', newRefreshToken, {
        httpOnly: true,
        sameSite: 'None',
        secure: true,
        maxAge: 24 * 60 * 10 * 1000, // 1 day
      });

      console.log('refreshing a new access token!');
      return res.json({ username, accessToken });
    }
  );
};

module.exports = { handleRefreshToken };
