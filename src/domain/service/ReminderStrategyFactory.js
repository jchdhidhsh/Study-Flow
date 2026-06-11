/**
 * 提醒策略工厂
 * 管理策略的注册和获取
 */
class ReminderStrategyFactory {
  constructor() {
    this.strategies = new Map();
  }
  
  /**
   * 注册策略
   * @param {string} type - 策略类型标识
   * @param {ReminderStrategy} strategy - 策略实例
   */
  register(type, strategy) {
    this.strategies.set(type, strategy);
  }
  
  /**
   * 获取策略
   * @param {string} type - 策略类型标识
   * @returns {ReminderStrategy} 策略实例
   * @throws {Error} 当策略不存在时抛出错误
   */
  get(type) {
    const strategy = this.strategies.get(type);
    if (!strategy) {
      throw new Error(`Unknown reminder type: ${type}`);
    }
    return strategy;
  }
  
  /**
   * 检查策略是否存在
   * @param {string} type - 策略类型标识
   * @returns {boolean} 策略是否存在
   */
  has(type) {
    return this.strategies.has(type);
  }
  
  /**
   * 创建默认工厂实例（预置常用策略）
   * @returns {ReminderStrategyFactory}
   */
  static createDefault() {
    const factory = new ReminderStrategyFactory();
    
    // 延迟加载策略类以避免循环依赖
    const DueDateReminderStrategy = require('./DueDateReminderStrategy');
    const HighPriorityReminderStrategy = require('./HighPriorityReminderStrategy');
    const DailySummaryReminderStrategy = require('./DailySummaryReminderStrategy');
    
    factory.register('DUE_DATE', new DueDateReminderStrategy());
    factory.register('HIGH_PRIORITY', new HighPriorityReminderStrategy());
    factory.register('DAILY_SUMMARY', new DailySummaryReminderStrategy());
    
    return factory;
  }
}

module.exports = ReminderStrategyFactory;
