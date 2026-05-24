/**
 * 课程数据导入脚本 v2
 */

import { pool } from '../src/database/index.js';

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
    level: '中级',
    title: '食物与烹饪',
    description: '掌握餐厅点餐和烹饪相关对话',
    lesson_count: 15,
    order_index: 2
  },
  {
    id: 3,
    level: '高级',
    title: '商务会谈',
    description: '提升商务英语沟通能力',
    lesson_count: 20,
    order_index: 3
  }
];

async function main() {
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
    
    // 插入或更新课程数据
    for (const course of courses) {
      await client.query(
        `INSERT INTO courses (id, level, title, description, lesson_count, order_index)
         VALUES ($1, $2, $3, $4, $5, $6)
         ON CONFLICT (id) DO UPDATE SET
           level = EXCLUDED.level,
           title = EXCLUDED.title,
           description = EXCLUDED.description,
           lesson_count = EXCLUDED.lesson_count,
           order_index = EXCLUDED.order_index,
           updated_at = CURRENT_TIMESTAMP`,
        [course.id, course.level, course.title, course.description, course.lesson_count, course.order_index]
      );
    }
    
    await client.query('COMMIT');
    console.log('✅ 课程数据导入成功!');
    console.log(`   课程数量：${courses.length} 个`);
  } catch (err) {
    await client.query('ROLLBACK');
    console.error('❌ 导入失败:', err);
    throw err;
  } finally {
    client.release();
  }
}

main();
