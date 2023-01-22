const User = require('../models/Users');
const argon2 = require('argon2');

const registerNewUser = async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password)
    return res
      .status(400)
      .json({ message: 'Username and password are required.' });

  // exec needs to be added when it is await func
  const duplicateUser = await User.findOne({ username }).exec();

  if (duplicateUser)
    return res.status(409).json({ message: 'Username already exsits.' });

  try {
    const hashedPassword = await argon2.hash(password);
    const result = await User.create({
      username,
      password: hashedPassword,
    });

    console.log(result);

    return res.status(201).json({ message: `New user ${username} created.` });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

module.exports = { registerNewUser };
