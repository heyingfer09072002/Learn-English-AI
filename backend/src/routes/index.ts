import { Router } from 'express';
import authRoutes from './auth.routes.js';
import userRoutes from './user.routes.js';
import lessonRoutes from './lesson.routes.js';
import aiRoutes from './ai.routes.js';
import vocabularyRoutes from './vocabulary.routes.js';
import { authMiddleware } from '../middleware/auth.middleware.js';

const router = Router();

// 公开路由（不需要认证）
router.use('/auth', authRoutes);

// 受保护路由（需要认证）
router.use(authMiddleware);

// 用户相关路由
router.use('/users', userRoutes);

// 课程相关路由
router.use('/lessons', lessonRoutes);

// 词汇相关路由
router.use('/vocabulary', vocabularyRoutes);

// AI 相关路由
router.use('/ai', aiRoutes);

export default router;
