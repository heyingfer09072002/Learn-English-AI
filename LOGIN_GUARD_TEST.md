# 🔴 路由守卫测试指南

## 问题现状

路由守卫代码已正确实现，但在浏览器中可能未生效。

## 路由守卫代码位置

**文件**: `frontend/src/router/index.ts` (第 149-167 行)

```typescript
router.beforeEach((to, from, next) => {
  const token = localStorage.getItem('auth_token');
  const requiresAuth = to.meta?.requiresAuth !== false;
  
  // 需要登录但没有 token，跳转到登录页
  if (requiresAuth && !token) {
    next('/login');
    return;
  }
  
  // 已登录但访问登录页，重定向到首页
  if (!requiresAuth && token) {
    next('/');
    return;
  }
  
  next();
});
```

## 测试步骤

### 方法 1: 无痕模式测试（推荐）

1. **打开无痕窗口**:
   - Chrome: Ctrl+Shift+N
   - Firefox: Ctrl+Shift+P

2. **访问首页**: http://localhost:5175

3. **预期结果**:
   - ✅ 应该自动跳转到 /login
   - ✅ 显示登录页面

4. **如果仍然显示首页**:
   - 打开浏览器控制台 (F12)
   - 查看 Console 是否有错误
   - 检查 Application > Local Storage 是否有 auth_token

### 方法 2: 清除 localStorage

1. **打开浏览器控制台** (F12)

2. **执行清除命令**:
```javascript
localStorage.clear()
location.reload()
```

3. **预期结果**:
   - ✅ 页面刷新后跳转到 /login

### 方法 3: 手动访问受保护页面

1. **清除 localStorage 后**:
```javascript
localStorage.clear()
```

2. **直接访问**:
```
http://localhost:5175/daily-tasks
http://localhost:5175/achievements
http://localhost:5175/favorites
```

3. **预期结果**:
   - ✅ 全部跳转到 /login

## 登录测试

1. **使用测试账号登录**:
```
邮箱：student@test.com
密码：123456
```

2. **登录后检查**:
```javascript
// 控制台执行
localStorage.getItem('auth_token')
// 应该显示一个 JWT token
```

3. **访问受保护页面**:
```
http://localhost:5175/daily-tasks
```
   - ✅ 应该正常显示内容

## 常见问题排查

### 问题 1: 路由守卫未执行

**检查**:
```javascript
// 控制台查看路由实例
console.log(window.$router)
```

**解决**:
- 确保 router/index.ts 中导出了 router
- 确保 main.ts 中使用了 router

### 问题 2: token 判断逻辑错误

**测试**:
```javascript
// 模拟未登录
localStorage.removeItem('auth_token')
location.href = '/daily-tasks'
```

### 问题 3: Vite 热更新问题

**解决**:
```bash
# 停止服务
killall -9 node

# 清除缓存
rm -rf frontend/node_modules/.vite

# 重启
cd frontend && npm run dev
```

## 调试代码

如果仍然不工作，在路由守卫中添加调试：

```typescript
router.beforeEach((to, from, next) => {
  const token = localStorage.getItem('auth_token');
  const requiresAuth = to.meta?.requiresAuth !== false;
  
  console.log('路由守卫触发:', {
    from: from.path,
    to: to.path,
    token: token ? '存在' : '不存在',
    requiresAuth: requiresAuth
  });
  
  if (requiresAuth && !token) {
    console.log('跳转到登录页');
    next('/login');
    return;
  }
  
  next();
});
```

## 当前服务状态

| 服务 | 端口 | 状态 |
|------|------|------|
| 后端 | 3001 | ✅ 运行中 |
| 前端 | 5175 | ✅ 运行中 |

## 快速测试链接

- 首页：http://localhost:5175
- 登录页：http://localhost:5175/login
- 每日任务：http://localhost:5175/daily-tasks
- 成就系统：http://localhost:5175/achievements

**注意**: 需要在浏览器中测试，curl 无法测试客户端路由！

