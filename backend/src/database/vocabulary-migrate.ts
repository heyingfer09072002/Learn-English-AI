import { pool } from '../database/index.js';

/**
 * 词汇学习系统数据库迁移
 */
export class VocabularyMigration {
  /**
   * 创建词汇主表
   */
  static async createWordsTable() {
    const query = `
      CREATE TABLE IF NOT EXISTS words (
        id SERIAL PRIMARY KEY,
        word VARCHAR(100) NOT NULL UNIQUE,
        phonetic_uk VARCHAR(100),
        phonetic_us VARCHAR(100),
        difficulty_level SMALLINT CHECK (difficulty_level BETWEEN 1 AND 10),
        frequency_level VARCHAR(20) CHECK (frequency_level IN ('high', 'medium', 'low')),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `;
    await pool.query(query);
    console.log('✅ Words 表创建成功');

    // 创建索引
    await pool.query('CREATE INDEX IF NOT EXISTS idx_word ON words(word)');
    await pool.query('CREATE INDEX IF NOT EXISTS idx_difficulty ON words(difficulty_level)');
    await pool.query('CREATE INDEX IF NOT EXISTS idx_frequency ON words(frequency_level)');
    console.log('✅ Words 表索引创建成功');
  }

  /**
   * 创建词性表
   */
  static async createWordPosTable() {
    const query = `
      CREATE TABLE IF NOT EXISTS word_pos (
        id SERIAL PRIMARY KEY,
        word_id INTEGER NOT NULL REFERENCES words(id) ON DELETE CASCADE,
        pos VARCHAR(50) NOT NULL,
        definition_cn TEXT NOT NULL,
        definition_en TEXT,
        root_affix TEXT,
        memory_tip TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `;
    await pool.query(query);
    console.log('✅ Word Pos 表创建成功');

    // 创建索引
    await pool.query('CREATE INDEX IF NOT EXISTS idx_word_pos_word_id ON word_pos(word_id)');
    await pool.query('CREATE INDEX IF NOT EXISTS idx_word_pos_pos ON word_pos(pos)');
    console.log('✅ Word Pos 表索引创建成功');
  }

  /**
   * 创建例句表
   */
  static async createWordSentencesTable() {
    const query = `
      CREATE TABLE IF NOT EXISTS word_sentences (
        id SERIAL PRIMARY KEY,
        word_id INTEGER NOT NULL REFERENCES words(id) ON DELETE CASCADE,
        sentence_en TEXT NOT NULL,
        sentence_cn TEXT NOT NULL,
        audio_url VARCHAR(500),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `;
    await pool.query(query);
    console.log('✅ Word Sentences 表创建成功');

    // 创建索引
    await pool.query('CREATE INDEX IF NOT EXISTS idx_word_sentences_word_id ON word_sentences(word_id)');
    console.log('✅ Word Sentences 表索引创建成功');
  }

  /**
   * 创建词汇关系表（同义词/反义词）
   */
  static async createWordRelationsTable() {
    const query = `
      CREATE TABLE IF NOT EXISTS word_relations (
        id SERIAL PRIMARY KEY,
        word_id INTEGER NOT NULL REFERENCES words(id) ON DELETE CASCADE,
        related_word_id INTEGER NOT NULL REFERENCES words(id) ON DELETE CASCADE,
        relation_type VARCHAR(20) CHECK (relation_type IN ('synonym', 'antonym')),
        similarity_score DECIMAL(3,2),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        CONSTRAINT unique_relation UNIQUE (word_id, related_word_id, relation_type)
      )
    `;
    await pool.query(query);
    console.log('✅ Word Relations 表创建成功');

    // 创建索引
    await pool.query('CREATE INDEX IF NOT EXISTS idx_word_relations_word_id ON word_relations(word_id)');
    await pool.query('CREATE INDEX IF NOT EXISTS idx_word_relations_related_word_id ON word_relations(related_word_id)');
    console.log('✅ Word Relations 表索引创建成功');
  }

  /**
   * 创建词汇分类表
   */
  static async createWordCategoriesTable() {
    const query = `
      CREATE TABLE IF NOT EXISTS word_categories (
        id SERIAL PRIMARY KEY,
        word_id INTEGER NOT NULL REFERENCES words(id) ON DELETE CASCADE,
        category_type VARCHAR(50) NOT NULL,
        category_value VARCHAR(100) NOT NULL,
        is_primary BOOLEAN DEFAULT FALSE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `;
    await pool.query(query);
    console.log('✅ Word Categories 表创建成功');

    // 创建索引
    await pool.query('CREATE INDEX IF NOT EXISTS idx_word_categories_word_id ON word_categories(word_id)');
    await pool.query('CREATE INDEX IF NOT EXISTS idx_word_categories_category ON word_categories(category_type, category_value)');
    console.log('✅ Word Categories 表索引创建成功');
  }

  /**
   * 创建用户词汇进度表
   */
  static async createUserWordProgressTable() {
    const query = `
      CREATE TABLE IF NOT EXISTS user_word_progress (
        id SERIAL PRIMARY KEY,
        user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        word_id INTEGER NOT NULL REFERENCES words(id) ON DELETE CASCADE,
        status VARCHAR(20) CHECK (status IN ('new', 'learning', 'mastered', 'review')),
        learned_times INTEGER DEFAULT 0,
        error_times INTEGER DEFAULT 0,
        last_learned_at TIMESTAMP,
        next_review_at TIMESTAMP,
        mastery_level SMALLINT CHECK (mastery_level BETWEEN 0 AND 100),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        CONSTRAINT unique_user_word UNIQUE (user_id, word_id)
      )
    `;
    await pool.query(query);
    console.log('✅ User Word Progress 表创建成功');

    // 创建索引
    await pool.query('CREATE INDEX IF NOT EXISTS idx_user_word_progress_user_id ON user_word_progress(user_id)');
    await pool.query('CREATE INDEX IF NOT EXISTS idx_user_word_progress_word_id ON user_word_progress(word_id)');
    await pool.query('CREATE INDEX IF NOT EXISTS idx_user_word_progress_status ON user_word_progress(status)');
    await pool.query('CREATE INDEX IF NOT EXISTS idx_user_word_progress_next_review ON user_word_progress(next_review_at)');
    console.log('✅ User Word Progress 表索引创建成功');
  }

  /**
   * 创建学习记录表
   */
  static async createLearningRecordsTable() {
    const query = `
      CREATE TABLE IF NOT EXISTS learning_records (
        id SERIAL PRIMARY KEY,
        user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        word_id INTEGER NOT NULL REFERENCES words(id) ON DELETE CASCADE,
        action_type VARCHAR(50) NOT NULL,
        is_correct BOOLEAN,
        time_spent INTEGER,
        metadata JSONB,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `;
    await pool.query(query);
    console.log('✅ Learning Records 表创建成功');

    // 创建索引
    await pool.query('CREATE INDEX IF NOT EXISTS idx_learning_records_user_id ON learning_records(user_id)');
    await pool.query('CREATE INDEX IF NOT EXISTS idx_learning_records_word_id ON learning_records(word_id)');
    await pool.query('CREATE INDEX IF NOT EXISTS idx_learning_records_created_at ON learning_records(created_at)');
    console.log('✅ Learning Records 表索引创建成功');
  }

  /**
   * 扩展用户表（添加登录失败锁定字段）
   */
  static async extendUsersTable() {
    // 检查并添加 failed_login_attempts 字段
    await pool.query(`
      DO $$ 
      BEGIN 
        IF NOT EXISTS (
          SELECT 1 FROM information_schema.columns 
          WHERE table_name = 'users' AND column_name = 'failed_login_attempts'
        ) THEN
          ALTER TABLE users ADD COLUMN failed_login_attempts INTEGER DEFAULT 0;
        END IF;
      END $$
    `);
    console.log('✅ Users.failed_login_attempts 字段添加成功');

    // 检查并添加 locked_until 字段
    await pool.query(`
      DO $$ 
      BEGIN 
        IF NOT EXISTS (
          SELECT 1 FROM information_schema.columns 
          WHERE table_name = 'users' AND column_name = 'locked_until'
        ) THEN
          ALTER TABLE users ADD COLUMN locked_until TIMESTAMP NULL;
        END IF;
      END $$
    `);
    console.log('✅ Users.locked_until 字段添加成功');
  }

  /**
   * 运行所有迁移
   */
  static async run() {
    console.log('🚀 开始执行词汇系统数据库迁移...\n');

    try {
      await this.extendUsersTable();
      await this.createWordsTable();
      await this.createWordPosTable();
      await this.createWordSentencesTable();
      await this.createWordRelationsTable();
      await this.createWordCategoriesTable();
      await this.createUserWordProgressTable();
      await this.createLearningRecordsTable();

      console.log('\n✅ 词汇系统数据库迁移完成！\n');
    } catch (error) {
      console.error('\n❌ 迁移失败:', error);
      throw error;
    }
  }

  /**
   * 回滚所有迁移（删除所有词汇表）
   */
  static async rollback() {
    console.log('⚠️  开始回滚词汇系统数据库迁移...\n');

    try {
      const tables = [
        'learning_records',
        'user_word_progress',
        'word_categories',
        'word_relations',
        'word_sentences',
        'word_pos',
        'words'
      ];

      for (const table of tables) {
        await pool.query(`DROP TABLE IF EXISTS ${table} CASCADE`);
        console.log(`🗑️  已删除表：${table}`);
      }

      console.log('\n✅ 词汇系统数据库回滚完成！\n');
    } catch (error) {
      console.error('\n❌ 回滚失败:', error);
      throw error;
    }
  }
}

// 如果直接运行此脚本
if (process.argv[1]?.endsWith('vocabulary-migrate.ts')) {
  const command = process.argv[2];
  
  if (command === '--rollback') {
    VocabularyMigration.rollback()
      .then(() => process.exit(0))
      .catch(() => process.exit(1));
  } else {
    VocabularyMigration.run()
      .then(() => process.exit(0))
      .catch(() => process.exit(1));
  }
}
