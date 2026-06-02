const ValidationError = require('../error/ValidationError');

const VALID_PRIORITIES = ['HIGH', 'MEDIUM', 'LOW'];

class TaskValidator {
  static validateCreate(command) {
    const errors = [];

    if (!command.userId || command.userId.trim() === '') {
      errors.push('userId 不能为空');
    }

    if (!command.title || command.title.trim() === '') {
      errors.push('title 不能为空');
    }

    if (!command.priority || !VALID_PRIORITIES.includes(command.priority.level)) {
      errors.push('priority 必须为合法枚举值');
    }

    if (!command.dueDate) {
      errors.push('dueDate 不能为空');
    } else if (command.dueDate < new Date()) {
      errors.push('dueDate 不能早于当前时间');
    }

    if (errors.length > 0) {
      throw new ValidationError(errors);
    }

    return true;
  }

  static validateTaskId(taskId, fieldName = 'taskId') {
    if (!taskId || taskId.trim() === '') {
      throw new ValidationError([`${fieldName} 不能为空`]);
    }
    return true;
  }

  static validateUserId(userId) {
    if (!userId || userId.trim() === '') {
      throw new ValidationError(['userId 不能为空']);
    }
    return true;
  }

  static validateDate(date, fieldName = 'date') {
    if (date === null || date === undefined) {
      throw new ValidationError([`${fieldName} 不能为空`]);
    }
    return true;
  }
}

module.exports = TaskValidator;