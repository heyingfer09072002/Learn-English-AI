# EnglishAI - AI 驱动的英语学习平台

一个全栈的、AI 驱动的现代化英语学习 Web 应用。

[![GitHub stars](https://img.shields.io/github/stars/heyingfer09072002/Learn-English-AI)](https://github.com/heyingfer09072002/Learn-English-AI)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Vue 3](https://img.shields.io/badge/Vue-3.x-green.svg)](https://vuejs.org/)
[![Node.js](https://img.shields.io/badge/Node.js-18+-green.svg)](https://nodejs.org/)
[![PostgreSQL](https://img.shields.io/badge/Database-PostgreSQL-blue.svg)](https://www.postgresql.org/)

> **实时预览**: https://5173-fc9e37e7cc8f52b5.monkeycode-ai.online

## 🌟 特性

- 🎯 **智能分析**: AI 深度分析词汇量和语法掌握度，生成个性化学习报告
- ✍️ **写作评估**: 实时评估英语写作，提供语法、用词和表达的专业建议
- 💬 **AI 对话**: 与 AI 进行自然对话练习，沉浸式提升口语和听力
- 📊 **进度追踪**: 可视化学习进度和成长轨迹，见证每一步提升
- 🎨 **现代 UI**: 深色科技感设计，Glassmorphism 效果，响应式布局
- 📚 **8 大主题课程**: 120 个精选句子，648 个单词解析，科学系统化学习

## 📁 项目结构

```
Learn-English-AI/
├── frontend/                    # Vue 3 前端应用
│   ├── src/
│   │   ├── api/                # API 客户端 (Axios)
│   │   ├── assets/             # 静态资源
│   │   ├── components/         # 组件
│   │   │   ├── layout/         # 布局组件
│   │   │   └── learning/       # 学习组件
│   │   ├── pages/              # 页面组件
│   │   │   ├── Home.vue        # 首页
│   │   │   ├── Learning.vue    # 学习中心
│   │   │   ├── Chat.vue        # AI 对话
│   │   │   ├── Lesson.vue      # 课程学习
│   │   │   ├── Writing.vue     # 写作评估
│   │   │   ├── Progress.vue    # 进度追踪
│   │   │   └── Profile.vue     # 个人中心 ✨
│   │   ├── router/             # 路由配置
│   │   ├── lib/                # 工具函数
│   │   └── main.ts             # 入口文件
│   ├── .env                    # 环境变量
│   ├── package.json
│   └── README.md
├── backend/                     # Node.js 后端服务
│   ├── src/
│   │   ├── controllers/        # 控制器
│   │   │   ├── auth.controller.ts
│   │   │   ├── user.controller.ts
│   │   │   ├── lesson.controller.ts
│   │   │   └── ai.controller.ts
│   │   ├── database/           # PostgreSQL 配置 ✨
│   │   │   └── index.ts
│   │   ├── middleware/         # 中间件 (JWT 认证)
│   │   ├── models/             # 数据模型
│   │   │   ├── User.model.ts
│   │   │   ├── Lesson.model.ts
│   │   │   └── Progress.model.ts
│   │   ├── routes/             # 路由定义
│   │   ├── schemas/            # Zod 验证模式
│   │   ├── migrate.ts          # 数据库迁移脚本 ✨
│   │   ├── seed-courses.ts     # 课程数据导入 ✨
│   │   └── index.ts            # 入口文件
│   ├── .env                    # 环境变量
│   ├── .env.example
│   ├── docker-compose.yml      # Docker 配置
│   ├── package.json
│   ├── API_TEST.md             # API 测试文档
│   └── README.md
├── .project-docs/              # 项目文档
│   └── PROJECT.md              # 项目总览
└── README.md
```

## 🚀 快速开始

### 环境要求

- Node.js 18+
- PostgreSQL 15+ (或使用 Docker)
- npm 或 pnpm
- Git

### 1. 克隆项目

```bash
git clone https://github.com/heyingfer09072002/Learn-English-AI.git
cd Learn-English-AI
```

### 2. 启动数据库

**方式 A: 使用 PostgreSQL 本地服务**

```bash
# 安装 PostgreSQL (Ubuntu/Debian)
sudo apt-get install postgresql postgresql-contrib

# 启动服务
sudo service postgresql start

# 创建数据库和用户
sudo -u postgres psql -c "CREATE USER english_ai WITH PASSWORD 'english_ai_pass';"
sudo -u postgres psql -c "CREATE DATABASE english_ai OWNER english_ai;"
sudo -u postgres psql -c "GRANT ALL PRIVILEGES ON DATABASE english_ai TO english_ai;"
```

**方式 B: 使用 Docker (推荐)**

```bash
cd backend
docker-compose up -d
```

### 3. 后端配置

```bash
# 进入后端目录
cd backend

# 安装依赖
npm install

# 配置环境变量
cp .env.example .env
# 编辑 .env 中的数据库配置

# 运行数据库迁移
npm run migrate

# 导入课程数据 (可选)
npm run seed

# 启动开发服务器 (http://localhost:3001)
npm run dev
```

### 4. 前端配置

```bash
# 打开新终端，进入前端目录
cd frontend

# 安装依赖
npm install

# 启动开发服务器 (http://localhost:5173)
npm run dev
```

访问 http://localhost:5173 开始使用！

## 🛠️ 技术栈

### 前端
| 技术 | 版本 | 用途 |
|------|------|------|
| Vue 3 | 3.x | 核心框架 |
| TypeScript | 5.x | 类型系统 |
| Vite | 5.x | 构建工具 |
| Vue Router | 4.x | 路由管理 |
| Axios | 1.x | HTTP 客户端 |
| Tailwind CSS | 3.x | 样式框架 |
| shadcn/ui | latest | UI 组件库 |

### 后端
| 技术 | 版本 | 用途 |
|------|------|------|
| Node.js | 18+ | 运行时 |
| Express | 4.x | Web 框架 |
| TypeScript | 5.x | 类型系统 |
| PostgreSQL | 15+ | 数据库 |
| node-postgres | 8.x | 数据库驱动 |
| JWT | 9.x | 身份认证 |
| bcryptjs | 2.x | 密码加密 |
| Zod | 3.x | 参数验证 |
| OpenAI SDK | 4.x | AI 集成 |

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

详细测试文档请查看 [backend/API_TEST.md](backend/API_TEST.md)

## 📚 课程内容

### 8 大主题课程

| 课程 | 等级 | 课时 | 内容 |
|------|------|------|------|
| 💬 日常对话 | 初级 | 16 | 问候、自我介绍、日常交流 |
| ✈️ 旅行英语 | 初级 | 14 | 机场、酒店、问路、观光 |
| 💼 商务沟通 | 中级 | 11 | 会议、演示、邮件、谈判 |
| 🎓 学术英语 | 高级 | 12 | 讲座、研究、论文、讨论 |
| 🌍 文化生活 | 中级 | 13 | 文化、传统、节日、习俗 |
| 🤖 科技前沿 | 高级 | 17 | 科技、AI、编程、创新 |
| 🏥 健康医疗 | 中级 | 15 | 健康、就医、症状、治疗 |
| 🎮 娱乐休闲 | 初级 | 17 | 电影、音乐、游戏、运动 |

### 数据结构

- **8 个课程** - 覆盖多场景英语学习需求
- **120 个句子** - 每个课程 15 个精选句子
- **648 个单词解析** - 包含音标、词性、含义、例句

## 🎯 功能展示

### 个人中心 ✨
- 用户信息管理
- 学习统计数据（学习天数、完成课程、掌握词汇、总时长）
- 学习进度可视化
- 成就系统

### 首页
- 8 大课程展示
- 功能卡片导航
- 数据展示

### 学习中心
- 词汇能力评估
- 语法能力评估
- 课程列表

### 课程学习
- 句子展示（英文 + 中文）
- 单词解析（音标、词性、含义）
- 音频播放控制
- 键盘快捷键（空格/左右箭头）

## 📝 环境变量

### 后端 (.env)
```env
NODE_ENV=development
PORT=3001
DB_HOST=localhost
DB_PORT=5432
DB_NAME=english_ai
DB_USER=english_ai
DB_PASSWORD=english_ai_pass
JWT_SECRET=your-super-secret-jwt-key
OPENAI_API_KEY=sk-your-openai-api-key-here
FRONTEND_URL=http://localhost:5173
```

### 前端 (.env)
```env
VITE_API_URL=http://localhost:3001/api
```

## 🔧 开发命令

### 后端
```bash
npm run dev          # 启动开发服务器
npm run build        # 构建生产版本
npm run start        # 启动生产服务器
npm run migrate      # 运行数据库迁移
npm run seed         # 导入课程数据
npm run db:reset     # 重置数据库
npm run lint         # 代码检查
npm test             # 运行测试
```

### 前端
```bash
npm run dev          # 启动开发服务器
npm run build        # 构建生产版本
npm run preview      # 预览生产版本
```

## 📊 开发进度

### 已完成 ✅
- ✅ 项目基础架构（前后端分离）
- ✅ PostgreSQL 数据库设计和集成
- ✅ JWT 认证系统
- ✅ RESTful API 接口
- ✅ 8 大主题课程数据
- ✅ 前端 7 个页面（Home/Learning/Chat/Lesson/Writing/Progress/Profile）
- ✅ 组件化架构
- ✅ 键盘快捷键支持
- ✅ Docker 数据库配置
- ✅ 数据库迁移和种子脚本
- ✅ API 测试文档

### 进行中 🚧
- 🚧 前后端 API 完整对接
- 🚧 用户登录/注册功能
- 🚧 完整的错误处理
- 🚧 单元测试

### 计划中 📋
- 📋 WebSocket 实时对话
- 📋 语音识别集成
- 📋 学习数据分析图表
- 📋 移动端适配
- 📋 PWA 支持
- 📋 多语言支持

## 🔗 链接

- **在线预览**: https://5173-fc9e37e7cc8f52b5.monkeycode-ai.online
- **GitHub**: https://github.com/heyingfer09072002/Learn-English-AI
- **项目文档**: .project-docs/PROJECT.md

## 📄 许可证

MIT License

## 👥 贡献

欢迎贡献代码！

1. Fork 项目
2. 创建特性分支 (`git checkout -b feature/AmazingFeature`)
3. 提交更改 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 提交 Pull Request

---

**EnglishAI** - 让英语学习从未如此简单 🚀

**最后更新**: 2026-05-24
