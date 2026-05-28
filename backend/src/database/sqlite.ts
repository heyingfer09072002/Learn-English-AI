import Database from 'better-sqlite3';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const dbPath = path.join(__dirname, '../../data/english.db');

export const db = new Database(dbPath);

db.pragma('journal_mode = WAL');

console.log('✅ SQLite 数据库已初始化:', dbPath);

export function query(sql: string, params: any[] = []) {
  try {
    const stmt = db.prepare(sql);
    if (sql.trim().toUpperCase().startsWith('SELECT')) {
      return stmt.all(...params);
    } else {
      return stmt.run(...params);
    }
  } catch (error: any) {
    console.error('❌ SQLite 查询错误:', error.message);
    console.error('SQL:', sql);
    throw error;
  }
}

export function close() {
  db.close();
  console.log('SQLite 连接已关闭');
}

process.on('SIGINT', () => {
  close();
  process.exit(0);
});
