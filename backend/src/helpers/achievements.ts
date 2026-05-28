import { db } from '../database/sqlite.js';

export const EXP_CONFIG = {
  learn_sentence: 2,
  master_sentence: 5,
  checkin: 20,
  checkin_streak: 5,
  add_favorite: 1,
  complete_task: 10,
  complete_course: 50,
};

export function addExperience(userId: number, exp: number, reason: string) {
  const current = getUserLevel(userId);
  const newExp = current.experience + exp;
  const levels = db.prepare('SELECT * FROM level_config ORDER BY level').all() as any[];
  
  let newLevel = current.level;
  for (const level of levels) {
    if (newExp >= level.experience_required) newLevel = level.level;
  }
  
  const title = levels.find(l => l.level === newLevel)?.title || '英语新手';
  
  db.prepare(`UPDATE user_levels SET level = ?, experience = ?, title = ?, updated_at = CURRENT_TIMESTAMP WHERE user_id = ?`)
    .run(newLevel, newExp, title, userId);
  
  return { level: newLevel, experience: newExp, title, leveledUp: newLevel > current.level, added: exp };
}

export function getUserLevel(userId: number) {
  const userLevel = db.prepare('SELECT level, experience, title FROM user_levels WHERE user_id = ?').get(userId) as any;
  if (!userLevel) {
    db.prepare('INSERT INTO user_levels (user_id, level, experience, title) VALUES (?, 1, 0, "英语新手")').run(userId);
    return { level: 1, experience: 0, title: '英语新手' };
  }
  return userLevel;
}

export function checkAchievements(userId: number) {
  const unlocked: any[] = [];
  const stats = db.prepare(`
    SELECT COUNT(DISTINCT p.sentence_id) as sentences_learned,
      SUM(CASE WHEN p.status = 'mastered' THEN 1 ELSE 0 END) as sentences_mastered,
      (SELECT COUNT(*) FROM user_checkins WHERE user_id = ?) as checkin_days,
      (SELECT MAX(streak_count) FROM user_checkins WHERE user_id = ?) as max_streak,
      (SELECT COUNT(*) FROM user_favorites WHERE user_id = ?) as favorites_count,
      (SELECT total_points FROM user_points WHERE user_id = ?) as total_points
    FROM user_progress p WHERE p.user_id = ?
  `).get(userId, userId, userId, userId, userId, userId) as any;
  
  if (!stats) return unlocked;
  const templates = db.prepare('SELECT * FROM achievement_templates ORDER BY sort_order').all() as any[];
  
  for (const template of templates) {
    const existing = db.prepare('SELECT id FROM user_achievements WHERE user_id = ? AND achievement_id = ?').get(userId, template.id);
    if (existing) continue;
    
    let progress = 0;
    switch (template.requirement_type) {
      case 'sentences_learned': progress = stats.sentences_learned || 0; break;
      case 'sentences_mastered': progress = stats.sentences_mastered || 0; break;
      case 'checkin_days': progress = stats.checkin_days || 0; break;
      case 'max_streak': progress = stats.max_streak || 0; break;
      case 'favorites_count': progress = stats.favorites_count || 0; break;
      case 'total_points': progress = stats.total_points || 0; break;
    }
    
    if (progress >= template.requirement_value) {
      db.prepare('INSERT INTO user_achievements (user_id, achievement_id, progress, unlocked_at) VALUES (?, ?, ?, CURRENT_TIMESTAMP)')
        .run(userId, template.id, progress);
      unlocked.push({ ...template, progress });
    }
  }
  return unlocked;
}
