import { Request, Response } from 'express';
import { db } from '../database/sqlite.js';
import { asyncHandler } from '../middleware/error.middleware.js';
import type { AuthRequest } from '../middleware/auth.middleware.js';

interface StatsRequest extends AuthRequest {
  query: {
    days?: string;
    startDate?: string;
    endDate?: string;
  };
}

/**
 * 获取个人学习概览
 */
export const getOverview = asyncHandler(async (req: StatsRequest, res: Response) => {
  const userId = req.user!.userId;
  
  const stats = db.prepare(`
    SELECT 
      COUNT(DISTINCT course_id) as coursesLearned,
      COUNT(DISTINCT sentence_id) as sentencesLearned,
      SUM(CASE WHEN status = 'mastered' THEN 1 ELSE 0 END) as sentencesMastered,
      AVG(accuracy) as avgAccuracy,
      MIN(date(created_at)) as firstLearnDate,
      COUNT(*) as totalPractices
    FROM user_progress
    WHERE user_id = ?
  `).get(userId) as any;
  
  const favorites = db.prepare(`
    SELECT COUNT(*) as count FROM user_favorites WHERE user_id = ?
  `).get(userId) as any;
  
  const checkins = db.prepare(`
    SELECT COUNT(*) as count, MAX(streak_count) as maxStreak 
    FROM user_checkins 
    WHERE user_id = ?
  `).get(userId) as any;
  
  // 计算学习时长（假设每个句子 2 分钟）
  const totalMinutes = (stats.sentencesLearned || 0) * 2;
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;
  
  res.json({
    success: true,
    data: {
      coursesLearned: stats.coursesLearned || 0,
      sentencesLearned: stats.sentencesLearned || 0,
      sentencesMastered: stats.sentencesMastered || 0,
      avgAccuracy: stats.avgAccuracy ? Math.round(stats.avgAccuracy) : 0,
      totalPractices: stats.totalPractices || 0,
      learningTime: { hours, minutes },
      favoritesCount: favorites.count,
      checkinDays: checkins.count,
      maxStreak: checkins.maxStreak || 0,
      firstLearnDate: stats.firstLearnDate,
    },
  });
});

/**
 * 获取学习趋势（每日学习数据）
 */
export const getLearningTrend = asyncHandler(async (req: StatsRequest, res: Response) => {
  const userId = req.user!.userId;
  const days = parseInt(req.query.days || '30');
  
  const trend = db.prepare(`
    SELECT 
      date(created_at) as date,
      COUNT(*) as count,
      AVG(accuracy) as avgAccuracy,
      SUM(CASE WHEN status = 'mastered' THEN 1 ELSE 0 END) as mastered
    FROM user_progress
    WHERE user_id = ? 
      AND created_at >= date('now', ?)
    GROUP BY date(created_at)
    ORDER BY date ASC
  `).all(userId, `-${days} days`) as any[];
  
  // 格式化数据
  const formatted = trend.map(row => ({
    date: row.date,
    count: row.count,
    avgAccuracy: Math.round(row.avgAccuracy),
    mastered: row.mastered,
  }));
  
  res.json({
    success: true,
    data: formatted,
  });
});

/**
 * 获取课程分布（雷达图数据）
 */
export const getCourseDistribution = asyncHandler(async (req: StatsRequest, res: Response) => {
  const userId = req.user!.userId;
  
  const distribution = db.prepare(`
    SELECT 
      c.id,
      c.title,
      c.difficulty,
      COUNT(p.id) as practiced,
      SUM(CASE WHEN p.status = 'mastered' THEN 1 ELSE 0 END) as mastered,
      AVG(p.accuracy) as avgAccuracy
    FROM user_progress p
    JOIN courses c ON p.course_id = c.id
    WHERE p.user_id = ?
    GROUP BY c.id, c.title, c.difficulty
    ORDER BY practiced DESC
  `).all(userId) as any[];
  
  const formatted = distribution.map(row => ({
    courseId: row.id,
    title: row.title,
    difficulty: row.difficulty,
    practiced: row.practiced,
    mastered: row.mastered,
    avgAccuracy: Math.round(row.avgAccuracy),
    progress: Math.round((row.mastered / row.practiced) * 100),
  }));
  
  res.json({
    success: true,
    data: formatted,
  });
});

/**
 * 获取难度分布（饼图数据）
 */
export const getDifficultyDistribution = asyncHandler(async (req: StatsRequest, res: Response) => {
  const userId = req.user!.userId;
  
  const distribution = db.prepare(`
    SELECT 
      s.difficulty,
      COUNT(*) as count,
      SUM(CASE WHEN p.status = 'mastered' THEN 1 ELSE 0 END) as mastered
    FROM user_progress p
    JOIN sentences s ON p.sentence_id = s.id
    WHERE p.user_id = ?
    GROUP BY s.difficulty
  `).all(userId) as any[];
  
  const formatted = distribution.map(row => ({
    difficulty: row.difficulty,
    count: row.count,
    mastered: row.mastered,
    percent: Math.round((row.mastered / row.count) * 100),
  }));
  
  res.json({
    success: true,
    data: formatted,
  });
});

/**
 * 获取每周热力图数据
 */
export const getWeeklyHeatmap = asyncHandler(async (req: StatsRequest, res: Response) => {
  const userId = req.user!.userId;
  
  // 获取过去 90 天每天的学习数据
  const heatmap = db.prepare(`
    SELECT 
      date(created_at) as date,
      COUNT(*) as count
    FROM user_progress
    WHERE user_id = ? 
      AND created_at >= date('now', '-90 days')
    GROUP BY date(created_at)
    ORDER BY date ASC
  `).all(userId) as any[];
  
  // 转换为热力图格式
  const data: Record<string, number> = {};
  heatmap.forEach(row => {
    data[row.date] = row.count;
  });
  
  res.json({
    success: true,
    data,
  });
});

/**
 * 获取句子类型统计
 */
export const getSentenceTypeStats = asyncHandler(async (req: StatsRequest, res: Response) => {
  const userId = req.user!.userId;
  
  const stats = db.prepare(`
    SELECT 
      COALESCE(s.grammar_point, '其他') as grammarPoint,
      COUNT(*) as count,
      AVG(p.accuracy) as avgAccuracy
    FROM user_progress p
    JOIN sentences s ON p.sentence_id = s.id
    WHERE p.user_id = ?
    GROUP BY grammarPoint
    ORDER BY count DESC
    LIMIT 10
  `).all(userId) as any[];
  
  const formatted = stats.map(row => ({
    type: row.grammarPoint.length > 10 ? row.grammarPoint.substring(0, 10) + '...' : row.grammarPoint,
    count: row.count,
    avgAccuracy: Math.round(row.avgAccuracy),
  }));
  
  res.json({
    success: true,
    data: formatted,
  });
});

export const StatisticsController = {
  getOverview,
  getLearningTrend,
  getCourseDistribution,
  getDifficultyDistribution,
  getWeeklyHeatmap,
  getSentenceTypeStats,
};
