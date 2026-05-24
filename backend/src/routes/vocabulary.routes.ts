import { Router } from 'express';
import {
  getGroups,
  getWordsInGroup,
  getWordDetail,
  searchWords,
  recordLearning,
  recordReview,
  getProgress,
  getDueReviews,
  getStatistics,
} from '../controllers/vocabulary.controller.js';
import { authMiddleware } from '../middleware/auth.middleware.js';

const router = Router();

// 所有词汇接口都需要认证
router.use(authMiddleware);

// 词汇组相关
router.get('/groups', getGroups);
router.get('/groups/:id/words', getWordsInGroup);

// 词汇搜索（必须在 /words/:id 之前）
router.get('/words/search', searchWords);

// 词汇详情
router.get('/words/:id', getWordDetail);

// 学习行为记录
router.post('/words/:id/learn', recordLearning);
router.post('/words/:id/review', recordReview);

// 进度统计
router.get('/progress', getProgress);
router.get('/review/due', getDueReviews);
router.get('/statistics', getStatistics);

export default router;
