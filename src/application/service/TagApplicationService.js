const Tag = require('../../domain/model/entity/Tag');

/**
 * 标签应用服务
 * 处理标签的业务逻辑
 */
class TagApplicationService {
  /**
   * @param {Object} deps
   * @param {TagRepository} deps.tagRepository
   * @param {TaskRepository} deps.taskRepository
   */
  constructor({ tagRepository, taskRepository }) {
    this.tagRepository = tagRepository;
    this.taskRepository = taskRepository;
  }

  /**
   * 创建标签
   * @param {Object} command
   * @param {string} command.userId - 用户ID
   * @param {string} command.name - 标签名称
   * @param {string} [command.color] - 标签颜色
   * @returns {Promise<Tag>}
   */
  async createTag({ userId, name, color }) {
    // 参数验证
    if (!userId || userId.trim() === '') {
      throw new Error('userId 不能为空');
    }
    if (!name || name.trim() === '') {
      throw new Error('标签名称不能为空');
    }

    // 检查名称是否已存在
    const existing = await this.tagRepository.findByName(name.trim(), userId);
    if (existing) {
      throw new Error('标签名称已存在');
    }

    // 创建标签
    const tag = new Tag({
      id: null,
      name: name.trim(),
      color: color || '#808080',
      userId,
    });

    return this.tagRepository.save(tag);
  }

  /**
   * 获取用户的所有标签
   * @param {string} userId
   * @returns {Promise<Tag[]>}
   */
  async getTagsByUserId(userId) {
    if (!userId || userId.trim() === '') {
      throw new Error('userId 不能为空');
    }
    return this.tagRepository.findByUserId(userId);
  }

  /**
   * 更新标签
   * @param {string} tagId
   * @param {Object} updates
   * @param {string} [updates.name]
   * @param {string} [updates.color]
   * @returns {Promise<Tag>}
   */
  async updateTag(tagId, { name, color }) {
    const tag = await this.tagRepository.findById(tagId);
    if (!tag) {
      throw new Error('标签不存在');
    }

    if (name) {
      tag.rename(name);
    }
    if (color) {
      tag.changeColor(color);
    }

    return this.tagRepository.save(tag);
  }

  /**
   * 删除标签
   * @param {string} tagId
   * @returns {Promise<boolean>}
   */
  async deleteTag(tagId) {
    const tag = await this.tagRepository.findById(tagId);
    if (!tag) {
      throw new Error('标签不存在');
    }
    return this.tagRepository.delete(tagId);
  }

  /**
   * 为任务添加标签
   * @param {string} taskId
   * @param {string} tagId
   * @returns {Promise<Object>}
   */
  async addTagToTask(taskId, tagId) {
    // 验证任务存在
    const task = await this.taskRepository.findById(taskId);
    if (!task) {
      throw new Error('任务不存在');
    }

    // 验证标签存在
    const tag = await this.tagRepository.findById(tagId);
    if (!tag) {
      throw new Error('标签不存在');
    }

    await this.tagRepository.addTagToTask(taskId, tagId);
    return { taskId, tagId, tag };
  }

  /**
   * 从任务移除标签
   * @param {string} taskId
   * @param {string} tagId
   * @returns {Promise<boolean>}
   */
  async removeTagFromTask(taskId, tagId) {
    return this.tagRepository.removeTagFromTask(taskId, tagId);
  }

  /**
   * 获取任务的所有标签
   * @param {string} taskId
   * @returns {Promise<Tag[]>}
   */
  async getTagsForTask(taskId) {
    return this.tagRepository.findTagsByTaskId(taskId);
  }

  /**
   * 按标签筛选任务
   * @param {string} tagId - 标签ID
   * @returns {Promise<string[]>} 任务ID列表
   */
  async getTaskIdsByTag(tagId) {
    return this.tagRepository.findTaskIdsByTagId(tagId);
  }

  /**
   * 获取标签及其关联的任务数量
   * @param {string} userId
   * @returns {Promise<Array<{tag: Tag, taskCount: number}>>}
   */
  async getTagsWithTaskCount(userId) {
    const tags = await this.tagRepository.findByUserId(userId);
    const result = [];

    for (const tag of tags) {
      const taskIds = await this.tagRepository.findTaskIdsByTagId(tag.id);
      result.push({ tag, taskCount: taskIds.length });
    }

    return result;
  }
}

module.exports = TagApplicationService;
