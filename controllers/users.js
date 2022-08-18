const User = require('../models/user');
const {
  NOT_FOUND_STATUS,
  BAD_REQUEST_STATUS,
  SERVER_ERROR_STATUS,
} = require('../utils/status');
// const { NotFound, BadRequest, ServerError } = require("../Errors/AllErrors");

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
      res.status(SERVER_ERROR_STATUS).send({ message: 'На сервере произошла ошибка' });
    });
};

module.exports.updateUserInfo = (req, res) => {
  User.findByIdAndUpdate(
    req.user._id,
    { name: req.body.name, about: req.body.about },
    { new: true, runValidators: true },
  )
    .then((user) => {
      if (user) {
        res.send({ data: user });
        return;
      }
      res.status(NOT_FOUND_STATUS).send({ message: 'Запрашиваемый пользователь не найден' });
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(BAD_REQUEST_STATUS).send({ message: 'Переданы некорректные данные' });
        return;
      }
      if (err.name === 'CastError') {
        res
          .status(BAD_REQUEST_STATUS)
          .send({ message: 'Передан некорректный id пользователя' });
        return;
      }
      res.status(SERVER_ERROR_STATUS).send({ message: 'Ошибка сервера' });
    });
};

// module.exports.updateUserInfo = (req, res) => {
//   const { name, about } = req.body;
//   User.findByIdAndUpdate(
//     req.user._id,
//     { name, about },
//     { new: true, runValidators: true },
//   )
//     .then((user) => {
//       if (user) {
//         res.send({ data: user });
//         return;
//       }
//       res.status(NOT_FOUND_STATUS).send({ message: 'Запрашиваемый пользователь не найден' });
//     })
//     .catch((err) => {
//       if (err.name === 'ValidationError') {
//         res.status(BAD_REQUEST_STATUS).send({ message: 'Переданы некорректные данные' });
//         return;
//       }
//       if (err.name === 'CastError') {
//         res
//           .status(BAD_REQUEST_STATUS)
//           .send({ message: 'Передан некорректный id пользователя' });
//         return;
//       }
//       res.status(SERVER_ERROR_STATUS).send({ message: 'Ошибка сервера' });
//     });
// };

module.exports.updateUserAvatar = (req, res) => {
  const { avatar } = req.body;
  User.findByIdAndUpdate(
    req.user._id,
    { avatar },
    { new: true, runValidators: true },
  )
    .then((user) => {
      if (user) {
        res.send({ data: user });
        return;
      }
      res.status(NOT_FOUND_STATUS).send({ message: 'Пользователь с таким id не найден' });
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(BAD_REQUEST_STATUS).send({ message: 'Переданы некорректные данные' });
        return;
      }
      if (err.name === 'CastError') {
        res
          .status(BAD_REQUEST_STATUS)
          .send({ message: 'Передан некорректный id пользователя' });
        return;
      }
      res.status(SERVER_ERROR_STATUS).send({ message: 'На сервере произошла ошибка сервера' });
    });
};

// module.exports.getUser = (req, res, next) => {
//   User.findById(req.params.userId)
//     .onFail(() => {
//       throw new NotFound('Пользователь с таким id не найден');
//     })
//     .then((user) => {
//       res.status(200).send({ data: user });
//     })
//     .catch((err) => {
//       if (err.name === 'CastError') {
//         next(new BadRequest('Неверный запрос'));
//       } else {
//         next(err);
//       }
//     });
// };
