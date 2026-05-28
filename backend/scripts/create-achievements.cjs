const Database = require('better-sqlite3');
const path = require('path');

const dbPath = path.join(__dirname, '../data/english.db');
const db = new Database(dbPath);

console.log('📦 创建成就系统表...');

db.exec('PRAGMA foreign_keys = OFF');

db.exec(`
  CREATE TABLE IF NOT EXISTS achievement_templates (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    code TEXT UNIQUE NOT NULL,
    name TEXT NOT NULL,
    description TEXT,
    icon TEXT,
    category TEXT,
    requirement_type TEXT,
    requirement_value INTEGER,
    badge_level TEXT,
    is_hidden BOOLEAN DEFAULT 0,
    sort_order INTEGER DEFAULT 0
  )
`);

db.exec(`
  CREATE TABLE IF NOT EXISTS user_achievements (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    achievement_id INTEGER NOT NULL,
    unlocked_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    progress INTEGER DEFAULT 0,
    is_claimed BOOLEAN DEFAULT 0,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (achievement_id) REFERENCES achievement_templates(id) ON DELETE CASCADE,
    UNIQUE(user_id, achievement_id)
  )
`);

db.exec(`
  CREATE TABLE IF NOT EXISTS user_levels (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    level INTEGER DEFAULT 1,
    experience INTEGER DEFAULT 0,
    title TEXT,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    UNIQUE(user_id)
  )
`);

db.exec(`
  CREATE TABLE IF NOT EXISTS level_config (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    level INTEGER UNIQUE NOT NULL,
    title TEXT NOT NULL,
    experience_required INTEGER NOT NULL,
    icon TEXT
  )
`);

db.exec('CREATE INDEX IF NOT EXISTS idx_user_achievements_user ON user_achievements(user_id)');

db.exec('PRAGMA foreign_keys = ON');

console.log('✅ 成就系统表创建完成');

// 初始化等级配置
const levelConfig = [
  [1, '英语新手', 0, '👶'],
  [2, '学习达人', 100, '📚'],
  [3, '进步之星', 300, '⭐'],
  [4, '勤奋学霸', 600, '🎓'],
  [5, '英语高手', 1000, '🏆'],
  [6, '语言大师', 1500, '👑'],
  [7, '传奇学者', 2500, '🌟'],
];

const levelExists = db.prepare("SELECT COUNT(*) as count FROM level_config").get();
if (levelExists.count === 0) {
  const insert = db.prepare('INSERT INTO level_config (level, title, experience_required, icon) VALUES (?, ?, ?, ?)');
  levelConfig.forEach(l => insert.run(l[0], l[1], l[2], l[3]));
  console.log('✅ 初始化等级配置');
}

// 初始化成就模板（只插入基本成就）
const achievements = [
  ['first_learning', '初次学习', '完成第一次学习', '🎉', 'learning', 'sentences_learned', 1, 'bronze', 0, 1],
  ['learning_10', '学习新手', '累计学习 10 个句子', '📖', 'learning', 'sentences_learned', 10, 'bronze', 0, 2],
  ['learning_100', '学习达人', '累计学习 100 个句子', '📚', 'learning', 'sentences_learned', 100, 'silver', 0, 3],
  ['first_checkin', '初次打卡', '第一次打卡', '📅', 'checkin', 'checkin_days', 1, 'bronze', 0, 4],
  ['checkin_7', '周坚持', '连续打卡 7 天', '🔥', 'checkin', 'max_streak', 7, 'silver', 0, 5],
  ['first_favorite', '初次收藏', '第一次收藏句子', '⭐', 'favorites', 'favorites_count', 1, 'bronze', 0, 6],
];

const achExists = db.prepare("SELECT COUNT(*) as count FROM achievement_templates").get();
if (achExists.count === 0) {
  const insert = db.prepare(`INSERT INTO achievement_templates 
    (code, name, description, icon, category, requirement_type, requirement_value, badge_level, is_hidden, sort_order) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`);
  achievements.forEach(a => insert.run(a[0], a[1], a[2], a[3], a[4], a[5], a[6], a[7], a[8], a[9]));
  console.log('✅ 初始化成就模板');
}

db.close();
console.log('✅ 成就系统初始化完成');
