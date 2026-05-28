import { drizzle } from 'drizzle-orm/better-sqlite3';
import Database from 'better-sqlite3';
import { sql } from 'drizzle-orm';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const dbPath = path.join(__dirname, '../data/english.db');
const sqlite = new Database(dbPath);
const db = drizzle(sqlite);

console.log('📦 创建错题本表...');

db.run(sql`
  CREATE TABLE IF NOT EXISTS user_favorites (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    sentence_id INTEGER NOT NULL,
    course_id INTEGER,
    note TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (sentence_id) REFERENCES sentences(id) ON DELETE CASCADE,
    UNIQUE(user_id, sentence_id)
  )
`);

db.run(sql`
  CREATE INDEX IF NOT EXISTS idx_user_favorites_user 
  ON user_favorites(user_id)
`);

db.run(sql`
  CREATE INDEX IF NOT EXISTS idx_user_favorites_course 
  ON user_favorites(user_id, course_id)
`);

console.log('✅ 错题本表创建完成');

sqlite.close();
