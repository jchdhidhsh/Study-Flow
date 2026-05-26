class UserRepositoryImpl {
  constructor() {
    this.data = new Map();
  }

  async findById(id) {
    return this.data.get(id) || null;
  }

  async findByUsername(username) {
    for (const user of this.data.values()) {
      if (user.username === username) return user;
    }
    return null;
  }

  async save(user) {
    this.data.set(user.id, user);
    return user;
  }

  async delete(id) {
    this.data.delete(id);
  }
}

module.exports = UserRepositoryImpl;