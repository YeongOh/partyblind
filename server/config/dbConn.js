const mongoose = require('mongoose');

mongoose.set('strictQuery', false);

const connectDB = async () => {
  console.log(process.env.DATABASE_URI);
  try {
    await mongoose.connect(process.env.DATABASE_URI, {
      useUnifiedTopology: true,
      useNewUrlParser: true,
    });
  } catch (error) {
    console.error(error);
  }
};

module.exports = connectDB;
