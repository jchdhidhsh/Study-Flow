# TaskService 接口契约文档

## 1. 类型定义

### 1.1 任务状态枚举

```typescript
enum TaskStatus {
  PENDING = { state: 'PENDING', label: '待办' },
  IN_PROGRESS = { state: 'IN_PROGRESS', label: '进行中' },
  COMPLETED = { state: 'COMPLETED', label: '已完成' }
}
```

### 1.2 任务优先级枚举

```typescript
enum TaskPriority {
  LOW = { level: 'LOW', label: '低优先级', order: 3 },
  MEDIUM = { level: 'MEDIUM', label: '中优先级', order: 2 },
  HIGH = { level: 'HIGH', label: '高优先级', order: 1 }
}
// order 值越小优先级越高
```

### 1.3 任务实体

```typescript
interface Task {
  id: string;              // 唯一标识符，格式: task-{timestamp}-{random}
  userId: string;          // 用户 ID
  title: string;            // 任务标题
  status: TaskStatus;       // 任务状态
  priority: TaskPriority;   // 任务优先级
  dueDate: Date;            // 截止日期
  completedAt?: Date;        // 完成时间（可选）
}
```

### 1.4 创建任务命令

```typescript
interface CreateTaskCommand {
  userId: string;
  title: string;
  priority: TaskPriority;
  dueDate: Date;
}
```

---

## 2. 方法契约

### 2.1 createTask

**签名：** `createTask(input: CreateTaskCommand): Promise<Task>`

| 分类 | 条件 |
|------|------|
| **前置条件** | userId 不为空且非空白字符；title 不为空且非空白字符；priority 为 HIGH/MEDIUM/LOW 之一；dueDate >= 当前时间 |
| **后置条件** | 返回新创建的 Task 对象；id 唯一；status = PENDING |
| **异常条件** | userId 为空 → 抛出 `"userId 不能为空"`；title 为空 → 抛出 `"title 不能为空"`；priority 非法 → 抛出 `"priority 必须为合法枚举值"`；dueDate 早于当前时间 → 抛出 `"dueDate 不能早于当前时间"` |

### 2.2 completeTask

**签名：** `completeTask(taskId: string): Promise<Task>`

| 分类 | 条件 |
|------|------|
| **前置条件** | taskId 不为空且非空白字符；对应任务存在 |
| **后置条件** | 任务状态变为 COMPLETED；返回更新后的任务 |
| **异常条件** | taskId 为空 → 抛出 `"taskId 不能为空"`；任务不存在 → 抛出 `"任务不存在"` |
| **幂等性** | 对已完成的任务再次调用不报错，返回原任务 |

### 2.3 listTasksByPriority

**签名：** `listTasksByPriority(userId: string): Promise<Task[]>`

| 分类 | 条件 |
|------|------|
| **前置条件** | userId 不为空且非空白字符 |
| **后置条件** | 返回该用户所有任务；按优先级降序排列（HIGH → MEDIUM → LOW） |
| **异常条件** | userId 为空 → 抛出 `"userId 不能为空"` |
| **边界条件** | 用户无任务时返回空数组 `[]` |

### 2.4 listDueTasks

**签名：** `listDueTasks(date: Date): Promise<Task[]>`

| 分类 | 条件 |
|------|------|
| **前置条件** | date 不为 null 或 undefined |
| **后置条件** | 返回所有 dueDate <= 指定日期的任务 |
| **异常条件** | date 为 null/undefined → 抛出 `"date 不能为空"` |
| **边界条件** | 无到期任务时返回空数组 `[]`；dueDate 等于查询日期时包含在结果中 |

---

## 3. 仓储依赖

| 仓储 | 方法 | 说明 |
|------|------|------|
| `taskRepository` | `save(task)` | 保存任务 |
| `taskRepository` | `findById(id)` | 根据 ID 查找任务 |
| `taskRepository` | `findByUserId(userId)` | 根据用户 ID 查找任务 |
| `taskRepository` | `findByDueDateBefore(date)` | 查找截止日期 <= 指定日期的任务 |

---

## 4. 测试覆盖矩阵

| 方法 | 正常路径 | 边界条件 | 异常输入 | 业务不变量 | 合计 |
|------|:--------:|:--------:|:--------:|:----------:|:----:|
| createTask | 2 | 3 | 4 | 2 | **11** |
| completeTask | 1 | 2 | 2 | 2 | **7** |
| listTasksByPriority | 2 | 2 | 1 | 2 | **7** |
| listDueTasks | 2 | 3 | 2 | 1 | **8** |
| **合计** | **7** | **10** | **9** | **7** | **33** |

---

## 5. 实现文件

| 文件 | 路径 |
|------|------|
| 服务实现 | `src/application/service/TaskApplicationService.js` |
| 单元测试 | `test/application/service/TaskApplicationService.test.js` |

---

## 6. 版本历史

| 版本 | 日期 | 变更说明 |
|------|------|----------|
| 1.0.0 | 2026-06-01 | 初始版本，基于 TDD 流程实现 |