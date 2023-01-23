const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const postSchema = new Schema({
  id: {
    type: String,
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
  text: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Number,
    required: true,
  },
  username: {
    type: String,
    required: true,
  },
  comments: [
    {
      commentUsername: {
        type: String,
      },
      commentText: {
        type: String,
      },
      commentTime: {
        type: Number,
        required: true,
      },
    },
  ],
  numberOfLikes: {
    type: Number,
  },
  likedUsernames: [String],
});

// User becomes users collection in the database
module.exports = mongoose.model('Post', postSchema);
