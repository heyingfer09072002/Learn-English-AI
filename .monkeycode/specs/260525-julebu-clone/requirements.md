# 句乐部 (Julebu.co) 复刻需求文档

## 项目概述

将现有的 Learn-English-AI 项目升级为类似句乐部的游戏化英语学习平台，在现有词汇学习功能基础上，增加游戏化学习机制、多种学习模式、用户自定义课程、智能复习系统等核心功能。

## 功能对比分析

### 现有功能 (Learn-English-AI)

| 功能模块 | 状态 | 说明 |
|---------|------|------|
| 用户认证系统 | ✅ 完成 | 注册、登录、JWT Token |
| 词汇学习 | ✅ 完成 | 4 种模式（卡片、拼写、选择、听力）|
| 词库数据 | ✅ 完成 | 6,233 条 CET-4/6词汇 |
| 艾宾浩斯复习 | ✅ 完成 | 8 个复习间隔 |
| 学习进度追踪 | ✅ 完成 | 可视化图表 |
| AI 对话 | 🔄 80% | 部分完成 |

### 需要新增的核心功能 (句乐部特色)

| 功能模块 | 优先级 | 复杂度 | 说明 |
|---------|--------|--------|------|
| **游戏化系统** | P0 | 中 | 连击、评级、成就 |
| **句子学习模式** | P0 | 高 | 连词成句核心玩法 |
| **课程创作系统** | P0 | 高 | 用户自定义课程 |
| **智能 AI 助手** | P1 | 中 | 悬浮答疑助手 |
| **复习本系统** | P1 | 中 | 智能复习推荐 |
| **生词本** | P1 | 低 | 单词收藏 |
| **PK 对战** | P2 | 高 | 实时 1v1 |
| **排行榜** | P2 | 低 | 学习时长/积分榜 |
| **学习小组** | P2 | 中 | 社交功能 |

---

## 详细需求清单

### 1. 游戏化学习系统

#### 1.1 连击系统 (Combo System)

**用户故事**: AS 学习者，I WANT 连续答对时获得视觉和音效反馈，SO THAT 我能获得成就感并持续学习

**验收标准**:
1. WHEN 用户连续答对题目，THE system SHALL 显示连击数字动画（2 连击、3 连击...）
2. WHEN 连击数达到 5/10/20/50，THE system SHALL 播放特殊动画效果（Perfect/Great）
3. WHEN 连击数达到倍数（10、20、30），THE system SHALL 给予额外分数加成（1.2x/1.5x/2.0x）
4. IF 用户答错题目，THE system SHALL 重置连击数为 0 并显示鼓励提示
5. WHILE 连击持续期间，THE system SHALL 累积显示Combo 特效和音效

#### 1.2 SSS 评级系统

**用户故事**: AS 学习者，I WANT 每次练习后获得评级，SO THAT 我能了解掌握程度并挑战更高等级

**验收标准**:
1. WHEN 用户完成一次练习，THE system SHALL 根据表现计算评级（C/B/A/S/SS/SSS）
2. WHEN 正确率在 95% 以上且平均答题时间<3 秒，THE system SHALL 授予 SSS 评级
3. WHEN 正确率在 90-95%，THE system SHALL 授予 SS 评级
4. WHEN 正确率在 80-90%，THE system SHALL 授予 S 评级
5. WHEN 正确率在 70-80%，THE system SHALL 授予 A 评级
6. WHEN 正确率在 60-70%，THE system SHALL 授予 B 评级
7. WHEN 正确率低于 60%，THE system SHALL 授予 C 评级并建议重新练习
8. WHILE 评级展示时，THE system SHALL 显示本次练习的关键数据（正确率、最快答题、连击数）

#### 1.3 学习成就系统

**用户故事**: AS 学习者，I WANT 解锁成就徽章，SO THAT 我能有长期学习的动力

**验收标准**:
1. The system SHALL 提供以下成就类别：
   - 连续打卡成就（3 天/7 天/30 天/100 天）
   - 学习时长成就（累计 10/50/100/500 小时）
   - 连击成就（最高连击 10/20/50/100）
   -  mastering 成就（掌握 100/500/1000 单词）
   - 评级成就（获得 100 次 SSS 评级）
2. WHEN 用户达成成就条件，THE system SHALL 弹出成就解锁动画
3. WHILE 用户访问个人主页，THE system SHALL 展示已解锁和未解锁的成就

---

### 2. 句子学习系统（核心玩法）

#### 2.1 连词成句模式

**用户故事**: AS 学习者，I WANT 通过逐步拼接的方式学习完整句子，SO THAT 我能在语境中自然记忆单词

**验收标准**:
1. The system SHALL 将句子拆分为渐进式片段，例如 "I like to eat apples." 拆解为：
   - Level 1: "I"
   - Level 2: "I like"
   - Level 3: "I like to"
   - Level 4: "I like to eat"
   - Level 5: "I like to eat apples."
2. WHEN 用户输入每个片段，THE system SHALL 实时校验拼写正确性
3. IF 用户输入错误，THE system SHALL 标红错误部分并允许重试
4. WHEN 用户完成一个句子的所有片段，THE system SHALL 播放成功动画
5. WHILE 学习过程中，THE system SHALL 高亮显示当前片段的音标、词性、释义
6. The system SHALL 支持键盘快捷键：
   - Enter: 确认输入
   - Esc: 跳过当前句
   - Ctrl+H: 显示提示

#### 2.2 多类型课程支持

**用户故事**: AS 学习者，I WANT 学习不同类型的课程内容，SO THAT 我可以根据兴趣选择学习材料

**验收标准**:
1. The system SHALL 支持以下课程类型：
   - 文字课程：纯文本句子，可配插图
   - 音频课程：每句带发音音频
   - 视频课程：视频分句播放，自动暂停
   - 音乐课程：歌词同步高亮
2. WHEN 用户学习视频/音频课程，THE system SHALL 提供以下控制：
   - 播放/暂停
   - 0.5x/0.75x/1.0x/1.25x/1.5x 倍速
   - 单句循环
   - A/B 复读
3. WHILE 音乐课程学习时，THE system SHALL 同步滚动显示歌词

#### 2.3 五种学习模式切换

**用户故事**: AS 学习者，I WANT 在不同学习模式间自由切换，SO THAT 我可以针对性训练不同能力

**验收标准**:
1. The system SHALL 提供以下学习模式：
   - **中译英**: 显示中文，输入英文
   - **听写模式**: 播放音频，输入英文（可重复播放 2 次）
   - **听力模式**: 三阶段（盲听→慢速听→看字幕）
   - **口语测评**: 跟读录音，AI 评分（0-100 分）
   - **视频模式**: 观看视频，分句练习
2. WHILE 学习过程中，THE system SHALL 允许用户随时切换模式
3. WHEN 切换模式时，THE system SHALL 保存当前进度

---

### 3. 课程创作系统

#### 3.1 课程编辑器

**用户故事**: AS 教师/高级用户，I WANT 创建自定义课程，SO THAT 我可以分享自己的学习内容

**验收标准**:
1. The system SHALL 提供可视化课程编辑器，支持：
   - 课程标题、描述、封面图设置
   - 难度级别选择（初级/中级/高级）
   - 适用人群标签（K12/四六级/雅思托福/商务等）
2. The system SHALL 支持四种内容类型：
   - 文字：输入英文句子，自动/手动添加中文翻译
   - 音频：上传音频文件，AI 自动分句
   - 视频：上传视频文件，AI 自动分句并生成字幕
   - 音乐：上传音频 + 歌词，AI 同步对齐
3. WHEN 用户上传内容，THE system SHALL 调用 AI 服务：
   - 自动拆分句子
   - 生成音标
   - 标注词性
   - 提取重点词汇
   - 生成知识点讲解
4. WHILE 编辑课程时，THE system SHALL 提供实时预览
5. WHEN 课程创建完成，THE system SHALL 允许作者：
   - 设置为公开/私有
   - 分享至学习广场
   - 生成分享链接

#### 3.2 课程审核与发布

**用户故事**: AS 平台管理员，I WANT 审核用户创作的课程，SO THAT 保证平台内容质量

**验收标准**:
1. WHEN 用户提交公开课程，THE system SHALL 标记为"待审核"状态
2. WHILE 待审核期间，THE system SHALL 仅作者可见
3. WHEN 审核通过，THE system SHALL 发布至课程广场并通知作者
4. IF 审核不通过，THE system SHALL 说明原因并退回修改

---

### 4. AI 智能助手

#### 4.1 悬浮答疑助手

**用户故事**: AS 学习者，I WANT 在学习时随时提问，SO THAT 我能及时解决疑惑

**验收标准**:
1. WHILE 学习页面中，THE system SHALL 在右下角显示 AI 助手悬浮按钮
2. WHEN 用户点击助手，THE system SHALL 展开对话面板
3. The system SHALL 自动理解当前学习的句子并提供帮助：
   - 语法解释
   - 单词用法
   - 同义词/反义词
   - 例句拓展
4. WHEN 用户提问，THE system SHALL 结合当前上下文给出精准回答
5. The system SHALL 提供每日 2 次免费提问，超出后消耗钻石
6. WHILE 对话过程中，THE system SHALL 支持：
   - 追问
   - 举例
   - 收藏回答

#### 4.2 AI 写作评估

**用户故事**: AS 学习者，I WANT 获得作文批改反馈，SO THAT 我能提升写作能力

**验收标准**:
1. WHEN 用户提交英语作文，THE system SHALL 提供以下评估：
   - 语法纠错（标红错误并提供修改建议）
   - 表达优化（推荐更地道的表达）
   - 词汇丰富度评分
   - 句子结构分析
   - 总体评分（0-100）
2. WHILE 评估报告中，THE system SHALL 生成：
   - 错误列表（错误类型 + 修改方案）
   - 亮点句子
   - 提升建议
   - 能力雷达图（语法/词汇/结构/表达）

---

### 5. 复习与巩固系统

#### 5.1 智能复习本

**用户故事**: AS 学习者，I WANT 系统自动安排复习，SO THAT 我在遗忘临界点得到巩固

**验收标准**:
1. The system SHALL 基于艾宾浩斯记忆曲线计算最佳复习时间
2. WHEN 用户完成学习，THE system SHALL 根据答题表现动态调整下次复习时间：
   - 答对且快速：延长复习间隔
   - 答对但犹豫：保持原间隔
   - 答错：缩短复习间隔，安排加练
3. WHILE 用户访问复习本，THE system SHALL 显示：
   - 今日待复习数量
   - 预计复习时间
   - 一键开始复习按钮
4. WHEN 复习完成，THE system SHALL 更新下次复习时间并显示掌握度变化

#### 5.2 生词本

**用户故事**: AS 学习者，I WANT 收藏不认识的单词，SO THAT 我可以集中攻克

**验收标准**:
1. WHILE 学习过程中，THE system SHALL 允许用户标记生词（点击单词或快捷键）
2. WHEN 生词被标记，THE system SHALL 加入生词本并记录上下文句子
3. The system SHALL 提供生词本管理功能：
   - 批量学习
   - 分类筛选（按课程/日期/难度）
   - 掌握后移除
   - 导出为单词表
4. WHILE 生词学习时，THE system SHALL 优先复习高频出现的生词

#### 5.3 掌握列表

**用户故事**: AS 学习者，I WANT 查看已完全掌握的内容，SO THAT 我有成就感并可跳过已会内容

**验收标准**:
1. WHEN 某句子/单词连续 3 次复习全对且响应时间<2 秒，THE system SHALL 标记为"已掌握"
2. WHILE 练习时，THE system SHALL 默认跳过已掌握内容
3. The system SHALL 允许用户手动标记/取消标记掌握状态
4. The system SHALL 在个人主页展示掌握数量统计

---

### 6. 社交与竞技功能

#### 6.1 PK 对战系统

**用户故事**: AS 学习者，I WANT 与其他用户实时对战，SO THAT 学习更有竞争乐趣

**验收标准**:
1. The system SHALL 提供 1v1 实时 PK 功能
2. The system SHALL 支持以下房间类型：
   - 公开房间：任何人可加入
   - 私密房间：通过房间号/链接邀请
   - 好友对战：从好友列表邀请
3. WHEN PK 开始，THE system SHALL 同步向双方展示相同题目
4. WHILE PK 进行中，THE system SHALL 实时显示：
   - 双方得分
   - 双方进度条
   - 剩余时间
5. WHEN PK 结束，THE system SHALL 显示：
   - 胜负结果
   - 详细数据对比（正确率、平均答题时间、连击数）
   - 积分变化
6. The system SHALL 提供积分系统，胜者加分，败者扣分

#### 6.2 排行榜系统

**用户故事**: AS 学习者，I WANT 查看自己在全站的排名，SO THAT 我有追赶目标

**验收标准**:
1. The system SHALL 提供以下排行榜：
   - 学习时长榜（今日/本周/本月/总榜）
   - 积分排行榜
   - 连续打卡榜
   - 掌握单词数榜
2. WHILE 用户查看排行榜，THE system SHALL 显示：
   - 前 100 名用户
   - 自己的排名（即使不在前 100）
   - 好友排名（如果已添加好友）
3. The system SHALL 每小时更新排行榜数据

#### 6.3 学习小组

**用户故事**: AS 学习者，I WANT 加入学习小组，SO THAT 我可以和朋友一起学习打卡

**验收标准**:
1. The system SHALL 允许用户创建/加入学习小组（最多 50 人/组）
2. WHILE 小组内，THE system SHALL 提供：
   - 小组动态：成员学习记录分享
   - 小组排行：组内成员学习时长排名
   - 打卡提醒：成员互相提醒学习
   - 小组目标：设定集体目标（如本周共学 100 小时）
3. WHEN 小组成员达成目标，THE system SHALL 解锁小组成就

---

### 7. 学习数据可视化

#### 7.1 成长记录

**用户故事**: AS 学习者，I WANT 看到自己的学习数据，SO THAT 我了解进步轨迹

**验收标准**:
1. The system SHALL 提供以下数据图表：
   - 学习热力图：日历视图，颜色深度表示学习时长
   - 成长曲线：学习天数、总时长、连续打卡趋势
   - 能力雷达图：听力/口语/阅读/写作/词汇五维能力
   - 课程进度：每个课程包的学习进度
2. WHILE 个人中心，THE system SHALL 展示高光时刻：
   - 最高连击记录
   - 最佳正确率
   - 最快答题速度
   - 总学习时长
   - 掌握单词数
3. The system SHALL 支持数据导出（周报/月报 PDF）

#### 7.2 学习分析

**用户故事**: AS 学习者，I WANT 了解自己的薄弱环节，SO THAT 我可以针对性提升

**验收标准**:
1. The system SHALL 分析用户的每次练习数据：
   - 每道题的答题时间
   - 错误类型分布
   - 时间段表现（上午/下午/晚上）
2. WHILE 分析报告，THE system SHALL 提供：
   - 薄弱知识点列表
   - 推荐复习内容
   - 学习效率建议
3. The system SHALL 每周生成学习报告并推送给用户

---

### 8. 用户系统与个性化

#### 8.1 个人资料

**用户故事**: AS 用户，I WANT 管理个人信息，SO THAT 我有专属的学习身份

**验收标准**:
1. The system SHALL 支持用户资料设置：
   - 头像上传
   - 昵称修改
   - 学习目标设定（考试/工作/兴趣）
   - 当前水平（CEFR A1-C2）
2. The system SHALL 根据用户水平推荐适合的课程难度

#### 8.2 个性化设置

**用户故事**: AS 用户，I WANT 自定义学习偏好，SO THAT 学习体验更适合我

**验收标准**:
1. The system SHALL 提供以下个性化选项：
   - 主题切换（深色/浅色模式）
   - 音效开关
   - 动画效果开关
   - 每日学习提醒时间
   - 默认学习模式
2. WHILE 学习中，THE system SHALL 记住用户的偏好设置

---

### 9. 商业化功能

#### 9.1 会员系统

**用户故事**: AS 用户，I WANT 了解会员权益，SO THAT 我可以决定是否购买

**验收标准**:
1. The system SHALL 提供会员等级：
   - 免费版：基础课程 + 每日 2 次 AI 提问
   - 月度会员：全部功能 + 无限 AI 提问
   - 年度会员：全部功能 + 专属客服
   - 永久会员：一次性购买，终身使用
2. WHEN 用户访问会员页面，THE system SHALL 展示：
   - 各等级权益对比
   - 价格信息
   - 用户评价

#### 9.2 金币与钻石系统

**用户故事**: AS 用户，I WANT 通过学习教育虚拟货币，SO THAT 我可以兑换会员或道具

**验收标准**:
1. The system SHALL 提供两种货币：
   - 金币：通过每日任务、打卡获得
   - 钻石：付费购买或成就奖励
2.金币可用于:
   - 兑换会员天数
   - 购买课程包
   - 兑换虚拟道具
3.钻石可用于:
   - 额外 AI 提问次数
   - 参与 PK 对战
   - 购买限定道具

#### 9.3 每日任务系统

**用户故事**: AS 用户，I WANT 完成每日任务获得奖励，SO THAT 我有持续学习的动力

**验收标准**:
1. The system SHALL 每日刷新以下任务:
   - 学习 15 分钟 (+50 金币)
   - 完成 3 个课程 (+30 金币)
   - 达到 10 连击 (+20 金币)
   - 参与 1 次 PK (+40 金币)
   - 复习 10 个单词 (+20 金币)
2. WHEN 任务完成，THE system SHALL 自动发放奖励
3. The system SHALL 提供连续 7 天完成任务的额外奖励

---

## 技术实现要求

### 后端架构升级

1. **新增数据表**:
   - `courses` - 用户创作课程主表
   - `course_items` - 课程句子/音频/视频内容
   - `user_achievements` - 用户成就记录
   - `combos` - 连击记录
   - `ratings` - 评级记录
   - `vocabulary_books` - 生词本
   - `pk_battles` - PK 对战记录
   - `study_groups` - 学习小组
   - `coins_transactions` - 金币流水
   - `ai_assistant_logs` - AI 助手对话日志

2. **新 API 接口**:
   - `/api/courses` - 课程 CRUD
   - `/api/practice/sentence` - 句子练习
   - `/api/combo` - 连击提交
   - `/api/rating` - 评级提交
   - `/api/review/due` - 待复习获取
   - `/api/vocabulary-book` - 生词本管理
   - `/api/pk/*` - PK 对战相关
   - `/api/leaderboard` - 排行榜
   - `/api/study-group/*` - 学习小组
   - `/api/ai/assistant` - AI 助手
   - `/api/statistics` - 学习数据

3. **Redis 缓存**:
   - 连击状态缓存（5 分钟过期）
   - 实时排行榜缓存（每小时更新）
   - PK 对战房间状态缓存

4. **WebSocket 支持**:
   - PK 对战实时同步
   - 学习小组动态推送

### 前端组件新增

1. **游戏化组件**:
   - `ComboDisplay.vue` - 连击展示
   - `RatingAnimation.vue` - 评级动画
   - `AchievementPopup.vue` - 成就解锁弹窗

2. **学习组件**:
   - `SentenceBuilder.vue` - 连词成句核心组件
   - `CourseEditor.vue` - 课程编辑器
   - `AIHelper.vue` - AI 助手悬浮窗

3. **社交组件**:
   - `PKArena.vue` - PK 对战界面
   - `Leaderboard.vue` - 排行榜
   - `StudyGroup.vue` - 学习小组

4. **数据组件**:
   - `LearningHeatmap.vue` - 学习热力图
   - `ProgressRadar.vue` - 能力雷达图
   - `AchievementWall.vue` - 成就墙

---

## 实施优先级

### Phase 1 (P0 - 核心功能，2 周)
1. 连词成句学习模式
2. 连击系统 + SSS 评级
3. 智能复习本
4. 生词本

### Phase 2 (P1 - 增强体验，2 周)
1. 多类型课程支持（音频/视频/音乐）
2. AI 智能助手
3. 课程编辑器
4. 学习数据可视化

### Phase 3 (P2 - 社交功能，2 周)
1. PK 对战系统
2. 排行榜
3. 学习小组
4. 每日任务系统

### Phase 4 (P3 - 商业化，1 周)
1. 会员系统
2. 金币钻石系统
3. 支付集成

---

## 成功指标

1. **用户参与度**:
   - 平均每日学习时长 > 30 分钟
   - 7 日留存率 > 50%
   - 30 日留存率 > 30%

2. **学习效果**:
   - 用户掌握单词数平均增长 > 100 个/月
   - 课程完成率 > 70%
   - 复习参与率 > 80%

3. **系统性能**:
   - 页面加载时间 < 2 秒
   - API 响应时间 < 500ms
   - PK 对战延迟 < 100ms
