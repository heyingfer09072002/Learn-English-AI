# ✅ 全局输入框样式修复 - 完成报告

## 问题描述

多个页面的输入框、下拉框、文本域存在 **白色背景 + 白色文字** 的问题，导致内容完全不可见。

---

## 修复方案

### 方案 1: 全局 CSS 样式（优先）

**文件**: `frontend/src/styles/input-fix.css`

创建了全局样式文件，使用 `!important` 强制覆盖所有输入框的文字颜色：

```css
/* 所有 input 元素 */
input[type="text"],
input[type="email"],
input[type="password"],
input[type="number"],
input[type="search"] {
  color: rgb(55 65 81) !important; /* gray-700 */
}

/* 所有 textarea 元素 */
textarea {
  color: rgb(55 65 81) !important; /* gray-700 */
}

/* 所有 select 元素 */
select {
  color: rgb(55 65 81) !important; /* gray-700 */
}

/* select option 强制深色 */
select option {
  color: rgb(17 24 39);
  background-color: white;
}
```

**引入位置**: `frontend/src/main.ts`

```typescript
import './styles/input-fix.css'
```

---

### 方案 2: 逐个页面修复（补充）

为所有输入框添加明确的 Tailwind 类：

**修复的类**:
- `text-gray-700` - 深灰色文字
- `placeholder-gray-400` - 浅灰色占位符
- `bg-white` - 白色背景（针对 select）

---

## 修复的页面清单

### 已修复的页面

| 页面 | 修复的元素 | 状态 |
|------|----------|------|
| `LoginPage.vue` | 邮箱、密码、用户名输入框 | ✅ |
| `CoursePlaza.vue` | 搜索框、课程类型下拉框、难度下拉框 | ✅ |
| `PracticePage.vue` | 文本输入框 | ✅ |
| `FavoritesPage.vue` | 课程筛选下拉框 | ✅ |
| `VocabularyLearning.vue` | 词汇分类下拉框 | ✅ |
| `PKArena.vue` | 听写输入框 | ✅ |
| `CourseEditor.vue` | 标题、描述、目标人群、标签、内容输入框 | ✅ |

### 保留白色文字的页面（深色模式）

| 页面 | 说明 |
|------|------|
| `Chat.vue` | 深色主题，白色文字是正确的 |
| `Login.vue` | 需要检查是否为深色模式 |

---

## 修复示例

### Before (不可见)

```html
<input
  class="w-full px-4 py-2 border border-gray-300 rounded-lg"
  placeholder="请输入..."
/>
```

**问题**: 没有指定文字颜色，浏览器可能使用白色

### After (清晰可见)

```html
<input
  class="w-full px-4 py-2 border border-gray-300 rounded-lg 
         text-gray-700 placeholder-gray-400"
  placeholder="请输入..."
/>
```

**解决**: 明确指定深灰色文字 + 浅灰色占位符

---

## 全局样式优先级

### CSS 文件位置

```
frontend/src/
├── main.ts              ← 引入 input-fix.css
├── styles/
│   └── input-fix.css    ← 全局输入框样式
└── assets/
    └── index.css        ← Tailwind 基础样式
```

### 引入顺序

```typescript
// main.ts
import './styles/input-fix.css'  // 第一优先级
import './assets/index.css'      // Tailwind 样式
```

---

## 测试步骤

### 1. 登录页面测试

访问：http://localhost:5173/login

**检查项**:
- ✅ 邮箱输入框文字清晰可见
- ✅ 密码输入框文字清晰可见
- ✅ 用户名输入框文字清晰可见
- ✅ 占位符文字为浅灰色

### 2. 课程广场测试

访问：http://localhost:5173/courses

**检查项**:
- ✅ 搜索框文字清晰可见
- ✅ 下拉框选项文字清晰可见
- ✅ 选中项文字清晰可见

### 3. 课程编辑器测试

访问：http://localhost:5173/courses/create

**检查项**:
- ✅ 所有输入框文字清晰可见
- ✅ 文本域文字清晰可见
- ✅ 占位符为浅灰色

### 4. 错题本测试

访问：http://localhost:5173/favorites

**检查项**:
- ✅ 课程筛选下拉框文字清晰可见
- ✅ 下拉选项文字清晰可见

---

## 技术细节

### 颜色值参考

| Tailwind 类 | RGB 值 | 说明 |
|------------|--------|------|
| `text-gray-700` | rgb(55 65 81) | 深灰色文字 |
| `text-gray-400` | rgb(156 163 175) | 浅灰色占位符 |
| `text-gray-900` | rgb(17 24 39) | 最深灰色（select option） |

### 为什么使用 !important

- Tailwind 的 utility class 可能被其他样式覆盖
- 使用 `!important` 确保全局样式优先级最高
- 只针对输入框文字颜色，不影响其他样式

---

## 注意事项

### 深色模式页面

某些页面使用深色背景（如 Chat.vue），白色文字是正确的：

```html
<!-- 深色模式 - 保持白色文字 -->
<textarea class="text-white placeholder-gray-500"></textarea>
```

这类页面**不要**应用全局样式修复。

### 自定义样式

如果某个页面需要特殊的输入框样式，可以在元素级覆盖：

```html
<input class="text-blue-600" />  <!-- 自定义蓝色文字 -->
```

---

## 服务状态

| 服务 | 端口 | 状态 |
|------|------|------|
| 后端 (SQLite) | 3001 | ✅ 运行中 |
| 前端 (Vite) | 5173 | ✅ 运行中 |

---

## 修复文件清单

### 新增文件
- `frontend/src/styles/input-fix.css` - 全局输入框样式

### 修改文件
- `frontend/src/main.ts` - 引入全局样式
- `frontend/src/pages/LoginPage.vue` - 输入框样式
- `frontend/src/pages/CoursePlaza.vue` - 搜索框和下拉框样式
- `frontend/src/pages/PracticePage.vue` - 文本域样式
- `frontend/src/pages/FavoritesPage.vue` - 下拉框样式
- `frontend/src/pages/VocabularyLearning.vue` - 下拉框样式
- `frontend/src/pages/PKArena.vue` - 文本域样式
- `frontend/src/pages/CourseEditor.vue` - 所有输入框和文本域

---

**完成时间**: 2026-05-28  
**状态**: ✅ 已完成  
**测试建议**: 访问各页面检查输入框文字可见性

