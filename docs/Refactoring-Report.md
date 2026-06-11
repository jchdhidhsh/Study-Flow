# 重构说明文档

## 实验三：重构、复用与设计模式应用

**日期**：2026-06-07  
**重构主题**：ReminderPolicy 提醒策略重构  
**设计模式**：策略模式 (Strategy Pattern)

---

## 1. 识别异味总结

### 代码异味清单

| 异味类型 | 具体位置 | 问题描述 |
|---------|---------|---------|
| **职责混乱** | TaskApplicationService | CRUD 与业务逻辑混杂，难以维护 |
| **策略缺失** | ReminderPolicy | 仅是数据载体，无策略实现 |
| **硬编码逻辑** | 提醒规则 | if-else 散落各处，违反 OCP |
| **贫血模型** | Task 实体 | 业务逻辑泄漏到服务层 |
| **验证重复** | 多个服务方法 | 参数验证代码重复 |
| **异常处理不一致** | 服务层 | 缺少统一的异常类型 |

### 可扩展性问题

- 新增提醒类型需修改原有代码
- 难以添加新的提醒规则组合

### 可测试性问题

- 验证逻辑内联，无法独立测试
- 隐式依赖 Date.now()，难以模拟时间

### 违反的设计原则

| 原则 | 违反位置 |
|------|---------|
| 单一职责原则 (SRP) | 服务层承担过多职责 |
| 开闭原则 (OCP) | 新增策略需修改原代码 |
| 依赖反转原则 (DIP) | 直接依赖具体实现 |

---

## 2. 原代码问题

| 问题类型 | 具体表现 |
|---------|---------|
| 策略缺失 | ReminderPolicy 仅是数据载体，无策略实现 |
| 硬编码逻辑 | 提醒规则以 if-else 散落各处，扩展困难 |
| 违反 OCP | 新增提醒类型需修改原有代码 |

---

## 2. 设计方案比较说明

### 方案 A：简单 if-else 扩展

```javascript
shouldRemind(task, policy) {
  if (policy.type === 'DUE_DATE') {
    // 到期前1天提醒逻辑
  }
  if (policy.type === 'HIGH_PRIORITY') {
    // 高优先级提醒逻辑
  }
  // 每新增一个类型都要修改这里
}
```

**优点**：快速实现，改动小  
**缺点**：违反 OCP，难以独立测试

### 方案 B：策略模式

```javascript
// 策略接口
class ReminderStrategy {
  shouldRemind(task, policy) { throw new Error('Not implemented'); }
}

// 具体策略
class DueDateReminderStrategy extends ReminderStrategy {
  shouldRemind(task, policy) { /* ... */ }
}

// 工厂 + 服务
class ReminderStrategyFactory {
  register(type, strategy) { this.strategies.set(type, strategy); }
}
```

**优点**：符合 OCP，可独立测试，易扩展  
**缺点**：需要更多代码文件

### 方案对比

| 维度 | 方案 A | 方案 B |
|------|--------|--------|
| 扩展新策略 | 修改原函数 | 新增策略类 |
| 违反 OCP | ❌ | ✅ |
| 独立测试 | ❌ 困难 | ✅ 容易 |

### 最终选择：方案 B（策略模式）

理由：
1. 扩展新策略无需修改现有代码
2. 每个策略可独立测试
3. 符合开闭原则
4. 满足实验要求

---

## 3. 重构后结构

```
src/
├── domain/service/                              # 新增：领域服务层
│   ├── ReminderStrategy.js                      # 策略基类
│   ├── DueDateReminderStrategy.js               # 到期前1天提醒
│   ├── HighPriorityReminderStrategy.js          # 高优先级即时提醒
│   ├── DailySummaryReminderStrategy.js          # 当日汇总提醒
│   └── ReminderStrategyFactory.js               # 策略工厂
└── application/service/
    └── ReminderService.js                       # 使用策略模式
```

### 新增文件

| 文件 | 说明 |
|------|------|
| ReminderStrategy.js | 策略接口 |
| DueDateReminderStrategy.js | 到期前1天提醒策略 |
| HighPriorityReminderStrategy.js | 高优先级即时提醒策略 |
| DailySummaryReminderStrategy.js | 当日汇总提醒策略 |
| ReminderStrategyFactory.js | 策略工厂 |
| ReminderService.js | 提醒服务 |
| ReminderStrategy.test.js | 21 个测试用例 |

---

## 4. 设计模式应用

### 策略模式
- `ReminderStrategy`：策略接口
- `DueDateReminderStrategy`、`HighPriorityReminderStrategy`、`DailySummaryReminderStrategy`：具体策略

### 工厂模式
- `ReminderStrategyFactory`：管理策略的注册和获取

### 符合原则
- ✅ 单一职责原则 (SRP)
- ✅ 开闭原则 (OCP)
- ✅ 依赖倒置原则 (DIP)

---

## 5. 测试结果

```
Test Suites: 3 passed, 3 total
Tests:       69 passed, 69 total
```

| 测试套件 | 测试数 |
|---------|--------|
| Task.test.js | 31 |
| TaskApplicationService.test.js | 17 |
| ReminderStrategy.test.js | 21 |

---

## 6. 重构收益

| 维度 | 重构前 | 重构后 |
|------|--------|--------|
| 扩展方式 | 修改原函数 | 新增策略类 |
| OCP 遵守 | ❌ | ✅ |
| 测试方式 | 难以独立测试 | 可独立测试 |

---

**文档时间**：2026-06-07
