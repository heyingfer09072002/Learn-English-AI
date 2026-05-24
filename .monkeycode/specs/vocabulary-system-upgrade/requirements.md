# Requirements Document

## Introduction

本需求文档定义 EnglishAI 平台词汇学习系统的全面升级需求，包括词汇库扩充至六级水平（6000 词）、多维度科学分组、词汇数据完善、以及四种学习模式的词汇学习页面。升级后的系统将为用户提供更系统、更科学、更高效的词汇学习体验。

## Glossary

- **System**: EnglishAI 词汇学习系统
- **六级词汇**: 大学英语六级考试大纲词汇，约 5500-6000 词
- **多维度分组**: 基于主题、难度、词性、学习阶段等多个维度的词汇分类方式
- **卡片背诵模式**: 闪卡式词汇记忆学习模式
- **拼写练习模式**: 听音/看义拼写单词的练习模式
- **选择题测试模式**: 多项选择题形式的词汇测试模式
- **听力辨音模式**: 听音辨义的听力训练模式
- **科学分组**: 基于艾宾浩斯记忆曲线和词汇学习理论的分组的分组方式
- **词汇画像**: 包含音标、词性、释义、例句、同反义词等完整信息的词汇数据结构

## Requirements

### Requirement 1: 词汇库扩充至 6000 词

**User Story:** AS 六级备考学习者，I WANT 完整的六级词汇库，SO THAT 我可以系统学习所有考试要求的词汇

#### Acceptance Criteria

1. 词汇库 SHALL 包含至少 6000 个六级考试核心词汇
2. 词汇来源 SHALL 基于权威六级词汇大纲（新东方或星火）
3. 词汇总表 SHALL 去重并标准化拼写（英式/美式拼写统一）
4. 词汇频率 SHALL 标注每个词汇在六级考试中的出现频率（高频、中频、低频）
5. 词汇分级 SHALL 按 CET-4、CET-6、考研、TOEFL、IELTS 等考试标注词汇归属
6. IF 词汇存在多种词性，系统 SHALL 为每种词性创建独立条目

### Requirement 2: 词汇信息完整性

**User Story:** AS 学习者，I WANT 每个词汇的详细信息，SO THAT 我可以全面理解和掌握词汇

#### Acceptance Criteria

1. 每个词汇条目 SHALL 包含音标（IPA 国际音标，同时标注英式和美式发音）
2. 每个词汇条目 SHALL 包含词性标注（noun、verb、adjective、adverb 等）
3. 每个词汇条目 SHALL 包含中文释义（至少 1 个，最多 5 个常用释义）
4. 每个词汇条目 SHALL 包含英文释义（柯林斯或朗文风格）
5. 每个词汇条目 SHALL 包含至少 2 个英文例句（带中文翻译）
6. 每个词汇条目 SHALL 包含至少 2 个同义词（如存在）
7. 每个词汇条目 SHALL 包含至少 2 个反义词（如存在）
8. 每个词汇条目 SHALL 包含词汇难度等级（1-10 级，1 为最简单）
9. 每个词汇条目 SHALL 包含助记信息（词根词缀、联想记忆等）
10. 每个词汇条目 SHALL 包含音频 URL（英音和美音各一个）

### Requirement 3: 多维度词汇分组

**User Story:** AS 学习者，I WANT 按多种维度浏览和选择词汇，SO THAT 我可以根据自己的学习重点选择词汇组

#### Acceptance Criteria

1. 系统 SHALL 支持按主题分类（日常对话、商务、学术、科技、文化、健康、旅行、娱乐等 8 大主题）
2. 系统 SHALL 支持按词频分级（高频词、中频词、低频词）
3. 系统 SHALL 支持按词性分类（名词、动词、形容词、副词、介词、连词等）
4. 系统 SHALL 支持按学习阶段分类（入门、初级、中级、高级、精通）
5. 系统 SHALL 支持按考试类型分类（CET-4、CET-6、考研、TOEFL、IELTS）
6. 系统 SHALL 支持用户自定义词汇本（生词本、易错本、收藏本）
7. WHEN 词汇属于多个分类，系统 SHALL 在所有相关分类中展示该词汇
8. IF 用户开始学习某个分组，系统 SHALL 记录学习进度

### Requirement 4: 词汇学习路线

**User Story:** AS 学习者，I WANT 科学的学习路线，SO THAT 我可以遵循记忆规律高效学习

#### Acceptance Criteria

1. 系统 SHALL 基于艾宾浩斯记忆曲线规划复习时间（学习后 5 分钟、30 分钟、12 小时、1 天、2 天、4 天、7 天、15 天）
2. 系统 SHALL 根据用户掌握的词汇量推荐下一阶段的学习内容
3. 系统 SHALL 提供每日学习计划（根据用户设定的每日目标词汇量）
4. 系统 SHALL 根据用户的学习表现动态调整词汇难度
5. 系统 SHALL 对于连续错误的词汇自动增加复习频率
6. 系统 SHALL 对于快速掌握的词汇减少重复次数
7. WHILE 用户学习过程中，系统 SHALL 实时显示学习进度和预计完成时间
8. WHEN 用户完成一个阶段学习，系统 SHALL 生成学习报告（掌握率、错误率、用时）

### Requirement 5: 卡片背诵模式

**User Story:** AS 学习者，I WANT 卡片背诵功能，SO THAT 我可以通过闪卡方式快速记忆词汇

#### Acceptance Criteria

1. WHEN 用户进入卡片模式，系统 SHALL 展示单词正面（英文单词 + 音标）
2. WHEN 用户点击卡片，系统 SHALL 翻转展示背面（词性 + 中英文释义 + 例句）
3. WHEN 用户点击"认识"按钮，系统 SHALL 标记该词汇为已掌握并进入下一词
4. WHEN 用户点击"不认识"按钮，系统 SHALL 标记该词汇为生词并加入复习队列
5. WHEN 用户点击"例句"按钮，系统 SHALL 播放例句音频
6. WHILE 卡片展示时，系统 SHALL 支持键盘快捷键（空格翻转、左右箭头标记认识/不认识）
7. IF 词汇包含词根词缀，系统 SHALL 在卡片背面展示助记信息
8. WHEN 一组卡片学习完成，系统 SHALL 统计掌握情况并显示结果

### Requirement 6: 拼写练习模式

**User Story:** AS 学习者，I WANT 拼写练习功能，SO THAT 我可以训练正确的单词拼写能力

#### Acceptance Criteria

1. WHEN 用户进入拼写模式，系统 SHALL 播放词汇音频或展示中文释义
2. WHEN 用户输入拼写，系统 SHALL 实时显示输入的字符
3. WHEN 用户提交答案，系统 SHALL 立即判断正误
4. IF 拼写正确，系统 SHALL 显示正确提示并自动进入下一词
5. IF 拼写错误，系统 SHALL 高亮显示错误字母并展示正确拼写
6. WHEN 同一词汇拼写错误超过 3 次，系统 SHALL 提供首字母提示
7. WHILE 用户输入时，系统 SHALL 支持退格删除和重新输入
8. WHEN 一组练习完成，系统 SHALL 显示拼写正确率和错误词汇列表

### Requirement 7: 选择题测试模式

**User Story:** AS 学习者，I WANT 选择题测试功能，SO THAT 我可以检验词汇掌握程度

#### Acceptance Criteria

1. WHEN 用户进入选择题模式，系统 SHALL 展示题干（英文单词或中文释义）
2. WHEN 系统生成选项，系统 SHALL 提供 4 个选项（1 个正确答案 + 3 个干扰项）
3. 干扰项 SHALL 来自同主题或同难度级别的词汇
4. WHEN 用户选择答案，系统 SHALL 立即反馈正误
5. IF 答案正确，系统 SHALL 显示绿色高亮并加分
6. IF 答案错误，系统 SHALL 显示红色高亮正确答案并给出解析
7. WHEN 一组测试完成，系统 SHALL 显示得分、正确率、用时排行榜
8. WHILE 答题过程中，系统 SHALL 显示当前题号和剩余题数

### Requirement 8: 听力辨音模式

**User Story:** AS 学习者，I WANT 听力辨音功能，SO THAT 我可以提高词汇的听力识别能力

#### Acceptance Criteria

1. WHEN 用户进入听力模式，系统 SHALL 仅播放音频而不展示文字
2. 用户 SHALL 可以重复播放音频最多 3 次
3. WHEN 用户作答时，系统 SHALL 提供 4 个文字选项（英文单词或中文释义）
4. WHEN 用户选择答案后，系统 SHALL 展示完整词汇信息（拼写、音标、释义）
5. IF 答案正确，系统 SHALL 播放正确提示音
6. IF 答案错误，系统 SHALL 播放错误提示音并展示正确答案
7. WHILE 音频播放时，系统 SHALL 展示播放进度条
8. WHEN 一组练习完成，系统 SHALL 显示听力正确率

### Requirement 9: 词汇学习页面重构

**User Story:** AS 用户，I WANT 统一的词汇学习页面，SO THAT 我可以在一个地方访问所有学习模式

#### Acceptance Criteria

1. 词汇学习页面 SHALL 展示四种学习模式的入口卡片
2. 页面 SHALL 显示当前词汇组的总体学习进度（已学/总数/掌握率）
3. 页面 SHALL 提供词汇筛选功能（按主题、难度、词性、掌握程度）
4. 页面 SHALL 提供搜索功能（支持英文模糊搜索和中文搜索）
5. 页面 SHALL 展示学习统计（今日学习、本周学习、词汇量增长曲线）
6. WHILE 学习中，页面 SHALL 支持随时暂停和继续
7. WHEN 用户切换学习模式，系统 SHALL 保持当前词汇组和进度
8. IF 用户中断学习，系统 SHALL 自动保存进度以便下次继续

### Requirement 10: 词汇数据库表设计

**User Story:** AS 开发者，I WANT 合理的数据库表结构，SO THAT 词汇数据可以高效存储和查询

#### Acceptance Criteria

1. 词汇主表 (words) SHALL 包含基础字段（id、word、phonetic_uk、phonetic_us、difficulty_level、created_at）
2. 词性表 (word_pos) SHALL 存储每个词汇的多种词性（id、word_id、pos、definition_cn、definition_en）
3. 例句表 (sentences) SHALL 存储词汇例句（id、word_id、sentence_en、sentence_cn、audio_url）
4. 同义词表 (synonyms) SHALL 存储同义词关系（id、word_id、synonym_word_id、similarity_score）
5. 反义词表 (antonyms) SHALL 存储反义词关系（id、word_id、antonym_word_id）
6. 词汇分类表 (word_categories) SHALL 存储多维度分类（id、word_id、category_type、category_value、is_primary）
7. 词汇音频表 (word_audio) SHALL 存储音频 URL（id、word_id、audio_uk_url、audio_us_url）
8. 助记表 (mnemonics) SHALL 存储助记信息（id、word_id、root_affix、memory_tip）
9. 所有表 SHALL 建立合适的索引以支持高频查询
10. SHALL 使用外键约束维护数据完整性

### Requirement 11: 词汇数据导入工具

**User Story:** AS 开发者，I WANT 批量数据导入工具，SO THAT 我可以高效导入 6000 词汇数据

#### Acceptance Criteria

1. 导入工具 SHALL 支持 JSON、CSV、Excel 格式的数据源文件
2. 导入工具 SHALL 验证数据完整性（必填字段、格式校验）
3. 导入工具 SHALL 支持断点续传和中途失败回滚
4. 导入工具 SHALL 显示导入进度和统计信息
5. 导入工具 SHALL 检测并处理重复词汇
6. 导入工具 SHALL 支持预览待导入数据
7. WHEN 导入完成，系统 SHALL 生成导入报告和错误日志
8. IF 数据验证失败，系统 SHALL 提示具体错误行和错误原因
9. 导入工具 SHALL 支持分批导入（每批 500 条）

### Requirement 12: 词汇学习进度追踪

**User Story:** AS 学习者，I WANT 追踪我的词汇学习进度，SO THAT 我可以了解自己的学习效果

#### Acceptance Criteria

1. 系统 SHALL 记录每个词汇的学习状态（未学、学习中、已掌握、需复习）
2. 系统 SHALL 记录每个词汇的最后学习时间
3. 系统 SHALL 记录每个词汇的复习次数和错误次数
4. 系统 SHALL 根据艾宾浩斯曲线计算下次复习时间
5. 系统 SHALL 提供词汇量统计（总词汇量、已掌握、学习中、待复习）
6. 系统 SHALL 提供学习趋势图表（日/周/月学习量）
7. 系统 SHALL 提供掌握率分析（按主题、难度、词性维度）
8. WHEN 用户登录，系统 SHALL 显示今日待复习词汇数

### Requirement 13: API 接口设计

**User Story:** AS 前端开发者，I WANT 完整的词汇学习 API，SO THAT 我可以实现学习功能

#### Acceptance Criteria

1. GET `/api/vocabulary/groups` SHALL 返回词汇分组列表（支持按类型筛选）
2. GET `/api/vocabulary/groups/:id/words` SHALL 返回分组下的词汇列表（支持分页）
3. GET `/api/vocabulary/words/:id` SHALL 返回词汇完整详情（包含所有字段）
4. POST `/api/vocabulary/words/:id/learn` SHALL 记录学习行为
5. POST `/api/vocabulary/words/:id/review` SHALL 记录复习结果
6. GET `/api/vocabulary/progress` SHALL 返回用户学习进度统计
7. GET `/api/vocabulary/review/due` SHALL 返回今日待复习词汇列表
8. POST `/api/vocabulary/practice/spelling` SHALL 提交拼写练习答案
9. POST `/api/vocabulary/practice/choice` SHALL 提交选择题答案
10. POST `/api/vocabulary/practice/listening` SHALL 提交听力练习答案

### Requirement 14: 性能要求

**User Story:** AS 用户，I WANT 快速响应的学习体验，SO THAT 我可以流畅学习不被卡顿打断

#### Acceptance Criteria

1. 词汇查询 API 响应时间 SHALL 小于 100ms（P95）
2. 词汇列表分页加载 SHALL 支持每页 20/50/100 条选项
3. 音频资源 SHALL 使用 CDN 加速，延迟小于 500ms
4. 学习进度保存 SHALL 使用异步方式，不阻塞用户操作
5. 系统 SHALL 支持至少 1000 并发用户同时学习
6. 词汇搜索 SHALL 支持模糊匹配，响应时间小于 200ms
7. 学习统计查询 SHALL 使用缓存，刷新间隔 5 分钟

## 非功能性需求

### Usability

1. 词汇卡片设计 SHALL 遵循简洁、清晰、重点突出的原则
2. 学习页面 SHALL 支持深色模式和浅色模式切换
3. 所有学习模式 SHALL 支持键盘快捷键操作
4. 学习进度 SHALL 实时可视化展示（进度条、图表）

### Accessibility

1. 所有图片和图标 SHALL 包含 alt 文本描述
2. 音频播放 SHALL 提供文字转录
3. 颜色使用 SHALL 符合 WCAG 2.1 AA 对比度标准
4. 页面 SHALL 支持屏幕阅读器

### Maintainability

1. 所有词汇数据 SHALL 使用 JSON Schema 验证格式
2. 数据库变更 SHALL 使用迁移脚本管理版本
3. 代码注释 SHALL 包含字段说明和业务逻辑解释
4. 测试用例 SHALL 覆盖所有学习模式的主要流程

---

**文档状态**: 草稿
**最后更新**: 2026-05-24
**版本**: 1.0
