const ReminderStrategy = require('../service/ReminderStrategy');

/**
 * 当日汇总提醒策略
 * 每天固定时间汇总未完成任务进行提醒
 */
class DailySummaryReminderStrategy extends ReminderStrategy {
  constructor(summaryTime = 17) {
    super();
    this.summaryTime = summaryTime; // 默认下午5点
  }
  
  shouldRemind(task, policy) {
    // 已完成任务不提醒
    if (task.status.state === 'COMPLETED') return false;
    
    const now = new Date();
    const startOfDay = new Date(now);
    startOfDay.setHours(0, 0, 0, 0);
    
    // 只在当天提醒
    return now >= startOfDay;
  }
  
  getNextRemindTime(task, policy) {
    if (task.status.state === 'COMPLETED') return null;
    
    const now = new Date();
    const todaySummary = new Date(now);
    todaySummary.setHours(this.summaryTime, 0, 0, 0);
    
    if (now < todaySummary) {
      return todaySummary;
    }
    
    // 明天同一时间
    const tomorrowSummary = new Date(todaySummary);
    tomorrowSummary.setDate(tomorrowSummary.getDate() + 1);
    return tomorrowSummary;
  }
}

module.exports = DailySummaryReminderStrategy;
