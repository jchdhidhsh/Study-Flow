const BaseEntity = require('./BaseEntity');
const TaskStatus = require('../vo/TaskStatus');
const Priority = require('../vo/Priority');

class Task extends BaseEntity {
  constructor({ id, name, description, taskListId, dueDate }) {
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
}

module.exports = Task;