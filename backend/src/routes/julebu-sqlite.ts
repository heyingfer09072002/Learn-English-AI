import { Router } from 'express';
import { PracticeControllerSQLite } from '../controllers/practice-sqlite.controller.js';
import { CourseControllerSQLite } from '../controllers/course-sqlite.controller.js';
import { StatisticsController } from '../controllers/statistics-sqlite.controller.js';
import { optionalAuthMiddleware } from '../middleware/auth.middleware.js';

const router = Router();

// 练习相关路由
router.post('/practice/sentence', PracticeControllerSQLite.submitPractice);
router.get('/practice/history', PracticeControllerSQLite.getHistory);
router.get('/practice/stats', PracticeControllerSQLite.getStats);

// 课程相关路由
router.get('/courses', optionalAuthMiddleware, CourseControllerSQLite.getCourses);
router.get('/courses/:id', optionalAuthMiddleware, CourseControllerSQLite.getCourseById);

// 统计相关路由
router.get('/statistics/overview', optionalAuthMiddleware, StatisticsController.getOverview);
router.get('/statistics/trend', optionalAuthMiddleware, StatisticsController.getLearningTrend);
router.get('/statistics/heatmap', optionalAuthMiddleware, StatisticsController.getWeeklyHeatmap);

export default router;
