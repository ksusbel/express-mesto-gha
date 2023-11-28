class AlreadyExistsError extends Error {
  constructor(message) {
    super(message);
    this.status = 409;
  }
}

module.exports = { AlreadyExistsError };