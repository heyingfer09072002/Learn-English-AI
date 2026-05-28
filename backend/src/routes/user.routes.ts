import { Router } from 'express';
import { authMiddleware } from '../middleware/auth.middleware.js';
import { getProfile, updateProfile, getLearningProgress, getStatistics } from '../controllers/user.controller.js';

const router = Router();

// 需要认证
router.use(authMiddleware);

router.get('/profile', getProfile);
router.put('/profile', updateProfile);
router.get('/progress', getLearningProgress);
router.get('/statistics', getStatistics);

export default router;
