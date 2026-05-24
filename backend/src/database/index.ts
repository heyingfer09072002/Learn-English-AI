import { Pool, PoolConfig } from 'pg';
import { config } from '../config/index.js';

const poolConfig: PoolConfig = {
  host: config.dbHost,
  port: config.dbPort,
  database: config.dbName,
  user: config.dbUser,
  password: config.dbPassword,
  max: 20,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
};

export const pool = new Pool(poolConfig);

pool.on('connect', () => {
  console.log('✅ PostgreSQL 连接成功');
});

pool.on('error', (err) => {
  console.error('❌ PostgreSQL 连接错误:', err);
});

process.on('SIGINT', async () => {
  await pool.end();
  console.log('PostgreSQL 连接池已关闭');
  process.exit(0);
});
