import { pool } from '../index.js';

/**
 * 句乐部游戏化学习系统数据库迁移
 * 创建 11 个新表以支持游戏化学习功能
 */
export class JulebuMigration {
  /**
   * 创建句子表
   */
  static async createSentencesTable() {
    const query = `
      CREATE TABLE IF NOT EXISTS sentences (
        id SERIAL PRIMARY KEY,
        course_id INTEGER NOT NULL REFERENCES courses(id) ON DELETE CASCADE,
        content_en TEXT NOT NULL,
        content_cn TEXT,
        audio_url VARCHAR(500),
        video_url VARCHAR(500),
        difficulty_level INTEGER DEFAULT 1 CHECK (difficulty_level BETWEEN 1 AND 5),
        word_count INTEGER,
        estimated_time INTEGER,
        sort_order INTEGER,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `;
    await pool.query(query);
    console.log('✅ Sentences 表创建成功');

    // 创建索引
    await pool.query('CREATE INDEX IF NOT EXISTS idx_sentence_course ON sentences(course_id)');
    await pool.query('CREATE INDEX IF NOT EXISTS idx_sentence_difficulty ON sentences(difficulty_level)');
    console.log('✅ Sentences 表索引创建成功');
  }

  /**
   * 创建课程表
   */
  static async createCoursesTable() {
    const query = `
      CREATE TABLE IF NOT EXISTS courses (
        id SERIAL PRIMARY KEY,
        title VARCHAR(200) NOT NULL,
        description TEXT,
        cover_image VARCHAR(500),
        author_id INTEGER REFERENCES users(id),
        course_type VARCHAR(20) CHECK (course_type IN ('text', 'audio', 'video', 'music')),
        difficulty_level VARCHAR(20) CHECK (difficulty_level IN ('beginner', 'intermediate', 'advanced')),
        target_audience VARCHAR(100),
        language_level VARCHAR(10),
        total_sentences INTEGER DEFAULT 0,
        estimated_duration INTEGER,
        is_public BOOLEAN DEFAULT FALSE,
        status VARCHAR(20) DEFAULT 'draft' CHECK (status IN ('draft', 'pending', 'published')),
        view_count INTEGER DEFAULT 0,
        study_count INTEGER DEFAULT 0,
        like_count INTEGER DEFAULT 0,
        tags TEXT[],
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `;
    await pool.query(query);
    console.log('✅ Courses 表创建成功');

    // 创建索引
    await pool.query('CREATE INDEX IF NOT EXISTS idx_course_author ON courses(author_id)');
    await pool.query('CREATE INDEX IF NOT EXISTS idx_course_status ON courses(status)');
    await pool.query('CREATE INDEX IF NOT EXISTS idx_course_type ON courses(course_type)');
    await pool.query('CREATE INDEX IF NOT EXISTS idx_course_public ON courses(is_public)');
    console.log('✅ Courses 表索引创建成功');
  }

  /**
   * 创建用户练习记录表
   */
  static async createUserPracticeRecordsTable() {
    const query = `
      CREATE TABLE IF NOT EXISTS user_practice_records (
        id SERIAL PRIMARY KEY,
        user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        sentence_id INTEGER REFERENCES sentences(id) ON DELETE CASCADE,
        course_id INTEGER REFERENCES courses(id),
        practice_mode VARCHAR(30) CHECK (practice_mode IN ('sentence_builder', 'dictation', 'listening', 'speaking', 'choice')),
        answer_text TEXT,
        is_correct BOOLEAN,
        time_spent INTEGER,
        attempt_count INTEGER DEFAULT 1,
        accuracy DECIMAL(5,4),
        combo_count INTEGER DEFAULT 0,
        rating VARCHAR(10) CHECK (rating IN ('C', 'B', 'A', 'S', 'SS', 'SSS')),
        score INTEGER,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `;
    await pool.query(query);
    console.log('✅ User Practice Records 表创建成功');

    // 创建索引
    await pool.query('CREATE INDEX IF NOT EXISTS idx_practice_user ON user_practice_records(user_id)');
    await pool.query('CREATE INDEX IF NOT EXISTS idx_practice_sentence ON user_practice_records(sentence_id)');
    await pool.query('CREATE INDEX IF NOT EXISTS idx_practice_created ON user_practice_records(created_at)');
    await pool.query('CREATE INDEX IF NOT EXISTS idx_practice_user_date ON user_practice_records(user_id, created_at DESC)');
    await pool.query('CREATE INDEX IF NOT EXISTS idx_practice_course ON user_practice_records(course_id, created_at)');
    console.log('✅ User Practice Records 表索引创建成功');
  }

  /**
   * 创建用户连击记录表
   */
  static async createUserCombosTable() {
    const query = `
      CREATE TABLE IF NOT EXISTS user_combos (
        id SERIAL PRIMARY KEY,
        user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        session_id UUID NOT NULL,
        max_combo INTEGER DEFAULT 0,
        current_combo INTEGER DEFAULT 0,
        is_active BOOLEAN DEFAULT TRUE,
        started_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        ended_at TIMESTAMP,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `;
    await pool.query(query);
    console.log('✅ User Combos 表创建成功');

    // 创建索引
    await pool.query('CREATE INDEX IF NOT EXISTS idx_combo_user ON user_combos(user_id)');
    await pool.query('CREATE INDEX IF NOT EXISTS idx_combo_session ON user_combos(session_id)');
    await pool.query('CREATE INDEX IF NOT EXISTS idx_combo_active ON user_combos(is_active)');
    console.log('✅ User Combos 表索引创建成功');
  }

  /**
   * 创建用户评级记录表
   */
  static async createUserRatingsTable() {
    const query = `
      CREATE TABLE IF NOT EXISTS user_ratings (
        id SERIAL PRIMARY KEY,
        user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        course_id INTEGER REFERENCES courses(id),
        sentence_id INTEGER REFERENCES sentences(id),
        rating VARCHAR(10) NOT NULL CHECK (rating IN ('C', 'B', 'A', 'S', 'SS', 'SSS')),
        accuracy DECIMAL(5,4),
        best_combo INTEGER,
        average_time INTEGER,
        rating_type VARCHAR(20) CHECK (rating_type IN ('course', 'daily', 'practice')),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        UNIQUE(user_id, course_id, rating_type, created_at::date)
      )
    `;
    await pool.query(query);
    console.log('✅ User Ratings 表创建成功');

    // 创建索引
    await pool.query('CREATE INDEX IF NOT EXISTS idx_rating_user ON user_ratings(user_id)');
    await pool.query('CREATE INDEX IF NOT EXISTS idx_rating_course ON user_ratings(course_id)');
    console.log('✅ User Ratings 表索引创建成功');
  }

  /**
   * 创建用户成就表
   */
  static async createUserAchievementsTable() {
    const query = `
      CREATE TABLE IF NOT EXISTS user_achievements (
        id SERIAL PRIMARY KEY,
        user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        achievement_key VARCHAR(100) NOT NULL,
        achievement_level VARCHAR(20) CHECK (achievement_level IN ('bronze', 'silver', 'gold', 'platinum')),
        progress INTEGER DEFAULT 0,
        target INTEGER NOT NULL,
        is_unlocked BOOLEAN DEFAULT FALSE,
        unlocked_at TIMESTAMP,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        UNIQUE(user_id, achievement_key)
      )
    `;
    await pool.query(query);
    console.log('✅ User Achievements 表创建成功');

    // 创建索引
    await pool.query('CREATE INDEX IF NOT EXISTS idx_achievement_user ON user_achievements(user_id)');
    await pool.query('CREATE INDEX IF NOT EXISTS idx_achievement_key ON user_achievements(achievement_key)');
    console.log('✅ User Achievements 表索引创建成功');
  }

  /**
   * 创建生词本表
   */
  static async createVocabularyBooksTable() {
    const query = `
      CREATE TABLE IF NOT EXISTS vocabulary_books (
        id SERIAL PRIMARY KEY,
        user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        word_id INTEGER NOT NULL REFERENCES words(id) ON DELETE CASCADE,
        sentence_id INTEGER REFERENCES sentences(id),
        note TEXT,
        mastery_level INTEGER DEFAULT 0 CHECK (mastery_level BETWEEN 0 AND 100),
        review_count INTEGER DEFAULT 0,
        last_reviewed_at TIMESTAMP,
        next_review_at TIMESTAMP,
        is_mastered BOOLEAN DEFAULT FALSE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        UNIQUE(user_id, word_id)
      )
    `;
    await pool.query(query);
    console.log('✅ Vocabulary Books 表创建成功');

    // 创建索引
    await pool.query('CREATE INDEX IF NOT EXISTS idx_vocab_book_user ON vocabulary_books(user_id)');
    await pool.query('CREATE INDEX IF NOT EXISTS idx_vocab_book_word ON vocabulary_books(word_id)');
    await pool.query('CREATE INDEX IF NOT EXISTS idx_vocab_book_mastered ON vocabulary_books(is_mastered)');
    console.log('✅ Vocabulary Books 表索引创建成功');
  }

  /**
   * 创建 PK 对战表
   */
  static async createPKBattlesTable() {
    const query = `
      CREATE TABLE IF NOT EXISTS pk_battles (
        id SERIAL PRIMARY KEY,
        room_id VARCHAR(50) UNIQUE NOT NULL,
        player1_id INTEGER REFERENCES users(id),
        player2_id INTEGER REFERENCES users(id),
        winner_id INTEGER REFERENCES users(id),
        player1_score INTEGER DEFAULT 0,
        player2_score INTEGER DEFAULT 0,
        player1_accuracy DECIMAL(5,4),
        player2_accuracy DECIMAL(5,4),
        status VARCHAR(20) DEFAULT 'waiting' CHECK (status IN ('waiting', 'playing', 'finished')),
        total_rounds INTEGER,
        completed_rounds INTEGER DEFAULT 0,
        started_at TIMESTAMP,
        finished_at TIMESTAMP,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `;
    await pool.query(query);
    console.log('✅ PK Battles 表创建成功');

    // 创建索引
    await pool.query('CREATE INDEX IF NOT EXISTS idx_pk_room ON pk_battles(room_id)');
    await pool.query('CREATE INDEX IF NOT EXISTS idx_pk_status ON pk_battles(status, created_at)');
    await pool.query('CREATE INDEX IF NOT EXISTS idx_pk_player1 ON pk_battles(player1_id)');
    await pool.query('CREATE INDEX IF NOT EXISTS idx_pk_player2 ON pk_battles(player2_id)');
    console.log('✅ PK Battles 表索引创建成功');
  }

  /**
   * 创建学习小组表
   */
  static async createStudyGroupsTables() {
    // 学习小组主表
    const groupsQuery = `
      CREATE TABLE IF NOT EXISTS study_groups (
        id SERIAL PRIMARY KEY,
        name VARCHAR(100) NOT NULL,
        description TEXT,
        owner_id INTEGER REFERENCES users(id),
        max_members INTEGER DEFAULT 50,
        is_public BOOLEAN DEFAULT TRUE,
        total_study_time INTEGER DEFAULT 0,
        target_weekly_time INTEGER,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `;
    await pool.query(groupsQuery);
    console.log('✅ Study Groups 表创建成功');

    // 学习小组成员表
    const membersQuery = `
      CREATE TABLE IF NOT EXISTS study_group_members (
        id SERIAL PRIMARY KEY,
        group_id INTEGER NOT NULL REFERENCES study_groups(id) ON DELETE CASCADE,
        user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        role VARCHAR(20) DEFAULT 'member' CHECK (role IN ('owner', 'admin', 'member')),
        joined_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        UNIQUE(group_id, user_id)
      )
    `;
    await pool.query(membersQuery);
    console.log('✅ Study Group Members 表创建成功');

    // 创建索引
    await pool.query('CREATE INDEX IF NOT EXISTS idx_group_owner ON study_groups(owner_id)');
    await pool.query('CREATE INDEX IF NOT EXISTS idx_group_public ON study_groups(is_public)');
    await pool.query('CREATE INDEX IF NOT EXISTS idx_member_group ON study_group_members(group_id)');
    await pool.query('CREATE INDEX IF NOT EXISTS idx_member_user ON study_group_members(user_id)');
    console.log('✅ Study Groups 表索引创建成功');
  }

  /**
   * 创建金币流水表
   */
  static async createUserCoinsTransactionsTable() {
    const query = `
      CREATE TABLE IF NOT EXISTS user_coins_transactions (
        id SERIAL PRIMARY KEY,
        user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        transaction_type VARCHAR(30) NOT NULL CHECK (transaction_type IN ('earn', 'spend')),
        coin_type VARCHAR(20) NOT NULL CHECK (coin_type IN ('gold', 'diamond')),
        amount INTEGER NOT NULL,
        balance_after INTEGER,
        source VARCHAR(100),
        description TEXT,
        reference_id INTEGER,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `;
    await pool.query(query);
    console.log('✅ User Coins Transactions 表创建成功');

    // 创建索引
    await pool.query('CREATE INDEX IF NOT EXISTS idx_coin_user ON user_coins_transactions(user_id)');
    await pool.query('CREATE INDEX IF NOT EXISTS idx_coin_type ON user_coins_transactions(coin_type)');
    console.log('✅ User Coins Transactions 表索引创建成功');
  }

  /**
   * 创建 AI 助手日志表
   */
  static async createAIAssistantLogsTable() {
    const query = `
      CREATE TABLE IF NOT EXISTS ai_assistant_logs (
        id SERIAL PRIMARY KEY,
        user_id INTEGER REFERENCES users(id),
        sentence_id INTEGER REFERENCES sentences(id),
        question TEXT NOT NULL,
        answer TEXT NOT NULL,
        token_used INTEGER,
        response_time INTEGER,
        is_collected BOOLEAN DEFAULT FALSE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `;
    await pool.query(query);
    console.log('✅ AI Assistant Logs 表创建成功');

    // 创建索引
    await pool.query('CREATE INDEX IF NOT EXISTS idx_ai_log_user ON ai_assistant_logs(user_id)');
    await pool.query('CREATE INDEX IF NOT EXISTS idx_ai_log_sentence ON ai_assistant_logs(sentence_id)');
    console.log('✅ AI Assistant Logs 表索引创建成功');
  }

  /**
   * 为用户表添加游戏化相关字段
   */
  static async alterUsersTable() {
    // 添加金幣字段
    await pool.query(`
      ALTER TABLE users ADD COLUMN IF NOT EXISTS gold_coins INTEGER DEFAULT 0;
    `);
    
    // 添加钻石字段
    await pool.query(`
      ALTER TABLE users ADD COLUMN IF NOT EXISTS diamond_coins INTEGER DEFAULT 0;
    `);
    
    // 添加连续打卡天数字段
    await pool.query(`
      ALTER TABLE users ADD COLUMN IF NOT EXISTS current_streak INTEGER DEFAULT 0;
    `);
    
    // 添加最长连续打卡字段
    await pool.query(`
      ALTER TABLE users ADD COLUMN IF NOT EXISTS best_streak INTEGER DEFAULT 0;
    `);
    
    // 添加总学习时长字段
    await pool.query(`
      ALTER TABLE users ADD COLUMN IF NOT EXISTS total_study_time INTEGER DEFAULT 0;
    `);
    
    // 添加最后学习日期字段
    await pool.query(`
      ALTER TABLE users ADD COLUMN IF NOT EXISTS last_study_date DATE;
    `);
    
    console.log('✅ Users 表游戏化字段添加成功');
  }

  /**
   * 执行所有迁移
   */
  static async migrate() {
    console.log('🚀 开始句乐部游戏化学习系统数据库迁移...\n');

    try {
      // 1. 更新 users 表
      await this.alterUsersTable();
      console.log('');

      // 2. 创建新表（注意顺序，先创建被依赖的表）
      await this.createCoursesTable();
      console.log('');

      await this.createSentencesTable();
      console.log('');

      await this.createUserPracticeRecordsTable();
      console.log('');

      await this.createUserCombosTable();
      console.log('');

      await this.createUserRatingsTable();
      console.log('');

      await this.createUserAchievementsTable();
      console.log('');

      await this.createVocabularyBooksTable();
      console.log('');

      await this.createPKBattlesTable();
      console.log('');

      await this.createStudyGroupsTables();
      console.log('');

      await this.createUserCoinsTransactionsTable();
      console.log('');

      await this.createAIAssistantLogsTable();
      console.log('');

      console.log('✅ 所有迁移执行完成！');
    } catch (error) {
      console.error('❌ 迁移失败:', error);
      throw error;
    }
  }

  /**
   * 回滚所有迁移（危险操作）
   */
  static async rollback() {
    console.log('⚠️  开始回滚数据库迁移...\n');

    try {
      // 按相反顺序删除表
      await pool.query('DROP TABLE IF EXISTS ai_assistant_logs CASCADE');
      await pool.query('DROP TABLE IF EXISTS user_coins_transactions CASCADE');
      await pool.query('DROP TABLE IF EXISTS study_group_members CASCADE');
      await pool.query('DROP TABLE IF EXISTS study_groups CASCADE');
      await pool.query('DROP TABLE IF EXISTS pk_battles CASCADE');
      await pool.query('DROP TABLE IF EXISTS vocabulary_books CASCADE');
      await pool.query('DROP TABLE IF EXISTS user_achievements CASCADE');
      await pool.query('DROP TABLE IF EXISTS user_ratings CASCADE');
      await pool.query('DROP TABLE IF EXISTS user_combos CASCADE');
      await pool.query('DROP TABLE IF EXISTS user_practice_records CASCADE');
      await pool.query('DROP TABLE IF EXISTS sentences CASCADE');
      await pool.query('DROP TABLE IF EXISTS courses CASCADE');

      // 移除 users 表的字段
      await pool.query('ALTER TABLE users DROP COLUMN IF EXISTS gold_coins');
      await pool.query('ALTER TABLE users DROP COLUMN IF EXISTS diamond_coins');
      await pool.query('ALTER TABLE users DROP COLUMN IF EXISTS current_streak');
      await pool.query('ALTER TABLE users DROP COLUMN IF EXISTS best_streak');
      await pool.query('ALTER TABLE users DROP COLUMN IF EXISTS total_study_time');
      await pool.query('ALTER TABLE users DROP COLUMN IF EXISTS last_study_date');

      console.log('✅ 所有迁移已回滚');
    } catch (error) {
      console.error('❌ 回滚失败:', error);
      throw error;
    }
  }
}
