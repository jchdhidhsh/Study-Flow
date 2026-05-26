class StatisticsApplicationService {
  constructor({ taskRepository, taskListRepository }) {
    this.taskRepository = taskRepository;
    this.taskListRepository = taskListRepository;
  }

  async generateStatistics(userId) {
    const taskLists = await this.taskListRepository.findByUserId(userId);
    const taskListIds = taskLists.map(t => t.id);
    const allTasks = [];
    for (const taskListId of taskListIds) {
      const tasks = await this.taskRepository.findByTaskListId(taskListId);
      allTasks.push(...tasks);
    }
    const totalTasks = allTasks.length;
    const completedTasks = allTasks.filter(t => t.status?.state === 'COMPLETED').length;
    const inProgressTasks = allTasks.filter(t => t.status?.state === 'IN_PROGRESS').length;
    const pendingTasks = allTasks.filter(t => t.status?.state === 'PENDING').length;
    const completionRate = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;
    return {
      totalTasks,
      completedTasks,
      inProgressTasks,
      pendingTasks,
      completionRate,
    };
  }
}

module.exports = StatisticsApplicationService;