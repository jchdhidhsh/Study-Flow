class TaskApplicationService {
  constructor({ taskRepository, taskListRepository }) {
    this.taskRepository = taskRepository;
    this.taskListRepository = taskListRepository;
  }

  async createTask(command) {
    const { name, description, taskListId, dueDate, priority } = command;
    const taskList = await this.taskListRepository.findById(taskListId);
    if (!taskList) {
      throw new Error('指定的清单不存在');
    }
    const task = {
      id: Date.now(),
      name,
      description,
      taskListId,
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