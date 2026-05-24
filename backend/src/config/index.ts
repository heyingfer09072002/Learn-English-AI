import dotenv from 'dotenv';

dotenv.config();

export const config = {
  // 服务器配置
  port: parseInt(process.env.PORT || '3001', 10),
  nodeEnv: process.env.NODE_ENV || 'development',
  
  // PostgreSQL 数据库配置
  dbHost: process.env.DB_HOST || 'localhost',
  dbPort: parseInt(process.env.DB_PORT || '5432', 10),
  dbName: process.env.DB_NAME || 'english_ai',
  dbUser: process.env.DB_USER || 'postgres',
  dbPassword: process.env.DB_PASSWORD || 'postgres',
  
  // JWT 配置
  jwtSecret: process.env.JWT_SECRET || 'your-secret-key-change-in-production',
  jwtExpiresIn: process.env.JWT_EXPIRES_IN || '7d',
  
  // AI 配置
  openaiApiKey: process.env.OPENAI_API_KEY || '',
  openaiModel: process.env.OPENAI_MODEL || 'gpt-4',
  
  // 前端地址
  frontendUrl: process.env.FRONTEND_URL || 'http://localhost:5173'
};
