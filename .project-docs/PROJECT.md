# EnglishAI 项目开发文档

## 项目概览

EnglishAI 是一个全栈的、AI 驱动的现代化英语学习平台，帮助用户通过智能化的方式高效提升英语能力。

**GitHub 仓库**: https://github.com/heyingfer09072002/Learn-English-AI

## 技术架构

```
┌─────────────────────────────────────────────────────────┐
│                    EnglishAI Platform                   │
├─────────────────────────────────────────────────────────┤
│                                                         │
│  Frontend (Vue 3)           Backend (Node.js)           │
│  ┌─────────────┐            ┌──────────────┐           │
│  │             │  REST API  │              │           │
│  │  Pages      │◄──────────►│  Controllers │           │
│  │  Components │            │  Routes      │           │
│  │  API Client │            │  Middleware  │           │
│  │             │            │              │           │
│  └─────────────┘            └──────────────┘           │
│                          │                              │
│                          ▼                              │
│                   ┌──────────────┐                     │
│                   │  PostgreSQL  │                     │
│                   │  Database    │                     │
│                   └──────────────┘                     │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

## 目录结构

```
workspace/
├── frontend/                 # 前端项目
│   ├── src/
│   │   ├── api/             # API 客户端
│   │   │   └── index.ts
│   │   ├── assets/          # 静态资源
│   │   ├── components/      # 组件
│   │   │   ├── layout/     # 布局组件
│   │   │   └── learning/   # 学习组件
│   │   ├── lib/            # 工具函数
│   │   ├── pages/          # 页面组件
│   │   │   ├── Home.vue
│   │   │   ├── Learning.vue
│   │   │   ├── Chat.vue
│   │   │   ├── Lesson.vue
│   │   │   └── ...
│   │   ├── router/         # 路由配置
│   │   └── main.ts         # 入口文件
│   ├── .env                # 环境变量
│   └── package.json
│
├── backend/                # 后端项目
│   ├── src/
│   │   ├── controllers/    # 控制器
│   │   ├── database/       # 数据库配置
│   │   ├── middleware/     # 中间件
│   │   ├── models/         # 数据模型
│   │   ├── routes/         # 路由
│   │   ├── schemas/        # 验证模式
│   │   └── index.ts        # 入口文件
│   ├── .env.example        # 环境变量示例
│   ├── docker-compose.yml  # Docker 配置
│   └── package.json
│
└── README.md               # 项目说明
```

## 技术栈详情

### 前端
| 技术 | 版本 | 用途 |
|------|------|------|
| Vue 3 | 3.x | 框架 |
| TypeScript | 5.x | 类型系统 |
| Vite | 5.x | 构建工具 |
| Vue Router | 4.x | 路由 |
| shadcn/ui | latest | UI 组件 |
| Tailwind CSS | 3.x | 样式 |
| Axios | 1.x | HTTP 客户端 |

### 后端
| 技术 | 版本 | 用途 |
|------|------|------|
| Node.js | 18+ | 运行时 |
| Express | 4.x | Web 框架 |
| TypeScript | 5.x | 类型系统 |
| PostgreSQL | 15+ | 数据库 |
| node-postgres | 8.x | 数据库驱动 |
| JWT | 9.x | 认证 |
| bcryptjs | 2.x | 密码加密 |
| Zod | 3.x | 参数验证 |
| OpenAI SDK | 4.x | AI 集成 |

## 数据库设计

### ER 图

```
┌─────────────────┐       ┌─────────────────┐
│    lessons      │       │     users       │
├─────────────────┤       ├─────────────────┤
│ id (PK)         │       │ id (PK)         │
│ title           │       │ email           │
│ description     │       │ username        │
│ level           │       │ password_hash   │
│ lessons_count   │       │ avatar          │
│ icon            │       │ level           │
│ order           │       │ created_at      │
│ created_at      │       │ updated_at      │
└─────────────────┘       └─────────────────┘
         │                          │
         │                          │
         ▼                          ▼
┌─────────────────┐       ┌─────────────────┐
│   sentences     │       │ user_progress   │
├─────────────────┤       ├─────────────────┤
│ id (PK)         │       │ id (PK)         │
│ lesson_id (FK)  │       │ user_id (FK)    │
│ english         │       │ lesson_id (FK)  │
│ chinese         │       │ completed       │
│ phonetic        │       │ total_time      │
│ audio_url       │       │ vocabulary      │
│ order           │       │ accuracy        │
│ created_at      │       │ last_study_at   │
└─────────────────┘       └─────────────────┘
         │
         ▼
┌─────────────────┐
│ word_breakdowns │
├─────────────────┤
│ id (PK)         │
│ sentence_id(FK) │
│ word            │
│ meaning         │
│ pos             │
│ phonetic        │
│ role            │
│ example         │
│ order           │
│ created_at      │
└─────────────────┘
```

### 表结构详情

查看 [backend/README.md](backend/README.md) 获取完整的 SQL 建表语句。

## API 接口

### 认证接口
- `POST /api/auth/register` - 用户注册
- `POST /api/auth/login` - 用户登录
- `POST /api/auth/refresh` - 刷新令牌
- `POST /api/auth/logout` - 用户登出

### 用户接口
- `GET /api/users/profile` - 获取用户信息
- `PUT /api/users/profile` - 更新用户信息
- `GET /api/users/progress` - 获取学习进度
- `GET /api/users/statistics` - 获取学习统计

### 课程接口
- `GET /api/lessons` - 获取课程列表
- `GET /api/lessons/:id` - 获取课程详情
- `GET /api/lessons/:id/sentences` - 获取句子列表
- `POST /api/lessons/:id/progress` - 更新学习进度

### AI 接口
- `POST /api/ai/chat` - AI 对话
- `POST /api/ai/writing-assessment` - 写作评估
- `POST /api/ai/sentence-analysis` - 句子分析
- `POST /api/ai/speaking-evaluation` - 口语评估

详细文档查看 [backend/API_TEST.md](backend/API_TEST.md)

## 开发指南

### 环境要求
- Node.js 18+
- PostgreSQL 15+ (或使用 Docker)
- npm 或 pnpm
- Git

### 本地开发

```bash
# 克隆项目
git clone https://github.com/heyingfer09072002/Learn-English-AI.git
cd Learn-English-AI

# 启动数据库
cd backend
docker-compose up -d

# 后端配置
npm install
npm run migrate
npm run dev

# 前端配置 (新终端)
cd frontend
npm install
npm run dev
```

访问：
- 前端：http://localhost:5173
- 后端：http://localhost:3001

### 数据库迁移

```bash
# 执行迁移
npm run migrate

# 重置数据库
npm run db:reset
```

## 部署

### 前端部署

```bash
cd frontend
npm run build
# 部署 dist 目录到静态服务器
```

### 后端部署

```bash
cd backend
npm run build
npm run start
# 或使用 PM2
pm2 start dist/index.js --name english-ai-api
```

### 环境变量

生产环境需要配置以下环境变量：

**后端**:
```env
NODE_ENV=production
PORT=3001
DB_HOST=your-db-host
DB_PORT=5432
DB_NAME=english_ai
DB_USER=your-db-user
DB_PASSWORD=your-db-password
JWT_SECRET=your-secret-key
OPENAI_API_KEY=your-api-key
FRONTEND_URL=https://your-domain.com
```

**前端**:
```env
VITE_API_URL=https://api.your-domain.com
```

## 开发路线图

### 已完成 ✅
- [x] 项目基础架构
- [x] 前后端分离结构
- [x] PostgreSQL 数据库设计
- [x] JWT 认证系统
- [x] 基础 API 接口
- [x] 前端页面路由
- [x] 课程学习页面
- [x] AI 对话界面
- [x] Docker 数据库配置

### 进行中 🚧
- [ ] 前后端 API 对接
- [ ] 用户登录/注册页面
- [ ] 完整的错误处理
- [ ] 单元测试

### 计划中 📋
- [ ] WebSocket 实时对话
- [ ] 语音识别集成
- [ ] 学习数据分析
- [ ] 移动端适配
- [ ] PWA 支持
- [ ] 多语言支持

## 贡献指南

1. Fork 项目
2. 创建特性分支 (`git checkout -b feature/AmazingFeature`)
3. 提交更改 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 提交 Pull Request

## 许可证

MIT License

## 联系方式

- **项目地址**: https://github.com/heyingfer09072002/Learn-English-AI
- **问题反馈**: 在 GitHub Issues 中提交

---

**EnglishAI** - 让英语学习从未如此简单 🚀
