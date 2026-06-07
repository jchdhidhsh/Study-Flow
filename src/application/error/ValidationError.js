/**
 * ValidationError - 参数验证异常
 * 用于统一处理业务层参数验证错误
 */
class ValidationError extends Error {
  constructor(errors) {
    const errorArray = Array.isArray(errors) ? errors : [errors];
    super(errorArray.join('; '));
    this.name = 'ValidationError';
    this.errors = errorArray;
  }
}

module.exports = ValidationError;
