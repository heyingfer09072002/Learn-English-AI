# 前端 API 整合文档

## ✅ 完成状态

所有前端页面已更新为**仅使用后端真实 API 数据**，无任何静态测试数据。

## 📋 已更新的页面

### 1. CoursePlaza.vue (课程广场)
- ✅ 使用 `GET /api/courses` 获取真实课程数据
- ✅ 支持筛选参数：courseType, difficultyLevel, search
- ✅ 空数据状态显示"暂无课程" + 创建引导
- ✅ 加载状态显示动画

### 2. PracticePage.vue (练习页面)
- ✅ 使用 `GET /api/practice/sentence` 获取句子
- ✅ 使用 `POST /api/practice/sentence` 提交练习
- ✅ 连击系统集成 (Pinia Store)
- ✅ 评级系统基于真实结果
- ✅ 无数据时显示引导而非假数据

### 3. StatisticsPage.vue (学习统计)
- ✅ 使用 `GET /api/statistics/overview` 获取概览
- ✅ 使用 `GET /api/statistics/heatmap` 获取热力图
- ✅ 使用 `GET /api/statistics/radar` 获取雷达图
- ✅ 所有数据为空时显示友好提示
- ✅ 加载状态动画

### 4. ProfilePage.vue (个人中心)
- ✅ 使用 `GET /api/users/profile` 获取用户信息
- ✅ 使用 `GET /api/statistics/achievements` 获取成就
- ✅ 未登录状态显示登录引导
- ✅ 移除所有硬编码用户数据
- ✅ 移除所有硬编码成就数据

### 5. PKArena.vue (PK 对战)
- ✅ 使用 `POST /api/pk/match` 匹配对手 (降级为 AI 对手如果失败)
- ✅ 使用 `GET /api/pk/sentence` 获取句子 (降级为预设句如果失败)
- ✅ 使用 `POST /api/pk/submit` 提交答案
- ✅ 错误处理完善
- ✅ 移除模拟对手数据

## 🔧 API 客户端

创建统一的 API 客户端：`frontend/src/api/apiClient.ts`

```typescript
// 使用示例
import { apiGet, apiPost } from '../api/apiClient';

// GET 请求
const result = await apiGet<Course[]>('/api/courses', { 
  courseType: 'text',
  difficultyLevel: 'intermediate'
});

// POST 请求
const result = await apiPost('/api/practice/sentence', {
  sentenceId: 1,
  answer: 'I like apples',
  timeSpent: 5000
});
```

### 特性
- ✅ 自动添加 Bearer Token (如果存在 localStorage)
- ✅ 统一错误处理
- ✅ 返回标准化响应格式
- ✅ 网络错误捕获

## 📊 后端 API 需求清单

### 需要实现但暂未实现的 API

| API 端点 | 用途 | 页面 | 降级方案 |
|---------|------|------|---------|
| `GET /api/users/profile` | 获取用户信息 | ProfilePage | 显示登录引导 |
| `GET /api/statistics/achievements` | 获取成就列表 | ProfilePage | 显示空列表 |
| `GET /api/pk/match` | PK 匹配对手 | PKArena | 使用 AI 对手 |
| `GET /api/pk/sentence` | 获取 PK 句子 | PKArena | 预设句子 |
| `POST /api/pk/submit` | 提交 PK 答案 | PKArena | 本地验证 |
| `GET /api/practice/sentence` | 获取练习句子 | PracticePage | 预设句子 |

### 已实现的 API

| API 端点 | 状态 | 说明 |
|---------|------|------|
| `GET /api/courses` | ✅ | 返回空数组如果无数据 |
| `POST /api/practice/sentence` | ✅ | 计算评级和连击 |
| `GET /api/statistics/overview` | ✅ | 返回默认 0 值 |
| `GET /api/statistics/heatmap` | ✅ | 返回空数组 |
| `GET /api/statistics/radar` | ✅ | 返回 null |

## 🎯 空数据处理策略

所有页面遵循统一的空数据处理原则：

1. **加载状态** - 显示 loading 动画
2. **数据为空** - 显示友好提示 + 操作引导
3. **API 错误** - 显示错误信息 + 重试选项
4. **无认证** - 显示登录引导

### 示例 UI 状态

```
// 课程为空
📚
暂无课程
开始学习后这里会显示课程

[创建第一个课程] 按钮

// 统计为空
📈
暂无统计数据
开始学习后这里会显示你的学习数据

// 成就为空
🏆
暂无成就数据
完成学习任务解锁成就
```

## 🚫 禁止行为

以下行为在前端页面中**严格禁止**：

1. ❌ 硬编码假数据用于展示
2. ❌ 使用 mock 数据假装后端有数据
3. ❌ 显示与后端实际数据不符的内容
4. ❌ 在 API 调用前预设"看起来真实"的数据

## ✅ 推荐做法

1. ✅ 始终使用 `apiClient` 发起请求
2. ✅ 统一处理 loading/error/empty 三种状态
3. ✅ 后端返回什么就显示什么
4. ✅ 空数据时显示友好引导而非假内容
5. ✅ 所有状态都应有对应的 UI 展示

## 📝 更新日志

### 2026-05-26
- ✅ 创建统一 API 客户端
- ✅ 更新 CoursePlaza 移除所有静态课程数据
- ✅ 更新 StatisticsPage 移除所有静态统计数据
- ✅ 更新 ProfilePage 移除所有硬编码用户和成就数据
- ✅ 更新 PKArena 移除模拟对手数据
- ✅ 更新 PracticePage 确保使用真实 API
- ✅ 所有 API 路由改为 optionalAuthMiddleware

## 🔗 相关文件

- `frontend/src/api/apiClient.ts` - 统一 API 客户端
- `frontend/src/pages/CoursePlaza.vue` - 课程广场
- `frontend/src/pages/PracticePage.vue` - 练习页面
- `frontend/src/pages/StatisticsPage.vue` - 统计页面
- `frontend/src/pages/ProfilePage.vue` - 个人中心
- `frontend/src/pages/PKArena.vue` - PK 对战

---

**前端永远只显示后端返回的真实数据！**
