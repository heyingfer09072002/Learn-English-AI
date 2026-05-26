import { Router } from 'express';
import { PracticeController } from '../controllers/practice.controller';
import { CourseController } from '../controllers/course.controller';
import { AIController } from '../controllers/ai.controller';
import { StatisticsController } from '../controllers/statistics.controller';

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
router.get('/api/courses', CourseController.getCourses);
router.get('/api/courses/:id', CourseController.getCourseById);
router.post('/api/courses', CourseController.createCourse);
router.put('/api/courses/:id', CourseController.updateCourse);
router.delete('/api/courses/:id', CourseController.deleteCourse);
router.post('/api/courses/:id/publish', CourseController.publishCourse);

/**
 * AI 助手相关路由
 */
router.post('/api/ai/assistant/ask', AIController.ask);
router.post('/api/ai/assistant/analyze/:sentenceId', AIController.analyzeSentence);
router.get('/api/ai/assistant/history', AIController.getHistory);

/**
 * 统计相关路由
 */
router.get('/api/statistics/overview', StatisticsController.getOverview);
router.get('/api/statistics/heatmap', StatisticsController.getHeatmap);
router.get('/api/statistics/radar', StatisticsController.getRadar);
router.get('/api/statistics/achievements', StatisticsController.getAchievements);
router.get('/api/statistics/course-progress/:courseId', StatisticsController.getCourseProgress);

export default router;
