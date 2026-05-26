import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { config } from './config/index.js';
import { pool } from './database/index.js';
import { UserModel } from './models/User.model.js';
import { LessonModel } from './models/Lesson.model.js';
import { ProgressModel } from './models/Progress.model.js';
import { VocabularyMigration } from './database/vocabulary-migrate.js';

// 加载环境变量
dotenv.config();

const app = express();
const PORT = config.port;

// 初始化数据库
const initDatabase = async () => {
  try {
    console.log('📦 正在初始化数据库...');
    
    // 创建表
    await UserModel.createTable();
    await LessonModel.createTables();
    await ProgressModel.createTable();
    
    // 创建词汇系统表
    await VocabularyMigration.run();
    
    // 插入示例数据
    await LessonModel.seed();
    
    console.log('✅ 数据库初始化完成');
  } catch (error) {
    console.error('❌ 数据库初始化失败:', error);
    throw error;
  }
};

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

// 路由
import mainRouter from './routes/index.js';
import julebuRouter from './routes/julebu.js';
app.use('/api', mainRouter);
app.use(julebuRouter);

// 404 处理
import { notFoundMiddleware, errorMiddleware } from './middleware/error.middleware.js';
app.use(notFoundMiddleware);

// 全局错误处理
app.use(errorMiddleware);

import { createServer } from 'http';
import { WebSocketService } from './services/websocket.service.js';

// 启动服务器
const startServer = async () => {
  // 初始化数据库 (失败时只警告，不阻止服务器启动)
  initDatabase().catch(error => {
    console.warn('⚠️  数据库初始化失败，服务将以无数据库模式运行');
  });

  const httpServer = createServer(app);
  
  // 初始化 WebSocket
  WebSocketService.init(httpServer);

  httpServer.listen(PORT, () => {
    console.log(`
╔═══════════════════════════════════════════════════╗
║                                                   ║
║   🚀 EnglishAI Backend Server                     ║
║   运行在：http://localhost:${PORT}                   ║
║   数据库：PostgreSQL                              ║
║   环境：${config.nodeEnv.padEnd(10)}                         ║
║   WebSocket: 已启用                               ║
║                                                   ║
╚═══════════════════════════════════════════════════╝
    `);
  });
};

startServer();

export default app;
