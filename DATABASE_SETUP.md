# 数据库配置指南

## ✅ 已完成配置

### SQLite 数据库（推荐用于开发环境）

**优势**：
- 无需安装任何数据库服务
- 零配置，开箱即用
- 适合开发和测试
- 自动创建和初始化

**数据结构**：
- ✅ 30 个英语词汇
- ✅ 20 句英语名言
- ✅ 19 个基础练习句子
- ✅ 2 个完整课程

## 快速启动

### 方式一：使用 SQLite（推荐）

```bash
# 进入后端目录
cd backend

# 初始化数据库（仅首次）
npm run db:init

# 启动 SQLite 模式后端
npm run dev:sqlite
```

### 方式二：使用 PostgreSQL（生产环境）

1. **安装 PostgreSQL**
```bash
# Ubuntu/Debian
sudo apt-get install postgresql postgresql-contrib

# macOS
brew install postgresql
```

2. **创建数据库**
```bash
sudo -u postgres psql
CREATE DATABASE english_ai;
CREATE USER postgres WITH PASSWORD 'postgres';
GRANT ALL PRIVILEGES ON DATABASE english_ai TO postgres;
\q
```

3. **配置环境变量**
创建 `backend/.env` 文件：
```env
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/english_ai
DB_HOST=localhost
DB_PORT=5432
DB_NAME=english_ai
DB_USER=postgres
DB_PASSWORD=postgres
```

4. **运行迁移并启动**
```bash
cd backend
npm run migrate
npm run migrate:julebu
npm run dev
```

## 数据库脚本命令

| 命令 | 说明 |
|------|------|
| `npm run db:sqlite` | 创建 SQLite 数据库表 |
| `npm run db:seed` | 导入初始数据 |
| `npm run db:init` | 完整初始化（建表 + 数据） |
| `npm run db:fetch` | 从在线 API 获取真实数据 |
| `npm run migrate` | PostgreSQL 迁移 |
| `npm run seed` | PostgreSQL 导入数据 |

## 当前数据统计

- **词汇表**: 30 个单词
- **名言课程**: 20 句名言（来自 Steve Jobs、Einstein 等）
- **句子练习**: 19 个句子（初/中/高级）
- **总课程数**: 2 个

## API 数据验证

```bash
# 获取课程列表
curl http://localhost:3001/api/courses

# 获取课程详情
curl http://localhost:3001/api/courses/1

# 获取统计信息
curl http://localhost:3001/api/statistics/overview
```

## 数据来源

所有数据均来自合法来源：

- **词汇数据**: 精选常用英语词汇
- **名言数据**: 来自公开的 CC0 许可 API
- **句子练习**: 英语教学常用句型

## 从在线 API 获取数据

使用 `fetch-online-data.js` 脚本从免费 API 获取更多真实数据：

```bash
npm run db:fetch
```

**数据源**：
- Free Dictionary API (CC BY-SA 3.0)
- Quotable API (CC0)

## 数据库文件位置

SQLite 数据库文件：`backend/data/english.db`

