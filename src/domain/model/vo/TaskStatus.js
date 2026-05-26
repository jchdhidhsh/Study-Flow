const TaskStatus = {
  PENDING: { state: 'PENDING', label: '待办' },
  IN_PROGRESS: { state: 'IN_PROGRESS', label: '进行中' },
  COMPLETED: { state: 'COMPLETED', label: '已完成' },
  CANCELLED: { state: 'CANCELLED', label: '已取消' },
};

Object.freeze(TaskStatus);

module.exports = TaskStatus;