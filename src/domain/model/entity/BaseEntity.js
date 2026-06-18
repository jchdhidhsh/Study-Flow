/**
 * 基础实体类
 * 提供实体的通用功能
 */
class BaseEntity {
  /**
   * @param {string} id - 实体唯一标识
   */
  constructor(id) {
    this.id = id;
    this.createdAt = new Date();
    this.updatedAt = new Date();
  }

  /**
   * 更新实体的时间戳
   */
  touch() {
    this.updatedAt = new Date();
  }
}

module.exports = BaseEntity;
