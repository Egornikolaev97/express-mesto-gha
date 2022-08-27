const { FORBIDDEN_STATUS } = require('./status');

class ForbiddenError extends Error {
  constructor(message) {
    super(message);
    this.statusCode = FORBIDDEN_STATUS;
  }
}

module.exports = ForbiddenError;
