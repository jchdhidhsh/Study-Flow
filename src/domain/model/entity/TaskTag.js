/**
 * 任务-标签关联实体
 * 表示任务与标签的多对多关系
 */
class TaskTag {
  /**
   * @param {Object} props
   * @param {string} props.taskId - 任务ID
   * @param {string} props.tagId - 标签ID
   * @param {Date} props.createdAt - 关联创建时间
   */
  constructor({ taskId, tagId, createdAt }) {
    if (!taskId) {
      throw new Error('taskId 不能为空');
    }
    if (!tagId) {
      throw new Error('tagId 不能为空');
    }
    this.taskId = taskId;
    this.tagId = tagId;
    this.createdAt = createdAt || new Date();
  }

  /**
   * 创建 TaskTag 实例
   * @param {string} taskId - 任务ID
   * @param {string} tagId - 标签ID
   * @returns {TaskTag}
   */
  static create(taskId, tagId) {
    return new TaskTag({ taskId, tagId });
  }
}

module.exports = TaskTag;
