const BaseEntity = require('./BaseEntity');
const TaskStatus = require('../vo/TaskStatus');
const Priority = require('../vo/Priority');

class Task extends BaseEntity {
  constructor({ id, name, description, taskListId, dueDate }) {
    if (!id) {
      throw new Error('实体 ID 不能为空');
    }
    super(id);
    this.name = name;
    this.description = description || '';
    this.taskListId = taskListId;
    this.dueDate = dueDate;
    this.priority = Priority.MEDIUM;
    this.status = TaskStatus.PENDING;
    this.reminderPolicyId = null;
    this.createdAt = new Date();
    this.updatedAt = new Date();
    this.completedAt = null;
  }

  changeStatus(newStatus) {
    const currentState = this.status.state;
    const targetState = newStatus.state;
    if (currentState === 'COMPLETED' || currentState === 'CANCELLED') {
      throw new Error('已完成后或已取消的任务不可变更状态');
    }
    if (targetState === 'COMPLETED' || targetState === 'CANCELLED') {
      this.completedAt = new Date();
    }
    this.status = newStatus;
    this.updatedAt = new Date();
  }

  setPriority(priority) {
    this.priority = priority;
    this.updatedAt = new Date();
  }

  assignReminderPolicy(policyId) {
    this.reminderPolicyId = policyId;
    this.updatedAt = new Date();
  }

  isOverdue() {
    return this.status.state !== 'COMPLETED' && this.status.state !== 'CANCELLED' && new Date() > this.dueDate;
  }

  /**
   * 完成任务（状态模式方法）
   * @returns {Task} 返回自身以支持链式调用
   * @throws {Error} 已取消的任务不可完成
   */
  complete() {
    if (this.status.state === 'CANCELLED') {
      throw new Error('已取消的任务不可完成');
    }
    // 幂等性：已完成的任务再次调用不报错
    if (this.status.state !== 'COMPLETED') {
      this.status = TaskStatus.COMPLETED;
      this.completedAt = new Date();
      this.updatedAt = new Date();
    }
    return this;
  }
}

module.exports = Task;