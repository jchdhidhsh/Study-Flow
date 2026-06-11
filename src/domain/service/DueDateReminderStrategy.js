const ReminderStrategy = require('../service/ReminderStrategy');

/**
 * 到期前1天提醒策略
 * 在任务到期前24小时内进行提醒
 */
class DueDateReminderStrategy extends ReminderStrategy {
  shouldRemind(task, policy) {
    // 已完成任务不提醒
    if (task.status.state === 'COMPLETED') return false;
    
    const now = new Date();
    const dueDate = new Date(task.dueDate);
    const oneDayBefore = new Date(dueDate);
    oneDayBefore.setDate(oneDayBefore.getDate() - 1);
    
    // 在到期前24小时内且未到期时提醒
    return now >= oneDayBefore && now < dueDate;
  }
  
  getNextRemindTime(task, policy) {
    const dueDate = new Date(task.dueDate);
    const oneDayBefore = new Date(dueDate);
    oneDayBefore.setDate(oneDayBefore.getDate() - 1);
    
    if (new Date() < oneDayBefore) {
      return oneDayBefore;
    }
    return null;
  }
}

module.exports = DueDateReminderStrategy;
