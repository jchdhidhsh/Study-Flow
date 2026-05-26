const BaseEntity = require('./BaseEntity');

class ReminderPolicy extends BaseEntity {
  constructor({ id, taskId, reminderTime, isEnabled }) {
    super(id);
    this.taskId = taskId;
    this.reminderTime = reminderTime;
    this.isEnabled = isEnabled !== false;
    this.createdAt = new Date();
    this.updatedAt = new Date();
  }

  updateReminderTime(newTime) {
    this.reminderTime = newTime;
    this.updatedAt = new Date();
  }

  enable() {
    this.isEnabled = true;
    this.updatedAt = new Date();
  }

  disable() {
    this.isEnabled = false;
    this.updatedAt = new Date();
  }
}

module.exports = ReminderPolicy;