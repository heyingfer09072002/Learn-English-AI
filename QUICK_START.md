# EnglishAI 快速启动指南

## 🎯 新功能演示

### 1. 访问登录页面
```
http://localhost:5173/login
```
- 注册新用户或直接登录
- 自动 Token 管理

### 2. 查看个人中心
```
http://localhost:5173/profile
```
- 学习统计面板
- 艾宾浩斯记忆曲线可视化
- 本周学习趋势图
- 待复习词汇提醒

### 3. 词汇学习
```
http://localhost:5173/vocabulary
```
- 4 种学习模式切换
- CET-4 官方词库 (228 词)
- CET-6 核心词库 (6000 词)

## 📊 词汇数据

| 词库 | 已导入 | 分类 |
|------|-------|------|
| CET-4 官方 | 228 | ✅ 已导入 |
| CET-6 生成 | 6005 | ✅ 已导入 |
| 总计 | 6233 | ✅ |

## 🔥 核心 API 测试

```bash
# 1. 登录 (必须先执行)
TOKEN=$(curl -s -X POST http://localhost:3001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"Test123456!"}' | \
  python3 -c "import sys,json; print(json.load(sys.stdin)['data']['token'])")

echo "获取的 Token: ..."

# 2. 获取词汇组
curl http://localhost:3001/api/vocabulary/groups \
  -H "Authorization: Bearer $TOKEN" | python3 -m json.tool | head -30

# 3. 搜索 CET-4 词汇
curl "http://localhost:3001/api/vocabulary/words/search?q=ability" \
  -H "Authorization: Bearer $TOKEN" | python3 -m json.tool

# 4. 获取词汇详情
curl http://localhost:3001/api/vocabulary/words/1 \
  -H "Authorization: Bearer $TOKEN" | python3 -m json.tool
```

## 🎨 界面预览

### 登录页面特性
- 渐变文字标题
- 玻璃态卡片设计
- 表单验证和错误提示
- 登录/注册切换

### 个人中心特性
- 3D 翻转头像
- 学习统计 4 指标
- SVG 记忆曲线图
- 7 天学习趋势柱状图
- 待复习词汇列表

## ✅ 服务状态

- 后端 API: http://localhost:3001 ✓
- 前端页面: http://localhost:5173 ✓
- PostgreSQL: localhost:5432 ✓
- 词汇数据: 6233 条 ✓

## 📝 下一步建议

1. 访问 qwerty-learner 项目借鉴更多功能
2. 导入 CET-6 官方词库
3. 添加 Chart.js 高级图表
4. 实现打字练习模式
5. 添加成就系统和排行榜
