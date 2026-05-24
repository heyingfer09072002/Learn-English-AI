# EnglishAI 测试清单

本文档提供完整的服务启动和测试步骤。

## 📋 前置条件

### 1. PostgreSQL 数据库

**方式 A: 使用 Docker 启动（推荐）**

```bash
cd /workspace/Learn-English-AI/backend
docker-compose up -d

# 验证容器运行
docker ps

# 查看容器日志
docker logs english-ai-db
```

**方式 B: 使用本地 PostgreSQL 服务**

```bash
# Ubuntu/Debian
sudo service postgresql start

# 创建数据库和用户
sudo -u postgres psql << EOF
CREATE USER english_ai WITH PASSWORD 'english_ai_pass';
CREATE DATABASE english_ai OWNER english_ai;
GRANT ALL PRIVILEGES ON DATABASE english_ai TO english_ai;
EOF
```

### 2. 环境变量配置

**后端后端配置**

```bash
cd /workspace/Learn-English-AI/backend
cp .env.example .env

# 编辑 .env 文件，确保以下配置正确：
# DB_HOST=localhost
# DB_PORT=5432
# DB_NAME=english_ai
# DB_USER=postgres (或 english_ai)
# DB_PASSWORD=postgres (或 english_ai_pass)
# JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
# OPENAI_API_KEY=sk-your-openai-api-key-here (可选)
```

**前端配置**

```bash
cd /workspace/Learn-English-AI/frontend
echo "VITE_API_URL=http://localhost:3001/api" > .env
```

## 🚀 服务启动

### 1. 启动后端服务

```bash
cd /workspace/Learn-English-AI/backend

# 安装依赖（如未安装）
npm install

# 启动开发服务器
npm run dev

# 应该看到类似输出：
# ╔═══════════════════════════════════════════════════╗
# ║                                                   ║
# ║   🚀 EnglishAI Backend Server                     ║
# ║   运行在：http://localhost:3001                   ║
# ║   数据库：PostgreSQL                              ║
# ║                                                   ║
# ╚═══════════════════════════════════════════════════╝
```

**验证后端启动成功：**

```bash
# 健康检查
curl http://localhost:3001/health

# API 根路由
curl http://localhost:3001/api
```

### 2. 启动前端服务

```bash
cd /workspace/Learn-English-AI/frontend

# 安装依赖（如未安装）
npm install

# 启动开发服务器
npm run dev

# 应该看到类似输出：
# ➜  Local:   http://localhost:5173/
# ➜  Network: use --host to expose
```

## ✅ 功能测试清单

### 基础 API 测试

```bash
# 1. 健康检查
curl http://localhost:3001/health | jq

# 2. API 信息
curl http://localhost:3001/api | jq

# 3. 用户注册
curl -X POST http://localhost:3001/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "password123",
    "username": "testuser"
  }' | jq

# 保存返回的 token
export TOKEN="your_token_here"

# 4. 用户登录
curl -X POST http://localhost:3001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "password123"
  }' | jq
```

### 认证接口测试

```bash
# 5. 获取用户信息（需要认证）
curl http://localhost:3001/api/users/profile \
  -H "Authorization: Bearer $TOKEN" | jq

# 6. 获取学习进度
curl http://localhost:3001/api/users/progress \
  -H "Authorization: Bearer $TOKEN" | jq

# 7. 获取学习统计
curl http://localhost:3001/api/users/statistics \
  -H "Authorization: Bearer $TOKEN" | jq
```

### 词汇系统 API 测试

```bash
# 8. 获取词汇分组列表
curl http://localhost:3001/api/vocabulary/groups \
  -H "Authorization: Bearer $TOKEN" | jq

# 9. 获取特定类型分组（按词频）
curl "http://localhost:3001/api/vocabulary/groups?type=frequency" \
  -H "Authorization: Bearer $TOKEN" | jq

# 10. 获取分组下的词汇
curl "http://localhost:3001/api/vocabulary/groups/1/words?page=1&limit=20" \
  -H "Authorization: Bearer $TOKEN" | jq

# 11. 获取词汇详情
curl http://localhost:3001/api/vocabulary/words/1 \
  -H "Authorization: Bearer $TOKEN" | jq

# 12. 搜索词汇
curl "http://localhost:3001/api/vocabulary/words/search?q=test&limit=10" \
  -H "Authorization: Bearer $TOKEN" | jq

# 13. 记录学习行为
curl -X POST http://localhost:3001/api/vocabulary/words/1/learn \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"action": "complete", "timeSpent": 10}' | jq

# 14. 记录复习
curl -X POST http://localhost:3001/api/vocabulary/words/1/review \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"isCorrect": true, "timeSpent": 5}' | jq

# 15. 获取学习进度统计
curl http://localhost:3001/api/vocabulary/progress \
  -H "Authorization: Bearer $TOKEN" | jq

# 16. 获取待复习词汇
curl http://localhost:3001/api/vocabulary/review/due \
  -H "Authorization: Bearer $TOKEN" | jq

# 17. 获取学习统计
curl "http://localhost:3001/api/vocabulary/statistics?timeRange=week" \
  -H "Authorization: Bearer $TOKEN" | jq
```

### 词汇数据导入测试

```bash
# 18. 导入示例词汇数据
cd /workspace/Learn-English-AI/backend
npm run import:vocabulary data/sample-vocabulary.json

# 19. 导入更多词汇
npm run import:vocabulary data/cet6-vocabulary-50.json

# 运行数据库迁移（如果需要）
npm run migrate
```

### 单元测试测试

```bash
# 20. 运行后端所有测试
cd /workspace/Learn-English-AI/backend
npm run test:run

# 21. 运行测试并生成覆盖率报告
npm run test:coverage

# 22. 运行特定测试文件
npx vitest run tests/vocabulary.integration.test.ts

# 23. 运行复习调度器测试
npx vitest run tests/review-scheduler.test.ts
```

### 前端组件测试

```bash
# 24. 前端访问
# 浏览器打开：http://localhost:5173

# 25. 测试页面路由
# - 首页：http://localhost:5173/
# - 学习中心：http://localhost:5173/learning
# - 词汇学习：http://localhost:5173/vocabulary
# - 课程学习：http://localhost:5173/lesson
# - AI 对话：http://localhost:5173/chat
# - 写作评估：http://localhost:5173/writing
# - 进度追踪：http://localhost:5173/progress
# - 个人中心：http://localhost:5173/profile
```

## 🧪 端到端测试流程

### 完整学习流程测试

1. **注册账号**
   - 前端打开首页
   - 点击注册
   - 填写邮箱、密码、用户名
   - 提交注册

2. **登录系统**
   - 使用注册的账号登录
   - 验证 token 存储

3. **浏览词汇分组**
   - 访问词汇学习页面
   - 查看词汇分组列表
   - 筛选不同分类

4. **卡片背诵模式**
   - 选择一个词汇组
   - 点击"卡片背诵"模式
   - 测试卡片翻转
   - 标记"认识"/"不认识"
   - 测试键盘快捷键（空格、左右箭头）

5. **查看学习进度**
   - 检查统计面板更新
   - 验证已掌握词汇数

6. **词汇搜索**
   - 使用搜索功能查找词汇
   - 验证搜索结果

7. **复习待办**
   - 查看待复习词汇
   - 完成一次复习

## 🐛 故障排查

### 后端连接数据库失败

```bash
# 检查 PostgreSQL 是否运行
sudo service postgresql status
# 或
docker ps | grep postgres

# 检查数据库配置
cat backend/.env | grep DB_

# 测试数据库连接
psql -h localhost -U postgres -d english_ai
```

### 端口被占用

```bash
# 查看占用端口的进程
lsof -i :3001
lsof -i :5173

# 终止进程
kill -9 <PID>
```

### 前端无法连接后端

```bash
# 检查后端是否运行
curl http://localhost:3001/health

# 检查前端 API 配置
cat frontend/.env

# 检查 CORS 配置
cat backend/.env | grep FRONTEND_URL
```

### 测试失败

```bash
# 查看详细错误日志
cat backend/logs/error.log

# 检查测试配置
cat backend/.env.test

# 重新运行迁移
npm run db:reset
npm run migrate
```

## 📊 测试报告模板

完成测试后，记录以下信息：

### API 测试结果

| 接口 | 状态码 | 响应时间 | 测试结果 |
|------|--------|----------|----------|
| POST /api/auth/register | 201 | <200ms | ✅ 通过 |
| POST /api/auth/login | 200 | <200ms | ✅ 通过 |
| GET /api/vocabulary/groups | 200 | <100ms | ✅ 通过 |
| ... | ... | ... | ... |

### 前端功能测试

| 页面/组件 | 功能 | 测试结果 |
|-----------|------|----------|
| 词汇学习页面 | 模式选择 | ✅ 通过 |
| 词汇学习页面 | 分组筛选 | ✅ 通过 |
| 卡片组件 | 翻转动画 | ✅ 通过 |
| 卡片组件 | 键盘快捷键 | ✅ 通过 |
| ... | ... | ... |

### 性能测试

| 指标 | 目标值 | 实际值 | 状态 |
|------|--------|--------|------|
| API 响应时间 (P95) | <500ms | XXXms | ✅/❌ |
| 前端页面加载时间 | <2s | X.Xs | ✅/❌ |
| 数据库查询时间 | <100ms | XXms | ✅/❌ |

## 🔧 常用命令汇总

```bash
# 后端命令
cd backend
npm run dev           # 开发模式
npm run build         # 构建
npm run start         # 生产模式
npm run migrate       # 数据库迁移
npm run seed          # 导入课程数据
npm run import:vocabulary  # 导入词汇数据
npm run test:run      # 运行测试
npm run test:coverage # 测试覆盖率

# 前端命令
cd frontend
npm run dev           # 开发模式
npm run build         # 构建
npm run preview       # 预览构建结果
```

---

**最后更新**: 2026-05-24
**版本**: 1.0
