import { Request, Response } from 'express';
import { db } from '../database/sqlite.js';
import { asyncHandler } from '../middleware/error.middleware.js';
import type { AuthRequest } from '../middleware/auth.middleware.js';
import { addExperience, checkAchievements } from '../helpers/achievements.js';

interface DailyTaskRequest extends AuthRequest {
  params: {
    taskId?: string;
  };
  body: {
    taskType?: string;
    progress?: number;
  };
}

// 今天是星期几
function getToday(): string {
  const now = new Date();
  return now.toISOString().split('T')[0];
}

// 计算连续打卡天数
function getStreak(userId: number): number {
  const today = getToday();
  const results = db.prepare(`
    SELECT checkin_date 
    FROM user_checkins 
    WHERE user_id = ? 
    ORDER BY checkin_date DESC
    LIMIT 30
  `).all(userId) as { checkin_date: string }[];
  
  if (results.length === 0) return 0;
  
  let streak = 0;
  let expectedDate = new Date(today);
  
  for (const row of results) {
    const checkinDate = new Date(row.checkin_date);
    const diffDays = Math.floor((expectedDate.getTime() - checkinDate.getTime()) / (1000 * 60 * 60 * 24));
    
    if (diffDays <= 1) {
      streak++;
      expectedDate = checkinDate;
    } else {
      break;
    }
  }
  
  return streak;
}

// 增加积分
function addPoints(userId: number, points: number, changeType: string, description: string) {
  // 更新用户积分
  const existing = db.prepare('SELECT * FROM user_points WHERE user_id = ?').get(userId);
  
  if (existing) {
    db.prepare(`
      UPDATE user_points 
      SET total_points = total_points + ?, 
          available_points = available_points + ?,
          updated_at = CURRENT_TIMESTAMP
      WHERE user_id = ?
    `).run(points, points, userId);
  } else {
    db.prepare(`
      INSERT INTO user_points (user_id, total_points, available_points)
      VALUES (?, ?, ?)
    `).run(userId, points, points);
  }
  
  // 记录流水
  const balance = db.prepare('SELECT available_points FROM user_points WHERE user_id = ?').get(userId) as any;
  db.prepare(`
    INSERT INTO user_points_log (user_id, change_type, points, balance_after, description)
    VALUES (?, ?, ?, ?, ?)
  `).run(userId, changeType, points, balance.available_points, description);
}

/**
 * 获取今日任务列表
 */
export const getTodayTasks = asyncHandler(async (req: DailyTaskRequest, res: Response) => {
  const userId = req.user!.userId;
  const today = getToday();
  
  // 获取或创建今日任务
  const templates = db.prepare(`
    SELECT * FROM daily_tasks_template WHERE is_active = 1
  `).all() as any[];
  
  const tasks = templates.map(template => {
    let task = db.prepare(`
      SELECT * FROM daily_tasks 
      WHERE user_id = ? AND date = ? AND task_type = ?
    `).get(userId, today, template.task_type) as any;
    
    if (!task) {
      // 创建新任务
      db.prepare(`
        INSERT INTO daily_tasks (user_id, date, task_type, title, description, target_value, points)
        VALUES (?, ?, ?, ?, ?, ?, ?)
      `).run(userId, today, template.task_type, template.title, template.description, template.target_value, template.points);
      
      task = db.prepare(`
        SELECT * FROM daily_tasks 
        WHERE user_id = ? AND date = ? AND task_type = ?
      `).get(userId, today, template.task_type);
    }
    
    return {
      ...task,
      progress: task.current_value,
      total: task.target_value,
      percent: Math.min(100, Math.floor((task.current_value / task.target_value) * 100)),
    };
  });
  
  // 获取积分和连续天数
  const points = db.prepare('SELECT * FROM user_points WHERE user_id = ?').get(userId) as any || {
    total_points: 0,
    available_points: 0,
  };
  
  const streak = getStreak(userId);
  const hasCheckin = db.prepare(`
    SELECT id FROM user_checkins WHERE user_id = ? AND checkin_date = ?
  `).get(userId, today);
  
  res.json({
    success: true,
    data: {
      date: today,
      tasks,
      points: {
        total: points.total_points,
        available: points.available_points,
      },
      streak,
      hasCheckin: !!hasCheckin,
    },
  });
});

/**
 * 更新任务进度
 */
export const updateTaskProgress = asyncHandler(async (req: DailyTaskRequest, res: Response) => {
  const userId = req.user!.userId;
  const { taskType, progress } = req.body;
  const today = getToday();
  
  if (!taskType) {
    return res.status(400).json({ success: false, error: '任务类型不能为空' });
  }
  
  const task = db.prepare(`
    SELECT * FROM daily_tasks 
    WHERE user_id = ? AND date = ? AND task_type = ?
  `).get(userId, today, taskType) as any;
  
  if (!task) {
    return res.status(404).json({ success: false, error: '任务不存在' });
  }
  
  if (task.is_completed) {
    return res.status(400).json({ success: false, error: '任务已完成' });
  }
  
  const newValue = task.current_value + (progress || 1);
  const isCompleted = newValue >= task.target_value ? 1 : 0;
  
  db.prepare(`
    UPDATE daily_tasks 
    SET current_value = ?, 
        is_completed = ?, 
        completed_at = CASE WHEN ? = 1 THEN CURRENT_TIMESTAMP ELSE NULL END
    WHERE user_id = ? AND date = ? AND task_type = ?
  `).run(newValue, isCompleted, isCompleted, userId, today, taskType);
  
  // 完成任务奖励积分
  if (isCompleted && !task.is_completed) {
    addPoints(userId, task.points, 'task_complete', `完成任务：${task.title}`);
  }
  
  res.json({
    success: true,
    data: {
      current: newValue,
      isCompleted: !!isCompleted,
      earned: isCompleted ? task.points : 0,
    },
  });
});

/**
 * 打卡
 */
export const checkin = asyncHandler(async (req: DailyTaskRequest, res: Response) => {
  const userId = req.user!.userId;
  const today = getToday();
  
  const existing = db.prepare(`
    SELECT * FROM user_checkins WHERE user_id = ? AND checkin_date = ?
  `).get(userId, today);
  
  if (existing) {
    return res.status(400).json({ success: false, error: '今日已打卡' });
  }
  
  const streak = getStreak(userId) + 1;
  const bonusPoints = Math.min(50, streak); // 连续奖励，最多 50 分
  const basePoints = 10;
  const totalPoints = basePoints + bonusPoints;
  
  db.prepare(`
    INSERT INTO user_checkins (user_id, checkin_date, streak_count, points_earned)
    VALUES (?, ?, ?, ?)
  `).run(userId, today, streak, totalPoints);
  
  addPoints(userId, totalPoints, 'checkin', `打卡奖励 +${totalPoints}积分（连续${streak}天）`);
  
  // 增加经验值
  const expResult = addExperience(userId, 20 + streak, `打卡 +${streak}天连续`);
  const achievements = checkAchievements(userId);
  
  res.json({
    success: true,
    message: '打卡成功',
    data: {
      streak,
      points: totalPoints,
      experience: expResult,
      newAchievements: achievements,
    },
  });
});

/**
 * 获取积分流水
 */
export const getPointsHistory = asyncHandler(async (req: DailyTaskRequest, res: Response) => {
  const userId = req.user!.userId;
  const limit = parseInt(req.query.limit as string) || 20;
  
  const history = db.prepare(`
    SELECT * FROM user_points_log 
    WHERE user_id = ? 
    ORDER BY created_at DESC 
    LIMIT ?
  `).all(userId, limit);
  
  res.json({
    success: true,
    data: history,
  });
});

/**
 * 获取打卡日历
 */
export const getCheckinCalendar = asyncHandler(async (req: DailyTaskRequest, res: Response) => {
  const userId = req.user!.userId;
  const month = req.query.month as string || getToday().slice(0, 7);
  
  const checkins = db.prepare(`
    SELECT checkin_date, streak_count 
    FROM user_checkins 
    WHERE user_id = ? AND checkin_date LIKE ?
    ORDER BY checkin_date DESC
  `).all(userId, `${month}%`) as any[];
  
  const streak = getStreak(userId);
  
  res.json({
    success: true,
    data: {
      month,
      checkins: checkins.map(c => c.checkin_date),
      streak,
    },
  });
});

export const DailyTasksController = {
  getTodayTasks,
  updateTaskProgress,
  checkin,
  getPointsHistory,
  getCheckinCalendar,
};
