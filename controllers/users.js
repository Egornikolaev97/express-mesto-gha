const User = require('../models/user');
const {
  NOT_FOUND_STATUS,
  BAD_REQUEST_STATUS,
  SERVER_ERROR_STATUS,
} = require('../utils/status');

module.exports.getUsers = (req, res, next) => {
  User.find({})
    .then((users) => res.send({
      data: users,
    }))
    .catch(next);
};

module.exports.getUser = (req, res) => {
  User.findById(req.params.userId)
    .then((user) => {
      if (user) {
        res.send({ data: user });
        return;
      }
      res.status(NOT_FOUND_STATUS).send({
        message: 'Пользователь с таким id не найден',
      });
    })
    .catch((err) => {
      if (err.name === 'castError') {
        res.status(BAD_REQUEST_STATUS).send({
          message: 'Некорректный id пользователя',
        });
        return;
      }
      res.status(SERVER_ERROR_STATUS).send({ message: err.name });
    });
};

module.exports.createUser = (req, res) => {
  const {
    name, about, avatar,
  } = req.body;

  User.create({
    name, about, avatar,
  })
    .then((user) => res.send({ data: user }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(BAD_REQUEST_STATUS).send({ message: 'Переданы некорректные данные' });
        return;
      }
      res.status(SERVER_ERROR_STATUS).send({ message: 'Ошибка сервера' });
    });
};
