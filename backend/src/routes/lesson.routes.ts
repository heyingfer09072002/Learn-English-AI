import { Router } from 'express';
import { getLessons, getLessonById, getSentences, updateProgress } from '../controllers/lesson.controller.js';

const router = Router();

router.get('/', getLessons);
router.get('/:id', getLessonById);
router.get('/:id/sentences', getSentences);
router.post('/:id/progress', updateProgress);

export default router;
