/**
 * 提醒策略基类
 * 定义提醒策略的接口
 */
class ReminderStrategy {
  /**
   * 判断任务是否应该提醒
   * @param {Task} task - 任务实体
   * @param {ReminderPolicy} policy - 提醒策略配置
   * @returns {boolean} 是否应该提醒
   */
  shouldRemind(task, policy) {
    throw new Error('Not implemented');
  }
  
  /**
   * 获取下次提醒时间
   * @param {Task} task - 任务实体
   * @param {ReminderPolicy} policy - 提醒策略配置
   * @returns {Date|null} 下次提醒时间
   */
  getNextRemindTime(task, policy) {
    return null;
  }
}

module.exports = ReminderStrategy;
