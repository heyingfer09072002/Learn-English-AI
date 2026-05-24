import { Router } from 'express';
import { getCourses, getCourseDetail, getLessons } from '../controllers/lesson.controller.js';
import { optionalAuthMiddleware } from '../middleware/auth.middleware.js';

const router = Router();

// 使用可选认证中间件
router.use(optionalAuthMiddleware);

router.get('/courses', getCourses);
router.get('/lessons', getLessons);
router.get('/courses/:id', getCourseDetail);

export default router;
