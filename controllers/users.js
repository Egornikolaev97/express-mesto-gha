const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const ConflictError = require('../utils/ConflictError');
const NotFoundError = require('../utils/NotFoundError');
const BadRequestError = require('../utils/BadRequestError');

// get all users
module.exports.getUsers = (req, res, next) => {
  User.find({})
    .then((users) => res.status(200).send(users))
    .catch(next);
};

// get user info
module.exports.getUser = (req, res, next) => {
  User.findById(req.params.userId)
    .then((user) => {
      if (user) {
        res.send({ data: user });
      } else {
        throw new NotFoundError('Пользователь не найден');
      }
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        throw new BadRequestError('Передан некорректный id пользователя');
      }
      next(err);
    }).catch(next);
};

module.exports.getUserMe = (req, res, next) => {
  User.findById(req.user._id).then((user) => {
    if (!user) {
      throw new NotFoundError('Пользователь не найден');
    }
    res.status(200).send({ data: user });
  }).catch(next);
};

// create user
module.exports.createUser = (req, res, next) => {
  const {
    email, password, name, about, avatar,
  } = req.body;

  bcrypt
    .hash(password, 10)
    .then((hash) => User.create({
      name,
      about,
      avatar,
      email,
      password: hash,
    }))
    .then((user) => User.findOne({ _id: user._id }))
    .then((user) => res.send(user))
    .catch((err) => {
      if (err.name === 'ValidationError' || err.name === 'CastError') {
        next(new BadRequestError('Неверный запрос или данные'));
      }
      if (err.code === 11000) {
        next(new ConflictError('Пользователь с таким email уже зарегестрирован'));
      }
      next(err);
    });
};

// login
module.exports.login = (req, res, next) => {
  const { email, password } = req.body;

  return User.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign(
        { _id: user._id },
        'some-secret-key',
        { expiresIn: '7d' },
      );
      res.send({ jwt: token });
    })
    .catch(next);
};

// update user info
// module.exports.updateUserInfo = (req, res) => {
//   User.findByIdAndUpdate(
//     req.user._id,
//     { name: req.body.name, about: req.body.about },
//     { new: true, runValidators: true },
//   )
//     .then((user) => {
//       if (user) {
//         res.send({ data: user });
//         return;
//       }
//       res
//         .status(NOT_FOUND_STATUS)
//         .send({ message: 'Пользователь с таким id не найден' });
//     })
//     .catch((err) => {
//       if (err.name === 'ValidationError') {
//         res
//           .status(BAD_REQUEST_STATUS)
//           .send({ message: 'Переданы некорректные данные' });
//         return;
//       }
//       if (err.name === 'CastError') {
//         res
//           .status(BAD_REQUEST_STATUS)
//           .send({ message: 'Передан некорректный id пользователя' });
//         return;
//       }
//       res
//         .status(SERVER_ERROR_STATUS)
//         .send({ message: 'На сервере произошла ошибка' });
//     });
// };

module.exports.updateUserInfo = (req, res, next) => {
  const { name, about } = req.body;
  User.findByIdAndUpdate(
    req.user._id,
    { name, about },
    { new: true, runValidators: true },
  )
    .then((user) => {
      if (user) {
        res.send({ data: user });
        return;
      }
      throw new NotFoundError('Пользователь не найден');
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        throw new BadRequestError('Переданы некорректные данные');
      }
      if (err.name === 'CastError') {
        throw new BadRequestError('Передан некорректный id пользователя');
      }
      next(err);
    }).catch(next);
};

// update user avatar
// module.exports.updateUserAvatar = (req, res) => {
//   const { avatar } = req.body;
//   User.findByIdAndUpdate(
//     req.user._id,
//     { avatar },
//     { new: true, runValidators: true },
//   )
//     .then((user) => {
//       if (user) {
//         res.send({ data: user });
//         return;
//       }
//       res
//         .status(NOT_FOUND_STATUS)
//         .send({ message: 'Пользователь с таким id не найден' });
//     })
//     .catch((err) => {
//       if (err.name === 'ValidationError') {
//         res
//           .status(BAD_REQUEST_STATUS)
//           .send({ message: 'Переданы некорректные данные' });
//         return;
//       }
//       if (err.name === 'CastError') {
//         res
//           .status(BAD_REQUEST_STATUS)
//           .send({ message: 'Передан некорректный id пользователя' });
//         return;
//       }
//       res
//         .status(SERVER_ERROR_STATUS)
//         .send({ message: 'На сервере произошла ошибка' });
//     });
// };

module.exports.updateUserAvatar = (req, res, next) => {
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
      throw new NotFoundError('Запрашиваемый пользователь не найден');
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        throw new BadRequestError('Переданы некорректные данные');
      }
      if (err.name === 'CastError') {
        throw new BadRequestError('Передан некорректный id пользователя');
      }
      next(err);
    }).catch(next);
};
