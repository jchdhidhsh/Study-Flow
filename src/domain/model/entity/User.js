const BaseEntity = require('./BaseEntity');

class User extends BaseEntity {
  constructor({ id, username, passwordHash }) {
    super(id);
    this.username = username;
    this.passwordHash = passwordHash;
    this.createdAt = new Date();
    this.updatedAt = new Date();
  }

  updateUsername(newUsername) {
    this.username = newUsername;
    this.updatedAt = new Date();
  }

  updatePassword(newPasswordHash) {
    this.passwordHash = newPasswordHash;
    this.updatedAt = new Date();
  }
}

module.exports = User;