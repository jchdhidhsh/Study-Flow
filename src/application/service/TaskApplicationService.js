const TaskStatus = require('../../domain/model/vo/TaskStatus');

class TaskApplicationService {
  constructor({ taskRepository, taskListRepository }) {
    this.taskRepository = taskRepository;
    this.taskListRepository = taskListRepository;
  }

  async createTask(command) {
    const { userId, title, priority, dueDate, taskListId } = command;

    if (!userId || userId.trim() === '') {
      throw new Error('userId 不能为空');
    }
    if (!title || title.trim() === '') {
      throw new Error('title 不能为空');
    }
    if (!priority || !['HIGH', 'MEDIUM', 'LOW'].includes(priority.level)) {
      throw new Error('priority 必须为合法枚举值');
    }
    const now = new Date();
    if (dueDate < now) {
      throw new Error('dueDate 不能早于当前时间');
    }

    const task = {
      id: `task-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      userId,
      title,
      status: TaskStatus.PENDING,
      priority,
      dueDate: new Date(dueDate),
    };
    return this.taskRepository.save(task);
  }

  async updateTask(id, command) {
    const task = await this.taskRepository.findById(id);
    if (!task) {
      throw new Error('任务不存在');
    }
    Object.assign(task, command);
    return this.taskRepository.save(task);
  }

  async changeStatus(id, newStatus) {
    const task = await this.taskRepository.findById(id);
    if (!task) {
      throw new Error('任务不存在');
    }
    task.status = newStatus;
    return this.taskRepository.save(task);
  }

  async completeTask(taskId) {
    if (!taskId || taskId.trim() === '') {
      throw new Error('taskId 不能为空');
    }
    const task = await this.taskRepository.findById(taskId);
    if (!task) {
      throw new Error('任务不存在');
    }
    task.complete();  // 使用实体的状态模式方法
    return this.taskRepository.save(task);
  }

  async listTasksByPriority(userId) {
    if (!userId || userId.trim() === '') {
      throw new Error('userId 不能为空');
    }
    const tasks = await this.taskRepository.findByUserId(userId);
    return tasks.sort((a, b) => a.priority.order - b.priority.order);
  }

  async listDueTasks(date) {
    if (date === null || date === undefined) {
      throw new Error('date 不能为空');
    }
    return this.taskRepository.findByDueDateBefore(date);
  }

  async deleteTask(id) {
    return this.taskRepository.delete(id);
  }

  async getTask(id) {
    return this.taskRepository.findById(id);
  }

  async listTasksByTaskList(taskListId) {
    return this.taskRepository.findByTaskListId(taskListId);
  }
}

module.exports = TaskApplicationService;