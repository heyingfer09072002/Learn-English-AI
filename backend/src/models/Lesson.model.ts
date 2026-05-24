import { pool } from '../database/index.js';

export interface Lesson {
  id?: number;
  title: string;
  description: string;
  level: string;
  lessonsCount: number;
  icon?: string;
  order?: number;
  createdAt?: Date;
}

export interface Sentence {
  id?: number;
  lessonId: number;
  english: string;
  chinese: string;
  phonetic?: string;
  audioUrl?: string;
  order?: number;
}

export interface WordBreakdown {
  id?: number;
  sentenceId: number;
  word: string;
  meaning: string;
  pos?: string;
  phonetic?: string;
  role?: string;
  example?: string;
  order?: number;
}

export class LessonModel {
  /**
   * 创建课程相关表
   */
  static async createTables() {
    // 课程表
    await pool.query(`
      CREATE TABLE IF NOT EXISTS lessons (
        id SERIAL PRIMARY KEY,
        title VARCHAR(200) NOT NULL,
        description TEXT,
        level VARCHAR(20) NOT NULL,
        lessons_count INTEGER DEFAULT 0,
        icon VARCHAR(50),
        "order" INTEGER DEFAULT 0,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // 句子表
    await pool.query(`
      CREATE TABLE IF NOT EXISTS sentences (
        id SERIAL PRIMARY KEY,
        lesson_id INTEGER REFERENCES lessons(id) ON DELETE CASCADE,
        english TEXT NOT NULL,
        chinese TEXT,
        phonetic VARCHAR(200),
        audio_url VARCHAR(500),
        "order" INTEGER DEFAULT 0,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // 单词拆解表
    await pool.query(`
      CREATE TABLE IF NOT EXISTS word_breakdowns (
        id SERIAL PRIMARY KEY,
        sentence_id INTEGER REFERENCES sentences(id) ON DELETE CASCADE,
        word VARCHAR(100) NOT NULL,
        meaning TEXT,
        pos VARCHAR(20),
        phonetic VARCHAR(100),
        role VARCHAR(50),
        example TEXT,
        "order" INTEGER DEFAULT 0,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    console.log('✅ Lessons, Sentences, WordBreakdowns 表创建成功');
  }

  /**
   * 获取所有课程
   */
  static async findAll() {
    const query = 'SELECT * FROM lessons ORDER BY "order"';
    const result = await pool.query(query);
    return result.rows;
  }

  /**
   * 根据 ID 获取课程
   */
  static async findById(id: number) {
    const query = 'SELECT * FROM lessons WHERE id = $1';
    const result = await pool.query(query, [id]);
    return result.rows[0] || null;
  }

  /**
   * 获取课程的句子列表
   */
  static async findSentences(lessonId: number) {
    const query = `
      SELECT s.*, 
        COALESCE(
          json_agg(
            json_build_object(
              'word', wb.word,
              'meaning', wb.meaning,
              'pos', wb.pos,
              'phonetic', wb.phonetic,
              'role', wb.role,
              'example', wb.example
            ) ORDER BY wb."order"
          ) FILTER (WHERE wb.id IS NOT NULL),
          '[]'
        ) as words
      FROM sentences s
      LEFT JOIN word_breakdowns wb ON s.id = wb.sentence_id
      WHERE s.lesson_id = $1
      GROUP BY s.id
      ORDER BY s."order"
    `;
    const result = await pool.query(query, [lessonId]);
    return result.rows;
  }

  /**
   * 初始化示例数据
   */
  static async seed() {
    // 检查是否已有数据
    const count = await pool.query('SELECT COUNT(*) FROM lessons');
    if (parseInt(count.rows[0].count) > 0) {
      return;
    }

    // 插入示例课程
    const lessons = [
      {
        title: '衣物与穿搭',
        description: '学习日常衣物相关词汇和表达',
        level: '初级',
        lessonsCount: 12,
        icon: 'shirt',
        order: 1
      },
      {
        title: '食物与烹饪',
        description: '掌握餐厅点餐和烹饪相关对话',
        level: '中级',
        lessonsCount: 15,
        icon: 'utensils',
        order: 2
      },
      {
        title: '商务会谈',
        description: '提升商务英语沟通能力',
        level: '高级',
        lessonsCount: 20,
        icon: 'briefcase',
        order: 3
      }
    ];

    for (const lesson of lessons) {
      await pool.query(`
        INSERT INTO lessons (title, description, level, lessons_count, icon, "order")
        VALUES ($1, $2, $3, $4, $5, $6)
      `, [lesson.title, lesson.description, lesson.level, lesson.lessonsCount, lesson.icon, lesson.order]);
    }

    console.log('✅ 示例课程数据已插入');
  }
}
