class TaskListRepositoryImpl {
  constructor() {
    this.data = new Map();
  }

  async findById(id) {
    return this.data.get(id) || null;
  }

  async findByUserId(userId) {
    const results = [];
    for (const taskList of this.data.values()) {
      if (taskList.userId === userId) results.push(taskList);
    }
    return results;
  }

  async save(taskList) {
    this.data.set(taskList.id, taskList);
    return taskList;
  }

  async delete(id) {
    this.data.delete(id);
  }
}

module.exports = TaskListRepositoryImpl;