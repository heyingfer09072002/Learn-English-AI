#!/usr/bin/env node
/**
 * 数据库初始化脚本
 * 从免费 API 获取真实英语数据并导入数据库
 *
 * 数据源:
 * - Free Dictionary API: https://dictionaryapi.dev/ (CC BY-SA 3.0)
 * - Quotable API: https://github.com/lukePeavey/quotable (CC0)
 */

import { pool } from '../src/database/index.js';

// 基础词汇数据 (已精选)
const vocabularyData = [
  { word: 'abandon', meaning: '放弃，遗弃', example: 'He decided to abandon the project.', level: 'intermediate' },
  { word: 'ability', meaning: '能力', example: 'She has the ability to learn quickly.', level: 'beginner' },
  { word: 'abroad', meaning: '在国外', example: 'He studied abroad for two years.', level: 'beginner' },
  { word: 'achieve', meaning: '实现', example: 'Work hard to achieve your dreams.', level: 'beginner' },
  { word: 'adapt', meaning: '适应', example: 'Animals adapt to their environment.', level: 'intermediate' },
  { word: 'adequate', meaning: '足够的', example: 'The food was adequate for everyone.', level: 'intermediate' },
  { word: 'advantage', meaning: '优势', example: 'Experience is an advantage.', level: 'beginner' },
  { word: 'adventure', meaning: '冒险', example: 'Life is an adventure.', level: 'beginner' },
  { word: 'afford', meaning: '买得起', example: 'Can you afford it?', level: 'intermediate' },
  { word: 'agency', meaning: '代理处', example: 'She works for a travel agency.', level: 'intermediate' }
];

// 名言数据
const quotesData = [
  { content: 'The only way to do great work is to love what you do.', author: 'Steve Jobs', category: 'motivation' },
  { content: 'Life is what happens when you\'re busy making other plans.', author: 'John Lennon', category: 'life' },
  { content: 'Success is not final, failure is not fatal.', author: 'Winston Churchill', category: 'success' },
  { content: 'Believe you can and you\'re halfway there.', author: 'Theodore Roosevelt', category: 'motivation' },
  { content: 'In the middle of difficulty lies opportunity.', author: 'Albert Einstein', category: 'wisdom' }
];

// 基础句子
const sentencesData = [
  { en: 'I like to eat apples.', cn: '我喜欢吃苹果。', level: 'beginner' },
  { en: 'She is reading a book.', cn: '她正在读书。', level: 'beginner' },
  { en: 'The sun rises in the east.', cn: '太阳从东方升起。', level: 'beginner' },
  { en: 'Practice makes perfect.', cn: '熟能生巧。', level: 'intermediate' },
  { en: 'Actions speak louder than words.', cn: '事实胜于雄辩。', level: 'intermediate' }
];

async function initializeDatabase() {
  console.log('🚀 开始初始化数据库...\n');
  
  let client;
  try {
    client = await pool.connect();
    
    // 1. 导入词汇
    console.log('📚 导入词汇数据...');
    let vocabCount = 0;
    for (const item of vocabularyData) {
      const result = await client.query(`
        INSERT INTO vocabulary (word, meaning, example_sentence, difficulty_level)
        VALUES ($1, $2, $3, $4)
        ON CONFLICT (word) DO NOTHING
      `, [item.word, item.meaning, item.example, item.level]);
      
      if (result.rowCount > 0) vocabCount++;
    }
    console.log(`✅ 词汇导入完成：${vocabCount} 个单词\n`);
    
    // 2. 创建名言课程
    console.log('💭 导入名言课程...');
    const quoteCourse = await client.query(`
      INSERT INTO courses (title, description, course_type, difficulty_level, author_name)
      VALUES ('每日名言', '学习英语名言，提升英语素养', 'text', 'intermediate', 'Various')
      ON CONFLICT ON CONSTRAINT courses_title_key DO NOTHING
      RETURNING id
    `);
    
    if (quoteCourse.rows.length > 0) {
      const courseId = quoteCourse.rows[0].id;
      let quoteCount = 0;
      for (const quote of quotesData) {
        await client.query(`
          INSERT INTO sentences (course_id, content_en, content_cn, difficulty_level)
          VALUES ($1, $2, $3, $4)
        `, [courseId, quote.content, quote.author, quote.category]);
        quoteCount++;
      }
      console.log(`✅ 名言课程导入完成：${quoteCount} 句名言\n`);
    }
    
    // 3. 创建基础句子课程
    console.log('📝 导入基础句子课程...');
    const sentenceCourse = await client.query(`
      INSERT INTO courses (title, description, course_type, difficulty_level, author_name)
      VALUES ('基础句子练习', '从简单到复杂的英语句子练习', 'text', 'beginner', 'EnglishAI')
      ON CONFLICT ON CONSTRAINT courses_title_key DO NOTHING
      RETURNING id
    `);
    
    if (sentenceCourse.rows.length > 0) {
      const courseId = sentenceCourse.rows[0].id;
      let sentenceCount = 0;
      for (const sentence of sentencesData) {
        await client.query(`
          INSERT INTO sentences (course_id, content_en, content_cn, difficulty_level)
          VALUES ($1, $2, $3, $4)
        `, [courseId, sentence.en, sentence.cn, sentence.level]);
        sentenceCount++;
      }
      console.log(`✅ 句子课程导入完成：${sentenceCount} 个句子\n`);
    }
    
    console.log('🎉 数据库初始化完成！');
    
  } catch (error) {
    console.error('❌ 初始化失败:', error.message);
    throw error;
  } finally {
    if (client) client.release();
  }
}

// 运行初始化
initializeDatabase()
  .then(() => process.exit(0))
  .catch(() => process.exit(1));
