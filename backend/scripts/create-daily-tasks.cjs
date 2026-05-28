const Database = require('better-sqlite3');
const path = require('path');

const dbPath = path.join(__dirname, '../data/english.db');
const db = new Database(dbPath);

console.log('📦 创建每日任务表...');

db.exec('PRAGMA foreign_keys = OFF');

// 任务模板表
db.exec(`
  CREATE TABLE IF NOT EXISTS daily_tasks_template (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    task_type TEXT NOT NULL,
    title TEXT NOT NULL,
    description TEXT,
    target_value INTEGER DEFAULT 1,
    points INTEGER DEFAULT 10,
    is_active BOOLEAN DEFAULT 1
  )
`);

// 用户每日任务表
db.exec(`
  CREATE TABLE IF NOT EXISTS daily_tasks (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    date TEXT NOT NULL,
    task_type TEXT NOT NULL,
    title TEXT NOT NULL,
    description TEXT,
    target_value INTEGER DEFAULT 1,
    current_value INTEGER DEFAULT 0,
    points INTEGER DEFAULT 10,
    is_completed BOOLEAN DEFAULT 0,
    completed_at DATETIME,
    claimed_at DATETIME,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(user_id, date, task_type)
  )
`);

// 用户打卡表
db.exec(`
  CREATE TABLE IF NOT EXISTS user_checkins (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    checkin_date TEXT NOT NULL,
    streak_count INTEGER DEFAULT 1,
    points_earned INTEGER DEFAULT 10,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(user_id, checkin_date)
  )
`);

// 用户积分表
db.exec(`
  CREATE TABLE IF NOT EXISTS user_points (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    total_points INTEGER DEFAULT 0,
    available_points INTEGER DEFAULT 0,
    used_points INTEGER DEFAULT 0,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(user_id)
  )
`);

// 积分流水表
db.exec(`
  CREATE TABLE IF NOT EXISTS user_points_log (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    change_type TEXT NOT NULL,
    points INTEGER NOT NULL,
    balance_after INTEGER,
    description TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  )
`);

db.exec(`
  CREATE INDEX IF NOT EXISTS idx_daily_tasks_user_date ON daily_tasks(user_id, date)
`);

db.exec(`
  CREATE INDEX IF NOT EXISTS idx_checkins_user ON user_checkins(user_id)
`);

db.exec('PRAGMA foreign_keys = ON');

console.log('✅ 每日任务表创建完成');

// 初始化默认任务模板
const defaultTasks = [
  ['learn_sentences', '学习句子', '完成 10 个句子的学习', 10, 20],
  ['practice_speaking', '口语练习', '完成 5 次口语评测', 5, 30],
  ['review_favorites', '复习错题', '复习 5 个收藏句子', 5, 15],
  ['complete_lesson', '完成课程', '完成 1 个课程的学习', 1, 50],
];

const exists = db.prepare("SELECT COUNT(*) as count FROM daily_tasks_template").get();
if (exists.count === 0) {
  const insert = db.prepare(`
    INSERT INTO daily_tasks_template (task_type, title, description, target_value, points)
    VALUES (?, ?, ?, ?, ?)
  `);
  defaultTasks.forEach(task => {
    insert.run(task[0], task[1], task[2], task[3], task[4]);
  });
  console.log('✅ 初始化默认任务模板');
}

// 关闭外键检查
db.exec('PRAGMA foreign_keys = OFF');

db.close();
