const mongoose = require('mongoose');

mongoose.set('strictQuery', false);

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.DATABASE_URI, {
      useUnifiedTopology: true,
      useNewUrlParser: true,
    });
    console.log(process.env.DATABASE_URI);
  } catch (error) {
    console.error(error);
  }
};

module.exports = connectDB;
