# 📊 数据效果预览指南

## 🌐 在线预览地址

**前端页面**: https://5173-9b85b29332306c52.monkeycode-ai.online

访问以下页面查看实时数据：

### 1. 课程广场页面
- **URL**: `http://localhost:5173/courses` 或 `http://localhost:5173/course-plaza`
- **显示数据**: 23 门课程列表
- **数据来源**: `GET /api/courses`
- **效果**: 看到所有课程卡片，包含课程名称、难度、描述

### 2. 课程详情页面
- **URL**: `http://localhost:5173/course/5` (替换 ID 查看不同课程)
- **显示数据**: 课程详情 + 1000 个句子
- **数据来源**: `GET /api/courses/5`
- **效果**: 完整的课程内容和句子列表

### 3. 学习统计页面
- **URL**: `http://localhost:5173/statistics`
- **显示数据**: 
  - 总课程数：23
  - 总句子数：20,539
  - 总词汇数：5,030
- **数据来源**: `GET /api/statistics/overview`

### 4. 词汇页面
- **URL**: `http://localhost:5173/vocabulary`
- **显示数据**: 5,030 个词汇
- **数据来源**: `GET /api/vocabulary`

## 🔍 API 接口直接查看

### 使用浏览器访问

```
http://localhost:3001/api/courses
http://localhost:3001/api/courses/5
http://localhost:3001/api/statistics/overview
http://localhost:3001/api/health
```

### 使用命令行查看

```bash
# 查看所有课程
curl http://localhost:3001/api/courses | json_pp

# 查看课程详情（包含 1000 个句子）
curl http://localhost:3001/api/courses/5 | json_pp

# 查看统计数据
curl http://localhost:3001/api/statistics/overview | json_pp
```

### 使用 Postman/API Fox

导入以下请求：

| 方法 | URL | 说明 |
|------|-----|------|
| GET | `http://localhost:3001/api/courses` | 获取所有课程 |
| GET | `http://localhost:3001/api/courses/5` | 获取课程详情 |
| GET | `http://localhost:3001/api/statistics/overview` | 获取统计数据 |
| GET | `http://localhost:3001/api/health` | 健康检查 |

## 📱 前端页面效果

### 课程广场页面
打开后你会看到：
- ✅ 23 个课程卡片
- ✅ 每个课程显示：标题、难度标签、描述
- ✅ 课程分类：商务/日常/考试/技能
- ✅ 点击卡片进入课程详情

### 课程详情页面
打开后你会看到：
- ✅ 课程基本信息
- ✅ 1000 个句子列表
- ✅ 每个句子显示：英文、中文、难度
- ✅ 可以开始练习

### 统计页面
打开后你会看到：
- ✅ 总课程数：23
- ✅ 总句子数：20,539
- ✅ 总词汇数：5,030
- ✅ 数据可视化图表

## 🎯 快速验证数据

### 1. 检查数据库文件
```bash
ls -lh backend/data/english.db
# 应该显示约 15MB
```

### 2. 查看数据统计
```bash
curl http://localhost:3001/api/statistics/overview
```

### 3. 查看课程列表
```bash
curl http://localhost:3001/api/courses | python3 -c "import json,sys; d=json.load(sys.stdin); print(f'课程总数：{len(d[\"data\"])}'); [print(f'{c[\"id\"]}. {c[\"title\"]} - {c[\"difficulty_level\"]}') for c in d['data']]"
```

## 🖥️ 数据库直接查看

### 使用 SQLite 客户端（如果已安装）
```bash
sqlite3 backend/data/english.db

# 查看课程
SELECT id, title, difficulty_level FROM courses;

# 查看词汇
SELECT word, meaning FROM vocabulary LIMIT 20;

# 查看句子数量
SELECT COUNT(*) FROM sentences;
```

### 使用在线 SQLite 查看器
1. 访问：https://sqliteviewer.app/
2. 上传文件：`backend/data/english.db`
3. 浏览所有表和数据

## 📊 数据量对比展示

| 项目 | 之前 | 现在 | 前端显示 |
|------|------|------|----------|
| 课程 | 2 门 | **23 门** | 课程广场卡片墙 |
| 句子 | 39 句 | **20,539 句** | 课程详情页列表 |
| 词汇 | 30 个 | **5,030 个** | 词汇表页面 |
| 统计 | 空数据 | **完整统计** | 统计图表 |

## 🎨 视觉效果的页面

### 首页
- 显示所有功能入口
- 快速开始按钮
- 课程推荐

### 课程广场
- 网格布局展示 23 门课程
- 难度标签颜色区分
- 课程描述预览

### 课程详情
- 课程内容列表
- 进度条显示
- 练习按钮

### 统计页面
- 数字卡片显示总量
- 图表展示分布
- 学习进度可视化

## 🔗 直接访问链接

**开发环境**:
- 首页：http://localhost:5173
- 课程广场：http://localhost:5173/course-plaza
- 课程详情：http://localhost:5173/course/5
- 统计数据：http://localhost:5173/statistics
- 词汇表：http://localhost:5173/vocabulary

**在线预览**:
- 完整站点：https://5173-9b85b29332306c52.monkeycode-ai.online

## 💡 提示

1. **首次加载**: 打开页面后，数据会从 API 实时加载，可能需要 1-2 秒
2. **分页显示**: 大量数据可能分页显示，注意翻页
3. **筛选功能**: 部分页面支持按难度筛选
4. **搜索功能**: 可以搜索特定课程或词汇

