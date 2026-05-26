import { JulebuMigration } from './database/migrations/julebu-migrate.js';

const runJulebuMigration = async () => {
  console.log('🚀 开始执行句乐部游戏化系统数据库迁移...\n');

  try {
    await JulebuMigration.migrate();
    console.log('\n✅ 句乐部游戏化系统数据库迁移完成！\n');
    process.exit(0);
  } catch (error) {
    console.error('\n❌ 迁移失败:', error);
    process.exit(1);
  }
};

runJulebuMigration();
