import { Router } from 'express';
import { register, login, refreshToken, logout } from '../controllers/auth.controller.js';
import { validate } from '../middleware/validate.middleware.js';
import { loginSchema, registerSchema } from '../schemas/auth.schema.js';

const router = Router();

router.post('/register', validate(registerSchema), register);
router.post('/login', validate(loginSchema), login);
router.post('/refresh', refreshToken);
router.post('/logout', logout);

export default router;
