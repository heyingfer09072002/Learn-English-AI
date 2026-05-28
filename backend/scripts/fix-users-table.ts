import { db } from '../src/database/sqlite.js';

console.log('🔧 检查并修复 users 表...\n');

// 检查 is_vip 字段是否存在
try {
  db.prepare('SELECT is_vip FROM users LIMIT 1').get();
  console.log('✅ is_vip 字段已存在');
} catch (error: any) {
  console.log('⚠️  is_vip 字段不存在，正在添加...');
  db.exec('ALTER TABLE users ADD COLUMN is_vip INTEGER DEFAULT 0');
  console.log('✅ 已添加 is_vip 字段');
}

// 检查 vip_expire_at 字段
try {
  db.prepare('SELECT vip_expire_at FROM users LIMIT 1').get();
  console.log('✅ vip_expire_at 字段已存在');
} catch (error: any) {
  db.exec('ALTER TABLE users ADD COLUMN vip_expire_at DATETIME');
  console.log('✅ 已添加 vip_expire_at 字段');
}

// 检查 total_practice_time 字段
try {
  db.prepare('SELECT total_practice_time FROM users LIMIT 1').get();
  console.log('✅ total_practice_time 字段已存在');
} catch (error: any) {
  db.exec('ALTER TABLE users ADD COLUMN total_practice_time INTEGER DEFAULT 0');
  console.log('✅ 已添加 total_practice_time 字段');
}

console.log('\n✅ 表结构检查完成！');
