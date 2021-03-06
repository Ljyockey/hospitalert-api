'use strict';

const bodyParser = require('body-parser');
const express = require('express');
const morgan = require('morgan');
const router = express.Router();

const usersRouter = require('./routes/users');
const friendsRouter = require('./routes/friends');
const hospitalizationsRouter = require('./routes/hospitalizations');

const app = express();

app.use(morgan('common'));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

//allows cross-origin requests
app.use(function(req, res, next) {
  res.set('Access-Control-Allow-Origin','*');
  res.set('Access-Control-Allow-Methods','OPTIONS,GET,POST,PUT,DELETE');
  res.set('Access-Control-Allow-Headers','Origin,X-Requested-With,Content-Type,Accept,X-CSRF-TOKEN,Authorization');
  next();
});

app.use('/users', usersRouter);
app.use('/friends', friendsRouter);
app.use('/hospitalizations', hospitalizationsRouter);

//GET request to wake up API server in case it is sleeping (hosted on Heroku)
app.get('/', (req, res) => {
  return res.status(200).send('Server is awake.');
});

app.use('*', function(req, res) {
  res.status(404).json({message: 'Not found'});
});

module.exports = app;