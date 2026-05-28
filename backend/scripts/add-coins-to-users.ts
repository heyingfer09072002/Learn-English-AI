import { db } from '../src/database/sqlite.js';

console.log('🔧 修复 users 表，添加金币和钻石字段...');

try {
  // 添加 gold_coins 字段
  db.exec(`
    ALTER TABLE users ADD COLUMN gold_coins INTEGER DEFAULT 0
  `);
  console.log('✅ 添加 gold_coins 字段');
  
  // 添加 diamond_coins 字段
  db.exec(`
    ALTER TABLE users ADD COLUMN diamond_coins INTEGER DEFAULT 0
  `);
  console.log('✅ 添加 diamond_coins 字段');
  
  console.log('✅ users 表修复完成！');
  
} catch (error: any) {
  if (error.message.includes('duplicate column')) {
    console.log('⚠️  字段已存在，跳过');
  } else {
    console.error('❌ 修复失败:', error.message);
  }
}
