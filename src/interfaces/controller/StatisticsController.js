class StatisticsController {
  constructor({ statisticsApplicationService }) {
    this.statisticsApplicationService = statisticsApplicationService;
  }

  async getStatistics(req, res) {
    try {
      const { userId } = req.params;
      const stats = await this.statisticsApplicationService.generateStatistics(Number(userId));
      res.json({ code: 0, data: stats });
    } catch (error) {
      res.status(400).json({ code: 1, message: error.message });
    }
  }
}

module.exports = StatisticsController;