# 失败测试与修复记录

## TDD 迭代过程记录

---

## 迭代 1：createTask

### 首次运行结果
```
11 tests | 6 passed, 5 failed
```

### 失败测试

| 编号 | 测试用例 | 失败原因 | 修复方案 |
|------|----------|----------|----------|
| TC1.1 | 成功创建任务，返回 Task 对象且状态为 PENDING | 测试期望 `result.name`，实际返回 `result.title` | 修正测试断言 |
| TC1.3 | title 为单字符时创建成功 | 同上字段名差异 | 修正测试断言 |
| TC1.8 | priority 为非法值时抛出异常 | 实现验证逻辑不完整：`!priority.level` 无法拦截 `{level: 'INVALID'}` | 加强验证：`['HIGH', 'MEDIUM', 'LOW'].includes(priority.level)` |
| TC1.10 | 新创建任务 status 始终为 PENDING | 对象引用比较失败：`expect(result.status).toBe(TaskStatus.PENDING)` | 改用值比较：`expect(result.status.state).toBe('PENDING')` |
| TC1.11 | 返回的 task 内容与输入参数一致 | 字段名差异：期望 `name` 实际 `title` | 修正测试断言 |

### 修复内容

**实现修正 (`TaskApplicationService.js`)：**
```diff
- if (!priority || !priority.level) {
+ if (!priority || !['HIGH', 'MEDIUM', 'LOW'].includes(priority.level)) {
```

**测试修正 (`TaskApplicationService.test.js`)：**
```diff
- expect(result.name).toBe(command.title);
+ expect(result.title).toBe(command.title);

- expect(result.status).toBe(TaskStatus.PENDING);
+ expect(result.status.state).toBe('PENDING');
```

### 最终结果
```
11/11 passed ✓
```

---

## 迭代 2：completeTask

### 首次运行结果
```
7 tests | 7 passed ✓
```

无需修复。

---

## 迭代 3：listTasksByPriority

### 首次运行结果
```
7 tests | 7 passed ✓
```

无需修复。

---

## 迭代 4：listDueTasks

### 首次运行结果
```
8 tests | 8 passed ✓
```

无需修复。

---

## 完整测试套件

### 最终结果
```
33 tests | 33 passed ✓
```

### 测试分布

| 方法 | 测试数 | 首次通过 | 最终通过 |
|------|--------|----------|----------|
| createTask | 11 | 6 | 11 |
| completeTask | 7 | 7 | 7 |
| listTasksByPriority | 7 | 7 | 7 |
| listDueTasks | 8 | 8 | 8 |
| **合计** | **33** | **28** | **33** |

---

## 问题分类统计

| 问题类型 | 数量 | 占比 |
|----------|------|------|
| 测试断言与契约不一致 | 4 | 80% |
| 实现验证逻辑缺陷 | 1 | 20% |

### 问题根因分析

1. **字段名不一致**：契约定义使用 `title`，但测试初稿错误使用 `name`
   - **教训**：契约文档应作为测试断言的唯一数据来源

2. **对象引用比较**：JavaScript 中对象引用比较需使用属性值
   - **教训**：对于值对象（Value Object），应比较其 `.state` 属性而非对象引用

3. **非法值验证不足**：简单存在性检查无法拦截非法枚举值
   - **教训**：枚举验证必须使用白名单方式

---

## 修复决策记录

| 决策点 | 选项 A | 选项 B（选择） | 理由 |
|--------|--------|----------------|------|
| 字段名差异 | 修改实现以匹配错误测试 | 修正测试以匹配契约 | 契约是需求来源，测试应反映契约 |
| 对象比较方式 | 修改实现返回相同引用 | 修正测试使用值比较 | 值对象语义上应比较值 |

---

## 时间线

| 阶段 | 操作 | 测试结果 |
|------|------|----------|
| 初始实现 | 创建测试文件 | 1/33 passed |
| createTask 修复 | 调整实现 + 测试 | 11/33 passed |
| completeTask 实现 | 添加方法实现 | 18/33 passed |
| listTasksByPriority 实现 | 添加方法实现 | 25/33 passed |
| listDueTasks 实现 | 添加方法实现 | 33/33 passed |

---

## 经验教训

### 1. 测试驱动开发原则
- 测试应反映契约/需求，而非实现细节
- 发现测试与契约不一致时，优先修正测试

### 2. 验证逻辑
- 枚举类型验证必须使用白名单
- 空值检查需区分 `null`、`undefined`、`空字符串`

### 3. 对象比较
- 状态对象（TaskStatus）使用属性值比较
- 避免依赖对象引用相等性