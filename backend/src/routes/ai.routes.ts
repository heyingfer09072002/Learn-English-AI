import { Router } from 'express';
import { chat, assessWriting, analyzeSentence, evaluateSpeaking } from '../controllers/ai.controller.js';
import { authMiddleware } from '../middleware/auth.middleware.js';

const router = Router();

router.use(authMiddleware);

router.post('/chat', chat);
router.post('/writing-assessment', assessWriting);
router.post('/sentence-analysis', analyzeSentence);
router.post('/speaking-evaluation', evaluateSpeaking);

export default router;
