import { Router } from 'express';
import { getProfile, updateProfile, getLearningProgress, getStatistics } from '../controllers/user.controller.js';

const router = Router();

// 临时关闭认证
// router.use(authMiddleware);

router.get('/profile', getProfile);
router.put('/profile', updateProfile);
router.get('/progress', getLearningProgress);
router.get('/statistics', getStatistics);

export default router;
