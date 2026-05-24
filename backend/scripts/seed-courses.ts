/**
 * 课程数据导入脚本
 */

import { pool } from '../src/database/index.js';

// 生成课程数据
const courses = [
  {
    id: 1,
    level: '初级',
    title: '衣物与穿搭',
    description: '学习日常衣物相关词汇和表达',
    lesson_count: 12,
    order_index: 1
  },
  {
    id: 2,
    level: '初级',
    title: '食物与烹饪',
    description: '掌握餐厅点餐和烹饪相关对话',
    lesson_count: 15,
    order_index: 2
  },
  {
    id: 3,
    level: '中级',
    title: '商务会谈',
    description: '提升商务英语沟通能力',
    lesson_count: 20,
    order_index: 3
  }
];

// 生成课程句子数据（Unit 11 的示例）
const sentences = [
  {
    id: 1,
    lesson_id: 1,
    english: 'I think I\'ll wear the blue jeans today.',
    chinese: '我想我今天会穿那条蓝色牛仔裤。',
    phonetic: '/aɪ θɪŋk aɪl wer ðə bluː dʒiːnz təˈdeɪ/',
    audio: '',
    segments: null,
    answer: 'wear blue jeans',
    words: [
      { word: 'wear', pos: 'v.', definition: '穿；戴' },
      { word: 'blue', pos: 'adj.', definition: '蓝色的' },
      { word: 'jeans', pos: 'n.', definition: '牛仔裤' }
    ]
  },
  {
    id: 2,
    lesson_id: 1,
    english: 'The shirt needs ironing.',
    chinese: '这件衬衫需要熨烫。',
    phonetic: '/ðə ʃɜːt niːdz ˈaɪənɪŋ/',
    audio: '',
    segments: null,
    answer: 'needs ironing',
    words: [
      { word: 'shirt', pos: 'n.', definition: '衬衫' },
      { word: 'needs', pos: 'v.', definition: '需要' },
      { word: 'ironing', pos: 'v.', definition: '熨烫' }
    ]
  }
];

async function seedCourses() {
  const client = await pool.connect();
  
  try {
    await client.query('BEGIN');
    
    // 创建课程表
    await client.query(`
      CREATE TABLE IF NOT EXISTS courses (
        id SERIAL PRIMARY KEY,
        level VARCHAR(50),
        title VARCHAR(255) NOT NULL,
        description TEXT,
        lesson_count INTEGER DEFAULT 0,
        order_index INTEGER DEFAULT 0,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    
    // 创建课程表
    await client.query(`
      CREATE TABLE IF NOT EXISTS lessons (
        id SERIAL PRIMARY KEY,
        course_id INTEGER REFERENCES courses(id),
        title VARCHAR(255) NOT NULL,
        description TEXT,
        sentence_count INTEGER DEFAULT 0,
        order_index INTEGER DEFAULT 0,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    
    // 创建句子表
    await client.query(`
      CREATE TABLE IF NOT EXISTS sentences (
        id SERIAL PRIMARY KEY,
        lesson_id INTEGER REFERENCES lessons(id),
        english TEXT NOT NULL,
        chinese TEXT,
        phonetic VARCHAR(255),
        audio VARCHAR(500),
        segments JSONB,
        answer TEXT,
        words JSONB,
        order_index INTEGER DEFAULT 0,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    
    // 插入课程数据
    for (const course of courses) {
      await client.query(
        `INSERT INTO courses (id, level, title, description, lesson_count, order_index) 
         VALUES ($1, $2, $3, $4, $5, $6)
         ON CONFLICT (id) DO UPDATE SET
           level = EXCLUDED.level,
           title = EXCLUDED.title,
           description = EXCLUDED.description,
           order_index = EXCLUDED.order_index`,
        [course.id, course.level, course.title, course.description, course.lesson_count, course.order_index]
      );
    }
    
    // 插入示例课程
    const sampleLesson = {
      course_id: 1,
      title: 'Unit 11 · 衣物与穿搭 · 句子练习',
      description: '学习衣物相关的常用句型'
    };
    
    await client.query(
      `INSERT INTO lessons (course_id, title, description) 
       VALUES ($1, $2, $3)
       ON CONFLICT DO NOTHING`,
      [sampleLesson.course_id, sampleLesson.title, sampleLesson.description]
    );
    
    // 插入句子数据
    for (const sentence of sentences) {
      await client.query(
        `INSERT INTO sentences (id, lesson_id, english, chinese, phonetic, answer, words)
         VALUES ($1, $2, $3, $4, $5, $6, $7)
         ON CONFLICT (id) DO UPDATE SET
           lesson_id = EXCLUDED.lesson_id,
           english = EXCLUDED.english,
           chinese = EXCLUDED.chinese,
           phonetic = EXCLUDED.phonetic,
           answer = EXCLUDED.answer,
           words = EXCLUDED.words`,
        [sentence.id, sentence.lesson_id, sentence.english, sentence.chinese, 
         sentence.phonetic, sentence.answer, JSON.stringify(sentence.words)]
      );
    }
    
    await client.query('COMMIT');
    console.log('✅ 课程数据导入完成');
    console.log(`   导入课程：${courses.length} 个`);
    console.log(`   导入句子：${sentences.length} 条`);
    
  } catch (error) {
    await client.query('ROLLBACK');
    console.error('❌ 导入失败:', error);
    throw error;
  } finally {
    client.release();
  }
}

// 执行
seedCourses();
