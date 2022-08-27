const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const { Joi, celebrate } = require('celebrate');
const { errors } = require('celebrate');
const { createUser, login } = require('./controllers/users');
const { auth } = require('./midlewares/auth');
const { handleError } = require('./midlewares/handleError');
const NotFoundError = require('./utils/NotFoundError');

const { PORT = 3000 } = process.env;
const app = express();
mongoose.connect('mongodb://localhost:27017/mestodb');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

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

app.use(auth);

app.use('/users', require('./routes/users'));
app.use('/cards', require('./routes/cards'));

app.use(errors());
app.use(handleError);

app.use((req, res, next) => {
  next(new NotFoundError('Страница не найдена'));
});

app.listen(PORT, () => {
  // eslint-disable-next-line no-console
  console.log('hello world');
});
