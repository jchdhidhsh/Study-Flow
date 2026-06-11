/**
 * ReminderStrategy 策略模式测试
 * 
 * 测试覆盖：
 * 1. DueDateReminderStrategy - 到期前1天提醒
 * 2. HighPriorityReminderStrategy - 高优先级即时提醒
 * 3. DailySummaryReminderStrategy - 当日未完成任务汇总提醒
 * 4. ReminderStrategyFactory - 策略工厂
 * 5. ReminderService - 提醒服务
 */

const path = require('path');
const ROOT_DIR = 'D:\\vscode\\Study-Flow';
const Task = require(path.join(ROOT_DIR, 'src/domain/model/entity/Task'));
const TaskStatus = require(path.join(ROOT_DIR, 'src/domain/model/vo/TaskStatus'));
const Priority = require(path.join(ROOT_DIR, 'src/domain/model/vo/Priority'));

// 策略实现 - 从源文件导入
const ReminderStrategy = require(path.join(ROOT_DIR, 'src/domain/service/ReminderStrategy'));
const DueDateReminderStrategy = require(path.join(ROOT_DIR, 'src/domain/service/DueDateReminderStrategy'));
const HighPriorityReminderStrategy = require(path.join(ROOT_DIR, 'src/domain/service/HighPriorityReminderStrategy'));
const DailySummaryReminderStrategy = require(path.join(ROOT_DIR, 'src/domain/service/DailySummaryReminderStrategy'));
const ReminderStrategyFactory = require(path.join(ROOT_DIR, 'src/domain/service/ReminderStrategyFactory'));
const ReminderService = require(path.join(ROOT_DIR, 'src/application/service/ReminderService'));

// ==================== 测试用例 ====================

describe('ReminderStrategy 策略基类', () => {
  test('shouldRemind 方法应被子类实现', () => {
    const strategy = new ReminderStrategy();
    const mockTask = { status: { state: 'PENDING' } };
    const mockPolicy = {};
    
    expect(() => strategy.shouldRemind(mockTask, mockPolicy)).toThrow('Not implemented');
  });
});

describe('DueDateReminderStrategy - 到期前1天提醒', () => {
  let strategy;
  let task;

  beforeEach(() => {
    strategy = new DueDateReminderStrategy();
  });

  test('任务在到期前24小时内应提醒', () => {
    // 模拟：距离到期还有12小时
    const dueDate = new Date(Date.now() + 12 * 60 * 60 * 1000);
    task = new Task({
      id: 1,
      name: '测试任务',
      taskListId: 1,
      dueDate: dueDate
    });
    task.status = TaskStatus.PENDING;
    
    const policy = { type: 'DUE_DATE' };
    expect(strategy.shouldRemind(task, policy)).toBe(true);
  });

  test('任务距离到期超过24小时不应提醒', () => {
    // 模拟：距离到期还有2天
    const dueDate = new Date(Date.now() + 2 * 24 * 60 * 60 * 1000);
    task = new Task({
      id: 2,
      name: '测试任务',
      taskListId: 1,
      dueDate: dueDate
    });
    task.status = TaskStatus.PENDING;
    
    const policy = { type: 'DUE_DATE' };
    expect(strategy.shouldRemind(task, policy)).toBe(false);
  });

  test('已完成任务不应提醒', () => {
    const dueDate = new Date(Date.now() + 12 * 60 * 60 * 1000);
    task = new Task({
      id: 3,
      name: '测试任务',
      taskListId: 1,
      dueDate: dueDate
    });
    task.status = TaskStatus.COMPLETED;
    
    const policy = { type: 'DUE_DATE' };
    expect(strategy.shouldRemind(task, policy)).toBe(false);
  });

  test('已过期任务不应提醒', () => {
    // 模拟：任务已过期1小时
    const dueDate = new Date(Date.now() - 60 * 60 * 1000);
    task = new Task({
      id: 4,
      name: '测试任务',
      taskListId: 1,
      dueDate: dueDate
    });
    task.status = TaskStatus.PENDING;
    
    const policy = { type: 'DUE_DATE' };
    expect(strategy.shouldRemind(task, policy)).toBe(false);
  });
});

describe('HighPriorityReminderStrategy - 高优先级即时提醒', () => {
  let strategy;
  let task;

  beforeEach(() => {
    strategy = new HighPriorityReminderStrategy();
  });

  test('高优先级未完成任务应即时提醒', () => {
    task = new Task({
      id: 1,
      name: '紧急任务',
      taskListId: 1,
      dueDate: new Date(Date.now() + 86400000)
    });
    task.status = TaskStatus.PENDING;
    task.priority = Priority.HIGH;
    
    const policy = { type: 'HIGH_PRIORITY' };
    expect(strategy.shouldRemind(task, policy)).toBe(true);
  });

  test('高优先级已完成任务不应提醒', () => {
    task = new Task({
      id: 2,
      name: '已完成紧急任务',
      taskListId: 1,
      dueDate: new Date(Date.now() + 86400000)
    });
    task.status = TaskStatus.COMPLETED;
    task.priority = Priority.HIGH;
    
    const policy = { type: 'HIGH_PRIORITY' };
    expect(strategy.shouldRemind(task, policy)).toBe(false);
  });

  test('中优先级任务不应即时提醒', () => {
    task = new Task({
      id: 3,
      name: '普通任务',
      taskListId: 1,
      dueDate: new Date(Date.now() + 86400000)
    });
    task.status = TaskStatus.PENDING;
    task.priority = Priority.MEDIUM;
    
    const policy = { type: 'HIGH_PRIORITY' };
    expect(strategy.shouldRemind(task, policy)).toBe(false);
  });

  test('低优先级任务不应即时提醒', () => {
    task = new Task({
      id: 4,
      name: '低优先级任务',
      taskListId: 1,
      dueDate: new Date(Date.now() + 86400000)
    });
    task.status = TaskStatus.PENDING;
    task.priority = Priority.LOW;
    
    const policy = { type: 'HIGH_PRIORITY' };
    expect(strategy.shouldRemind(task, policy)).toBe(false);
  });
});

describe('DailySummaryReminderStrategy - 当日未完成任务汇总提醒', () => {
  let strategy;
  let task;

  beforeEach(() => {
    strategy = new DailySummaryReminderStrategy();
  });

  test('当日未完成任务应提醒', () => {
    // 创建一个截止日期为今天的任务
    const today = new Date();
    today.setHours(23, 59, 59, 999);
    
    task = new Task({
      id: 1,
      name: '今日任务',
      taskListId: 1,
      dueDate: today
    });
    task.status = TaskStatus.PENDING;
    
    const policy = { type: 'DAILY_SUMMARY' };
    expect(strategy.shouldRemind(task, policy)).toBe(true);
  });

  test('已完成的任务不应提醒', () => {
    const today = new Date();
    today.setHours(23, 59, 59, 999);
    
    task = new Task({
      id: 2,
      name: '已完成今日任务',
      taskListId: 1,
      dueDate: today
    });
    task.status = TaskStatus.COMPLETED;
    
    const policy = { type: 'DAILY_SUMMARY' };
    expect(strategy.shouldRemind(task, policy)).toBe(false);
  });

  test('未来日期的任务应在当日汇总中', () => {
    const futureDate = new Date();
    futureDate.setDate(futureDate.getDate() + 1);
    
    task = new Task({
      id: 3,
      name: '明日任务',
      taskListId: 1,
      dueDate: futureDate
    });
    task.status = TaskStatus.PENDING;
    
    const policy = { type: 'DAILY_SUMMARY' };
    // 当前实现只检查是否当天，不检查是否到期
    expect(strategy.shouldRemind(task, policy)).toBe(true);
  });
});

describe('ReminderStrategyFactory - 策略工厂', () => {
  let factory;

  beforeEach(() => {
    factory = new ReminderStrategyFactory();
  });

  test('可以注册和获取策略', () => {
    const strategy = new DueDateReminderStrategy();
    factory.register('DUE_DATE', strategy);
    
    expect(factory.has('DUE_DATE')).toBe(true);
    expect(factory.get('DUE_DATE')).toBe(strategy);
  });

  test('获取未注册的策略应抛出错误', () => {
    expect(() => factory.get('UNKNOWN')).toThrow('Unknown reminder type: UNKNOWN');
  });

  test('has 方法正确判断策略存在性', () => {
    expect(factory.has('DUE_DATE')).toBe(false);
    
    factory.register('DUE_DATE', new DueDateReminderStrategy());
    
    expect(factory.has('DUE_DATE')).toBe(true);
  });

  test('可以注册多个策略', () => {
    factory.register('DUE_DATE', new DueDateReminderStrategy());
    factory.register('HIGH_PRIORITY', new HighPriorityReminderStrategy());
    factory.register('DAILY_SUMMARY', new DailySummaryReminderStrategy());
    
    expect(factory.has('DUE_DATE')).toBe(true);
    expect(factory.has('HIGH_PRIORITY')).toBe(true);
    expect(factory.has('DAILY_SUMMARY')).toBe(true);
  });
});

describe('ReminderService - 提醒服务集成测试', () => {
  let factory;
  let service;
  let task1, task2, task3;
  let policies;

  beforeEach(() => {
    factory = new ReminderStrategyFactory();
    factory.register('DUE_DATE', new DueDateReminderStrategy());
    factory.register('HIGH_PRIORITY', new HighPriorityReminderStrategy());
    factory.register('DAILY_SUMMARY', new DailySummaryReminderStrategy());
    
    service = new ReminderService(factory);
    
    // 创建测试任务
    task1 = new Task({
      id: 1,
      name: '紧急任务',
      taskListId: 1,
      dueDate: new Date(Date.now() + 12 * 60 * 60 * 1000) // 12小时后到期
    });
    task1.status = TaskStatus.PENDING;
    task1.priority = Priority.HIGH;
    
    task2 = new Task({
      id: 2,
      name: '普通任务',
      taskListId: 1,
      dueDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000) // 2天后到期
    });
    task2.status = TaskStatus.PENDING;
    task2.priority = Priority.MEDIUM;
    
    task3 = new Task({
      id: 3,
      name: '已完成任务',
      taskListId: 1,
      dueDate: new Date(Date.now() + 12 * 60 * 60 * 1000)
    });
    task3.status = TaskStatus.COMPLETED;
    task3.priority = Priority.HIGH;
    
    policies = [
      { id: 1, type: 'DUE_DATE', taskId: 1 },
      { id: 2, type: 'HIGH_PRIORITY', taskId: 2 },
      { id: 3, type: 'DAILY_SUMMARY', taskId: 3 }
    ];
  });

  test('shouldRemind 正确使用策略', () => {
    // task1: 高优先级，应该被 HIGH_PRIORITY 策略提醒
    expect(service.shouldRemind(task1, { type: 'HIGH_PRIORITY' })).toBe(true);
    
    // task2: 非高优先级，不应被 HIGH_PRIORITY 策略提醒
    expect(service.shouldRemind(task2, { type: 'HIGH_PRIORITY' })).toBe(false);
  });

  test('getAllPendingReminders 返回所有待提醒项', () => {
    // 创建带 taskId 的任务
    task1.taskId = 1;
    task2.taskId = 2;
    task3.taskId = 3;
    
    const reminders = service.getAllPendingReminders(
      [task1, task2, task3],
      [
        { id: 1, type: 'HIGH_PRIORITY', taskId: 1 },
        { id: 2, type: 'HIGH_PRIORITY', taskId: 2 }
      ]
    );
    
    // task1: HIGH priority + PENDING + taskId=1 → 应被提醒
    // task2: MEDIUM priority → 不应被 HIGH_PRIORITY 提醒
    // task3: HIGH priority but COMPLETED → 不应被提醒
    expect(reminders.length).toBe(1);
    expect(reminders[0].task.id).toBe(1);
  });

  test('空任务列表返回空提醒', () => {
    const reminders = service.getAllPendingReminders(
      [],
      [{ id: 1, type: 'HIGH_PRIORITY', taskId: 1 }]
    );
    
    expect(reminders.length).toBe(0);
  });

  test('空策略列表返回空提醒', () => {
    const reminders = service.getAllPendingReminders(
      [task1],
      []
    );
    
    expect(reminders.length).toBe(0);
  });
});

describe('扩展性测试 - 新增策略', () => {
  test('可以新增自定义策略', () => {
    class WeeklyReminderStrategy extends ReminderStrategy {
      shouldRemind(task, policy) {
        if (task.status.state === 'COMPLETED') return false;
        
        const now = new Date();
        const dueDate = new Date(task.dueDate);
        const daysUntilDue = Math.floor((dueDate - now) / (1000 * 60 * 60 * 24));
        
        // 周提醒：到期前7天
        return daysUntilDue <= 7 && daysUntilDue > 0;
      }
    }
    
    const factory = new ReminderStrategyFactory();
    factory.register('WEEKLY', new WeeklyReminderStrategy());
    
    expect(factory.has('WEEKLY')).toBe(true);
    expect(factory.get('WEEKLY')).toBeInstanceOf(WeeklyReminderStrategy);
  });
});
