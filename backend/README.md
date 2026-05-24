# Backend - EnglishAI 后端服务

基于 Node.js + Express.js 的 RESTful API 服务

## 技术栈

- **运行时**: Node.js 18+
- **框架**: Express.js
- **语言**: TypeScript
- **数据库**: MongoDB (Mongoose ODM) - *待集成*
- **认证**: JWT (JSON Web Token)
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
│   ├── models/           # 数据模型 - *待开发*
│   ├── routes/           # 路由定义
│   │   ├── auth.routes.ts
│   │   ├── user.routes.ts
│   │   ├── lesson.routes.ts
│   │   └── ai.routes.ts
│   ├── services/         # 业务逻辑层 - *待开发*
│   ├── middleware/       # 中间件
│   │   ├── auth.middleware.ts
│   │   └── validate.middleware.ts
│   ├── config/           # 配置文件
│   ├── schemas/          # Zod 验证模式
│   ├── utils/            # 工具函数
│   └── index.ts          # 入口文件
├── .env.example          # 环境变量示例
├── package.json
└── tsconfig.json
```

## 快速开始

### 1. 安装依赖

```bash
cd backend
npm install
```

### 2. 配置环境变量

```bash
cp .env.example .env
# 编辑 .env 文件，填入你的配置
```

### 3. 启动开发服务器

```bash
# 开发模式（热重载）
npm run dev

# 构建生产版本
npm run build

# 启动生产服务器
npm run start
```

服务器默认运行在 `http://localhost:3001`

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
| MONGODB_URI | MongoDB 连接串 | - |
| JWT_SECRET | JWT 密钥 | - |
| JWT_EXPIRES_IN | JWT 有效期 | 7d |
| OPENAI_API_KEY | OpenAI API 密钥 | - |
| OPENAI_MODEL | OpenAI 模型 | gpt-4 |
| FRONTEND_URL | 前端地址 | http://localhost:5173 |

## 开发任务

- [x] 基础项目结构
- [x] Express 服务器配置
- [x] JWT 认证中间件
- [x] 用户认证接口
- [x] AI 对话接口
- [ ] MongoDB 数据模型
- [ ] 数据库 CRUD 操作
- [ ] 文件上传（口语录音）
- [ ] WebSocket 实时对话
- [ ] Redis 缓存
- [ ] 单元测试
- [ ] API 文档（Swagger）

## 注意事项

1. **JWT Secret**: 生产环境必须使用强随机密钥
2. **OpenAI API Key**: 需要在 `.env` 中配置有效的 API Key
3. **CORS**: 默认允许前端地址，根据实际部署调整
4. **数据库**: 当前使用内存数据，生产环境需连接 MongoDB

---

**EnglishAI Backend** - AI 驱动的英语学习平台后端服务
