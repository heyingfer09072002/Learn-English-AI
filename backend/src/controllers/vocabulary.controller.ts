import { Request, Response } from 'express';
import { asyncHandler } from '../middleware/error.middleware.js';
import { VocabularyModel, WordQueryParams } from '../models/Vocabulary.model.js';
import { ReviewScheduler } from '../utils/review-scheduler.js';
import {
  NotFoundError,
  ValidationError,
  FieldRequiredError,
} from '../middleware/errors.js';

/**
 * 获取词汇分组列表
 * GET /api/vocabulary/groups
 */
export const getGroups = asyncHandler(async (req: Request, res: Response) => {
  const { type } = req.query;
  
  // 这里返回硬编码的分组，实际应该从数据库查询
  const groups = [
    {
      id: 1,
      name: '高频词汇',
      description: '六级考试高频词汇',
      categoryType: 'frequency',
      categoryValue: 'high',
      wordCount: 2000,
      learnedCount: 0,
      masteryRate: 0,
    },
    {
      id: 2,
      name: '中频词汇',
      description: '六级考试中频词汇',
      categoryType: 'frequency',
      categoryValue: 'medium',
      wordCount: 2500,
      learnedCount: 0,
      masteryRate: 0,
    },
    {
      id: 3,
      name: '低频词汇',
      description: '六级考试低频词汇',
      categoryType: 'frequency',
      categoryValue: 'low',
      wordCount: 1500,
      learnedCount: 0,
      masteryRate: 0,
    },
    {
      id: 4,
      name: '动词专项',
      description: '常用动词词汇',
      categoryType: 'pos',
      categoryValue: 'verb',
      wordCount: 1800,
      learnedCount: 0,
      masteryRate: 0,
    },
    {
      id: 5,
      name: '名词专项',
      description: '常用名词词汇',
      categoryType: 'pos',
      categoryValue: 'noun',
      wordCount: 2500,
      learnedCount: 0,
      masteryRate: 0,
    },
    {
      id: 6,
      name: '形容词专项',
      description: '常用形容词词汇',
      categoryType: 'pos',
      categoryValue: 'adjective',
      wordCount: 1200,
      learnedCount: 0,
      masteryRate: 0,
    },
    {
      id: 7,
      name: '日常对话主题',
      description: '日常交流场景词汇',
      categoryType: 'theme',
      categoryValue: 'daily-conversation',
      wordCount: 800,
      learnedCount: 0,
      masteryRate: 0,
    },
    {
      id: 8,
      name: '商务主题',
      description: '商务英语场景词汇',
      categoryType: 'theme',
      categoryValue: 'business',
      wordCount: 1000,
      learnedCount: 0,
      masteryRate: 0,
    },
    {
      id: 9,
      name: 'CET-6 核心',
      description: '六级考试核心词汇',
      categoryType: 'exam',
      categoryValue: 'CET-6',
      wordCount: 5500,
      learnedCount: 0,
      masteryRate: 0,
    },
    {
      id: 10,
      name: '入门阶段',
      description: '初级难度词汇',
      categoryType: 'stage',
      categoryValue: 'beginner',
      wordCount: 1500,
      learnedCount: 0,
      masteryRate: 0,
    },
  ];

  // 按类型筛选
  const filteredGroups = type 
    ? groups.filter(g => g.categoryType === type)
    : groups;

  res.json({
    success: true,
    data: filteredGroups,
  });
});

/**
 * 获取分组下的词汇
 * GET /api/vocabulary/groups/:id/words
 */
export const getWordsInGroup = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  const { page = 1, limit = 20 } = req.query;
  
  const pageNum = parseInt(page as string);
  const limitNum = parseInt(limit as string);
  
  // 根据分组 ID 查询词汇
  // 这里简化实现，实际应该根据分组类型和值查询
  const query: WordQueryParams = {
    page: pageNum,
    limit: limitNum,
  };

  // 根据 ID 映射到实际的查询条件
  const groupMapping: Record<number, Partial<WordQueryParams>> = {
    1: { frequency: 'high' },
    2: { frequency: 'medium' },
    3: { frequency: 'low' },
    4: { pos: 'verb' },
    5: { pos: 'noun' },
    6: { pos: 'adjective' },
  };

  if (groupMapping[parseInt(id)]) {
    Object.assign(query, groupMapping[parseInt(id)]);
  }

  const result = await VocabularyModel.findWords(query);

  res.json({
    success: true,
    data: {
      words: result.words,
      total: result.total,
      page: result.page,
      limit: result.limit,
      hasMore: result.page * result.limit < result.total,
    },
  });
});

/**
 * 获取词汇详情
 * GET /api/vocabulary/words/:id
 */
export const getWordDetail = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  const wordId = parseInt(id);

  if (isNaN(wordId)) {
    throw new ValidationError('无效的词汇 ID');
  }

  const wordDetail = await VocabularyModel.findWordDetail(wordId);

  if (!wordDetail) {
    throw new NotFoundError('词汇');
  }

  res.json({
    success: true,
    data: wordDetail,
  });
});

/**
 * 搜索词汇
 * GET /api/vocabulary/words/search
 */
export const searchWords = asyncHandler(async (req: Request, res: Response) => {
  const { q, limit = 20 } = req.query;
  
  if (!q || typeof q !== 'string') {
    throw new FieldRequiredError('query');
  }

  const limitNum = parseInt(limit as string);
  const results = await VocabularyModel.searchWords(q, Math.min(limitNum, 100));

  res.json({
    success: true,
    data: {
      words: results,
      count: results.length,
    },
  });
});

/**
 * 记录学习行为
 * POST /api/vocabulary/words/:id/learn
 */
export const recordLearning = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  const wordId = parseInt(id);
  const { action, timeSpent = 0 } = req.body;
  
  if (!req.user) {
    return res.json({ success: true, data: null });
  }

  const userId = req.user.userId;

  if (isNaN(wordId)) {
    throw new ValidationError('无效的词汇 ID');
  }

  // 检查词汇是否存在
  const word = await VocabularyModel.findById(wordId);
  if (!word) {
    throw new NotFoundError('词汇');
  }

  // 记录学习（简化为 review 行为）
  const result = await ReviewScheduler.recordLearning(
    userId,
    wordId,
    action === 'complete', // 假设为正确
    timeSpent,
    'learn'
  );

  res.json({
    success: true,
    data: {
      progress: result.progress,
      nextReviewAt: result.progress.nextReviewAt,
      masteryLevel: result.progress.masteryLevel,
    },
  });
});

/**
 * 记录复习
 * POST /api/vocabulary/words/:id/review
 */
export const recordReview = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  const wordId = parseInt(id);
  const { isCorrect, timeSpent = 0 } = req.body;
  
  if (!req.user) {
    return res.json({ success: true, data: null });
  }

  const userId = req.user.userId;

  if (isNaN(wordId)) {
    throw new ValidationError('无效的词汇 ID');
  }

  if (typeof isCorrect !== 'boolean') {
    throw new ValidationError('isCorrect 必须为布尔值');
  }

  // 记录复习
  const result = await ReviewScheduler.recordLearning(
    userId,
    wordId,
    isCorrect,
    timeSpent,
    'review'
  );

  res.json({
    success: true,
    data: {
      progress: result.progress,
      nextReviewAt: result.progress.nextReviewAt,
      masteryLevel: result.progress.masteryLevel,
    },
  });
});

/**
 * 获取用户学习进度
 * GET /api/vocabulary/progress
 */
export const getProgress = asyncHandler(async (req: Request, res: Response) => {
  if (!req.user) {
    return res.json({ success: true, data: null });
  }

  const userId = req.user.userId;
  const statistics = await ReviewScheduler.getUserStatistics(userId);

  res.json({
    success: true,
    data: statistics,
  });
});

/**
 * 获取待复习词汇
 * GET /api/vocabulary/review/due
 */
export const getDueReviews = asyncHandler(async (req: Request, res: Response) => {
  if (!req.user) {
    return res.json({ success: true, data: null });
  }

  const userId = req.user.userId;
  const { date } = req.query;
  
  const reviewDate = date ? new Date(date as string) : new Date();
  const dueReviews = await ReviewScheduler.getDueReviews(userId, reviewDate);

  res.json({
    success: true,
    data: {
      words: dueReviews,
      count: dueReviews.length,
      date: reviewDate.toISOString().split('T')[0],
    },
  });
});

/**
 * 获取学习统计
 * GET /api/vocabulary/statistics
 */
export const getStatistics = asyncHandler(async (req: Request, res: Response) => {
  if (!req.user) {
    return res.json({ success: true, data: null });
  }

  const userId = req.user.userId;
  const { timeRange = 'all' } = req.query;

  const statistics = await ReviewScheduler.getUserStatistics(userId);

  res.json({
    success: true,
    data: {
      ...statistics,
      timeRange,
    },
  });
});
