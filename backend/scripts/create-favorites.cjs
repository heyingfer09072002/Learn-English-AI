const Database = require('better-sqlite3');
const path = require('path');

const dbPath = path.join(__dirname, '../data/english.db');
const db = new Database(dbPath);

console.log('📦 创建错题本表...');

// 删除旧表（如果存在）
db.exec('DROP TABLE IF EXISTS user_favorites');

db.exec(`
  CREATE TABLE user_favorites (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    sentence_id INTEGER NOT NULL,
    course_id INTEGER,
    note TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(user_id, sentence_id)
  )
`);

db.exec(`
  CREATE INDEX IF NOT EXISTS idx_user_favorites_user 
  ON user_favorites(user_id)
`);

db.exec(`
  CREATE INDEX IF NOT EXISTS idx_user_favorites_course 
  ON user_favorites(user_id, course_id)
`);

console.log('✅ 错题本表创建完成');

const info = db.prepare("SELECT sql FROM sqlite_master WHERE type='table' AND name='user_favorites'").get();
console.log('📊 表结构:', info.sql);

db.close();
