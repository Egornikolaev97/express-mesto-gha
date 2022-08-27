const { SERVER_ERROR_STATUS } = require('../utils/status');

module.exports = (err, req, res, next) => {
  const { statusCode = SERVER_ERROR_STATUS, message } = err;
  res
    .status(statusCode)
    .send({
      message: statusCode === SERVER_ERROR_STATUS
        ? 'На сервере произошла ошибка'
        : message,
    });
  next();
};
