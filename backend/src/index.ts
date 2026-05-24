import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { config } from './config/index.js';

// 加载环境变量
dotenv.config();

const app = express();
const PORT = config.port;

// 中间件
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// 请求日志
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
  next();
});

// 健康检查接口
app.get('/health', (req, res) => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  });
});

// API 根路由
app.get('/api', (req, res) => {
  res.json({
    name: 'EnglishAI API',
    version: '1.0.0',
    description: 'AI 驱动的英语学习平台后端服务',
    endpoints: {
      health: '/health',
      auth: '/api/auth',
      users: '/api/users',
      lessons: '/api/lessons',
      ai: '/api/ai'
    }
  });
});

// 路由
import authRoutes from './routes/auth.routes.js';
import userRoutes from './routes/user.routes.js';
import lessonRoutes from './routes/lesson.routes.js';
import aiRoutes from './routes/ai.routes.js';

app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/lessons', lessonRoutes);
app.use('/api/ai', aiRoutes);

// 404 处理
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: '接口不存在'
  });
});

// 错误处理
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error('Error:', err);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || '服务器内部错误'
  });
});

// 启动服务器
app.listen(PORT, () => {
  console.log(`
╔═══════════════════════════════════════════════════╗
║                                                   ║
║   🚀 EnglishAI Backend Server                     ║
║   运行在：http://localhost:${PORT}                   ║
║   环境：${config.nodeEnv.padEnd(10)}                         ║
║                                                   ║
╚═══════════════════════════════════════════════════╝
  `);
});

export default app;
