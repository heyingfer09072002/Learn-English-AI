import { Router } from 'express';
import { PracticeController } from '../controllers/practice.controller';
import { CourseController } from '../controllers/course.controller';
import { AIController } from '../controllers/ai.controller';
import { StatisticsController } from '../controllers/statistics.controller';
import { optionalAuthMiddleware } from '../middleware/auth.middleware.js';

const router = Router();

/**
 * 练习相关路由
 */
router.post('/api/practice/sentence', PracticeController.submitPractice);
router.get('/api/practice/history', PracticeController.getHistory);
router.get('/api/practice/stats', PracticeController.getStats);

/**
 * 课程相关路由
 */
router.get('/api/courses', optionalAuthMiddleware, CourseController.getCourses);
router.get('/api/courses/:id', optionalAuthMiddleware, CourseController.getCourseById);
router.post('/api/courses', optionalAuthMiddleware, CourseController.createCourse);
router.put('/api/courses/:id', optionalAuthMiddleware, CourseController.updateCourse);
router.delete('/api/courses/:id', optionalAuthMiddleware, CourseController.deleteCourse);
router.post('/api/courses/:id/publish', optionalAuthMiddleware, CourseController.publishCourse);

/**
 * AI 助手相关路由
 */
router.post('/api/ai/assistant/ask', optionalAuthMiddleware, AIController.ask);
router.post('/api/ai/assistant/analyze/:sentenceId', optionalAuthMiddleware, AIController.analyzeSentence);
router.get('/api/ai/assistant/history', optionalAuthMiddleware, AIController.getHistory);

/**
 * 统计相关路由
 */
router.get('/api/statistics/overview', optionalAuthMiddleware, StatisticsController.getOverview);
router.get('/api/statistics/heatmap', optionalAuthMiddleware, StatisticsController.getHeatmap);
router.get('/api/statistics/radar', optionalAuthMiddleware, StatisticsController.getRadar);
router.get('/api/statistics/achievements', optionalAuthMiddleware, StatisticsController.getAchievements);
router.get('/api/statistics/course-progress/:courseId', optionalAuthMiddleware, StatisticsController.getCourseProgress);

export default router;
