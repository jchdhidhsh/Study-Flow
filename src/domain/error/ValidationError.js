class ValidationError extends Error {
  constructor(errors) {
    const message = Array.isArray(errors) ? errors.join('; ') : errors;
    super(message);
    this.name = 'ValidationError';
    this.errors = Array.isArray(errors) ? errors : [errors];
  }
}

module.exports = ValidationError;