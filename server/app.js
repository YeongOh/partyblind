require('dotenv').config();
const express = require('express');
const app = express();
const cors = require('cors');
const cookieParser = require('cookie-parser');
const mongoose = require('mongoose');
const connectDB = require('./config/dbConn');
// const verifyJWT = require('./middlewares/verifyJWT');

connectDB();

app.use(express.urlencoded({ extended: false }));
app.use(express.json());

const whitelist = [
  'https://partyblind-api.onrender.com',
  'http://localhost:3000',
];

const corsOptions = {
  origin: function (origin, callback) {
    if (whitelist.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
};

app.use(cors(corsOptions));
app.use(cookieParser());

app.use('/auth', require('./routers/auth'));
app.use('/post', require('./routers/post'));
// app.use(verifyJWT);

// everything below needs authentication

// Not Found
app.use((req, res, next) => {
  console.log('reached Not Found');
  res.sendStatus(404);
});

// Error handling
app.use((error, req, res, next) => {
  console.log(error);
  res.sendStatus(500);
});

mongoose.connection.once('open', () => {
  console.log('MongoDB is live!');
  app.listen(4000, () => {
    console.log('Server is live!');
  });
});
