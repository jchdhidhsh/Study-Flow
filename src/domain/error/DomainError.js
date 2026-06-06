/**
 * 领域异常基类
 */
class DomainError extends Error {
  constructor(message, code = null) {
    super(message);
    this.name = this.constructor.name;
    this.code = code;
    Error.captureStackTrace(this, this.constructor);
  }
}

module.exports = DomainError;
