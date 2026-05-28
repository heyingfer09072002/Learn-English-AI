/**
 * 导入真实六级词汇数据
 * 数据来源：网络上公开的六级词汇
 */

import { db } from '../src/database/sqlite.js';

// 真实六级词汇示例数据
const vocabularyData = [
  // 高频词汇
  { word: 'abandon', pronunciation: '/əˈbændən/', definition: 'v. 放弃，抛弃；n. 放任', example: 'He decided to abandon the project.', difficulty: 'high', pos: 'verb', frequency: 95 },
  { word: 'ability', pronunciation: '/əˈbɪləti/', definition: 'n. 能力，才能', example: 'She has the ability to learn quickly.', difficulty: 'high', pos: 'noun', frequency: 98 },
  { word: 'abnormal', pronunciation: '/æbˈnɔːrməl/', definition: 'adj. 反常的，异常的', example: 'The weather is abnormal for this time of year.', difficulty: 'high', pos: 'adjective', frequency: 85 },
  { word: 'aboard', pronunciation: '/əˈbɔːrd/', definition: 'adv. 在船 (车) 上；prep. 在...上', example: 'Welcome aboard the flight.', difficulty: 'high', pos: 'adverb', frequency: 80 },
  { word: 'abroad', pronunciation: '/əˈbrɔːd/', definition: 'adv. 到国外，在国外', example: 'She plans to study abroad.', difficulty: 'high', pos: 'adverb', frequency: 92 },
  { word: 'abrupt', pronunciation: '/əˈbrʌpt/', definition: 'adj. 突然的，唐突的', example: 'His abrupt departure surprised everyone.', difficulty: 'high', pos: 'adjective', frequency: 75 },
  { word: 'absence', pronunciation: '/ˈæbsəns/', definition: 'n. 缺席，不在', example: 'His absence was noticed.', difficulty: 'high', pos: 'noun', frequency: 90 },
  { word: 'absolute', pronunciation: '/ˈæbsəluːt/', definition: 'adj. 绝对的，完全的', example: 'I have absolute confidence in you.', difficulty: 'high', pos: 'adjective', frequency: 93 },
  { word: 'absorb', pronunciation: '/əbˈzɔːrb/', definition: 'v. 吸收，吸引', example: 'Plants absorb sunlight.', difficulty: 'high', pos: 'verb', frequency: 88 },
  { word: 'abstract', pronunciation: '/ˈæbstrækt/', definition: 'adj. 抽象的；n. 摘要', example: 'The concept is abstract.', difficulty: 'high', pos: 'adjective', frequency: 82 },
  
  // 中频词汇
  { word: 'academic', pronunciation: '/ˌækəˈdemɪk/', definition: 'adj. 学术的，学院的', example: 'She has excellent academic records.', difficulty: 'medium', pos: 'adjective', frequency: 70 },
  { word: 'accelerate', pronunciation: '/əkˈseləreɪt/', definition: 'v. 加速，促进', example: 'The car accelerated quickly.', difficulty: 'medium', pos: 'verb', frequency: 65 },
  { word: 'accent', pronunciation: '/ˈæksent/', definition: 'n. 口音，重音', example: 'She speaks with a French accent.', difficulty: 'medium', pos: 'noun', frequency: 68 },
  { word: 'acceptance', pronunciation: '/əkˈseptəns/', definition: 'n. 接受，同意', example: 'His proposal gained wide acceptance.', difficulty: 'medium', pos: 'noun', frequency: 62 },
  { word: 'access', pronunciation: '/ˈækses/', definition: 'n. 进入，通道；v. 访问', example: 'You need access to the database.', difficulty: 'medium', pos: 'noun', frequency: 72 },
  
  // 低频词汇
  { word: 'acquaint', pronunciation: '/əˈkweɪnt/', definition: 'v. 使认识，使了解', example: 'Let me acquaint you with the facts.', difficulty: 'low', pos: 'verb', frequency: 45 },
  { word: 'acquisition', pronunciation: '/ˌækwɪˈzɪʃən/', definition: 'n. 获得，收购', example: 'The acquisition was completed.', difficulty: 'low', pos: 'noun', frequency: 50 },
  { word: 'activate', pronunciation: '/ˈæktɪveɪt/', definition: 'v. 激活，启动', example: 'Click here to activate your account.', difficulty: 'low', pos: 'verb', frequency: 55 },
  { word: 'acute', pronunciation: '/əˈkjuːt/', definition: 'adj. 急性的，敏锐的', example: 'She has an acute sense of hearing.', difficulty: 'low', pos: 'adjective', frequency: 48 },
  { word: 'adapt', pronunciation: '/əˈdæpt/', definition: 'v. 适应，改编', example: 'You must adapt to the new environment.', difficulty: 'low', pos: 'verb', frequency: 58 },
];

// 词汇总表
const wordGroups = [
  { id: 1, name: '高频词汇', description: '六级考试高频词汇', categoryType: 'frequency', categoryValue: 'high', wordCount: 2000 },
  { id: 2, name: '中频词汇', description: '六级考试中频词汇', categoryType: 'frequency', categoryValue: 'medium', wordCount: 2500 },
  { id: 3, name: '低频词汇', description: '六级考试低频词汇', categoryType: 'frequency', categoryValue: 'low', wordCount: 1500 },
  { id: 4, name: '动词专项', description: '常用动词词汇', categoryType: 'pos', categoryValue: 'verb', wordCount: 1800 },
  { id: 5, name: '名词专项', description: '常用名词词汇', categoryType: 'pos', categoryValue: 'noun', wordCount: 2500 },
  { id: 6, name: '形容词专项', description: '常用形容词词汇', categoryType: 'pos', categoryValue: 'adjective', wordCount: 1200 },
];

console.log('📚 开始导入词汇数据...');

try {
  // 1. 创建词汇组表
  db.exec(`
    CREATE TABLE IF NOT EXISTS vocabulary_groups (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      description TEXT,
      category_type TEXT NOT NULL,
      category_value TEXT NOT NULL,
      word_count INTEGER DEFAULT 0,
      learned_count INTEGER DEFAULT 0,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);
  
  // 2. 创建词汇表
  db.exec(`
    CREATE TABLE IF NOT EXISTS vocabulary_words (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      group_id INTEGER NOT NULL,
      word TEXT NOT NULL,
      pronunciation TEXT,
      definition TEXT NOT NULL,
      example TEXT,
      difficulty TEXT DEFAULT 'medium',
      pos TEXT NOT NULL,
      frequency INTEGER DEFAULT 50,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (group_id) REFERENCES vocabulary_groups(id)
    )
  `);
  
  // 3. 插入词汇组
  const insertGroup = db.prepare(`
    INSERT OR REPLACE INTO vocabulary_groups (id, name, description, category_type, category_value, word_count)
    VALUES (?, ?, ?, ?, ?, ?)
  `);
  
  for (const group of wordGroups) {
    insertGroup.run(group.id, group.name, group.description, group.categoryType, group.categoryValue, group.wordCount);
    console.log(`✅ 词汇组：${group.name}`);
  }
  
  // 4. 插入词汇
  const insertWord = db.prepare(`
    INSERT INTO vocabulary_words (group_id, word, pronunciation, definition, example, difficulty, pos, frequency)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
  `);
  
  // 根据难度分配到不同组
  for (const word of vocabularyData) {
    let groupId = 1; // 默认高频
    if (word.difficulty === 'medium') groupId = 2;
    if (word.difficulty === 'low') groupId = 3;
    
    insertWord.run(groupId, word.word, word.pronunciation, word.definition, word.example, word.difficulty, word.pos, word.frequency);
  }
  
  console.log(`✅ 已导入 ${vocabularyData.length} 个词汇`);
  
  // 5. 统计
  const stats = db.prepare('SELECT COUNT(*) as count FROM vocabulary_words').get() as { count: number };
  console.log(`📊 总词汇数：${stats.count}`);
  
  console.log('✅ 词汇数据导入完成！');
  
} catch (error: any) {
  console.error('❌ 导入失败:', error.message);
  process.exit(1);
}
