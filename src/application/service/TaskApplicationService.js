const TaskValidator = require('../../domain/validator/TaskValidator');
const TaskStatus = require('../../domain/model/vo/TaskStatus');

class TaskApplicationService {
  constructor({ taskRepository, taskListRepository }) {
    this.taskRepository = taskRepository;
    this.taskListRepository = taskListRepository;
  }

  async createTask(command) {
    TaskValidator.validateCreate(command);

    const { userId, title, priority, dueDate } = command;

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
    TaskValidator.validateTaskId(id, 'id');
    const task = await this.taskRepository.findById(id);
    if (!task) {
      throw new Error('任务不存在');
    }
    Object.assign(task, command);
    return this.taskRepository.save(task);
  }

  async changeStatus(id, newStatus) {
    TaskValidator.validateTaskId(id, 'id');
    const task = await this.taskRepository.findById(id);
    if (!task) {
      throw new Error('任务不存在');
    }
    task.status = newStatus;
    return this.taskRepository.save(task);
  }

  async completeTask(taskId) {
    TaskValidator.validateTaskId(taskId, 'taskId');
    const task = await this.taskRepository.findById(taskId);
    if (!task) {
      throw new Error('任务不存在');
    }
    if (task.status.state !== 'COMPLETED') {
      task.status = TaskStatus.COMPLETED;
      task.completedAt = new Date();
      return this.taskRepository.save(task);
    }
    return task;
  }

  async listTasksByPriority(userId) {
    TaskValidator.validateUserId(userId);
    const tasks = await this.taskRepository.findByUserId(userId);
    return tasks.sort((a, b) => a.priority.order - b.priority.order);
  }

  async listDueTasks(date) {
    TaskValidator.validateDate(date, 'date');
    return this.taskRepository.findByDueDateBefore(date);
  }

  async deleteTask(id) {
    TaskValidator.validateTaskId(id, 'id');
    return this.taskRepository.delete(id);
  }

  async getTask(id) {
    TaskValidator.validateTaskId(id, 'id');
    return this.taskRepository.findById(id);
  }

  async listTasksByTaskList(taskListId) {
    TaskValidator.validateTaskId(taskListId, 'taskListId');
    return this.taskRepository.findByTaskListId(taskListId);
  }
}

module.exports = TaskApplicationService;