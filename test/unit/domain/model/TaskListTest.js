const TaskList = require('../../../src/domain/model/entity/TaskList');

describe('TaskList 领域实体测试', () => {
  test('创建清单时属性正确', () => {
    const taskList = new TaskList({
      id: 1,
      name: '英语学习',
      userId: 100,
      description: '英语相关任务',
    });
    expect(taskList.name).toBe('英语学习');
    expect(taskList.userId).toBe(100);
    expect(taskList.description).toBe('英语相关任务');
  });

  test('重命名清单', () => {
    const taskList = new TaskList({ id: 1, name: '旧名称', userId: 100 });
    taskList.rename('新名称');
    expect(taskList.name).toBe('新名称');
  });

  test('更新描述', () => {
    const taskList = new TaskList({ id: 1, name: '清单', userId: 100 });
    taskList.updateDescription('新的描述信息');
    expect(taskList.description).toBe('新的描述信息');
  });

  test('实体 ID 不能为空', () => {
    expect(() => new TaskList({ id: undefined, name: 'test', userId: 1 })).toThrow('实体 ID 不能为空');
  });
});