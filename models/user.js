const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const { isEmail, isURL } = require('validator');
const UnauthorizedError = require('../utils/Unauthorized');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    minlength: 2,
    maxlength: 30,
    default: 'Жак-Ив Кусто',
  },
  about: {
    type: String,
    required: true,
    minlength: 2,
    maxlength: 30,
    default: 'Исследователь',
  },
  avatar: {
    type: String,
    required: true,
    default: 'https://pictures.s3.yandex.net/resources/jacques-cousteau_1604399756.png',
    validate: isURL,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    validate: isEmail,
  },
  password: {
    type: String,
    require: true,
    select: false,
  },
}, {
  versionKey: false,
});

userSchema.statics.findUserByCredintials = function (email, password) {
  return this.findOne({ email }).select('+password')
    .then((user) => {
      if (!user) {
        throw new UnauthorizedError('Неверный email или пароль');
      }
      return bcrypt.compare(password, user.password).then((matched) => {
        if (!matched) {
          throw new UnauthorizedError('Неверный email или пароль');
        }
        return user;
      });
    });
};

module.exports = mongoose.model('user', userSchema);
