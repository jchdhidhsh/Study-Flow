class TaskStatistics {
  constructor({ totalCount, completedCount, inProgressCount, pendingCount, completionRate, highPriorityCount }) {
    this.totalCount = totalCount;
    this.completedCount = completedCount;
    this.inProgressCount = inProgressCount;
    this.pendingCount = pendingCount;
    this.completionRate = completionRate;
    this.highPriorityCount = highPriorityCount;
    Object.freeze(this);
  }
}

module.exports = TaskStatistics;