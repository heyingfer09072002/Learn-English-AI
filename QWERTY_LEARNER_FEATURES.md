# qwerty-learner 功能参考

## 项目信息
- **项目地址**: https://github.com/RealKai42/qwerty-learner
- **Stars**: 22,078+ ⭐
- **描述**: 为键盘工作者设计的单词记忆与英语肌肉记忆锻炼软件

## 值得借鉴的功能

### 1. 打字练习模式
- 单词拼写练习
- 实时错误提示
- 打字速度统计（WPM）
- 准确率计算
- 肌肉记忆训练

**实现建议**:
```typescript
// 在 SpellingMode 基础上添加
interface TypingStats {
  wpm: number;        // 每分钟单词数
  accuracy: number;   // 准确率
  errors: number;     // 错误数
  timeSpent: number;  // 用时
}
```

### 2. 成就系统
- 学习天数徽章
- 词汇量里程碑
- 连续学习奖励
- 成就展示墙

**实现建议**:
```sql
CREATE TABLE achievements (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id),
  achievement_type VARCHAR(50),
  unlocked_at TIMESTAMP,
  progress INTEGER DEFAULT 0
);
```

### 3. 排行榜
- 学习时长排名
- 词汇量排名
- 准确率排名
- 好友 PK 功能

### 4. 详细统计面板
- 每日学习曲线
- 记忆遗忘曲线分析
- 词频分布图
- 难度进阶图

### 5. 丰富的词库
- CET-4/CET-6
- 考研英语
- 雅思 (IELTS)
- 托福 (TOEFL)
- GRE
- GMAT
- 商务英语 (BEC)
- 专业英语（TEM-4/8）

**数据获取**:
可以从以下来源获取：
1. 官方词库网站
2. 教育类 API
3. 开源词库项目
4. 用户贡献数据

### 6. 移动端适配
- 响应式布局
- PWA 支持
- 离线学习
- 触摸优化

### 7. 社交功能
- 学习小组
- 互相监督
- 分享学习成果
- 学习打卡

## 下一步功能开发优先级

1. **打字练习模式** ⭐⭐⭐⭐⭐
   - 基于 SpellingMode 扩展
   - 添加 WPM 统计
   - 实时错误高亮

2. **详细统计图表** ⭐⭐⭐⭐⭐
   - 集成 ECharts
   - 学习趋势分析
   - 词汇量增长图

3. **词库扩展** ⭐⭐⭐⭐
   - 考研词汇
   - 雅思词库
   - 托福词库

4. **成就系统** ⭐⭐⭐⭐
   - 徽章设计
   - 解锁条件
   - 展示页面

5. **移动端适配** ⭐⭐⭐⭐
   - 响应式布局
   - 触摸键盘优化

6. **AI 功能** ⭐⭐⭐⭐⭐
   - AI 对话练习
   - 写作评估
   - 纠错建议

## qwerty-learner 代码参考

### 词汇数据格式
```javascript
{
  name: "CET-4",
  phonetic: "/əˈbændən/",
  definition: [
    "抛弃，舍弃",
    "放弃"
  ],
  example: [
    "abandon the car",
    "abandon the plan"
  ]
}
```

### 学习算法
```javascript
// 艾宾浩斯复习间隔
const reviewIntervals = [
  5 * 60 * 1000,      // 5 分钟
  30 * 60 * 1000,     // 30 分钟
  12 * 60 * 60 * 1000, // 12 小时
  24 * 60 * 60 * 1000, // 1 天
  2 * 24 * 60 * 60 * 1000,  // 2 天
  4 * 24 * 60 * 60 * 1000,  // 4 天
  7 * 24 * 60 * 60 * 1000,  // 7 天
  15 * 24 * 60 * 60 * 1000  // 15 天
];
```

## 总结

EnglishAI 项目已在以下方面完成：
- ✅ 4 种学习模式
- ✅ 艾宾浩斯记忆曲线
- ✅ 可视化图表
- ✅ CET-4/CET-6 词库

下一步可以借鉴 qwerty-learner 的：
- 打字练习模式
- 成就系统
- 更多词库
- 详细统计
- 社交功能
