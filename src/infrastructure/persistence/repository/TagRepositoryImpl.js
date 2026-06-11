const TagRepository = require('../../../domain/repository/TagRepository');
const Tag = require('../../../domain/model/entity/Tag');
const TaskTag = require('../../../domain/model/entity/TaskTag');

/**
 * 标签仓储实现（内存存储）
 */
class TagRepositoryImpl extends TagRepository {
  constructor() {
    super();
    this.tags = new Map();
    this.taskTags = new Map(); // key: taskId, value: Set<tagId>
  }

  /**
   * 生成标签ID
   * @returns {string}
   */
  generateId() {
    return `tag-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }

  async save(tag) {
    if (!tag.id) {
      tag.id = this.generateId();
    }
    this.tags.set(tag.id, tag);
    return tag;
  }

  async findById(id) {
    return this.tags.get(id) || null;
  }

  async findByUserId(userId) {
    return Array.from(this.tags.values()).filter(t => t.userId === userId);
  }

  async findByName(name, userId) {
    return Array.from(this.tags.values()).find(
      t => t.name === name && t.userId === userId
    ) || null;
  }

  async delete(id) {
    // 删除标签本身
    const deleted = this.tags.delete(id);
    // 清理任务关联
    for (const [taskId, tagIds] of this.taskTags.entries()) {
      tagIds.delete(id);
      if (tagIds.size === 0) {
        this.taskTags.delete(taskId);
      }
    }
    return deleted;
  }

  async addTagToTask(taskId, tagId) {
    if (!this.taskTags.has(taskId)) {
      this.taskTags.set(taskId, new Set());
    }
    this.taskTags.get(taskId).add(tagId);
    return TaskTag.create(taskId, tagId);
  }

  async removeTagFromTask(taskId, tagId) {
    const tagIds = this.taskTags.get(taskId);
    if (tagIds) {
      return tagIds.delete(tagId);
    }
    return false;
  }

  async findTagsByTaskId(taskId) {
    const tagIds = this.taskTags.get(taskId);
    if (!tagIds) {
      return [];
    }
    return Array.from(tagIds)
      .map(tagId => this.tags.get(tagId))
      .filter(Boolean);
  }

  async findTaskIdsByTagId(tagId) {
    const result = [];
    for (const [taskId, tagIds] of this.taskTags.entries()) {
      if (tagIds.has(tagId)) {
        result.push(taskId);
      }
    }
    return result;
  }

  /**
   * 清空所有数据（仅用于测试）
   */
  clear() {
    this.tags.clear();
    this.taskTags.clear();
  }
}

module.exports = TagRepositoryImpl;
