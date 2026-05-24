# EnglishAI - 科学高效的英语词汇学习系统

[![Version](https://img.shields.io/badge/version-1.0.0-blue.svg)](https://github.com/heyingfer09072002/Learn-English-AI)
[![License](https://img.shields.io/badge/license-MIT-green.svg)](LICENSE)
[![Vue 3](https://img.shields.io/badge/Vue-3.x-green.svg)](https://vuejs.org/)
[![Node.js](https://img.shields.io/badge/Node-16.x-green.svg)](https://nodejs.org/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-15.x-blue.svg)](https://www.postgresql.org/)

> 🎯 **EnglishAI** 是一款基于艾宾浩斯记忆曲线的科学词汇学习系统，提供 4 种高效学习模式，帮助您快速掌握 CET-4/CET-6 核心词汇。

## ✨ 核心特性

### 🎓 科学学习方法
- **艾宾浩斯记忆曲线**：智能安排复习时间点，最大化记忆效果
- **4 种学习模式**：卡片背诵、拼写练习、选择题测试、听力辨音
- **个性化进度追踪**：实时记录学习数据，可视化成长轨迹

### 📚 丰富词汇资源
- **CET-4 官方词库**：228 条高频核心词汇
- **CET-6 核心词库**：6000+ 条六级必备词汇
- **多维度分类**：按词频、词性、主题、考试类型、难度分级

### 🎨 精美界面设计
- **深色主题 UI**：沉浸式学习体验，护眼舒适
- **玻璃态组件**：现代化设计风格，美观大方
- **可视化图表**：记忆曲线、学习趋势、进度统计

## 🚀 快速开始

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

### 3. 启动数据库
```bash
# 使用 Docker（推荐）
cd backend
docker-compose up -d

# 或使用本地 PostgreSQL
sudo service postgresql start
```

### 4. 配置环境变量
```bash
# 后端 .env
cp backend/.env.example backend/.env
# 编辑 .env 文件配置数据库和 JWT 密钥

# 前端 .env
echo "VITE_API_BASE_URL=http://localhost:3001/api" > frontend/.env
```

### 5. 数据迁移
```bash
cd backend
npm run migrate
npm run import:vocabulary data/cet4-official-flat.json
```

### 6. 启动服务
```bash
# 后端服务（端口 3001）
cd backend
npm run dev

# 前端服务（端口 5173）
cd frontend
npm run dev
```

### 7. 访问系统
- **前端页面**: http://localhost:5173
- **API 服务**: http://localhost:3001
- **登录页面**: http://localhost:5173/login

## 📋 功能模块

### 用户系统
- ✅ 用户注册/登录
- ✅ JWT Token 认证
- ✅ 个人中心管理
- ✅ 学习历史记录

### 词汇学习
- ✅ 词汇组选择（10 种分类）
- ✅ 4 种学习模式
- ✅ 学习进度追踪
- ✅ 艾宾浩斯复习提醒

### 学习模式

#### 1️⃣ 卡片背诵模式
- 3D 翻转动画
- 显示音标、词性、释义、例句
- 认识/不认识标记
- 键盘快捷键操作

#### 2️⃣ 拼写练习模式
- 看中文写英文
- 首字母提示
- 准确率统计
- 即时答案反馈

#### 3️⃣ 选择题测试模式
- 4 选项随机排序
- 答案解析展示
- 正确率统计
- 智能干扰项生成

#### 4️⃣ 听力辨音模式
- 音频播放
- 听音拼写
- 2 次提示机会
- 听力准确率

### 可视化图表
- ✅ 艾宾浩斯记忆曲线
- ✅ 本周学习趋势图
- ✅ 学习进度条
- ✅ 统计数据面板

## 📊 词库数据

| 词库类型 | 词汇数量 | 状态 |
|---------|---------|------|
| CET-4 官方 | 228 | ✅ 已导入 |
| CET-6 核心 | 6005 | ✅ 已导入 |
| 总计 | 6233 | ✅ |

### 词汇信息
每条词汇包含：
- 📝 单词拼写
- 🔊 英式/美式音标
- 📖 词性（v./n./adj./adv.）
- 🌐 中英文释义
- 💡 记忆技巧
- 📚 例句及翻译
- 🔗 同义词/反义词
- 🏷️ 多维度分类标签

## 🛠️ 技术栈

### 前端
- [Vue 3](https://vuejs.org/) - 渐进式 JavaScript 框架
- [TypeScript](https://www.typescriptlang.org/) - 类型安全的 JavaScript
- [Tailwind CSS](https://tailwindcss.com/) - 实用优先的 CSS 框架
- [Vue Router](https://router.vuejs.org/) - 官方路由管理器
- [Vite](https://vitejs.dev/) - 下一代前端构建工具

### 后端
- [Node.js](https://nodejs.org/) - JavaScript 运行时
- [TypeScript](https://www.typescriptlang.org/) - 类型系统
- [Express](https://expressjs.com/) - Web 应用框架
- [PostgreSQL](https://www.postgresql.org/) - 关系型数据库
- [JWT](https://jwt.io/) - JSON Web Token 认证
- [bcrypt](https://www.npmjs.com/package/bcryptjs) - 密码加密

### 开发工具
- [Vitest](https://vitest.dev/) - 单元测试框架
- [tsx](https://www.npmjs.com/package/tsx) - TypeScript 执行器
- [ESLint](https://eslint.org/) - 代码检查
- [Prettier](https://prettier.io/) - 代码格式化

## 📁 项目结构

```
Learn-English-AI/
├── backend/                    # 后端服务
│   ├── src/
│   │   ├── controllers/       # 控制器层
│   │   ├── models/           # 数据模型
│   │   ├── routes/           # 路由定义
│   │   ├── middleware/       # 中间件
│   │   ├── utils/            # 工具函数
│   │   ├── database/         # 数据库配置
│   │   └── index.ts          # 入口文件
│   ├── data/                 # 词汇数据
│   ├── scripts/              # 脚本文件
│   ├── tests/                # 测试文件
│   └── package.json
├── frontend/                  # 前端应用
│   ├── src/
│   │   ├── pages/           # 页面组件
│   │   ├── components/      # 通用组件
│   │   ├── api/             # API 客户端
│   │   ├── router/          # 路由配置
│   │   └── main.ts          # 入口文件
│   └── package.json
├── .monkeycode/              # 项目文档
├── PROJECT_COMPLETE.md       # 完成报告
├── QUICK_START.md           # 快速指南
├── TESTING_CHECKLIST.md     # 测试清单
├── UPDATE_SUMMARY.md        # 更新总结
└── README.md                # 项目说明
```

## 🔌 API 接口

### 认证接口
```bash
POST /api/auth/register    # 用户注册
POST /api/auth/login       # 用户登录
GET  /api/users/profile    # 获取用户信息
```

### 词汇接口
```bash
GET /api/vocabulary/groups         # 词汇分组列表
GET /api/vocabulary/groups/:id/words  # 获取分组词汇
GET /api/vocabulary/words/:id      # 词汇详情
GET /api/vocabulary/words/search?q=query  # 搜索词汇
```

### 学习接口
```bash
POST /api/vocabulary/words/:id/learn  # 记录学习
POST /api/vocabulary/words/:id/review # 记录复习
GET  /api/vocabulary/progress        # 学习进度
GET  /api/vocabulary/review/due      # 待复习
GET  /api/vocabulary/statistics      # 学习统计
```

## 🧪 测试

```bash
# 运行后端测试
cd backend
npm run test:run

# 查看测试覆盖率
npm run test:coverage

# 快速 API 测试
./test-api.sh
```

## 📈 学习数据

### 记忆曲线时间点
| 时间点 | 记忆保留率 | 建议行动 |
|-------|-----------|---------|
| 学习时 | 100% | 初次学习 |
| 1 天后 | 65% | 第一次复习 |
| 4 天后 | 35% | 第二次复习 |
| 7 天后 | 25% | 第三次复习 |
| 15 天后 | 21% | 第四次复习 |

> 💡 **提示**：及时复习可将记忆保留率提升至 **90% 以上**

## 🌟 功能路线图

- [x] 用户认证系统
- [x] 词汇学习功能
- [x] 4 种学习模式
- [x] 可视化图表
- [x] CET-4/CET-6 词库
- [ ] AI 对话练习
- [ ] 写作评估
- [ ] 打字练习模式
- [ ] 成就系统
- [ ] 社交功能
- [ ] 移动端适配

## 🤝 贡献指南

欢迎提交 Issue 和 Pull Request！

1. Fork 本项目
2. 创建特性分支 (`git checkout -b feature/AmazingFeature`)
3. 提交更改 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 开启 Pull Request

## 📄 开源协议

MIT License

## 👏 致谢

- [qwerty-learner](https://github.com/RealKai42/qwerty-learner) - 灵感来源
- 词库数据来源于 CET-4/CET-6 官方大纲

## 📞 联系方式

- 项目地址：https://github.com/heyingfer09072002/Learn-English-AI
- 问题反馈：请在 GitHub 提交 Issue

---

<div align="center">

**如果您觉得这个项目有帮助，请给一个 ⭐️ Star 支持！**

Made with ❤️ by EnglishAI Team

</div>
