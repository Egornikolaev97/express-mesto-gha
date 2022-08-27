const { UNAUTHORIZED } = require('./status');

class Unauthorized extends Error {
  constructor(message) {
    super(message);
    this.statusCode = UNAUTHORIZED;
  }
}

module.exports = Unauthorized;
