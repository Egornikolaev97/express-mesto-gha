const jwt = require('jsonwebtoken');

const JWT_SECRET = '3e532aa036e8e3fbfd3960eee25f2c33993cf7659958fa1d8877c3f331f39ae3';

module.exports.jwtSign = (user) => jwt.sign({ _id: user._id }, JWT_SECRET, {
  expiresIn: '7d',
});

module.exports.jwtVerify = (token) => jwt.verify(token, JWT_SECRET);
