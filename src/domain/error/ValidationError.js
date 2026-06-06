const DomainError = require('./DomainError');

/**
 * 验证异常 - 用于输入参数校验失败
 */
class ValidationError extends DomainError {
  constructor(message, errors = []) {
    super(message, 'VALIDATION_ERROR');
    this.errors = Array.isArray(errors) ? errors : [message];
  }
}

module.exports = ValidationError;
