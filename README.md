# EnglishAI - 商务英语学习平台

[![Version](https://img.shields.io/badge/version-1.0.0-blue.svg)](https://github.com/heyingfer09072002/Learn-English-AI)
[![License](https://img.shields.io/badge/license-MIT-green.svg)](LICENSE)
[![Vue 3](https://img.shields.io/badge/Vue-3.x-green.svg)](https://vuejs.org/)
[![Node.js](https://img.shields.io/badge/Node-18.x-green.svg)](https://nodejs.org/)
[![SQLite](https://img.shields.io/badge/SQLite-3.x-blue.svg)](https://www.sqlite.org/)

> 🎯 **EnglishAI** 是一款科学高效的商务英语在线学习平台，提供课程学习、词汇记忆、每日任务、成就系统等核心功能，帮助您快速提升英语能力。

## ✨ 核心特性

### 🎓 科学学习体系
- **艾宾浩斯记忆曲线**：智能安排复习时间点，最大化记忆效果
- **句子级别追踪**：记录每个句子的学习状态和准确率
- **个性化进度**：实时追踪学习数据，可视化成长轨迹

### 🏆 游戏化激励
- **7 等级体系**：英语新手 → 传奇学者
- **20+ 成就徽章**：学习类/打卡类/任务类/课程类
- **积分奖励**：每日任务、打卡、完成任务获取积分
- **经验系统**：学习句子 +2、掌握 +5、打卡 +20

### 📚 丰富学习资源
- **11500+ 词汇量**：高频/中频/低频 + 动词/名词/形容词专项
- **真实例句库**：每个单词配备发音、释义、例句
- **课程广场**：文本/音频/视频/音乐多种课程类型
- **每日任务**：4 类任务，养成学习习惯

### 🎨 精美界面设计
- **现代化 UI**：渐变配色、圆角卡片、流畅动画
- **响应式布局**：适配桌面端和移动端
- **游戏化体验**：成就弹窗、升级动画、经验飘字

## 🚀 快速开始

### 环境要求

- Node.js >= 18
- npm >= 9

### 1. 克隆项目

```bash
git clone https://github.com/heyingfer09072002/Learn-English-AI.git
cd Learn-English-AI
```

### 2. 安装依赖

```bash
# 后端依赖
cd backend
npm install

# 前端依赖
cd ../frontend
npm install
```

### 3. 启动后端（SQLite 模式）

```bash
cd backend
npm run dev:sqlite
# 运行在 http://localhost:3001
```

### 4. 启动前端

```bash
cd frontend
npm run dev
# 运行在 http://localhost:5173
```

### 5. 访问系统

打开浏览器访问：http://localhost:5173

**测试账号**:
- 邮箱：student@test.com
- 密码：123456

## 📋 功能模块

| 模块 | 状态 | 说明 |
|------|------|------|
| 🔐 用户认证 | ✅ | 注册/登录/JWT 认证/路由守卫 |
| 📊 学习进度 | ✅ | 句子级别追踪/准确率统计 |
| 📖 词汇学习 | ✅ | 11500+ 词/6 大分类/搜索功能 |
| ⭐ 错题本 | ✅ | 收藏句子/添加笔记/课程筛选 |
| 📅 每日任务 | ✅ | 4 类任务/打卡系统/积分奖励 |
| 🏆 成就系统 | ✅ | 7 等级/20+ 徽章/经验系统 |
| 📈 学习统计 | ✅ | 概览卡片/趋势图/分布统计 |
| 🎮 PK 对战 | 🚧 | 实时匹配/积分排行榜 |

## 🗄️ 数据库设计

### 核心表结构（12 张表）

| 表名 | 说明 |
|------|------|
| `users` | 用户信息（含金币/钻石） |
| `user_progress` | 学习进度追踪 |
| `user_favorites` | 收藏句子/错题 |
| `daily_tasks` | 每日任务模板 |
| `user_checkins` | 打卡记录 |
| `user_points` | 用户积分 |
| `user_points_log` | 积分流水 |
| `achievement_templates` | 成就模板 |
| `user_achievements` | 用户成就 |
| `user_levels` | 用户等级 |
| `vocabulary_groups` | 词汇分组 |
| `vocabulary_words` | 词汇数据（11500+） |

### 数据库文件

```
backend/data/english.db - 15MB SQLite 数据库
```

## 🎯 游戏化激励详情

### 等级体系

| 等级 | 称号 | 所需经验 | 图标 |
|------|------|----------|------|
| Lv.1 | 英语新手 | 0 | 👶 |
| Lv.2 | 学习达人 | 300 | 📖 |
| Lv.3 | 进步之星 | 600 | ⭐ |
| Lv.4 | 勤奋学霸 | 1000 | 📚 |
| Lv.5 | 英语高手 | 1500 | 🎓 |
| Lv.6 | 语言大师 | 2200 | 🏆 |
| Lv.7 | 传奇学者 | 3000 | 👑 |

### 经验获取规则

| 行为 | 经验值 |
|------|--------|
| 学习句子 | +2 EXP |
| 掌握句子 | +5 EXP |
| 每日打卡 | +20 EXP (+连续天数) |
| 完成任务 | +10 EXP |
| 完成课程 | +50 EXP |

### 成就徽章分类

| 类别 | 徽章示例 |
|------|----------|
| 学习类 | 学习达人（100 句）、词汇大师（500 词） |
| 打卡类 | 周坚持（7 天）、月坚持（30 天） |
| 任务类 | 任务达人（完成 50 任务） |
| 课程类 | 课程完成者（完成 10 课） |

## 🛠️ 技术栈

### 前端
- **框架**: Vue 3 + TypeScript
- **构建工具**: Vite
- **状态管理**: Pinia
- **路由**: Vue Router
- **UI**: TailwindCSS
- **HTTP**: Fetch API

### 后端
- **运行环境**: Node.js
- **框架**: Express
- **数据库**: SQLite
- **认证**: JWT (jsonwebtoken)
- **加密**: bcrypt
- **实时通信**: Socket.IO

## 📁 项目结构

```
Learn-English-AI/
├── backend/              # 后端服务
│   ├── src/
│   │   ├── controllers/  # 控制器
│   │   ├── routes/       # 路由
│   │   ├── middleware/   # 中间件
│   │   ├── models/       # 数据模型
│   │   ├── database/     # 数据库配置
│   │   └── helpers/      # 辅助函数
│   ├── data/             # SQLite 数据库
│   ├── scripts/          # 数据脚本
│   └── package.json
├── frontend/             # 前端应用
│   ├── src/
│   │   ├── pages/        # 页面组件
│   │   ├── components/   # 通用组件
│   │   ├── api/          # API 客户端
│   │   ├── router/       # 路由配置
│   │   ├── styles/       # 样式文件
│   │   └── assets/       # 静态资源
│   └── package.json
├── README.md             # 项目说明
├── PROJECT_COMPLETE_SUMMARY.md  # 完成总结
└── ...
```

## 📄 文档

| 文档 | 说明 |
|------|------|
| `PROJECT_COMPLETE_SUMMARY.md` | 项目完成总结 |
| `BACKEND_FIX_COMPLETE.md` | 后端接口修复报告 |
| `INPUT_STYLE_FIX_COMPLETE.md` | 输入框样式修复报告 |
| `FRONTEND_OPTIMIZATION_COMPLETE.md` | 前端优化报告 |

## 🔧 开发命令

### 后端

```bash
cd backend

# 开发模式（SQLite）
npm run dev:sqlite

# 数据导入
npm run seed:vocabulary

# 数据库迁移
npm run migrate
```

### 前端

```bash
cd frontend

# 开发模式
npm run dev

# 构建生产版本
npm run build

# 预览构建结果
npm run preview
```

## 🎬 使用演示

### 1. 注册登录

访问登录页面，注册新账号或使用测试账号登录。

### 2. 开始学习

- 进入课程广场选择课程
- 或进入词汇学习选择词汇组
- 完成句子学习获取经验值

### 3. 每日任务

- 访问每日任务页面
- 点击打卡获取积分
- 完成任务获取经验值和成就

### 4. 查看成就

- 访问成就系统页面
- 查看已解锁的徽章
- 追踪下一个成就目标

## 📊 项目数据

| 指标 | 数量 |
|------|------|
| 前端页面 | 11 个 |
| 前端组件 | 20+ 个 |
| 后端 API | 35+ 个 |
| 数据库表 | 12 张 |
| 词汇数据 | 11500+ 词 |
| 文档文件 | 15+ 个 |

## 🤝 参与贡献

欢迎提交 Issue 和 Pull Request！

1. Fork 本项目
2. 创建功能分支 (`git checkout -b feature/AmazingFeature`)
3. 提交更改 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 开启 Pull Request

## 📝 许可证

本项目采用 MIT 许可证 - 查看 [LICENSE](LICENSE) 文件了解详情。

## 👨‍💻 开发者

- **GitHub**: [@heyingfer09072002](https://github.com/heyingfer09072002)
- **项目地址**: https://github.com/heyingfer09072002/Learn-English-AI

---

<div align="center">

**Made with ❤️ for English Learners**

⭐ 如果这个项目对你有帮助，请给一个 Star！

</div>
