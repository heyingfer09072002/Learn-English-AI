import { pool } from './database/index.js';
import { UserModel } from './models/User.model.js';
import { LessonModel } from './models/Lesson.model.js';
import { ProgressModel } from './models/Progress.model.js';

const runMigrations = async () => {
  console.log('🚀 开始执行数据库迁移...\n');

  try {
    // 创建表
    console.log('📦 创建数据表...');
    await UserModel.createTable();
    await LessonModel.createTables();
    await ProgressModel.createTable();

    // 插入示例数据
    console.log('\n📝 插入示例数据...');
    await LessonModel.seed();

    console.log('\n✅ 数据库迁移完成！\n');
    process.exit(0);
  } catch (error) {
    console.error('\n❌ 迁移失败:', error);
    process.exit(1);
  }
};

runMigrations();
