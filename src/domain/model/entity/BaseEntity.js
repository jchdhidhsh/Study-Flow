class BaseEntity {
  constructor(id) {
    if (id === undefined || id === null) {
      throw new Error('实体 ID 不能为空');
    }
    this.id = id;
  }

  equals(other) {
    if (!(other instanceof BaseEntity)) return false;
    return this.id === other.id;
  }
}

module.exports = BaseEntity;