const Task = require('../../../../src/domain/model/entity/Task');
const TaskStatus = require('../../../../src/domain/model/vo/TaskStatus');
const Priority = require('../../../../src/domain/model/vo/Priority');

describe('Task 领域实体测试', () => {
  let task;

  beforeEach(() => {
    task = new Task({
      id: 1,
      name: '完成数学作业',
      description: '第二章练习题',
      taskListId: 10,
      dueDate: new Date(Date.now() + 86400000),
    });
  });

  test('创建任务时状态默认为待办', () => {
    expect(task.status).toBe(TaskStatus.PENDING);
    expect(task.priority).toBe(Priority.MEDIUM);
  });

  test('任务名称应被正确设置', () => {
    expect(task.name).toBe('完成数学作业');
  });

  test('状态从待办流转到进行中', () => {
    task.changeStatus(TaskStatus.IN_PROGRESS);
    expect(task.status).toBe(TaskStatus.IN_PROGRESS);
    expect(task.completedAt).toBeNull();
  });

  test('状态从进行中流转到已完成', () => {
    task.changeStatus(TaskStatus.IN_PROGRESS);
    task.changeStatus(TaskStatus.COMPLETED);
    expect(task.status).toBe(TaskStatus.COMPLETED);
    expect(task.completedAt).not.toBeNull();
  });

  test('已完成的任务不可变更状态', () => {
    task.changeStatus(TaskStatus.COMPLETED);
    expect(() => task.changeStatus(TaskStatus.IN_PROGRESS)).toThrow('已完成后或已取消的任务不可变更状态');
  });

  test('已取消的任务不可变更状态', () => {
    task.changeStatus(TaskStatus.CANCELLED);
    expect(() => task.changeStatus(TaskStatus.PENDING)).toThrow('已完成后或已取消的任务不可变更状态');
  });

  test('待办状态可以直接取消', () => {
    task.changeStatus(TaskStatus.CANCELLED);
    expect(task.status).toBe(TaskStatus.CANCELLED);
  });

  test('设置优先级', () => {
    task.setPriority(Priority.HIGH);
    expect(task.priority).toBe(Priority.HIGH);
  });

  test('逾期判断', () => {
    const overdueTask = new Task({
      id: 2,
      name: '已逾期任务',
      taskListId: 10,
      dueDate: new Date(Date.now() - 1000),
    });
    expect(overdueTask.isOverdue()).toBe(true);
    expect(task.isOverdue()).toBe(false);
  });

  test('分配提醒策略', () => {
    task.assignReminderPolicy(100);
    expect(task.reminderPolicyId).toBe(100);
  });

  test('实体 ID 不能为空', () => {
    expect(() => new Task({ id: undefined, name: 'test', taskListId: 1, dueDate: new Date() })).toThrow('实体 ID 不能为空');
  });

  describe('complete() 状态模式方法', () => {
    test('完成任务后状态变为已完成', () => {
      task.complete();
      expect(task.status).toBe(TaskStatus.COMPLETED);
      expect(task.completedAt).not.toBeNull();
    });

    test('已完成的任务再次调用 complete() 不报错（幂等性）', () => {
      task.complete();
      const firstCompleteAt = task.completedAt;
      const result = task.complete();
      expect(result.status).toBe(TaskStatus.COMPLETED);
      expect(task.completedAt).toBe(firstCompleteAt);
    });

    test('进行中的任务可以完成', () => {
      task.changeStatus(TaskStatus.IN_PROGRESS);
      task.complete();
      expect(task.status).toBe(TaskStatus.COMPLETED);
    });

    test('已取消的任务调用 complete() 抛出异常', () => {
      task.changeStatus(TaskStatus.CANCELLED);
      expect(() => task.complete()).toThrow('已取消的任务不可完成');
    });
  });
});