import express from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import { createServer } from 'http';
import { Server } from 'socket.io';
import julebuRoutes from './routes/julebu-sqlite.js';
import authRoutes from './routes/auth.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const server = createServer(app);
const io = new Server(server, {
  cors: {
    origin: process.env.FRONTEND_URL || 'http://localhost:5173',
    methods: ['GET', 'POST']
  }
});

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, '../../frontend/dist')));

// API 路由
app.use('/api', julebuRoutes);
app.use('/api', authRoutes); // 认证和 VIP 路由

// 健康检查
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', mode: 'sqlite' });
});

// Socket.IO 事件
io.on('connection', (socket) => {
  console.log('Socket 连接:', socket.id);
  
  socket.on('disconnect', () => {
    console.log('Socket 断开:', socket.id);
  });
});

// 前端路由
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../../frontend/dist/index.html'));
});

const PORT = process.env.PORT || 3001;

server.listen(PORT, () => {
  console.log(`
╔════════════════════════════════════════════════╗
║   🚀 EnglishAI Backend (SQLite Mode)           ║
║   服务器运行中：http://localhost:${PORT}                ║
║   模式：SQLite                                 ║
╚════════════════════════════════════════════════╝
  `);
});

export { io };
