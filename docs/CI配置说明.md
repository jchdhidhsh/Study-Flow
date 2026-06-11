# CI 配置文件

**配置日期**：2026-06-11  
**实验**：实验四 - 独立迭代、代码审查与持续集成

---

## 1. CI 配置文件

**文件位置**：`.github/workflows/ci.yml`

```yaml
name: CI

on:
  push:
    branches: [ main ]
  pull_request:
    branches: [ main ]

jobs:
  build-and-test:
    runs-on: ubuntu-latest

    steps:
      - name: Checkout code
        uses: actions/checkout@v4

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'npm'

      - name: Install dependencies
        run: npm ci

      - name: Run linter
        run: npm run lint

      - name: Run tests
        run: npm test

      - name: Upload test results
        if: always()
        uses: actions/upload-artifact@v4
        with:
          name: test-results
          path: coverage/
```

---

## 2. 为什么这些检查是必要的

| 检查 | 必要性 |
|------|-------|
| npm ci | 确保依赖版本一致，避免幽灵依赖 |
| npm run lint | 早期发现代码风格和潜在错误 |
| npm test | 确保每次提交不破坏现有功能 |

---

## 3. CI 能拦截的质量问题

- 语法错误
- 代码风格违规
- 单元测试失败
- 回归问题
- 覆盖率为零

---

## 4. 仍需人工评审

- 业务逻辑正确性
- 设计模式选择
- API 契约变更
- 异常处理完整性
- 注释和文档质量

---

## 5. 本地验证

```bash
# 静态检查
npm run lint  → 0 errors, 41 warnings

# 单元测试
npm test      → 101 passed
```
