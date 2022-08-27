const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const handleError = require('./midlewares/handleError');
const { createUser, login } = require('./controllers/users');
const auth = require('./midlewares/auth');
const { NOT_FOUND_STATUS } = require('./utils/status');

const { PORT = 3000 } = process.env;
const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use((req, res, next) => {
  req.user = {
    _id: '62fe287129b9817061602c01',
  };

  next();
});

app.post(
  '/signup',
  celebrate({
    body: Joi.object().keys({
      email: Joi.string().required().email(),
      password: Joi.string().required(),
      name: Joi.string().min(2).max(30),
      about: Joi.string().min(2).max(30),
      avatar: Joi.string().regex(/^http(s)?:\/\/((www.)?([\w-]+\.)+\/?)\S*$/),
    }),
  }),
  createUser,
);
app.post(
  '/signin',
  celebrate({
    body: Joi.object().keys({
      email: Joi.string().required().email(),
      password: Joi.string().required(),
    }),
  }),
  login,
);
app.use(auth);

mongoose.connect('mongodb://localhost:27017/mestodb');

app.use('/users', require('./routes/users'));
app.use('/cards', require('./routes/cards'));

app.use(handleError);

app.use((req, res) => {
  res
    .status(NOT_FOUND_STATUS)
    .send({ message: 'Такой страницы не существует' });
});

app.listen(PORT, () => {
  // eslint-disable-next-line no-console
  console.log('hello world');
});
