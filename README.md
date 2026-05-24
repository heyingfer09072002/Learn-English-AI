# EnglishAI - AI 驱动的英语学习平台

一个全栈的、AI 驱动的现代化英语学习 Web 应用。

## 🌟 特性

- 🎯 **智能分析**: AI 深度分析词汇量和语法掌握度
- ✍️ **写作评估**: 实时评估英语写作，提供专业建议
- 💬 **AI 对话**: 与 AI 进行自然对话练习
- 📊 **进度追踪**: 可视化学习进度和成长轨迹
- 🎨 **现代 UI**: 深色科技感设计，响应式布局

## 📁 项目结构

```
Learn-English-AI/
├── frontend/          # 前端代码 (Vue 3 + TypeScript)
│   ├── src/
│   │   ├── pages/    # 页面组件
│   │   ├── components/
│   │   │   ├── layout/    # 布局组件
│   │   │   └── learning/  # 学习组件
│   │   ├── router/   # 路由配置
│   │   └── ...
│   ├── package.json
│   └── README.md
├── backend/           # 后端代码 (Node.js + Express)
│   ├── src/
│   │   ├── controllers/  # 控制器
│   │   ├── routes/       # 路由
│   │   ├── middleware/   # 中间件
│   │   ├── config/       # 配置
│   │   └── index.ts      # 入口
│   ├── package.json
│   └── README.md
└── README.md          # 本文件
```

## 🚀 快速开始

### 前端开发

```bash
# 进入前端目录
cd frontend

# 安装依赖
npm install

# 启动开发服务器 (http://localhost:5173)
npm run dev

# 构建生产版本
npm run build
```

### 后端开发

```bash
# 进入后端目录
cd backend

# 安装依赖
npm install

# 配置环境变量
cp .env.example .env
# 编辑 .env 文件

# 启动开发服务器 (http://localhost:3001)
npm run dev

# 构建生产版本
npm run build
```

## 🛠️ 技术栈

### 前端
- **框架**: Vue 3 + TypeScript
- **构建工具**: Vite
- **UI 组件**: shadcn/ui
- **样式**: Tailwind CSS
- **路由**: Vue Router
- **状态管理**: Vue Composition API
- **图标**: Lucide Icons

### 后端
- **运行时**: Node.js 18+
- **框架**: Express.js
- **语言**: TypeScript
- **数据库**: MongoDB (待集成)
- **认证**: JWT
- **AI 集成**: OpenAI API
- **验证**: Zod

## 📋 API 接口

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

详细文档请查看 [backend/README.md](backend/README.md)

## 🎯 开发进度

### 前端
- ✅ 首页
- ✅ 学习中心
- ✅ 课程学习页面
- ✅ AI 对话界面
- ✅ 组件化架构
- ✅ 键盘快捷键支持
- ⏳ 写作评估页面
- ⏳ 进度追踪详情

### 后端
- ✅ Express 服务器
- ✅ JWT 认证
- ✅ 基础 API 接口
- ✅ AI 集成框架
- ⏳ MongoDB 数据模型
- ⏳ 数据库 CRUD
- ⏳ 文件上传
- ⏳ WebSocket 实时对话

## 📝 环境变量

### 后端 (.env)
```env
PORT=3001
NODE_ENV=development
MONGODB_URI=mongodb://localhost:27017/english-ai
JWT_SECRET=your-secret-key
OPENAI_API_KEY=sk-your-key
FRONTEND_URL=http://localhost:5173
```

### 前端
前端使用 Vite 默认环境变量方式，如需配置在 `.env` 文件中。

## 🔗 链接

- 前端预览：https://5173-fc9e37e7cc8f52b5.monkeycode-ai.online
- GitHub: https://github.com/heyingfer09072002/Learn-English-AI

## 📄 许可证

MIT License

## 👥 贡献

欢迎贡献代码！请查看开发任务列表。

---

**EnglishAI** - 让英语学习从未如此简单 🚀
