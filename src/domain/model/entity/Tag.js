/**
 * 标签实体
 * 用于对任务进行分类标记
 */
class Tag {
  /**
   * @param {Object} props
   * @param {string} props.id - 标签唯一标识
   * @param {string} props.name - 标签名称
   * @param {string} props.color - 标签颜色（十六进制）
   * @param {string} props.userId - 所属用户ID
   * @param {Date} props.createdAt - 创建时间
   */
  constructor({ id, name, color, userId, createdAt }) {
    this.id = id;
    this.name = name;
    this.color = color || '#808080'; // 默认灰色
    this.userId = userId;
    this.createdAt = createdAt || new Date();
  }

  /**
   * 更新标签名称
   * @param {string} newName - 新名称
   * @returns {Tag}
   */
  rename(newName) {
    if (!newName || newName.trim() === '') {
      throw new Error('标签名称不能为空');
    }
    this.name = newName.trim();
    return this;
  }

  /**
   * 更新标签颜色
   * @param {string} newColor - 新颜色（十六进制）
   * @returns {Tag}
   */
  changeColor(newColor) {
    if (!newColor || !/^#[0-9A-Fa-f]{6}$/.test(newColor)) {
      throw new Error('颜色必须是有效的十六进制格式，如 #FF0000');
    }
    this.color = newColor;
    return this;
  }

  /**
   * 创建标签副本（用于克隆）
   * @returns {Tag}
   */
  clone() {
    return new Tag({
      id: `tag-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      name: `${this.name} (副本)`,
      color: this.color,
      userId: this.userId,
      createdAt: new Date(),
    });
  }
}

module.exports = Tag;
