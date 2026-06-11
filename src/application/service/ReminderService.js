const ReminderStrategyFactory = require('../../domain/service/ReminderStrategyFactory');

/**
 * 提醒服务
 * 负责根据策略判断任务是否需要提醒
 */
class ReminderService {
  /**
   * @param {ReminderStrategyFactory} strategyFactory - 策略工厂
   */
  constructor(strategyFactory) {
    this.strategyFactory = strategyFactory;
  }
  
  /**
   * 判断单个任务是否应该提醒
   * @param {Task} task - 任务实体
   * @param {ReminderPolicy} policy - 提醒策略配置
   * @returns {boolean} 是否应该提醒
   */
  shouldRemind(task, policy) {
    const strategy = this.strategyFactory.get(policy.type);
    return strategy.shouldRemind(task, policy);
  }
  
  /**
   * 获取所有待提醒的任务和策略组合
   * @param {Task[]} tasks - 任务列表
   * @param {ReminderPolicy[]} policies - 策略配置列表
   * @returns {Array<{task: Task, policy: ReminderPolicy}>} 待提醒列表
   */
  getAllPendingReminders(tasks, policies) {
    const reminders = [];
    
    for (const policy of policies) {
      // 找到 policy 对应的任务
      const task = tasks.find(t => t.id === policy.taskId);
      if (task && this.shouldRemind(task, policy)) {
        reminders.push({ task, policy });
      }
    }
    
    return reminders;
  }
  
  /**
   * 获取下次提醒时间
   * @param {Task} task - 任务实体
   * @param {ReminderPolicy} policy - 提醒策略配置
   * @returns {Date|null} 下次提醒时间
   */
  getNextRemindTime(task, policy) {
    const strategy = this.strategyFactory.get(policy.type);
    return strategy.getNextRemindTime(task, policy);
  }
}

module.exports = ReminderService;
