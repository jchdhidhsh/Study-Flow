const ValidationError = require('../error/ValidationError');

/**
 * 任务创建参数验证器
 */
class TaskValidator {
  static VALID_PRIORITIES = ['HIGH', 'MEDIUM', 'LOW'];

  /**
   * 验证创建任务命令
   * @param {Object} command - 创建任务命令
   * @param {string} command.userId - 用户ID
   * @param {string} command.title - 任务标题
   * @param {Object} command.priority - 任务优先级
   * @param {Date} command.dueDate - 截止日期
   * @throws {ValidationError} 验证失败时抛出
   */
  static validateCreate(command) {
    const errors = [];

    if (!command.userId || command.userId.trim() === '') {
      errors.push('userId 不能为空');
    }

    if (!command.title || command.title.trim() === '') {
      errors.push('title 不能为空');
    }

    if (!command.priority || !this.VALID_PRIORITIES.includes(command.priority.level)) {
      errors.push('priority 必须为合法枚举值');
    }

    if (!command.dueDate || command.dueDate < new Date()) {
      errors.push('dueDate 不能早于当前时间');
    }

    if (errors.length > 0) {
      throw new ValidationError('验证失败', errors);
    }
  }

  /**
   * 验证ID参数
   * @param {string} id - ID
   * @param {string} fieldName - 字段名称
   * @throws {ValidationError} 验证失败时抛出
   */
  static validateId(id, fieldName = 'id') {
    if (!id || id.trim() === '') {
      throw new ValidationError(`${fieldName} 不能为空`);
    }
  }

  /**
   * 验证日期参数
   * @param {Date} date - 日期
   * @throws {ValidationError} 验证失败时抛出
   */
  static validateDate(date) {
    if (date === null || date === undefined) {
      throw new ValidationError('date 不能为空');
    }
  }
}

module.exports = TaskValidator;
