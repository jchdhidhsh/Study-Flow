const BaseEntity = require('./BaseEntity');

class TaskList extends BaseEntity {
  constructor({ id, name, userId, description }) {
    super(id);
    this.name = name;
    this.userId = userId;
    this.description = description || '';
    this.createdAt = new Date();
    this.updatedAt = new Date();
  }

  rename(newName) {
    this.name = newName;
    this.updatedAt = new Date();
  }

  updateDescription(description) {
    this.description = description;
    this.updatedAt = new Date();
  }
}

module.exports = TaskList;