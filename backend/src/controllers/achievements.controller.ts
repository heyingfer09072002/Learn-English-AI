import { Request, Response } from 'express';
import { db } from '../database/sqlite.js';
import { asyncHandler } from '../middleware/error.middleware.js';
import type { AuthRequest } from '../middleware/auth.middleware.js';

interface AchievementRequest extends AuthRequest {}

// 获取用户当前等级
function getUserLevel(userId: number) {
  const userLevel = db.prepare(`
    SELECT level, experience, title 
    FROM user_levels 
    WHERE user_id = ?
  `).get(userId) as any;
  
  // 如果是新用户，创建初始等级
  if (!userLevel) {
    db.prepare(`
      INSERT INTO user_levels (user_id, level, experience, title)
      VALUES (?, 1, 0, '英语新手')
    `).run(userId);
    return { level: 1, experience: 0, title: '英语新手' };
  }
  
  return userLevel;
}

// 增加经验值
function addExperience(userId: number, exp: number, reason: string) {
  const current = getUserLevel(userId);
  const newExp = current.experience + exp;
  
  // 获取等级配置
  const levels = db.prepare('SELECT * FROM level_config ORDER BY level').all() as any[];
  
  // 计算新等级
  let newLevel = current.level;
  for (const level of levels) {
    if (newExp >= level.experience_required) {
      newLevel = level.level;
    }
  }
  
  const title = levels.find(l => l.level === newLevel)?.title || '英语新手';
  
  // 更新等级
  db.prepare(`
    UPDATE user_levels 
    SET level = ?, experience = ?, title = ?, updated_at = CURRENT_TIMESTAMP
    WHERE user_id = ?
  `).run(newLevel, newExp, title, userId);
  
  return {
    level: newLevel,
    experience: newExp,
    title,
    leveledUp: newLevel > current.level,
  };
}

// 检查和解锁成就
function checkAchievements(userId: number) {
  const unlocked: any[] = [];
  
  // 获取用户统计数据
  const stats = db.prepare(`
    SELECT 
      COUNT(DISTINCT p.sentence_id) as sentences_learned,
      SUM(CASE WHEN p.status = 'mastered' THEN 1 ELSE 0 END) as sentences_mastered,
      AVG(p.accuracy) as avg_accuracy,
      (SELECT COUNT(*) FROM user_checkins WHERE user_id = ?) as checkin_days,
      (SELECT MAX(streak_count) FROM user_checkins WHERE user_id = ?) as max_streak,
      (SELECT COUNT(*) FROM user_favorites WHERE user_id = ?) as favorites_count,
      (SELECT total_points FROM user_points WHERE user_id = ?) as total_points
    FROM user_progress p
    WHERE p.user_id = ?
  `).get(userId, userId, userId, userId, userId, userId) as any;
  
  if (!stats) return unlocked;
  
  // 获取所有成就模板
  const templates = db.prepare('SELECT * FROM achievement_templates ORDER BY sort_order').all() as any[];
  
  for (const template of templates) {
    // 检查是否已解锁
    const existing = db.prepare(`
      SELECT id FROM user_achievements 
      WHERE user_id = ? AND achievement_id = ?
    `).get(userId, template.id);
    
    if (existing) continue; // 已解锁，跳过
    
    // 获取当前进度
    let currentProgress = 0;
    switch (template.requirement_type) {
      case 'sentences_learned':
        currentProgress = stats.sentences_learned || 0;
        break;
      case 'sentences_mastered':
        currentProgress = stats.sentences_mastered || 0;
        break;
      case 'checkin_days':
        currentProgress = stats.checkin_days || 0;
        break;
      case 'max_streak':
        currentProgress = stats.max_streak || 0;
        break;
      case 'favorites_count':
        currentProgress = stats.favorites_count || 0;
        break;
      case 'total_points':
        currentProgress = stats.total_points || 0;
        break;
      case 'avg_accuracy':
        currentProgress = stats.avg_accuracy ? Math.round(stats.avg_accuracy) : 0;
        break;
    }
    
    // 检查是否满足条件
    if (currentProgress >= template.requirement_value) {
      db.prepare(`
        INSERT INTO user_achievements (user_id, achievement_id, progress, unlocked_at)
        VALUES (?, ?, ?, CURRENT_TIMESTAMP)
      `).run(userId, template.id, currentProgress);
      
      unlocked.push({
        ...template,
        progress: currentProgress,
      });
    }
  }
  
  return unlocked;
}

/**
 * 获取成就列表
 */
export const getAchievements = asyncHandler(async (req: AchievementRequest, res: Response) => {
  const userId = req.user!.userId;
  
  // 获取所有成就模板
  const templates = db.prepare(`
    SELECT * FROM achievement_templates ORDER BY category, sort_order
  `).all() as any[];
  
  // 获取用户已解锁成就
  const userAchievements = db.prepare(`
    SELECT achievement_id, progress, unlocked_at 
    FROM user_achievements 
    WHERE user_id = ?
  `).all(userId) as any[];
  
  const unlockedIds = new Set(userAchievements.map(a => a.achievement_id));
  const progressMap = new Map(userAchievements.map(a => [a.achievement_id, a.progress]));
  
  // 合并数据
  const achievements = templates.map(t => ({
    ...t,
    unlocked: unlockedIds.has(t.id),
    progress: progressMap.get(t.id) || 0,
    percent: Math.min(100, Math.floor(((progressMap.get(t.id) || 0) / t.requirement_value) * 100)),
  }));
  
  // 按类别分组
  const grouped = achievements.reduce((acc, a) => {
    if (!acc[a.category]) acc[a.category] = [];
    acc[a.category].push(a);
    return acc;
  }, {} as Record<string, any[]>);
  
  res.json({
    success: true,
    data: {
      total: achievements.length,
      unlocked: unlockedIds.size,
      grouped,
    },
  });
});

/**
 * 获取用户等级
 */
export const getUserLevelInfo = asyncHandler(async (req: AchievementRequest, res: Response) => {
  const userId = req.user!.userId;
  
  const current = getUserLevel(userId);
  const levels = db.prepare('SELECT * FROM level_config ORDER BY level').all() as any[];
  
  const nextLevel = levels.find(l => l.experience_required > current.experience);
  const prevLevel = levels.filter(l => l.experience_required <= current.experience).pop();
  
  const expNeeded = nextLevel ? nextLevel.experience_required - current.experience : 0;
  const expFromPrev = prevLevel ? current.experience - prevLevel.experience_required : current.experience;
  const expToNext = nextLevel ? nextLevel.experience_required - (prevLevel?.experience_required || 0) : 1;
  const percent = expToNext > 0 ? Math.floor((expFromPrev / expToNext) * 100) : 100;
  
  // 检查并解锁成就
  const newAchievements = checkAchievements(userId);
  
  res.json({
    success: true,
    data: {
      level: current.level,
      title: current.title,
      experience: current.experience,
      nextLevel: nextLevel ? nextLevel.level : null,
      expNeeded,
      expToNextLevel: expToNext,
      percent,
      icon: levels.find(l => l.level === current.level)?.icon || '👶',
      newAchievements,
    },
  });
});

/**
 * 增加经验值（外部调用）
 */
export const addExp = asyncHandler(async (req: Request, res: Response) => {
  const { userId, exp, reason } = req.body;
  
  if (!userId || !exp) {
    return res.status(400).json({ success: false, error: '参数错误' });
  }
  
  const result = addExperience(userId, exp, reason);
  const achievements = checkAchievements(userId);
  
  res.json({
    success: true,
    data: {
      ...result,
      newAchievements: achievements,
    },
  });
});

/**
 * 获取等级配置
 */
export const getLevelConfig = asyncHandler(async (req: Request, res: Response) => {
  const levels = db.prepare('SELECT * FROM level_config ORDER BY level').all();
  
  res.json({
    success: true,
    data: levels,
  });
});

export const AchievementsController = {
  getAchievements,
  getUserLevelInfo,
  addExp,
  getLevelConfig,
};
