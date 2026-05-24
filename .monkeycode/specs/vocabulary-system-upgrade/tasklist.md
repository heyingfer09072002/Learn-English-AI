# 词汇学习系统升级实施计划

- [x] 1. 创建词汇数据库表结构
  - [x] 1.1 创建词汇主表 (words)
    - 实现 words 表迁移（id, word, phonetic_uk, phonetic_us, difficulty_level, frequency_level）
    - 添加索引（word, difficulty_level, frequency_level）

  - [x] 1.2 创建词性表 (word_pos)
    - 实现 word_pos 表迁移（word_id, pos, definition_cn, definition_en, root_affix, memory_tip）
    - 添加外键约束和索引

  - [x] 1.3 创建例句表 (word_sentences)
    - 实现 word_sentences 表迁移（word_id, sentence_en, sentence_cn, audio_url）
    - 添加外键约束和索引

  - [x] 1.4 创建词汇关系表 (word_relations)
    - 实现同义词/反义词关系表
    - 添加唯一约束防止重复关系

  - [x] 1.5 创建词汇分类表 (word_categories)
    - 实现多维度分类表（theme, exam, pos, stage）
    - 添加复合索引支持分类查询

  - [x] 1.6 创建用户词汇进度表 (user_word_progress)
    - 实现进度表迁移（user_id, word_id, status, learned_times, error_times, next_review_at, mastery_level）
    - 添加唯一约束和索引

  - [x] 1.7 创建学习记录表 (learning_records)
    - 实现学习记录表（user_id, word_id, action_type, is_correct, time_spent, metadata）
    - 添加时间索引支持统计查询

  - [x] 2.1 创建词汇模型类 (`models/Vocabulary.model.ts`)
    - 实现 Word、WordPos、WordSentence 等接口定义
    - 实现 findById、findByWord 等查询方法
    - 实现批量插入方法

  - [ ] 2.2 创建词汇关系模型 (`models/WordRelation.model.ts`)
    - 实现同义词、反义词的增删查方法

  - [ ] 2.3 创建词汇分类模型 (`models/WordCategory.model.ts`)
    - 实现按类型查询词汇
    - 实现按分类获取词汇列表

  - [ ] 2.4 创建进度模型 (`models/UserWordProgress.model.ts`)
    - 实现进度查询和更新方法
    - 实现获取待复习词汇方法

- [ ] 3. 实现艾宾浩斯记忆算法
  - [x] 3.1 创建复习调度器 (`utils/review-scheduler.ts`)
    - 实现 REVIEW_INTERVALS 数组（5 分钟、30 分钟、12 小时等）
    - 实现 calculateNextReview 方法
    - 实现 getDueReviews 方法

  - [ ] 3.2 编写复习算法单元测试
    - 测试初次学习后的复习时间计算
    - 测试答错后的重新调度
    - 测试已掌握状态判断

- [ ] 4. 实现词汇导入工具
  - [x] 4.1 创建导入工具类 (`utils/vocabulary-importer.ts`)
    - 实现 JSON、CSV 格式解析
    - 实现数据验证（必填字段、格式校验）
    - 实现批量插入（每批 500 条）

  - [x] 4.2 实现重复检测和错误处理
    - 实现词汇重复检测
    - 实现导入失败回滚
    - 实现导入进度追踪

  - [x] 5.1 创建词汇分组控制器 (`controllers/vocabulary.controller.ts`)
    - 实现 GET /api/vocabulary/groups 获取分组列表
    - 实现 GET /api/vocabulary/groups/:id/words 获取分组词汇
    - 实现支持按类型筛选

  - [x] 5.2 实现词汇详情接口
    - 实现 GET /api/vocabulary/words/:id 获取完整详情
    - 实现关联数据（例句、同义词、反义词）加载

  - [x] 5.3 实现词汇搜索接口
    - 实现 GET /api/vocabulary/words/search 支持模糊搜索
    - 实现中文搜索支持
    - 实现分页和排序

  - [x] 5.4 实现学习行为记录接口
    - 实现 POST /api/vocabulary/words/:id/learn 记录学习
    - 实现 POST /api/vocabulary/words/:id/review 记录复习
    - 实现调用复习调度器计算下次复习时间

- [ ] 6. 实现练习接口
  - [ ] 6.1 实现拼写练习接口 (`controllers/vocabulary-practice.controller.ts`)
    - 实现 POST /api/vocabulary/practice/spelling
    - 实现答案比对（忽略大小写）
    - 实现错误分析

  - [ ] 6.2 实现选择题接口
    - 实现 POST /api/vocabulary/practice/choice
    - 实现智能生成干扰项（同主题/同难度）
    - 实现答案解析

  - [ ] 6.3 实现听力练习接口
    - 实现 POST /api/vocabulary/practice/listening
    - 实现听力答案验证

- [ ] 7. 实现进度统计接口
  - [ ] 7.1 实现进度查询 (`controllers/vocabulary-progress.controller.ts`)
    - 实现 GET /api/vocabulary/progress 获取总体进度
    - 实现按分组统计进度

  - [ ] 7.2 实现待复习查询
    - 实现 GET /api/vocabulary/review/due 获取今日待复习
    - 实现按日期范围查询

  - [ ] 7.3 实现统计接口
    - 实现 GET /api/vocabulary/statistics 获取学习统计
    - 实现学习趋势计算（日/周/月）
    - 实现掌握率分析

- [ ] 8. 实现前端词汇 API 客户端
  - [x] 8.1 扩展 API 客户端 (`src/api/index.ts`)
    - 添加 vocabulary 相关 API 方法
    - 定义词汇相关的请求和响应类型

  - [x] 9.1 创建词汇学习主页面 (`pages/VocabularyLearning.vue`)
    - 实现四种学习模式入口卡片
    - 实现词汇组选择器
    - 实现进度展示面板

  - [x] 10.1 创建卡片组件 (`components/vocabulary/CardMode.vue`)
    - 实现卡片翻转动画
    - 实现正面展示（单词 + 音标）
    - 实现背面展示（释义 + 例句 + 助记）

  - [x] 17.2 实现复习调度器测试
    - 测试艾宾浩斯算法正确性
    - 测试边界条件（已掌握、错误多次）

  - [x] 17.3 实现词汇控制器测试
    - 测试词汇分组接口
    - 测试词汇详情接口
    - 测试学习记录接口

  - [ ] 17.4 实现练习接口测试
    - 测试拼写练习答案判定
    - 测试选择题干扰项生成
    - 测试听力练习接口

- [ ] 18. 前端组件测试
  - [ ] 18.1 测试卡片背诵组件
    - 测试卡片翻转功能
    - 测试"认识"/"不认识"标记
    - 测试学习进度追踪

  - [ ] 18.2 测试拼写练习组件
    - 测试答案判定逻辑
    - 测试错误提示
    - 测试首字母提示

  - [ ] 18.3 测试选择题组件
    - 测试选项生成
    - 测试答案验证
    - 测试计分系统

  - [ ] 18.4 测试听力辨音组件
    - 测试音频播放
    - 测试答题逻辑

- [ ] 19. 检查点 - 验证测试覆盖率
  - 确保词汇模块测试覆盖率达到 80% 以上，如有疑问请询问用户

- [ ] 20. 性能优化
  - [ ] 20.1 实现词汇查询缓存
    - 使用 Redis 缓存词汇详情（1 小时）
    - 使用 Redis 缓存词汇列表（10 分钟）

  - [ ] 20.2 实现音频 CDN 加速
    - 配置音频文件 CDN
    - 实现 CDN 回退机制

  - [ ] 20.3 实现分页和虚拟滚动
    - 词汇列表分页加载（20/50/100 条选项）
    - 长列表使用虚拟滚动优化

- [ ] 21. 实现深色模式支持
  - [ ] 21.1 添加词汇页面深色样式
    - 实现主题切换按钮
    - 实现深色模式样式

---

**创建时间**: 2026-05-24
**关联设计**: `.monkeycode/specs/vocabulary-system-upgrade/design.md`
