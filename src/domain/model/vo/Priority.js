const Priority = {
  HIGH: { level: 'HIGH', label: '高优先级', order: 1 },
  MEDIUM: { level: 'MEDIUM', label: '中优先级', order: 2 },
  LOW: { level: 'LOW', label: '低优先级', order: 3 },
};

Object.freeze(Priority);

module.exports = Priority;