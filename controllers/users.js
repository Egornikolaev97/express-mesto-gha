const bcrypt = require('bcryptjs');
const User = require('../models/user');
const ConflictError = require('../utils/ConflictError');
const Unauthorized = require('../utils/Unauthorized');
const NotFoundError = require('../utils/NotFoundError');
const BadRequestError = require('../utils/BadRequestError');
const {
  NOT_FOUND_STATUS,
  BAD_REQUEST_STATUS,
  SERVER_ERROR_STATUS,
} = require('../utils/status');

// get all users
module.exports.getUsers = (req, res, next) => {
  User.find({})
    .then((users) => res.send({
      data: users,
    }))
    .catch(next);
};

// get user info
module.exports.getUser = (req, res) => {
  User.findById(req.params.userId)
    .then((user) => {
      if (user) {
        res.send({ data: user });
        return;
      }
      res
        .status(NOT_FOUND_STATUS)
        .send({ message: 'Пользователь с таким id не найден' });
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        res
          .status(BAD_REQUEST_STATUS)
          .send({ message: 'Некорректный id пользователя' });
        return;
      }
      res
        .status(SERVER_ERROR_STATUS)
        .send({ message: 'На сервере произошла ошибка' });
    });
};

// create user
// module.exports.createUser = (req, res) => {
//   const { name, about, avatar } = req.body;

//   User.create({ name, about, avatar })
//     .then((user) => res.send({ data: user }))
//     .catch((err) => {
//       if (err.name === 'ValidationError') {
//         res
//           .status(BAD_REQUEST_STATUS)
//           .send({ message: 'Переданы некорректные данные' });
//         return;
//       }
//       res
//         .status(SERVER_ERROR_STATUS)
//         .send({ message: 'На сервере произошла ошибка' });
//     });
// };

// module.exports.createUser = (req, res) => {
//   const {
//     name, about, avatar, email, password,
//   } = req.body;
//   User.findOne({ email }).then((userFinded) => {
//     if (userFinded) {
//       throw new ConflictError('Пользователь уже зарегестрирован');
//     }
//     bcrypt.hash(password, 10).then((hash) => {
//       User.create({
//         name,
//         about,
//         avatar,
//         email,
//         password: hash,
//       })
//         .then((user) => {
//           res.send({
//             data: {
//               email: user.email,
//               name: user.name,
//               about: user.about,
//               avatar: user.avatar,
//               _id: user._id,
//             },
//           });
//         })
//         .catch((err) => {
//           if (err.name === 'ValidationError') {
//             res
//               .status(BAD_REQUEST_STATUS)
//               .send({ message: 'Переданы некорректные данные' });
//             return;
//           }
//           res
//             .status(SERVER_ERROR_STATUS)
//             .send({ message: 'На сервере произошла ошибка' });
//         });
//     });
//   });
// };

// module.exports.createUser = (req, res, next) => {
//   const {
//     email, password, name, about, avatar,
//   } = req.body;
//   User.findOne({ email }).then((userFinded) => {
//     if (userFinded) {
//       throw new ConflictError('Пользователь уже зарегестрирован');
//     }
//     bcrypt.hash(password, 10).then((hash) => User.create({
//       name, about, avatar, email, password: hash,
//     }))
//       .then((user) => {
//         res.status(201).send({
//           data: {
//             email: user.email,
//             name: user.name,
//             about: user.about,
//             avatar: user.avatar,
//             _id: user._id,
//           },
//         });
//       }).catch((err) => {
//         if (err.name === 'ValidationError') {
//           throw new BadRequestError('Переданы некорректные данные');
//         }
//         if (err.code === 11000) {
//           throw new ConflictError('Пользователь уже зарегестрирован');
//         }
//         next(err);
//       })
//       .catch(next);
//   })
//     .catch(next);
// };

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

// update user info
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
      res
        .status(NOT_FOUND_STATUS)
        .send({ message: 'Пользователь с таким id не найден' });
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res
          .status(BAD_REQUEST_STATUS)
          .send({ message: 'Переданы некорректные данные' });
        return;
      }
      if (err.name === 'CastError') {
        res
          .status(BAD_REQUEST_STATUS)
          .send({ message: 'Передан некорректный id пользователя' });
        return;
      }
      res
        .status(SERVER_ERROR_STATUS)
        .send({ message: 'На сервере произошла ошибка' });
    });
};

// update user avatar
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
      res
        .status(NOT_FOUND_STATUS)
        .send({ message: 'Пользователь с таким id не найден' });
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res
          .status(BAD_REQUEST_STATUS)
          .send({ message: 'Переданы некорректные данные' });
        return;
      }
      if (err.name === 'CastError') {
        res
          .status(BAD_REQUEST_STATUS)
          .send({ message: 'Передан некорректный id пользователя' });
        return;
      }
      res
        .status(SERVER_ERROR_STATUS)
        .send({ message: 'На сервере произошла ошибка' });
    });
};
