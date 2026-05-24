import { Router } from 'express';
import { getProfile, updateProfile, getLearningProgress, getStatistics } from '../controllers/user.controller.js';
import { authMiddleware } from '../middleware/auth.middleware.js';

const router = Router();

router.use(authMiddleware);

router.get('/profile', getProfile);
router.put('/profile', updateProfile);
router.get('/progress', getLearningProgress);
router.get('/statistics', getStatistics);

export default router;
