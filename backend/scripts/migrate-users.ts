#!/usr/bin/env tsx
/**
 * 用户系统和 VIP 相关表结构迁移
 */

import { db } from '../src/database/sqlite.js';

console.log('🔧 开始创建用户系统表结构...\n');

const migrations = [
  // 用户表
  `CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    email TEXT UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    username TEXT,
    avatar_url TEXT DEFAULT '/avatar.png',
    is_vip INTEGER DEFAULT 0,
    vip_expire_at DATETIME,
    level INTEGER DEFAULT 1,
    exp INTEGER DEFAULT 0,
    total_practice_time INTEGER DEFAULT 0,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    last_login DATETIME,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
  )`,

  // 学习进度表
  `CREATE TABLE IF NOT EXISTS user_progress (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    course_id INTEGER NOT NULL,
    sentence_id INTEGER NOT NULL,
    status TEXT DEFAULT 'new',
    accuracy REAL,
    attempts INTEGER DEFAULT 0,
    last_practiced DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id),
    UNIQUE(user_id, sentence_id)
  )`,

  // 错题本/收藏表
  `CREATE TABLE IF NOT EXISTS user_favorites (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    sentence_id INTEGER NOT NULL,
    note TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id),
    UNIQUE(user_id, sentence_id)
  )`,

  // VIP 订单表
  `CREATE TABLE IF NOT EXISTS vip_orders (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    order_no TEXT UNIQUE NOT NULL,
    amount REAL NOT NULL,
    duration_days INTEGER NOT NULL,
    status TEXT DEFAULT 'pending',
    paid_at DATETIME,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id)
  )`,

  // 创建索引
  `CREATE INDEX IF NOT EXISTS idx_user_progress_user ON user_progress(user_id)`,
  `CREATE INDEX IF NOT EXISTS idx_user_progress_sentence ON user_progress(sentence_id)`,
  `CREATE INDEX IF NOT EXISTS idx_user_favorites_user ON user_favorites(user_id)`,
  `CREATE INDEX IF NOT EXISTS idx_vip_orders_user ON vip_orders(user_id)`,
  `CREATE INDEX IF NOT EXISTS idx_users_email ON users(email)`
];

let successCount = 0;
for (const sql of migrations) {
  try {
    const tableName = sql.match(/CREATE TABLE IF NOT EXISTS (\w+)/)?.[1] || 
                      sql.match(/CREATE INDEX IF NOT EXISTS (\w+)/)?.[1];
    db.exec(sql);
    console.log(`✅ 创建：${tableName}`);
    successCount++;
  } catch (error: any) {
    console.error(`❌ 失败:`, error.message);
  }
}

console.log(`\n🎉 迁移完成！成功创建 ${successCount}/${migrations.length} 个表/索引`);
