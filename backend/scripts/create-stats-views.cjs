const Database = require('better-sqlite3');
const path = require('path');

const dbPath = path.join(__dirname, '../data/english.db');
const db = new Database(dbPath);

console.log('📦 创建统计视图...');

db.exec('PRAGMA foreign_keys = OFF');

// 用户学习统计
db.exec(`
  CREATE VIEW IF NOT EXISTS user_learning_stats AS
  SELECT 
    u.id as user_id,
    u.email,
    u.username,
    u.vip_level,
    u.created_at as join_date,
    COUNT(DISTINCT p.course_id) as courses_learned,
    COUNT(DISTINCT p.sentence_id) as sentences_learned,
    SUM(CASE WHEN p.status = 'mastered' THEN 1 ELSE 0 END) as sentences_mastered,
    AVG(p.accuracy) as avg_accuracy,
    (SELECT COUNT(*) FROM user_favorites f WHERE f.user_id = u.id) as favorites_count,
    (SELECT COUNT(*) FROM user_checkins c WHERE c.user_id = u.id) as checkin_days,
    (SELECT MAX(streak_count) FROM user_checkins c WHERE c.user_id = u.id) as max_streak
  FROM users u
  LEFT JOIN user_progress p ON u.id = p.user_id
  GROUP BY u.id
`);

// 每日学习统计（近 30 天）
db.exec(`
  CREATE VIEW IF NOT EXISTS daily_learning_stats AS
  SELECT 
    date(created_at) as date,
    COUNT(*) as sentences_count,
    COUNT(DISTINCT user_id) as active_users,
    AVG(accuracy) as avg_accuracy
  FROM user_progress
  WHERE created_at >= date('now', '-30 days')
  GROUP BY date(created_at)
  ORDER BY date DESC
`);

db.exec('PRAGMA foreign_keys = ON');

console.log('✅ 统计视图创建完成');

db.close();
