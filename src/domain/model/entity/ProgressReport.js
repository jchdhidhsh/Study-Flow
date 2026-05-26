const BaseEntity = require('./BaseEntity');

class ProgressReport extends BaseEntity {
  constructor({ id, userId, reportDate, totalTasks, completedTasks, inProgressTasks, pendingTasks, cancelledTasks, completionRate, priorityStats }) {
    super(id);
    this.userId = userId;
    this.reportDate = reportDate;
    this.totalTasks = totalTasks;
    this.completedTasks = completedTasks;
    this.inProgressTasks = inProgressTasks;
    this.pendingTasks = pendingTasks;
    this.cancelledTasks = cancelledTasks;
    this.completionRate = completionRate;
    this.priorityStats = priorityStats || {};
    this.generatedAt = new Date();
  }
}

module.exports = ProgressReport;