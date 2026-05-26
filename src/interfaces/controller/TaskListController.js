class TaskListController {
  constructor({ taskListApplicationService }) {
    this.taskListApplicationService = taskListApplicationService;
  }

  async createTaskList(req, res) {
    try {
      const taskList = await this.taskListApplicationService.createTaskList(req.body);
      res.status(201).json({ code: 0, data: taskList });
    } catch (error) {
      res.status(400).json({ code: 1, message: error.message });
    }
  }

  async updateTaskList(req, res) {
    try {
      const { id } = req.params;
      const taskList = await this.taskListApplicationService.updateTaskList(Number(id), req.body);
      res.json({ code: 0, data: taskList });
    } catch (error) {
      res.status(400).json({ code: 1, message: error.message });
    }
  }

  async deleteTaskList(req, res) {
    try {
      const { id } = req.params;
      await this.taskListApplicationService.deleteTaskList(Number(id));
      res.json({ code: 0, message: '删除成功' });
    } catch (error) {
      res.status(400).json({ code: 1, message: error.message });
    }
  }

  async getTaskList(req, res) {
    try {
      const { id } = req.params;
      const taskList = await this.taskListApplicationService.getTaskList(Number(id));
      if (!taskList) {
        return res.status(404).json({ code: 1, message: '清单不存在' });
      }
      res.json({ code: 0, data: taskList });
    } catch (error) {
      res.status(400).json({ code: 1, message: error.message });
    }
  }

  async listTaskListsByUser(req, res) {
    try {
      const { userId } = req.params;
      const taskLists = await this.taskListApplicationService.listTaskListsByUser(Number(userId));
      res.json({ code: 0, data: taskLists });
    } catch (error) {
      res.status(400).json({ code: 1, message: error.message });
    }
  }
}

module.exports = TaskListController;