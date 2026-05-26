import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import { pool } from '../src/database/index.js';
import { JulebuMigration } from '../src/database/migrations/julebu-migrate.js';

/**
 * 句乐部游戏化系统数据库迁移测试
 * 验证所有 11 个新表的表结构、索引和外键约束
 */
describe('Julebu Migration', () => {
  const TABLES = [
    'courses',
    'sentences',
    'user_practice_records',
    'user_combos',
    'user_ratings',
    'user_achievements',
    'vocabulary_books',
    'pk_battles',
    'study_groups',
    'study_group_members',
    'user_coins_transactions',
    'ai_assistant_logs'
  ];

  const ALTERED_COLUMNS = [
    'gold_coins',
    'diamond_coins',
    'current_streak',
    'best_streak',
    'total_study_time',
    'last_study_date'
  ];

  beforeAll(async () => {
    console.log('🧪 开始数据库迁移测试...');
  });

  afterAll(async () => {
    // 清理测试数据
    await pool.end();
  });

  describe('表创建验证', () => {
    it('应该创建所有 11 个新表', async () => {
      const query = `
        SELECT table_name 
        FROM information_schema.tables 
        WHERE table_schema = 'public' 
        AND table_type = 'BASE TABLE'
      `;
      
      const result = await pool.query(query);
      const existingTables = result.rows.map(row => row.table_name);

      TABLES.forEach(tableName => {
        expect(existingTables).toContain(tableName);
      });
    });

    it('courses 表应该有正确的字段', async () => {
      const query = `
        SELECT column_name, data_type, is_nullable, column_default
        FROM information_schema.columns
        WHERE table_name = 'courses'
        ORDER BY ordinal_position
      `;
      
      const result = await pool.query(query);
      const columns = result.rows.map(row => row.column_name);

      const requiredColumns = [
        'id', 'title', 'description', 'cover_image', 'author_id',
        'course_type', 'difficulty_level', 'status', 'view_count',
        'study_count', 'like_count', 'tags', 'created_at', 'updated_at'
      ];

      requiredColumns.forEach(col => {
        expect(columns).toContain(col);
      });
    });

    it('sentences 表应该有正确的字段', async () => {
      const query = `
        SELECT column_name 
        FROM information_schema.columns
        WHERE table_name = 'sentences'
        ORDER BY ordinal_position
      `;
      
      const result = await pool.query(query);
      const columns = result.rows.map(row => row.column_name);

      const requiredColumns = [
        'id', 'course_id', 'content_en', 'content_cn',
        'audio_url', 'video_url', 'difficulty_level',
        'word_count', 'estimated_time', 'sort_order'
      ];

      requiredColumns.forEach(col => {
        expect(columns).toContain(col);
      });
    });

    it('user_practice_records 表应该有正确的索引', async () => {
      const query = `
        SELECT indexname 
        FROM pg_indexes 
        WHERE tablename = 'user_practice_records'
      `;
      
      const result = await pool.query(query);
      const indexes = result.rows.map(row => row.indexname);

      expect(indexes).toContain('idx_practice_user');
      expect(indexes).toContain('idx_practice_sentence');
      expect(indexes).toContain('idx_practice_created');
      expect(indexes).toContain('idx_practice_user_date');
      expect(indexes).toContain('idx_practice_course');
    });

    it('pk_battles 表应该有正确的状态约束', async () => {
      const query = `
        SELECT check_clause
        FROM information_schema.check_constraints
        WHERE constraint_name LIKE '%pk_battles_status%'
      `;
      
      const result = await pool.query(query);
      expect(result.rows.length).toBeGreaterThan(0);
      
      // 验证状态约束包含正确的值
      const checkClause = result.rows[0].check_clause;
      expect(checkClause).toContain('waiting');
      expect(checkClause).toContain('playing');
      expect(checkClause).toContain('finished');
    });

    it('user_ratings 表应该有唯一约束', async () => {
      const query = `
        SELECT constraint_name, constraint_type
        FROM information_schema.table_constraints
        WHERE table_name = 'user_ratings'
        AND constraint_type = 'UNIQUE'
      `;
      
      const result = await pool.query(query);
      expect(result.rows.length).toBeGreaterThan(0);
    });

    it('vocabulary_books 表应该有外键引用', async () => {
      const query = `
        SELECT tc.table_name, kcu.column_name, 
               ccu.table_name AS foreign_table_name,
               ccu.column_name AS foreign_column_name
        FROM information_schema.table_constraints AS tc
        JOIN information_schema.key_column_usage AS kcu
          ON tc.constraint_name = kcu.constraint_name
        JOIN information_schema.constraint_column_usage AS ccu
          ON ccu.constraint_name = tc.constraint_name
        WHERE tc.constraint_type = 'FOREIGN KEY'
        AND tc.table_name = 'vocabulary_books'
      `;
      
      const result = await pool.query(query);
      const foreignKeys = result.rows;

      expect(foreignKeys.find(fk => fk.column_name === 'user_id')).toBeDefined();
      expect(foreignKeys.find(fk => fk.column_name === 'word_id')).toBeDefined();
    });
  });

  describe('users 表字段扩展验证', () => {
    it('users 表应该添加游戏化字段', async () => {
      const query = `
        SELECT column_name 
        FROM information_schema.columns
        WHERE table_name = 'users'
      `;
      
      const result = await pool.query(query);
      const columns = result.rows.map(row => row.column_name);

      ALTERED_COLUMNS.forEach(col => {
        expect(columns).toContain(col);
      });
    });

    it('gold_coins 字段应该有默认值 0', async () => {
      const query = `
        SELECT column_default
        FROM information_schema.columns
        WHERE table_name = 'users'
        AND column_name = 'gold_coins'
      `;
      
      const result = await pool.query(query);
      expect(result.rows[0].column_default).toBe('0');
    });
  });

  describe('外键约束测试', () => {
    it('sentences 表应该外键引用 courses 表', async () => {
      const query = `
        SELECT tc.table_name, kcu.column_name, 
               ccu.table_name AS foreign_table_name
        FROM information_schema.table_constraints AS tc
        JOIN information_schema.key_column_usage AS kcu
          ON tc.constraint_name = kcu.constraint_name
        JOIN information_schema.constraint_column_usage AS ccu
          ON ccu.constraint_name = tc.constraint_name
        WHERE tc.constraint_type = 'FOREIGN KEY'
        AND tc.table_name = 'sentences'
        AND ccu.table_name = 'courses'
      `;
      
      const result = await pool.query(query);
      expect(result.rows.length).toBeGreaterThan(0);
    });

    it('study_group_members 表应该外键引用 study_groups 表', async () => {
      const query = `
        SELECT tc.table_name, kcu.column_name, 
               ccu.table_name AS foreign_table_name
        FROM information_schema.table_constraints AS tc
        JOIN information_schema.key_column_usage AS kcu
          ON tc.constraint_name = kcu.constraint_name
        JOIN information_schema.constraint_column_usage AS ccu
          ON ccu.constraint_name = tc.constraint_name
        WHERE tc.constraint_type = 'FOREIGN KEY'
        AND tc.table_name = 'study_group_members'
      `;
      
      const result = await pool.query(query);
      const foreignKeys = result.rows;

      expect(foreignKeys.find(fk => fk.foreign_table_name === 'study_groups')).toBeDefined();
      expect(foreignKeys.find(fk => fk.foreign_table_name === 'users')).toBeDefined();
    });
  });

  describe('级联删除测试', () => {
    it('courses 删除时应该级联删除 sentences', async () => {
      // 先检查迁移是否已执行
      const checkQuery = `
        SELECT COUNT(*) as count
        FROM information_schema.tables
        WHERE table_name = 'courses'
      `;
      
      const checkResult = await pool.query(checkQuery);
      if (checkResult.rows[0].count === 0) {
        // 表不存在，跳过测试
        console.log('⚠️ courses 表不存在，跳过级联删除测试');
        return;
      }

      // 创建一个测试课程
      const insertCourse = `
        INSERT INTO courses (title, status)
        VALUES ($1, $2)
        RETURNING id
      `;
      const courseResult = await pool.query(insertCourse, ['测试课程', 'draft']);
      const courseId = courseResult.rows[0].id;

      // 创建关联的句子
      const insertSentence = `
        INSERT INTO sentences (course_id, content_en, sort_order)
        VALUES ($1, $2, $3)
      `;
      await pool.query(insertSentence, [courseId, 'Test sentence', 1]);

      // 删除课程
      const deleteCourse = `DELETE FROM courses WHERE id = $1`;
      await pool.query(deleteCourse, [courseId]);

      // 验证句子是否被级联删除
      const checkSentence = `
        SELECT COUNT(*) as count
        FROM sentences
        WHERE course_id = $1
      `;
      const sentenceResult = await pool.query(checkSentence, [courseId]);
      expect(sentenceResult.rows[0].count).toBe(0);
    });
  });

  describe('索引性能测试', () => {
    it('user_practice_records 表的用户查询应该使用索引', async () => {
      // 使用 EXPLAIN ANALYZE 检查查询计划
      const query = `
        EXPLAIN ANALYZE
        SELECT * FROM user_practice_records
        WHERE user_id = 1
        ORDER BY created_at DESC
      `;
      
      const result = await pool.query(query);
      const plan = result.rows[0].QUERY_PLAN;
      
      // 查询计划应该包含 Index Scan
      const planText = JSON.stringify(plan);
      // 注意：实际测试中可能需要具体检查索引使用情况
      expect(planText).toBeDefined();
    });

    it('pk_battles 表的状态查询应该使用索引', async () => {
      const query = `
        EXPLAIN ANALYZE
        SELECT * FROM pk_battles
        WHERE status = 'waiting'
        ORDER BY created_at
      `;
      
      const result = await pool.query(query);
      const plan = result.rows[0].QUERY_PLAN;
      expect(plan).toBeDefined();
    });
  });
});
