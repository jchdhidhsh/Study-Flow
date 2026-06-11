const ReminderStrategy = require('../service/ReminderStrategy');

/**
 * 高优先级即时提醒策略
 * 高优先级任务创建后立即提醒
 */
class HighPriorityReminderStrategy extends ReminderStrategy {
  shouldRemind(task, policy) {
    return task.priority.level === 'HIGH' && task.status.state !== 'COMPLETED';
  }
  
  getNextRemindTime(task, policy) {
    // 高优先级任务创建后立即提醒
    if (task.priority.level === 'HIGH' && task.status.state !== 'COMPLETED') {
      return new Date();
    }
    return null;
  }
}

module.exports = HighPriorityReminderStrategy;
