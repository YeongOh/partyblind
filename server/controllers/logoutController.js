const User = require('../models/Users');

const logout = async (req, res) => {
  // On client, also delete the accessToken

  const cookies = req.cookies;

  if (!cookies?.jwt) return res.sendStatus(204); // No content to send

  const refreshToken = cookies.jwt;

  // refreshToken in DB?
  const foundUser = await User.findOne({ refreshToken }).exec();

  if (!foundUser) {
    res.clearCookie('jwt', {
      httpOnly: true,
      sameSite: 'None',
      secure: true,
    });
    return res.sendStatus(204);
  }

  // Delete refreshToken in DB
  foundUser.refreshToken = foundUser.refreshToken.filter(
    (rt) => rt !== refreshToken
  );

  // foundUser.refreshToken = '';
  const result = await foundUser.save();

  res.clearCookie('jwt', {
    httpOnly: true,
    sameSite: 'None',
    secure: true,
  });

  return res.sendStatus(204);
};

module.exports = { logout };
