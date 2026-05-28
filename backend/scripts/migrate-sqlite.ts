#!/usr/bin/env tsx
/**
 * SQLite 数据库迁移脚本
 * 创建所有必需的表结构
 */

import { db } from '../src/database/sqlite.js';

console.log('🚀 开始数据库迁移...\n');

const migrations = [
  // 用户表
  `CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT UNIQUE NOT NULL,
    email TEXT UNIQUE NOT NULL,
    password_hash TEXT,
    avatar_url TEXT DEFAULT '/avatar.png',
    level INTEGER DEFAULT 1,
    exp INTEGER DEFAULT 0,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    last_login DATETIME
  )`,

  // 课程表
  `CREATE TABLE IF NOT EXISTS courses (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT UNIQUE NOT NULL,
    description TEXT,
    course_type TEXT DEFAULT 'text',
    difficulty_level TEXT,
    author_name TEXT,
    cover_image TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  )`,

  // 句子表
  `CREATE TABLE IF NOT EXISTS sentences (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    course_id INTEGER NOT NULL,
    content_en TEXT NOT NULL,
    content_cn TEXT,
    difficulty_level TEXT,
    audio_url TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (course_id) REFERENCES courses(id)
  )`,

  // 词汇表
  `CREATE TABLE IF NOT EXISTS vocabulary (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    word TEXT UNIQUE NOT NULL,
    meaning TEXT,
    example_sentence TEXT,
    difficulty_level TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  )`,

  // 学习进度表
  `CREATE TABLE IF NOT EXISTS progress (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER,
    sentence_id INTEGER NOT NULL,
    status TEXT DEFAULT 'new',
    attempts INTEGER DEFAULT 0,
    correct_count INTEGER DEFAULT 0,
    last_practiced DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id),
    FOREIGN KEY (sentence_id) REFERENCES sentences(id)
  )`,

  // 发音评分表
  `CREATE TABLE IF NOT EXISTS pronunciation_scores (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER,
    sentence_id INTEGER NOT NULL,
    score REAL,
    feedback TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id),
    FOREIGN KEY (sentence_id) REFERENCES sentences(id)
  )`,

  // PK 对战记录表
  `CREATE TABLE IF NOT EXISTS pk_battles (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER,
    opponent_name TEXT,
    score INTEGER,
    accuracy REAL,
    sentences_completed INTEGER,
    result TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id)
  )`,

  // 成就表
  `CREATE TABLE IF NOT EXISTS achievements (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    achievement_type TEXT NOT NULL,
    title TEXT NOT NULL,
    description TEXT,
    earned_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id)
  )`
];

let successCount = 0;
for (const sql of migrations) {
  try {
    const tableName = sql.match(/CREATE TABLE IF NOT EXISTS (\w+)/)?.[1];
    db.exec(sql);
    console.log(`✅ 创建表：${tableName}`);
    successCount++;
  } catch (error: any) {
    console.error(`❌ 创建表失败:`, error.message);
  }
}

console.log(`\n🎉 迁移完成！成功创建 ${successCount}/${migrations.length} 个表`);
