class TaskListApplicationService {
  constructor({ taskListRepository }) {
    this.taskListRepository = taskListRepository;
  }

  async createTaskList(command) {
    const { name, userId, description } = command;
    const taskList = {
      id: Date.now(),
      name,
      userId,
      description,
    };
    return this.taskListRepository.save(taskList);
  }

  async updateTaskList(id, command) {
    const taskList = await this.taskListRepository.findById(id);
    if (!taskList) {
      throw new Error('清单不存在');
    }
    Object.assign(taskList, command);
    return this.taskListRepository.save(taskList);
  }

  async deleteTaskList(id) {
    return this.taskListRepository.delete(id);
  }

  async getTaskList(id) {
    return this.taskListRepository.findById(id);
  }

  async listTaskListsByUser(userId) {
    return this.taskListRepository.findByUserId(userId);
  }
}

module.exports = TaskListApplicationService;