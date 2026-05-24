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

const router = Router();

// 所有接口公开（临时关闭认证）
router.get('/groups', getGroups);
router.get('/groups/:id/words', getWordsInGroup);
router.get('/words/search', searchWords);
router.get('/words/:id', getWordDetail);
router.post('/words/:id/learn', recordLearning);
router.post('/words/:id/review', recordReview);
router.get('/progress', getProgress);
router.get('/review/due', getDueReviews);
router.get('/statistics', getStatistics);

export default router;
