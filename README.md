# EnglishAI - AI 驱动的英语学习平台

一个现代化的、AI 驱动的英语学习 Web 应用，帮助用户高效提升英语能力。

## 项目结构

```
Learn-English-AI/
├── frontend/          # 前端代码（Vue 3 + TypeScript）
├── backend/           # 后端代码（待开发）
└── README.md          # 项目说明文档
```

## 技术栈

### 前端 (frontend/)
- **框架**: Vue 3 + TypeScript
- **构建工具**: Vite
- **UI 组件库**: shadcn/ui + Tailwind CSS
- **路由**: Vue Router
- **图标**: Lucide Icons
- **状态管理**: Vue Composition API

### 后端 (backend/)
- *待开发*

## 功能特性

### ✅ 已实现
- **首页**: 展示平台核心功能和统计数据
- **学习中心**: 课程列表、学习进度追踪、能力评估入口
- **课程学习页面**: 
  - 句子展示（英文、中文、音标、分词）
  - 单词拆解（词性、释义、例句、句子角色）
  - 音频播放控制（播放/暂停、慢速模式）
  - 键盘快捷键支持（空格播放、S 慢速、A 答案、左右切换）
  - 学习进度条
- **AI 对话页面**: 对话练习界面
- **响应式设计**: 适配 PC 和平板

### 🚧 开发中
- 写作评估功能
- 进度追踪详情
- 词汇/语法能力评估测试
- AI 能力接入

## 快速开始

### 前端开发

```bash
# 进入前端目录
cd frontend

# 安装依赖
npm install

# 启动开发服务器
npm run dev

# 构建生产版本
npm run build

# 预览生产构建
npm run preview
```

### 访问地址
- 开发服务器：http://localhost:5173
- 在线预览：https://5173-fc9e37e7cc8f52b5.monkeycode-ai.online

## 页面路由

| 路由 | 页面 | 说明 |
|------|------|------|
| `/` | Home | 首页 |
| `/learning` | Learning | 学习中心 |
| `/chat` | Chat | AI 对话 |
| `/lesson` | Lesson | 课程学习 |
| `/writing` | Writing | 写作评估 |
| `/progress` | Progress | 进度追踪 |

## 设计特点

- **深色科技风**: 深蓝紫色背景 (#0a0e27)
- **渐变色彩**: 蓝 - 紫 - 青渐变主题
- **玻璃拟态**: 半透明组件 + backdrop-blur
- **动态背景**: 光晕动画效果
- **流畅交互**: Hover 动画、过渡效果

## 开发规范

### 目录结构
```
frontend/
├── src/
│   ├── assets/        # 静态资源
│   ├── components/    # 通用组件
│   │   ├── layout/    # 布局组件
│   │   └── learning/  # 学习相关组件
│   ├── pages/         # 页面组件
│   ├── router/        # 路由配置
│   ├── lib/           # 工具函数
│   ├── App.vue        # 根组件
│   └── main.ts        # 入口文件
├── public/            # 公共资源
└── package.json       # 依赖配置
```

### 组件命名
- 使用 PascalCase 命名（如 `Navbar.vue`, `SentenceDisplay.vue`）
- 组件文件名与导出名称一致

### 代码风格
- 使用 TypeScript 严格模式
- 遵循 Vue 3 Composition API 风格
- 使用 Tailwind CSS 进行样式编写

## 贡献指南

1. Fork 本仓库
2. 创建特性分支 (`git checkout -b feature/AmazingFeature`)
3. 提交更改 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 提交 Pull Request

## 许可证

MIT License

## 联系方式

- GitHub: [@heyingfer09072002](https://github.com/heyingfer09072002/Learn-English-AI)

---

**EnglishAI** - 让英语学习从未如此简单 🚀
