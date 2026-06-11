/**
 * 标签仓储接口
 */
class TagRepository {
  /**
   * 保存标签
   * @param {Tag} tag
   * @returns {Promise<Tag>}
   */
  async save(tag) {
    throw new Error('Not implemented');
  }

  /**
   * 根据ID查找标签
   * @param {string} id
   * @returns {Promise<Tag|null>}
   */
  async findById(id) {
    throw new Error('Not implemented');
  }

  /**
   * 根据用户ID查找所有标签
   * @param {string} userId
   * @returns {Promise<Tag[]>}
   */
  async findByUserId(userId) {
    throw new Error('Not implemented');
  }

  /**
   * 根据标签名称查找
   * @param {string} name
   * @param {string} userId
   * @returns {Promise<Tag|null>}
   */
  async findByName(name, userId) {
    throw new Error('Not implemented');
  }

  /**
   * 删除标签
   * @param {string} id
   * @returns {Promise<boolean>}
   */
  async delete(id) {
    throw new Error('Not implemented');
  }

  /**
   * 为任务添加标签
   * @param {string} taskId
   * @param {string} tagId
   * @returns {Promise<TaskTag>}
   */
  async addTagToTask(taskId, tagId) {
    throw new Error('Not implemented');
  }

  /**
   * 从任务移除标签
   * @param {string} taskId
   * @param {string} tagId
   * @returns {Promise<boolean>}
   */
  async removeTagFromTask(taskId, tagId) {
    throw new Error('Not implemented');
  }

  /**
   * 获取任务的所有标签
   * @param {string} taskId
   * @returns {Promise<Tag[]>}
   */
  async findTagsByTaskId(taskId) {
    throw new Error('Not implemented');
  }

  /**
   * 获取标签关联的所有任务ID
   * @param {string} tagId
   * @returns {Promise<string[]>}
   */
  async findTaskIdsByTagId(tagId) {
    throw new Error('Not implemented');
  }
}

module.exports = TagRepository;
