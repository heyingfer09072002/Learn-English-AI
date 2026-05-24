# Backend - EnglishAI 后端服务

基于 Node.js + Express.js 的 RESTful API 服务，使用 PostgreSQL 数据库

## 技术栈

- **运行时**: Node.js 18+
- **框架**: Express.js
- **语言**: TypeScript
- **数据库**: PostgreSQL + node-postgres
- **认证**: JWT (JSON Web Token)
- **密码加密**: bcryptjs
- **AI 集成**: OpenAI API
- **验证**: Zod

## 目录结构

```
backend/
├── src/
│   ├── controllers/      # 控制器层
│   │   ├── auth.controller.ts
│   │   ├── user.controller.ts
│   │   ├── lesson.controller.ts
│   │   └── ai.controller.ts
│   ├── models/           # 数据模型
│   │   ├── User.model.ts
│   │   ├── Lesson.model.ts
│   │   └── Progress.model.ts
│   ├── routes/           # 路由定义
│   │   ├── auth.routes.ts
│   │   ├── user.routes.ts
│   │   ├── lesson.routes.ts
│   │   └── ai.routes.ts
│   ├── database/         # 数据库配置
│   │   └── index.ts
│   ├── middleware/       # 中间件
│   │   ├── auth.middleware.ts
│   │   └── validate.middleware.ts
│   ├── config/           # 配置文件
│   ├── schemas/          # Zod 验证模式
│   ├── utils/            # 工具函数
│   └── index.ts          # 入口文件
├── migrations/           # 数据库迁移文件
├── .env.example          # 环境变量示例
├── package.json
└── tsconfig.json
```

## 快速开始

### 方式一：使用 Docker（推荐）

```bash
# 启动 PostgreSQL 数据库
docker-compose up -d

# 验证数据库是否运行
docker ps

# 查看日志
docker-compose logs -f postgres
```

### 方式二：本地安装 PostgreSQL

确保已安装 PostgreSQL 12+：

```bash
# macOS
brew install postgresql
brew services start postgresql

# Linux
sudo apt-get install postgresql postgresql-contrib

# Windows
# 下载安装：https://www.postgresql.org/download/windows/
```

### 2. 创建数据库

```bash
# 创建数据库
createdb english_ai

# 或手动执行
psql -U postgres
CREATE DATABASE english_ai;
\q
```

### 3. 安装依赖

```bash
cd backend
npm install
```

### 4. 配置环境变量

```bash
cp .env.example .env
# 编辑 .env 文件，填入你的配置
```

### 5. 启动开发服务器

```bash
# 开发模式（热重载，自动初始化数据库）
npm run dev

# 构建生产版本
npm run build

# 启动生产服务器
npm run start
```

服务器默认运行在 `http://localhost:3001`

## 数据库表结构

### users 表
```sql
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  username VARCHAR(100) NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  avatar VARCHAR(500),
  level VARCHAR(20) DEFAULT 'A1',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### lessons 表
```sql
CREATE TABLE lessons (
  id SERIAL PRIMARY KEY,
  title VARCHAR(200) NOT NULL,
  description TEXT,
  level VARCHAR(20) NOT NULL,
  lessons_count INTEGER DEFAULT 0,
  icon VARCHAR(50),
  "order" INTEGER DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### sentences 表
```sql
CREATE TABLE sentences (
  id SERIAL PRIMARY KEY,
  lesson_id INTEGER REFERENCES lessons(id) ON DELETE CASCADE,
  english TEXT NOT NULL,
  chinese TEXT,
  phonetic VARCHAR(200),
  audio_url VARCHAR(500),
  "order" INTEGER DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### word_breakdowns 表
```sql
CREATE TABLE word_breakdowns (
  id SERIAL PRIMARY KEY,
  sentence_id INTEGER REFERENCES sentences(id) ON DELETE CASCADE,
  word VARCHAR(100) NOT NULL,
  meaning TEXT,
  pos VARCHAR(20),
  phonetic VARCHAR(100),
  role VARCHAR(50),
  example TEXT,
  "order" INTEGER DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### user_progress 表
```sql
CREATE TABLE user_progress (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
  lesson_id INTEGER REFERENCES lessons(id) ON DELETE SET NULL,
  completed_lessons INTEGER DEFAULT 0,
  total_study_time INTEGER DEFAULT 0,
  vocabulary INTEGER DEFAULT 0,
  accuracy DECIMAL(5,2) DEFAULT 0,
  last_study_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(user_id)
);
```

## API 接口文档

### 健康检查

```http
GET /health
```

响应：
```json
{
  "status": "ok",
  "timestamp": "2024-01-01T00:00:00.000Z",
  "uptime": 12345
}
```

### 认证接口

#### 用户注册
```http
POST /api/auth/register
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "password123",
  "username": "John Doe"
}
```

#### 用户登录
```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "password123"
}
```

#### 刷新令牌
```http
POST /api/auth/refresh
Content-Type: application/json

{
  "token": "your-jwt-token"
}
```

#### 用户登出
```http
POST /api/auth/logout
Authorization: Bearer <token>
```

### 用户接口

所有用户接口都需要 JWT 认证。

#### 获取用户信息
```http
GET /api/users/profile
Authorization: Bearer <token>
```

#### 更新用户信息
```http
PUT /api/users/profile
Authorization: Bearer <token>
Content-Type: application/json

{
  "username": "New Name",
  "avatar": "https://..."
}
```

#### 获取学习进度
```http
GET /api/users/progress
Authorization: Bearer <token>
```

#### 获取学习统计
```http
GET /api/users/statistics
Authorization: Bearer <token>
```

### 课程接口

#### 获取课程列表
```http
GET /api/lessons
```

#### 获取课程详情
```http
GET /api/lessons/:id
```

#### 获取句子列表
```http
GET /api/lessons/:id/sentences
```

#### 更新学习进度
```http
POST /api/lessons/:id/progress
Authorization: Bearer <token>
Content-Type: application/json

{
  "completed": true
}
```

### AI 接口

所有 AI 接口都需要 JWT 认证。

#### AI 对话
```http
POST /api/ai/chat
Authorization: Bearer <token>
Content-Type: application/json

{
  "message": "Hello, how to improve my English?",
  "context": "english_learning"
}
```

#### 写作评估
```http
POST /api/ai/writing-assessment
Authorization: Bearer <token>
Content-Type: application/json

{
  "text": "This is my English essay..."
}
```

#### 句子分析
```http
POST /api/ai/sentence-analysis
Authorization: Bearer <token>
Content-Type: application/json

{
  "sentence": "I have been learning English for 5 years."
}
```

#### 口语评估
```http
POST /api/ai/speaking-evaluation
Authorization: Bearer <token>
Content-Type: application/json

{
  "audioUrl": "https://...",
  "transcript": "I think..."
}
```

## 环境变量

| 变量名 | 说明 | 默认值 |
|--------|------|--------|
| PORT | 服务器端口 | 3001 |
| NODE_ENV | 运行环境 | development |
| DB_HOST | PostgreSQL 主机 | localhost |
| DB_PORT | PostgreSQL 端口 | 5432 |
| DB_NAME | 数据库名称 | english_ai |
| DB_USER | 数据库用户 | postgres |
| DB_PASSWORD | 数据库密码 | postgres |
| JWT_SECRET | JWT 密钥 | - |
| JWT_EXPIRES_IN | JWT 有效期 | 7d |
| OPENAI_API_KEY | OpenAI API 密钥 | - |
| OPENAI_MODEL | OpenAI 模型 | gpt-4 |
| FRONTEND_URL | 前端地址 | http://localhost:5173 |

## 开发任务

- [x] PostgreSQL 数据库配置
- [x] 用户数据模型
- [x] 课程数据模型
- [x] 学习进度模型
- [x] JWT 认证中间件
- [x] 用户认证接口
- [x] AI 对话接口
- [ ] 完整的 API 测试
- [ ] 数据库迁移脚本
- [ ] Redis 缓存
- [ ] WebSocket 实时对话
- [ ] 文件上传（口语录音）
- [ ] API 文档（Swagger）

## 注意事项

1. **数据库连接**: 确保 PostgreSQL 服务正在运行
2. **JWT Secret**: 生产环境必须使用强随机密钥
3. **OpenAI API Key**: 需要在 `.env` 中配置有效的 API Key
4. **CORS**: 默认允许前端地址，根据实际部署调整

---

**EnglishAI Backend** - AI 驱动的英语学习平台后端服务
