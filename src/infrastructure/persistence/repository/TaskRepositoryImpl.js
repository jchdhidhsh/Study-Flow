class TaskRepositoryImpl {
  constructor() {
    this.data = new Map();
  }

  async findById(id) {
    return this.data.get(id) || null;
  }

  async findByTaskListId(taskListId) {
    const results = [];
    for (const task of this.data.values()) {
      if (task.taskListId === taskListId) results.push(task);
    }
    return results;
  }

  async findByUserId(userId) {
    return [];
  }

  async save(task) {
    this.data.set(task.id, task);
    return task;
  }

  async delete(id) {
    this.data.delete(id);
  }
}

module.exports = TaskRepositoryImpl;