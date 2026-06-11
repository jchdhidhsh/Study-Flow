const TaskApplicationService = require('../../../src/application/service/TaskApplicationService');

const TaskStatus = {
  PENDING: { state: 'PENDING', label: '待办' },
  IN_PROGRESS: { state: 'IN_PROGRESS', label: '进行中' },
  COMPLETED: { state: 'COMPLETED', label: '已完成' },
};

const TaskPriority = {
  LOW: { level: 'LOW', label: '低优先级', order: 3 },
  MEDIUM: { level: 'MEDIUM', label: '中优先级', order: 2 },
  HIGH: { level: 'HIGH', label: '高优先级', order: 1 },
};

function createMockTaskRepository() {
  const tasks = new Map();
  return {
    tasks,
    save: jest.fn((task) => {
      tasks.set(task.id, task);
      return task;
    }),
    findById: jest.fn((id) => tasks.get(id) || null),
    findByUserId: jest.fn((userId) =>
      Array.from(tasks.values()).filter((t) => t.userId === userId)
    ),
    findByDueDateBefore: jest.fn((date) =>
      Array.from(tasks.values()).filter((t) => t.dueDate <= date)
    ),
    delete: jest.fn((id) => tasks.delete(id)),
    clear: jest.fn(() => tasks.clear()),
  };
}

function createMockTaskListRepository() {
  const taskLists = new Map();
  return {
    taskLists,
    findById: jest.fn((id) => taskLists.get(id) || null),
    save: jest.fn((list) => {
      taskLists.set(list.id, list);
      return list;
    }),
    clear: jest.fn(() => taskLists.clear()),
  };
}

function createTaskList(id = 'list-1') {
  return { id, name: '测试清单' };
}

function createTask(overrides = {}) {
  const task = {
    id: `task-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    userId: 'user-1',
    title: '测试任务',
    status: { ...TaskStatus.PENDING },
    priority: { ...TaskPriority.MEDIUM },
    dueDate: new Date(Date.now() + 86400000),
    ...overrides,
  };
  
  // 添加 complete 方法（状态模式）
  task.complete = function() {
    if (this.status.state === 'CANCELLED') {
      throw new Error('已取消的任务不可完成');
    }
    if (this.status.state !== 'COMPLETED') {
      this.status = { ...TaskStatus.COMPLETED };
      this.completedAt = new Date();
      this.updatedAt = new Date();
    }
    return this;
  };
  
  return task;
}

describe('TaskApplicationService', () => {
  let service;
  let mockTaskRepository;
  let mockTaskListRepository;

  beforeEach(() => {
    mockTaskRepository = createMockTaskRepository();
    mockTaskListRepository = createMockTaskListRepository();
    service = new TaskApplicationService({
      taskRepository: mockTaskRepository,
      taskListRepository: mockTaskListRepository,
    });
  });

  afterEach(() => {
    mockTaskRepository.clear();
    mockTaskListRepository.clear();
  });

  describe('createTask', () => {
    const validCommand = {
      userId: 'user-1',
      title: '测试任务',
      priority: TaskPriority.MEDIUM,
      dueDate: new Date(Date.now() + 86400000),
    };

    describe('正常路径', () => {
      it('TC1.1: 成功创建任务，返回 Task 对象且状态为 PENDING', async () => {
        mockTaskListRepository.taskLists.set('list-1', createTaskList());
        const command = { ...validCommand, taskListId: 'list-1' };

        const result = await service.createTask(command);

        expect(result).toBeDefined();
        expect(result.title).toBe(command.title);
        expect(result.status.state).toBe('PENDING');
        expect(mockTaskRepository.save).toHaveBeenCalled();
      });

      it('TC1.2: 连续创建多个任务，id 唯一', async () => {
        mockTaskListRepository.taskLists.set('list-1', createTaskList());
        const command = { ...validCommand, taskListId: 'list-1' };

        const task1 = await service.createTask(command);
        const task2 = await service.createTask(command);

        expect(task1.id).not.toBe(task2.id);
      });
    });

    describe('边界条件', () => {
      it('TC1.3: title 为单字符时创建成功', async () => {
        mockTaskListRepository.taskLists.set('list-1', createTaskList());
        const command = { ...validCommand, taskListId: 'list-1', title: 'a' };

        const result = await service.createTask(command);

        expect(result.title).toBe('a');
      });

      it('TC1.4: dueDate 等于当前时间时创建成功', async () => {
        mockTaskListRepository.taskLists.set('list-1', createTaskList());
        const now = new Date();
        const command = { ...validCommand, taskListId: 'list-1', dueDate: now };

        const result = await service.createTask(command);

        expect(result.dueDate.getTime()).toBe(now.getTime());
      });

      it('TC1.5: priority 为 LOW/MEDIUM/HIGH 时均可创建成功', async () => {
        mockTaskListRepository.taskLists.set('list-1', createTaskList());

        for (const priority of [TaskPriority.LOW, TaskPriority.MEDIUM, TaskPriority.HIGH]) {
          const command = { ...validCommand, taskListId: 'list-1', priority };
          const result = await service.createTask(command);
          expect(result.priority).toBe(priority);
        }
      });
    });

    describe('异常输入', () => {
      it('TC1.6: userId 为空时抛出异常', async () => {
        mockTaskListRepository.taskLists.set('list-1', createTaskList());
        const command = { ...validCommand, taskListId: 'list-1', userId: '' };

        await expect(service.createTask(command)).rejects.toThrow();
      });

      it('TC1.7: title 为空时抛出异常', async () => {
        mockTaskListRepository.taskLists.set('list-1', createTaskList());
        const command = { ...validCommand, taskListId: 'list-1', title: '' };

        await expect(service.createTask(command)).rejects.toThrow();
      });

      it('TC1.8: priority 为非法值时抛出异常', async () => {
        mockTaskListRepository.taskLists.set('list-1', createTaskList());
        const command = { ...validCommand, taskListId: 'list-1', priority: { level: 'INVALID' } };

        await expect(service.createTask(command)).rejects.toThrow();
      });

      it('TC1.9: dueDate 早于当前时间时抛出异常', async () => {
        mockTaskListRepository.taskLists.set('list-1', createTaskList());
        const pastDate = new Date(Date.now() - 86400000);
        const command = { ...validCommand, taskListId: 'list-1', dueDate: pastDate };

        await expect(service.createTask(command)).rejects.toThrow();
      });
    });

    describe('业务不变量', () => {
      it('TC1.10: 新创建任务 status 始终为 PENDING', async () => {
        mockTaskListRepository.taskLists.set('list-1', createTaskList());
        const command = { ...validCommand, taskListId: 'list-1' };

        const result = await service.createTask(command);

        expect(result.status.state).toBe('PENDING');
      });

      it('TC1.11: 返回的 task 内容与输入参数一致', async () => {
        mockTaskListRepository.taskLists.set('list-1', createTaskList());
        const command = {
          ...validCommand,
          taskListId: 'list-1',
        };

        const result = await service.createTask(command);

        expect(result.title).toBe(command.title);
        expect(result.priority).toBe(command.priority);
        expect(result.dueDate.getTime()).toBe(new Date(command.dueDate).getTime());
      });
    });
  });

  describe('completeTask', () => {
    describe('正常路径', () => {
      it('TC2.1: 成功完成任务，状态变为 COMPLETED', async () => {
        const task = createTask({ id: 'task-1' });
        mockTaskRepository.tasks.set(task.id, task);

        const result = await service.completeTask(task.id);

        expect(result.status.state).toBe('COMPLETED');
      });
    });

    describe('边界条件', () => {
      it('TC2.2: 对已完成的任務再次执行完成操作不报错', async () => {
        const task = createTask({ id: 'task-1', status: TaskStatus.COMPLETED });
        mockTaskRepository.tasks.set(task.id, task);

        const result = await service.completeTask(task.id);

        expect(result.status.state).toBe('COMPLETED');
      });

      it('TC2.3: 空字符串 taskId 应触发异常', async () => {
        await expect(service.completeTask('')).rejects.toThrow();
      });
    });

    describe('异常输入', () => {
      it('TC2.4: taskId 为 null 时抛出异常', async () => {
        await expect(service.completeTask(null)).rejects.toThrow();
      });

      it('TC2.5: 任务不存在时抛出异常', async () => {
        await expect(service.completeTask('non-existent-id')).rejects.toThrow('任务不存在');
      });
    });

    describe('业务不变量', () => {
      it('TC2.6: 状态转换后不可逆', async () => {
        const task = createTask({ id: 'task-1' });
        mockTaskRepository.tasks.set(task.id, task);

        await service.completeTask(task.id);
        const completedTask = mockTaskRepository.tasks.get(task.id);

        expect(completedTask.status.state).toBe('COMPLETED');
      });

      it('TC2.7: 重复调用结果一致（幂等性）', async () => {
        const task = createTask({ id: 'task-1' });
        mockTaskRepository.tasks.set(task.id, task);

        const result1 = await service.completeTask(task.id);
        const result2 = await service.completeTask(task.id);

        expect(result1.status.state).toBe(result2.status.state);
      });
    });
  });

  describe('listTasksByPriority', () => {
    describe('正常路径', () => {
      it('TC3.1: 返回任务按优先级降序排列', async () => {
        const userId = 'user-1';
        const tasks = [
          createTask({ id: 'task-1', userId, priority: TaskPriority.LOW }),
          createTask({ id: 'task-2', userId, priority: TaskPriority.HIGH }),
          createTask({ id: 'task-3', userId, priority: TaskPriority.MEDIUM }),
        ];
        tasks.forEach((t) => mockTaskRepository.tasks.set(t.id, t));

        const result = await service.listTasksByPriority(userId);

        expect(result[0].priority.level).toBe('HIGH');
        expect(result[1].priority.level).toBe('MEDIUM');
        expect(result[2].priority.level).toBe('LOW');
      });

      it('TC3.2: 只返回指定用户任务', async () => {
        const tasks = [
          createTask({ id: 'task-1', userId: 'user-1' }),
          createTask({ id: 'task-2', userId: 'user-2' }),
          createTask({ id: 'task-3', userId: 'user-1' }),
        ];
        tasks.forEach((t) => mockTaskRepository.tasks.set(t.id, t));

        const result = await service.listTasksByPriority('user-1');

        expect(result).toHaveLength(2);
        result.forEach((t) => expect(t.userId).toBe('user-1'));
      });
    });

    describe('边界条件', () => {
      it('TC3.3: 用户没有任何任务时返回空数组', async () => {
        const result = await service.listTasksByPriority('user-without-tasks');

        expect(result).toEqual([]);
      });

      it('TC3.4: 所有任务优先级相同时返回数组', async () => {
        const userId = 'user-1';
        const tasks = [
          createTask({ id: 'task-1', userId, priority: TaskPriority.HIGH }),
          createTask({ id: 'task-2', userId, priority: TaskPriority.HIGH }),
        ];
        tasks.forEach((t) => mockTaskRepository.tasks.set(t.id, t));

        const result = await service.listTasksByPriority(userId);

        expect(result).toHaveLength(2);
      });
    });

    describe('异常输入', () => {
      it('TC3.5: userId 为空时抛出异常', async () => {
        await expect(service.listTasksByPriority('')).rejects.toThrow();
        await expect(service.listTasksByPriority(null)).rejects.toThrow();
      });
    });

    describe('业务不变量', () => {
      it('TC3.6: 返回结果始终按优先级降序', async () => {
        const userId = 'user-1';
        const tasks = [
          createTask({ id: 'task-1', userId, priority: TaskPriority.MEDIUM }),
          createTask({ id: 'task-2', userId, priority: TaskPriority.HIGH }),
        ];
        tasks.forEach((t) => mockTaskRepository.tasks.set(t.id, t));

        const result = await service.listTasksByPriority(userId);

        for (let i = 0; i < result.length - 1; i++) {
          expect(result[i].priority.order).toBeLessThan(result[i + 1].priority.order);
        }
      });

      it('TC3.7: 返回的任务 userId 与查询参数一致', async () => {
        const userId = 'user-specific';
        const task = createTask({ id: 'task-1', userId });
        mockTaskRepository.tasks.set(task.id, task);

        const result = await service.listTasksByPriority(userId);

        result.forEach((t) => expect(t.userId).toBe(userId));
      });
    });
  });

  describe('listDueTasks', () => {
    describe('正常路径', () => {
      it('TC4.1: 返回 dueDate <= 指定日期的任务', async () => {
        const targetDate = new Date('2024-01-15T00:00:00Z');
        const tasks = [
          createTask({ id: 'task-1', dueDate: new Date('2024-01-10') }),
          createTask({ id: 'task-2', dueDate: new Date('2024-01-15') }),
          createTask({ id: 'task-3', dueDate: new Date('2024-01-20') }),
        ];
        tasks.forEach((t) => mockTaskRepository.tasks.set(t.id, t));

        const result = await service.listDueTasks(targetDate);

        expect(result).toHaveLength(2);
        result.forEach((t) => expect(t.dueDate.getTime()).toBeLessThanOrEqual(targetDate.getTime()));
      });

      it('TC4.2: 跨状态查询只返回符合条件的任务', async () => {
        const targetDate = new Date('2024-01-15T00:00:00Z');
        const tasks = [
          createTask({ id: 'task-1', dueDate: new Date('2024-01-10'), status: TaskStatus.PENDING }),
          createTask({ id: 'task-2', dueDate: new Date('2024-01-10'), status: TaskStatus.COMPLETED }),
        ];
        tasks.forEach((t) => mockTaskRepository.tasks.set(t.id, t));

        const result = await service.listDueTasks(targetDate);

        expect(result).toHaveLength(2);
      });
    });

    describe('边界条件', () => {
      it('TC4.3: 无到期任务时返回空数组', async () => {
        const futureDate = new Date('2024-02-01');
        const tasks = [
          createTask({ id: 'task-1', dueDate: new Date('2024-02-15') }),
        ];
        tasks.forEach((t) => mockTaskRepository.tasks.set(t.id, t));

        const result = await service.listDueTasks(futureDate);

        expect(result).toEqual([]);
      });

      it('TC4.4: dueDate 等于查询日期时返回该任务', async () => {
        const targetDate = new Date('2024-01-15T00:00:00Z');
        const task = createTask({ id: 'task-1', dueDate: new Date('2024-01-15T00:00:00Z') });
        mockTaskRepository.tasks.set(task.id, task);

        const result = await service.listDueTasks(targetDate);

        expect(result).toHaveLength(1);
        expect(result[0].id).toBe(task.id);
      });

      it('TC4.5: dueDate 晚于查询日期时不返回', async () => {
        const targetDate = new Date('2024-01-15');
        const task = createTask({ id: 'task-1', dueDate: new Date('2024-01-20') });
        mockTaskRepository.tasks.set(task.id, task);

        const result = await service.listDueTasks(targetDate);

        expect(result).toHaveLength(0);
      });
    });

    describe('异常输入', () => {
      it('TC4.6: date 为 null 时抛出异常', async () => {
        await expect(service.listDueTasks(null)).rejects.toThrow();
      });

      it('TC4.7: date 未传入时抛出异常', async () => {
        await expect(service.listDueTasks()).rejects.toThrow();
      });
    });

    describe('业务不变量', () => {
      it('TC4.8: 返回的任务 dueDate 始终 <= 输入 date', async () => {
        const targetDate = new Date('2024-01-15');
        const tasks = [
          createTask({ id: 'task-1', dueDate: new Date('2024-01-10') }),
          createTask({ id: 'task-2', dueDate: new Date('2024-01-15') }),
        ];
        tasks.forEach((t) => mockTaskRepository.tasks.set(t.id, t));

        const result = await service.listDueTasks(targetDate);

        result.forEach((t) => {
          expect(t.dueDate.getTime()).toBeLessThanOrEqual(targetDate.getTime());
        });
      });
    });
  });
});