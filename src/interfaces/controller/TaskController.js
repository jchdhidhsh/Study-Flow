class TaskController {
  constructor({ taskApplicationService }) {
    this.taskApplicationService = taskApplicationService;
  }

  async createTask(req, res) {
    try {
      const task = await this.taskApplicationService.createTask(req.body);
      res.status(201).json({ code: 0, data: task });
    } catch (error) {
      res.status(400).json({ code: 1, message: error.message });
    }
  }

  async updateTask(req, res) {
    try {
      const { id } = req.params;
      const task = await this.taskApplicationService.updateTask(Number(id), req.body);
      res.json({ code: 0, data: task });
    } catch (error) {
      res.status(400).json({ code: 1, message: error.message });
    }
  }

  async changeStatus(req, res) {
    try {
      const { id } = req.params;
      const { newStatus } = req.body;
      const task = await this.taskApplicationService.changeStatus(Number(id), newStatus);
      res.json({ code: 0, data: task });
    } catch (error) {
      res.status(400).json({ code: 1, message: error.message });
    }
  }

  async deleteTask(req, res) {
    try {
      const { id } = req.params;
      await this.taskApplicationService.deleteTask(Number(id));
      res.json({ code: 0, message: '删除成功' });
    } catch (error) {
      res.status(400).json({ code: 1, message: error.message });
    }
  }

  async getTask(req, res) {
    try {
      const { id } = req.params;
      const task = await this.taskApplicationService.getTask(Number(id));
      if (!task) {
        return res.status(404).json({ code: 1, message: '任务不存在' });
      }
      res.json({ code: 0, data: task });
    } catch (error) {
      res.status(400).json({ code: 1, message: error.message });
    }
  }

  async listTasksByTaskList(req, res) {
    try {
      const { taskListId } = req.params;
      const tasks = await this.taskApplicationService.listTasksByTaskList(Number(taskListId));
      res.json({ code: 0, data: tasks });
    } catch (error) {
      res.status(400).json({ code: 1, message: error.message });
    }
  }
}

module.exports = TaskController;