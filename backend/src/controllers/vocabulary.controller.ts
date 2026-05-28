import { Request, Response } from 'express';
import { asyncHandler } from '../middleware/error.middleware.js';
import { db } from '../database/sqlite.js';

/**
 * 获取词汇分组列表
 * GET /api/vocabulary/groups
 */
export const getGroups = asyncHandler(async (req: Request, res: Response) => {
  const { type } = req.query;
  
  let query = 'SELECT * FROM vocabulary_groups';
  const params: any[] = [];
  
  if (type) {
    query += ' WHERE category_type = ?';
    params.push(type);
  }
  
  const groups = db.prepare(query).all(...params) as any[];
  
  res.json({
    success: true,
    data: groups,
  });
});

/**
 * 获取指定词汇组的单词
 * GET /api/vocabulary/groups/:id/words
 */
export const getWordsInGroup = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  const { limit = 50, offset = 0 } = req.query;
  
  const words = db.prepare(`
    SELECT * FROM vocabulary_words 
    WHERE group_id = ?
    LIMIT ? OFFSET ?
  `).all(id, Number(limit), Number(offset)) as any[];
  
  const total = db.prepare('SELECT COUNT(*) as count FROM vocabulary_words WHERE group_id = ?').get(id) as any;
  
  res.json({
    success: true,
    data: {
      words,
      total: total.count,
      limit: Number(limit),
      offset: Number(offset),
    },
  });
});

/**
 * 搜索单词
 * GET /api/vocabulary/words/search
 */
export const searchWords = asyncHandler(async (req: Request, res: Response) => {
  const { query: searchQuery } = req.query;
  
  if (!searchQuery) {
    return res.status(400).json({
      success: false,
      error: '搜索词不能为空',
    });
  }
  
  const words = db.prepare(`
    SELECT * FROM vocabulary_words 
    WHERE word LIKE ? OR definition LIKE ?
    LIMIT 20
  `).all(`%${searchQuery}%`, `%${searchQuery}%`) as any[];
  
  res.json({
    success: true,
    data: words,
  });
});

/**
 * 获取单词详情
 * GET /api/vocabulary/words/:id
 */
export const getWordDetail = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  
  const word = db.prepare('SELECT * FROM vocabulary_words WHERE id = ?').get(id) as any;
  
  if (!word) {
    return res.status(404).json({
      success: false,
      error: '单词不存在',
    });
  }
  
  res.json({
    success: true,
    data: word,
  });
});

/**
 * 获取学习进度
 * GET /api/vocabulary/progress
 */
export const getProgress = asyncHandler(async (req: Request, res: Response) => {
  // 需要认证，从 token 获取 userId
  // 临时返回空数据
  res.json({
    success: true,
    data: {
      totalWords: 0,
      learnedWords: 0,
      masteredWords: 0,
      reviewDue: 0,
    },
  });
});

/**
 * 获取待复习单词
 * GET /api/vocabulary/review/due
 */
export const getDueReviews = asyncHandler(async (req: Request, res: Response) => {
  res.json({
    success: true,
    data: [],
  });
});

/**
 * 获取统计数据
 * GET /api/vocabulary/statistics
 */
export const getStatistics = asyncHandler(async (req: Request, res: Response) => {
  const totalWords = db.prepare('SELECT COUNT(*) as count FROM vocabulary_words').get() as any;
  
  const byDifficulty = db.prepare(`
    SELECT difficulty, COUNT(*) as count 
    FROM vocabulary_words 
    GROUP BY difficulty
  `).all() as any[];
  
  const byPos = db.prepare(`
    SELECT pos, COUNT(*) as count 
    FROM vocabulary_words 
    GROUP BY pos
  `).all() as any[];
  
  res.json({
    success: true,
    data: {
      totalWords: totalWords.count,
      byDifficulty,
      byPos,
    },
  });
});

/**
 * 记录学习
 * POST /api/vocabulary/words/:id/learn
 */
export const recordLearning = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  // TODO: 实现学习记录逻辑
  
  res.json({
    success: true,
    message: '学习记录成功',
  });
});

/**
 * 记录复习
 * POST /api/vocabulary/words/:id/review
 */
export const recordReview = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  // TODO: 实现复习记录逻辑
  
  res.json({
    success: true,
    message: '复习记录成功',
  });
});
