import { Router } from 'express';
import authRoutes from './auth.routes.js';
import userRoutes from './user.routes.js';
import lessonRoutes from './lesson.routes.js';
import aiRoutes from './ai.routes.js';
import vocabularyRoutes from './vocabulary.routes.js';
import { authMiddleware, optionalAuthMiddleware } from '../middleware/auth.middleware.js';

const router = Router();

// 公开路由（不需要认证）
router.use('/auth', authRoutes);
router.use('/lessons', lessonRoutes);
router.use('/vocabulary', vocabularyRoutes);
router.use('/users', userRoutes);

// 受保护路由（需要认证）
router.use(authMiddleware);

// AI 相关路由
router.use('/ai', aiRoutes);

export default router;
