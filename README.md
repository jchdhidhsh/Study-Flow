# StudyFlow 学习任务管理系统

面向学生的个人学习任务管理系统，基于领域驱动设计（DDD）四层架构构建。

## 项目简介

StudyFlow 帮助学生规划学习任务、设置优先级、配置提醒、跟踪任务进度、查看学习统计，提升个人学习效率。系统功能聚焦、操作简洁，适用于个人学习场景。

## 四大模块简介

| 模块 | 层级 | 说明 |
|------|------|------|
| **domain** | 领域层 | 核心业务层：领域实体（User、Task、TaskList、ReminderPolicy、ProgressReport）、值对象（Priority、TaskStatus）、聚合根、领域服务、仓储接口、领域事件 |
| **application** | 应用层 | 用例编排层：应用服务、命令对象（写操作）、查询对象（读操作）、DTO 传输对象 |
| **infrastructure** | 基础设施层 | 技术实现层：仓储实现、ORM 映射、数据库实体、通知服务、安全组件 |
| **interfaces** | 接口层 | 交互入口层：REST 控制器、请求/响应 DTO、Web 配置 |

## 本地运行步骤

### 环境要求

- Node.js >= 18.x
- npm >= 9.x

### 安装依赖

```bash
npm install
```

### 启动开发服务器

```bash
npm run dev
```

服务启动后访问 http://localhost:3000/health 验证服务状态。

### 生产环境启动

```bash
npm start
```

### 运行测试

```bash
npm test              # 运行所有测试
npm run test:watch   # 监听模式运行测试
npm run test:coverage  # 生成测试覆盖率报告
```

## 项目结构

```
study-flow/
├── src/
│   ├── domain/              # 领域层：核心业务模型
│   ├── application/         # 应用层：用例编排
│   ├── infrastructure/     # 基础设施层：持久化、技术实现
│   └── interfaces/          # 接口层：HTTP 入口
├── test/                    # 测试目录
│   ├── unit/               # 单元测试
│   └── integration/         # 集成测试
└── docs/                    # 项目文档
```

## 技术栈

- **运行时**：Node.js 18.x
- **框架**：Express.js
- **测试**：Jest
- **开发工具**：Nodemon