# 句乐部游戏化学习系统设计文档

Feature Name: julebu-clone  
Updated: 2026-05-25

## 1. 系统描述

本设计基于现有 Learn-English-AI 项目进行升级，在现有词汇学习功能基础上，增加句乐部 (julebu.co) 的核心游戏化学习机制，打造沉浸式英语学习体验。

### 核心设计理念

1. **游戏化驱动学习**：通过连击、评级、成就系统激发学习动力
2. **句子为核心单位**：在真实语境中学习，而非孤立背单词
3. **AI 智能辅助**：实时答疑、个性化学习路径
4. **社交化学习**：PK 对战、学习小组增强互动性

## 2. 系统架构

### 2.1 整体架构图

```mermaid
graph TB
    subgraph Client["前端 Vue 3 + TypeScript"]
        UI[用户界面]
        GC[游戏化组件]
        LC[学习组件]
        SC[社交组件]
        DC[数据组件]
    end
    
    subgraph Gateway["API Gateway"]
        RT[路由分发]
        AM[认证中间件]
        VM[验证中间件]
        EM[错误处理]
    end
    
    subgraph Backend["后端 Node.js + Express"]
        MC[模型控制器]
        PC[练习控制器]
        CC[课程控制器]
        AC[AI 控制器]
        SOC[社交控制器]
    end
    
    subgraph Data["数据层"]
        PgDB[(PostgreSQL)]
        Redis[(Redis - 缓存)]
        WS[WebSocket 服务]
    end
    
    subgraph AI["AI 服务"]
        ChatAPI[OpenAI API]
        SpeechAPI[TTS/STT]
    end
    
    UI --> RT
    RT --> AM
    AM --> VM
    VM --> MC
    VM --> PC
    VM --> CC
    VM --> AC
    VM --> SOC
    
    MC --> PgDB
    PC --> PgDB
    PC --> Redis
    CC --> PgDB
    AC --> ChatAPI
    SOC --> WS
    SOC --> Redis
```

### 2.2 技术栈

| 层级 | 技术 | 用途 |
|------|------|------|
| **前端** | Vue 3.5.34 + TypeScript | 渐进式框架 |
| **状态管理** | Pinia | 全局状态管理 |
| **UI 框架** | Tailwind CSS 4.3.0 | 原子化 CSS |
| **路由** | Vue Router 4.6.4 | 客户端路由 |
| **HTTP** | Axios 1.16.1 | API 客户端 |
| **后端** | Node.js 18+ + Express | Web 服务器 |
| **数据库** | PostgreSQL 15 | 关系型数据库 |
| **缓存** | Redis 7 | 实时数据缓存 |
| **实时通信** | Socket.io 4.x | WebSocket |
| **AI** | OpenAI SDK | 智能助手 |
| **测试** | Vitest 1.1.0 | 单元测试 |

## 3. 组件和接口

### 3.1 前端组件结构

```
frontend/src/
├── components/
│   ├── game/
│   │   ├── ComboDisplay.vue         # 连击展示
│   │   ├── RatingAnimation.vue      # SSS 评级动画
│   │   ├── AchievementPopup.vue     # 成就解锁弹窗
│   │   └── ProgressBar.vue          # 进度条
│   ├── learning/
│   │   ├── SentenceBuilder.vue      # 连词成句核心组件
│   │   ├── ModeSelector.vue         # 学习模式切换
│   │   ├── AudioPlayer.vue          # 音频播放
│   │   ├── VideoPlayer.vue          # 视频播放
│   │   └── WordHighlight.vue        # 单词高亮
│   ├── course/
│   │   ├── CourseCard.vue           # 课程卡片
│   │   ├── CourseEditor.vue         # 课程编辑器
│   │   ├── CourseList.vue           # 课程列表
│   │   └── CoursePreview.vue        # 课程预览
│   ├── social/
│   │   ├── PKArena.vue              # PK 对战
│   │   ├── Leaderboard.vue          # 排行榜
│   │   └── StudyGroup.vue           # 学习小组
│   ├── ai/
│   │   ├── AIHelper.vue             # AI 助手悬浮窗
│   │   └── ChatPanel.vue            # AI 对话面板
│   └── stats/
│       ├── LearningHeatmap.vue      # 学习热力图
│       ├── ProgressRadar.vue        # 能力雷达图
│       └── AchievementWall.vue      # 成就墙
├── pages/
│   ├── Home.vue                     # 首页（课程广场）
│   ├── Learning.vue                 # 学习主页
│   ├── Vocabulary.vue               # 词汇学习
│   ├── CourseEditor.vue             # 课程创作
│   ├── Practice.vue                 # 练习页面
│   ├── PK.vue                       # PK 对战页
│   ├── Leaderboard.vue              # 排行榜页
│   ├── Profile.vue                  # 个人中心
│   └── Login.vue                    # 登录页
└── stores/
    ├── userStore.ts                 # 用户状态
    ├── comboStore.ts                # 连击状态
    ├── learningStore.ts             # 学习进度
    └── courseStore.ts               # 课程数据
```

### 3.2 后端接口分层

```
backend/src/
├── controllers/
│   ├── auth.controller.ts            # 用户认证
│   ├── user.controller.ts             # 用户信息
│   ├── practice.controller.ts         # 练习记录
│   ├── sentence.controller.ts         # 句子学习
│   ├── course.controller.ts           # 课程管理
│   ├── ai.controller.ts               # AI 助手
│   ├── pk.controller.ts               # PK 对战
│   ├── leaderboard.controller.ts      # 排行榜
│   ├── vocabulary.controller.ts       # 词汇学习
│   └── statistics.controller.ts       # 学习统计
├── models/
│   ├── User.model.ts                 # 用户模型
│   ├── Sentence.model.ts             # 句子模型
│   ├── Course.model.ts               # 课程模型
│   ├── PracticeRecord.model.ts       # 练习记录模型
│   ├── Combo.model.ts                # 连击记录
│   ├── Achievement.model.ts          # 成就模型
│   ├── PKBattle.model.ts             # PK 对战模型
│   └── Vocabulary.model.ts           # 词汇模型（已有）
├── services/
│   ├── combo.service.ts              # 连击计算服务
│   ├── rating.service.ts             # 评级计算
│   ├── review.service.ts             # 复习调度
│   ├── ai.service.ts                 # AI 助手服务
│   ├── course-creator.service.ts     # 课程创建服务
│   └── statistics.service.ts         # 统计服务
└── middleware/
    ├── auth.middleware.ts            # JWT 认证（已有）
    ├── rateLimit.middleware.ts       # 限流
    └── error.middleware.ts           # 错误处理（已有）
```

## 4. 数据模型设计

### 4.1 新增数据库表

#### 4.1.1 sentences - 句子表

```sql
CREATE TABLE sentences (
    id SERIAL PRIMARY KEY,
    course_id INTEGER REFERENCES courses(id) ON DELETE CASCADE,
    content_en TEXT NOT NULL,                    -- 英文原句
    content_cn TEXT,                              -- 中文翻译
    audio_url VARCHAR(500),                       -- 音频 URL
    video_url VARCHAR(500),                       -- 视频 URL
    difficulty_level INTEGER DEFAULT 1,           -- 难度级别 1-5
    word_count INTEGER,                           -- 单词数量
    estimated_time INTEGER,                       -- 预计用时（秒）
    sort_order INTEGER,                           -- 课程内排序
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

#### 4.1.2 courses - 课程表

```sql
CREATE TABLE courses (
    id SERIAL PRIMARY KEY,
    title VARCHAR(200) NOT NULL,                 -- 课程标题
    description TEXT,                             -- 课程描述
    cover_image VARCHAR(500),                     -- 封面图
    author_id INTEGER REFERENCES users(id),       -- 作者
    course_type VARCHAR(20),                      -- text/audio/video/music
    difficulty_level VARCHAR(20),                 -- beginner/intermediate/advanced
    target_audience VARCHAR(100),                 -- 目标人群
    language_level VARCHAR(10),                   -- CEFR A1-C2
    total_sentences INTEGER DEFAULT 0,            -- 句子总数
    estimated_duration INTEGER,                   -- 预计总时长（分钟）
    is_public BOOLEAN DEFAULT FALSE,              -- 是否公开
    status VARCHAR(20) DEFAULT 'draft',           -- draft/pending/published
    view_count INTEGER DEFAULT 0,                 -- 浏览数
    study_count INTEGER DEFAULT 0,                -- 学习数
    like_count INTEGER DEFAULT 0,                 -- 点赞数
    tags TEXT[],                                  -- 标签数组
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

#### 4.1.3 user_practice_records - 用户练习记录

```sql
CREATE TABLE user_practice_records (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    sentence_id INTEGER REFERENCES sentences(id) ON DELETE CASCADE,
    course_id INTEGER REFERENCES courses(id),
    practice_mode VARCHAR(30),                    -- sentence_builder/dictation/listening/speaking
    answer_text TEXT,                             -- 用户答案
    is_correct BOOLEAN,                           -- 是否正确
    time_spent INTEGER,                           -- 用时（毫秒）
    attempt_count INTEGER DEFAULT 1,              -- 尝试次数
    accuracy DECIMAL(5,4),                        -- 准确率
    combo_count INTEGER DEFAULT 0,                -- 连击数
    rating VARCHAR(10),                           -- C/B/A/S/SS/SSS
    score INTEGER,                                -- 得分
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_practice_user ON user_practice_records(user_id);
CREATE INDEX idx_practice_sentence ON user_practice_records(sentence_id);
CREATE INDEX idx_practice_created ON user_practice_records(created_at);
```

#### 4.1.4 user_combos - 连击记录表

```sql
CREATE TABLE user_combos (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    session_id UUID NOT NULL,                     -- 练习轮次 ID
    max_combo INTEGER DEFAULT 0,                  -- 最高连击
    current_combo INTEGER DEFAULT 0,              -- 当前连击
    is_active BOOLEAN DEFAULT TRUE,               -- 是否活跃
    started_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    ended_at TIMESTAMP,                           -- 连击中断时间
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

#### 4.1.5 user_ratings - 评级记录表

```sql
CREATE TABLE user_ratings (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    course_id INTEGER REFERENCES courses(id),
    sentence_id INTEGER REFERENCES sentences(id),
    rating VARCHAR(10) NOT NULL,                  -- C/B/A/S/SS/SSS
    accuracy DECIMAL(5,4),                        -- 正确率
    best_combo INTEGER,                           -- 最佳连击
    average_time INTEGER,                         -- 平均用时（毫秒）
    rating_type VARCHAR(20),                      -- course_daily_practice
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(user_id, course_id, rating_type, created_at::date)
);
```

#### 4.1.6 user_achievements - 成就表

```sql
CREATE TABLE user_achievements (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    achievement_key VARCHAR(100) NOT NULL,        -- 成就标识
    achievement_level VARCHAR(20),                -- bronze/silver/gold/platinum
    progress INTEGER DEFAULT 0,                   -- 当前进度
    target INTEGER NOT NULL,                      -- 目标值
    is_unlocked BOOLEAN DEFAULT FALSE,            -- 是否解锁
    unlocked_at TIMESTAMP,                        -- 解锁时间
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(user_id, achievement_key)
);
```

#### 4.1.7 vocabulary_books - 生词本

```sql
CREATE TABLE vocabulary_books (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    word_id INTEGER REFERENCES words(id) ON DELETE CASCADE,
    sentence_id INTEGER REFERENCES sentences(id), -- 来源句子
    note TEXT,                                    -- 用户笔记
    mastery_level INTEGER DEFAULT 0,              -- 掌握度 0-100
    review_count INTEGER DEFAULT 0,               -- 复习次数
    last_reviewed_at TIMESTAMP,                   -- 最后复习时间
    next_review_at TIMESTAMP,                     -- 下次复习时间
    is_mastered BOOLEAN DEFAULT FALSE,            -- 已掌握
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(user_id, word_id)
);
```

#### 4.1.8 pk_battles - PK 对战表

```sql
CREATE TABLE pk_battles (
    id SERIAL PRIMARY KEY,
    room_id VARCHAR(50) UNIQUE NOT NULL,          -- 房间号
    player1_id INTEGER REFERENCES users(id),      -- 玩家 1
    player2_id INTEGER REFERENCES users(id),      -- 玩家 2
    winner_id INTEGER REFERENCES users(id),       -- 胜者
    player1_score INTEGER DEFAULT 0,              -- 玩家 1 得分
    player2_score INTEGER DEFAULT 0,              -- 玩家 2 得分
    player1_accuracy DECIMAL(5,4),                -- 玩家 1 正确率
    player2_accuracy DECIMAL(5,4),                -- 玩家 2 正确率
    status VARCHAR(20) DEFAULT 'waiting',         -- waiting/playing/finished
    total_rounds INTEGER,                         -- 总轮数
    completed_rounds INTEGER DEFAULT 0,           -- 已完成轮数
    started_at TIMESTAMP,                         -- 开始时间
    finished_at TIMESTAMP,                        -- 结束时间
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

#### 4.1.9 study_groups - 学习小组

```sql
CREATE TABLE study_groups (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,                   -- 小组名称
    description TEXT,                             -- 描述
    owner_id INTEGER REFERENCES users(id),        -- 组长
    max_members INTEGER DEFAULT 50,               -- 最大人数
    is_public BOOLEAN DEFAULT TRUE,               -- 是否公开
    total_study_time INTEGER DEFAULT 0,           -- 总学习时长（分钟）
    target_weekly_time INTEGER,                   -- 周目标时长
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE study_group_members (
    id SERIAL PRIMARY KEY,
    group_id INTEGER REFERENCES study_groups(id) ON DELETE CASCADE,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    role VARCHAR(20) DEFAULT 'member',            -- owner/admin/member
    joined_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(group_id, user_id)
);
```

#### 4.1.10 user_coins_transactions - 金币流水

```sql
CREATE TABLE user_coins_transactions (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    transaction_type VARCHAR(30) NOT NULL,        -- earn/spend
    coin_type VARCHAR(20) NOT NULL,               -- gold/diamond
    amount INTEGER NOT NULL,                      -- 金额（正数增加，负数减少）
    balance_after INTEGER,                        -- 交易后余额
    source VARCHAR(100),                          -- 来源（daily_task/achievement/pk/refund）
    description TEXT,                             -- 描述
    reference_id INTEGER,                         -- 关联 ID（任务 ID/成就 ID 等）
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_coin_user ON user_coins_transactions(user_id);
```

#### 4.1.11 ai_assistant_logs - AI 助手日志

```sql
CREATE TABLE ai_assistant_logs (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id),
    sentence_id INTEGER REFERENCES sentences(id), -- 当前学习的句子
    question TEXT NOT NULL,                       -- 用户问题
    answer TEXT NOT NULL,                         -- AI 回答
    token_used INTEGER,                           -- 消耗 token 数
    response_time INTEGER,                        -- 响应时间（毫秒）
    is_collected BOOLEAN DEFAULT FALSE,           -- 是否收藏
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### 4.2 TypeScript 接口定义

#### 前端关键接口

```typescript
// 连击状态接口
export interface ComboState {
  count: number;
  maxCombo: number;
  multiplier: number;
  isPerfect: boolean;
}

// 评级接口
export type RatingLevel = 'C' | 'B' | 'A' | 'S' | 'SS' | 'SSS';

export interface PracticeRating {
  level: RatingLevel;
  accuracy: number;
  averageTime: number;
  bestCombo: number;
  score: number;
}

// 句子学习接口
export interface Sentence {
  id: number;
  courseId: number;
  contentEn: string;
  contentCn: string;
  audioUrl?: string;
  videoUrl?: string;
  difficultyLevel: number;
  wordCount: number;
  sortOrder: number;
  words: SentenceWord[];          // 句子拆解的单词
}

// 句子拆分单词接口
export interface SentenceWord {
  word: string;
  pos?: string;
  phonetic?: string;
  definition?: string[];
  startTime?: number;             // 音频中的开始时间
  endTime?: number;               // 音频中的结束时间
}

// 课程接口
export interface Course {
  id: number;
  title: string;
  description: string;
  coverImage?: string;
  authorId: number;
  authorName?: string;
  courseType: 'text' | 'audio' | 'video' | 'music';
  difficultyLevel: 'beginner' | 'intermediate' | 'advanced';
  totalSentences: number;
  estimatedDuration: number;
  isPublic: boolean;
  status: 'draft' | 'pending' | 'published';
  viewCount: number;
  studyCount: number;
  likeCount: number;
  tags: string[];
}

// 学习进度接口
export interface LearningProgress {
  courseId: number;
  completedSentences: number;
  totalSentences: number;
  accuracy: number;
  bestRating: RatingLevel;
  lastPracticedAt: Date;
}

// PK 对战接口
export interface PKBattle {
  roomId: string;
  player1: PKPlayer;
  player2: PKPlayer;
  status: 'waiting' | 'playing' | 'finished';
  totalRounds: number;
  completedRounds: number;
  currentRound: number;
}

export interface PKPlayer {
  id: number;
  username: string;
  score: number;
  accuracy: number;
  combo: number;
  isReady: boolean;
}

// AI 助手接口
export interface AIAssistant {
  ask(question: string, context?: AIContext): Promise<AIResponse>;
  analyzeSentence(sentenceId: number): Promise<SentenceAnalysis>;
}

export interface AIContext {
  sentenceId?: number;
  courseId?: number;
  wordId?: number;
}

export interface AIResponse {
  answer: string;
  sources?: string[];
  examples?: string[];
}
```

## 5. 正确性属性

### 5.1 连击计算不变量

```typescript
// 连击数计算属性
interface ComboInvariants {
  // 1. 连击数始终 >= 0
  count >= 0;
  
  // 2. 最大连击 >= 当前连击
  maxCombo >= count;
  
  // 3. 连击倍数与连击数的关系
  multipler === 1.0 when count < 5;
  multiplier === 1.2 when count >= 5 && count < 10;
  multiplier === 1.5 when count >= 10 && count < 20;
  multiplier === 2.0 when count >= 20;
  
  // 4. 连击中断后状态重置
  onWrongAnswer: {
    count = 0;
    isPerfect = false;
    // maxCombo 保持不变
  }
}
```

### 5.2 评级计算不变量

```typescript
// 评级计算属性
interface RatingInvariants {
  // 1. 评级必须基于准确率和平均时间
  accuracy >= 0.95 && avgTime < 3000  => 'SSS';
  accuracy >= 0.90 && accuracy < 0.95 => 'SS';
  accuracy >= 0.80 && accuracy < 0.90 => 'S';
  accuracy >= 0.70 && accuracy < 0.80 => 'A';
  accuracy >= 0.60 && accuracy < 0.70 => 'B';
  accuracy < 0.60                      => 'C';
  
  // 2. 评级一旦确定不可更改
  createdAt 后 rating 字段 immutable;
  
  // 3. 每日评级记录唯一性
  UNIQUE(user_id, course_id, rating_type, DATE(created_at));
}
```

### 5.3 复习调度不变量

```typescript
// 艾宾浩斯复习调度属性
interface ReviewSchedulerInvariants {
  // 1. 复习间隔单调递增
  REVIEW_INTERVALS[i] < REVIEW_INTERVALS[i+1];
  
  // 2. 答错则 5 分钟后复习
  if !isCorrect then nextReview = now + 5min;
  
  // 3. 掌握度计算
  masteryLevel = min((accuracy * progressWeight) * 100, 100);
  
  // 4. 已掌握不需要复习
  if masteryLevel === 100 then status = 'mastered';
}
```

## 6. 错误处理

### 6.1 错误类型定义

```typescript
// 错误处理中间件已存在，需扩展以下错误类型
export class PracticeError extends AppError {
  constructor(message: string) {
    super(message, 400, 'PRACTICE_ERROR');
  }
}

export class InvalidAnswerError extends PracticeError {
  constructor() {
    super('答案格式不正确');
  }
}

export class CourseNotPublishedError extends AppError {
  constructor() {
    super('课程未发布，无法学习', 403);
  }
}

export class PKBattleNotFoundError extends AppError {
  constructor() {
    super('PK 对战不存在', 404);
  }
}

export class InsufficientCoinsError extends AppError {
  constructor(required: number, current: number) {
    super(`金币不足，需要${required}金币，当前${current}金币`, 400);
  }
}

export class DailyQuestionLimitError extends AppError {
  constructor(limit: number) {
    super(`今日 AI 提问次数已达上限${limit}次`, 429);
  }
}
```

### 6.2 错误处理策略

```typescript
// 全局错误处理中间件 (middleware/error.middleware.ts)
export const errorMiddleware = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  // 1. 已知应用错误
  if (err instanceof AppError) {
    return res.status(err.statusCode).json({
      success: false,
      error: {
        type: err.type,
        message: err.message,
        code: err.code
      }
    });
  }
  
  // 2. 数据库连接错误
  if (err.name === 'DatabaseError') {
    logger.error('数据库错误', err);
    return res.status(500).json({
      success: false,
      error: {
        type: 'DATABASE_ERROR',
        message: '数据库服务暂时不可用'
      }
    });
  }
  
  // 3. AI 服务错误
  if (err.name === 'AI Service Error') {
    logger.error('AI 服务错误', err);
    return res.status(503).json({
      success: false,
      error: {
        type: 'AI_SERVICE_ERROR',
        message: 'AI 服务暂时不可用'
      }
    });
  }
  
  // 4. 未知错误
  logger.error('未知错误', err);
  return res.status(500).json({
    success: false,
    error: {
      type: 'INTERNAL_ERROR',
      message: '服务器内部错误'
    }
  });
};
```

## 7. 测试策略

### 7.1 单元测试

**测试框架**: Vitest 1.1.0

**核心测试场景**:

1. **连击计算测试**
   - 测试连击递增逻辑
   - 测试连击中断重置
   - 测试倍数计算准确性
   - 属性测试：连击数始终非负

2. **评级计算测试**
   - 测试不同准确率区间的评级
   - 测试时间阈值对评级的影响
   - 边界值测试（95%, 90%, 80% 等）

3. **复习调度测试**
   - 测试艾宾浩斯间隔计算
   - 测试掌握度计算
   - 测试答错后的复习安排

4. **句子拆分测试**
   - 测试英文句子正确拆分
   - 测试单词词性标注
   - 测试音标生成

### 7.2 集成测试

1. **API 端到端测试**
   - 词汇学习流程
   - 课程创建流程
   - PK 对战完整流程

2. **WebSocket 测试**
   - PK 实时同步
   - 学习小组动态推送

### 7.3 前端组件测试

1. **Vue 组件测试**
   - 连击展示组件动画
   - 评级动画组件
   - 句子构建器交互

2. **状态管理测试**
   - Pinia store 状态更新
   - 异步 action 测试

## 8. 性能优化

### 8.1 缓存策略

```typescript
// Redis 缓存键命名规范
const CACHE_KEYS = {
  LEADERBOARD_DAILY: 'leaderboard:daily:',
  LEADERBOARD_WEEKLY: 'leaderboard:weekly:',
  PK_BATTLE_ROOM: 'pk:room:{roomId}',
  USER_COMBO: 'combo:{userId}',
  USER_STATS: 'stats:{userId}',
  COURSE_SENTENCES: 'course:{courseId}:sentences'
};

// 缓存过期时间
const CACHE_TTL = {
  LEADERBOARD: 3600,      // 1 小时
  PK_BATTLE: 300,         // 5 分钟
  USER_COMBO: 60,         // 实时状态，短时缓存
  COURSE_SENTENCES: 86400 // 24 小时
};
```

### 8.2 数据库索引优化

```sql
-- 用户练习记录常用查询索引
CREATE INDEX idx_practice_user_date ON user_practice_records(user_id, created_at DESC);
CREATE INDEX idx_practice_course ON user_practice_records(course_id, created_at);

-- 排行榜查询索引
CREATE INDEX idx_leaderboard_total_time ON users(total_study_time DESC);
CREATE INDEX idx_leaderboard_streak ON users(current_streak DESC);

-- PK 对战查询索引
CREATE INDEX idx_pk_status ON pk_battles(status, created_at);
CREATE INDEX idx_pk_player ON pk_battles(player1_id, player2_id);
```

### 8.3 前端性能优化

1. **懒加载**
   - 课程列表虚拟滚动
   - 图片懒加载
   - 组件路由懒加载

2. **状态持久化**
   - 学习进度本地存储
   - 连击状态 session 存储

3. **资源优化**
   - 音频预加载
   - 视频分片加载
   - 字体子集化

## 9. 安全性

### 9.1 认证与授权

1. **JWT 增强**
   - 刷新 Token 机制
   - Token 黑名单
   - 设备指纹验证

2. **速率限制**
   - API 访问限流（每分 60 次）
   - 练习请求限流（防刷）
   - AI 提问限流（每日 2 次免费）

### 9.2 数据验证

```typescript
// 使用 Zod 进行请求体验证
import { z } from 'zod';

// 句子练习请求验证
export const sentencePracticeSchema = z.object({
  sentenceId: z.number().int().positive(),
  answer: z.string().min(1).max(500),
  mode: z.enum(['sentence_builder', 'dictation', 'listening', 'speaking']),
  timeSpent: z.number().int().positive().max(300000),
  attemptCount: z.number().int().positive().max(10)
});

// 课程创建请求验证
export const courseCreateSchema = z.object({
  title: z.string().min(1).max(200),
  description: z.string().max(2000),
  courseType: z.enum(['text', 'audio', 'video', 'music']),
  difficultyLevel: z.enum(['beginner', 'intermediate', 'advanced']),
  sentences: z.array(z.object({
    contentEn: z.string().min(1).max(1000),
    contentCn: z.string().max(500),
    audioUrl: z.string().url().optional(),
    sortOrder: z.number().int()
  })).min(1).max(200)
});
```

### 9.3 输入净化

1. **XSS 防护**：前端 DOMPurify 净化
2. **SQL 注入防护**：参数化查询
3. **文件上传安全**: 类型白名单 + 大小限制

## 10. 部署与运维

### 10.1 环境配置

```bash
# .env 环境变量
# 数据库
DATABASE_URL=postgresql://user:pass@localhost:5432/english_ai
REDIS_URL=redis://localhost:6379

# AI 服务
OPENAI_API_KEY=sk-xxx
TTS_PROVIDER=azure

# WebSocket
WS_HOST=localhost
WS_PORT=8081

# 速率限制
API_RATE_LIMIT=60
AI_QUESTION_LIMIT=2

# 缓存
CACHE_TTL_LEADERBOARD=3600
CACHE_TTL_PK_BATTLE=300
```

### 10.2 健康检查

```typescript
// /health 端点
GET /health -> {
  status: 'ok' | 'degraded' | 'down',
  checks: {
    database: 'ok' | 'down',
    redis: 'ok' | 'down',
    openai: 'ok' | 'down',
    tts: 'ok' | 'down'
  },
  uptime: number,
  timestamp: string
}
```

### 10.3 日志与监控

1. **日志级别**: debug, info, warn, error
2. **结构化日志**: JSON 格式
3. **关键指标**:
   - API 响应时间 P95 < 500ms
   - WS 延迟 P95 < 100ms
   - 错误率 < 1%
   - CPU 使用率 < 70%

## 11. 参考资料

[^1]: (句乐部官网) - [核心玩法：连词成句](https://julebu.co/docs)
[^2]: (句乐部官网) - [五种学习模式](https://julebu.co/docs/guide-learning-modes)
[^3]: (现有项目) - [词汇模型](/backend/src/models/Vocabulary.model.ts)
[^4]: (现有项目) - [复习调度器](/backend/src/utils/review-scheduler.ts)
[^5]: (现有项目) - [练习组件](/frontend/src/components/vocabulary/WordCard.vue)
