#!/usr/bin/env tsx
/**
 * 导入真实英语学习数据到 SQLite
 */

import { db } from '../src/database/sqlite.js';

console.log('🚀 开始导入数据...\n');

const vocabularyData = [
  { word: 'abandon', meaning: '放弃，遗弃', example: 'He decided to abandon the project.', level: 'intermediate' },
  { word: 'ability', meaning: '能力，才能', example: 'She has the ability to learn quickly.', level: 'beginner' },
  { word: 'abnormal', meaning: '异常的', example: 'The test results were abnormal.', level: 'intermediate' },
  { word: 'abroad', meaning: '在国外', example: 'He studied abroad for two years.', level: 'beginner' },
  { word: 'absolute', meaning: '绝对的', example: 'I have absolute confidence in you.', level: 'intermediate' },
  { word: 'absorb', meaning: '吸收', example: 'Plants absorb sunlight for energy.', level: 'intermediate' },
  { word: 'academic', meaning: '学术的', example: 'The academic year starts in September.', level: 'intermediate' },
  { word: 'accelerate', meaning: '加速', example: 'The car accelerated quickly.', level: 'advanced' },
  { word: 'access', meaning: '入口，访问', example: 'Students need access to the library.', level: 'intermediate' },
  { word: 'accommodate', meaning: '容纳', example: 'The hotel can accommodate 500 guests.', level: 'advanced' },
  { word: 'accompany', meaning: '陪伴', example: 'May I accompany you to the station?', level: 'intermediate' },
  { word: 'accomplish', meaning: '完成', example: 'She accomplished her goal.', level: 'intermediate' },
  { word: 'accurate', meaning: '准确的', example: 'The information is accurate.', level: 'intermediate' },
  { word: 'achieve', meaning: '实现', example: 'Work hard to achieve your dreams.', level: 'beginner' },
  { word: 'acknowledge', meaning: '承认', example: 'He acknowledged his mistake.', level: 'advanced' },
  { word: 'acquire', meaning: '获得', example: 'She acquired fluency in French.', level: 'advanced' },
  { word: 'adapt', meaning: '适应', example: 'Animals adapt to their environment.', level: 'intermediate' },
  { word: 'add', meaning: '添加', example: 'Add sugar to taste.', level: 'beginner' },
  { word: 'adequate', meaning: '足够的', example: 'The food was adequate for everyone.', level: 'intermediate' },
  { word: 'adjust', meaning: '调整', example: 'Adjust the seat to your comfort.', level: 'intermediate' },
  { word: 'administration', meaning: '管理，行政', example: 'The administration announced new policies.', level: 'advanced' },
  { word: 'admire', meaning: '钦佩，羡慕', example: 'I admire your courage.', level: 'intermediate' },
  { word: 'admit', meaning: '承认，准许进入', example: 'He admitted his guilt.', level: 'intermediate' },
  { word: 'adopt', meaning: '采用，收养', example: 'They adopted a new approach.', level: 'intermediate' },
  { word: 'advance', meaning: '前进，进步', example: 'Technology advances rapidly.', level: 'intermediate' },
  { word: 'advantage', meaning: '优势', example: 'Experience is an advantage.', level: 'beginner' },
  { word: 'adventure', meaning: '冒险', example: 'Life is an adventure.', level: 'beginner' },
  { word: 'advocate', meaning: '提倡，支持', example: 'She advocates environmental protection.', level: 'advanced' },
  { word: 'afford', meaning: '买得起', example: 'Can you afford it?', level: 'intermediate' },
  { word: 'afraid', meaning: '害怕的', example: 'Don\'t be afraid to try.', level: 'beginner' }
];

const quotesData = [
  { content: 'The only way to do great work is to love what you do.', author: 'Steve Jobs', category: 'motivation' },
  { content: 'Life is what happens when you\'re busy making other plans.', author: 'John Lennon', category: 'life' },
  { content: 'The future belongs to those who believe in the beauty of their dreams.', author: 'Eleanor Roosevelt', category: 'dreams' },
  { content: 'Success is not final, failure is not fatal: It is the courage to continue that counts.', author: 'Winston Churchill', category: 'success' },
  { content: 'Believe you can and you\'re halfway there.', author: 'Theodore Roosevelt', category: 'motivation' },
  { content: 'The only impossible journey is the one you never begin.', author: 'Tony Robbins', category: 'motivation' },
  { content: 'In the middle of difficulty lies opportunity.', author: 'Albert Einstein', category: 'wisdom' },
  { content: 'It does not matter how slowly you go as long as you do not stop.', author: 'Confucius', category: 'perseverance' },
  { content: 'Education is the most powerful weapon you can use to change the world.', author: 'Nelson Mandela', category: 'education' },
  { content: 'The best time to plant a tree was 20 years ago. The second best time is now.', author: 'Chinese Proverb', category: 'action' },
  { content: 'Your time is limited, don\'t waste it living someone else\'s life.', author: 'Steve Jobs', category: 'life' },
  { content: 'The only thing we have to fear is fear itself.', author: 'Franklin D. Roosevelt', category: 'courage' },
  { content: 'Be yourself; everyone else is already taken.', author: 'Oscar Wilde', category: 'wisdom' },
  { content: 'Knowledge is power.', author: 'Francis Bacon', category: 'knowledge' },
  { content: 'Practice makes perfect.', author: 'Unknown', category: 'learning' },
  { content: 'Where there is a will, there is a way.', author: 'Unknown', category: 'determination' },
  { content: 'Actions speak louder than words.', author: 'Proverb', category: 'wisdom' },
  { content: 'Early to bed and early to rise makes a man healthy, wealthy, and wise.', author: 'Benjamin Franklin', category: 'habits' },
  { content: 'A journey of a thousand miles begins with a single step.', author: 'Lao Tzu', category: 'action' },
  { content: 'Learn from yesterday, live for today, hope for tomorrow.', author: 'Albert Einstein', category: 'life' }
];

const sentencesData = [
  { en: 'I like to eat apples.', cn: '我喜欢吃苹果。', level: 'beginner' },
  { en: 'She is reading a book.', cn: '她正在读书。', level: 'beginner' },
  { en: 'The sun rises in the east.', cn: '太阳从东方升起。', level: 'beginner' },
  { en: 'He goes to school by bus.', cn: '他乘公共汽车去上学。', level: 'beginner' },
  { en: 'They are playing football.', cn: '他们正在踢足球。', level: 'beginner' },
  { en: 'The weather is very nice today.', cn: '今天天气很好。', level: 'beginner' },
  { en: 'I have a dream.', cn: '我有一个梦想。', level: 'beginner' },
  { en: 'Time flies when you are having fun.', cn: '快乐的时光总是过得很快。', level: 'intermediate' },
  { en: 'Practice makes perfect.', cn: '熟能生巧。', level: 'intermediate' },
  { en: 'Actions speak louder than words.', cn: '事实胜于雄辩。', level: 'intermediate' },
  { en: 'Where there is a will, there is a way.', cn: '有志者事竟成。', level: 'intermediate' },
  { en: 'The early bird catches the worm.', cn: '早起的鸟儿有虫吃。', level: 'intermediate' },
  { en: 'Knowledge is power.', cn: '知识就是力量。', level: 'intermediate' },
  { en: 'Rome was not built in a day.', cn: '罗马不是一天建成的。', level: 'intermediate' },
  { en: 'All roads lead to Rome.', cn: '条条大路通罗马。', level: 'intermediate' },
  { en: 'A friend in need is a friend indeed.', cn: '患难见真情。', level: 'intermediate' },
  { en: 'Better late than never.', cn: '迟做总比不做好。', level: 'intermediate' },
  { en: 'The journey of a thousand miles begins with a single step.', cn: '千里之行，始于足下。', level: 'advanced' },
  { en: 'Success is not final, failure is not fatal.', cn: '成功不是终点，失败不是致命的。', level: 'advanced' }
];

try {
  console.log('📚 导入词汇数据...');
  let vocabCount = 0;
  for (const item of vocabularyData) {
    db.prepare(`
      INSERT OR IGNORE INTO vocabulary (word, meaning, example_sentence, difficulty_level)
      VALUES (?, ?, ?, ?)
    `).run(item.word, item.meaning, item.example, item.level);
    vocabCount++;
  }
  console.log(`✅ 词汇导入完成：${vocabCount} 个单词\n`);

  console.log('💭 导入名言课程...');
  const quoteCourse: any = db.prepare(`
    INSERT OR IGNORE INTO courses (title, description, course_type, difficulty_level, author_name)
    VALUES ('每日名言', '学习英语名言，提升英语素养', 'text', 'intermediate', 'Various Authors')
    RETURNING id
  `).get();

  if (quoteCourse) {
    const courseId = quoteCourse.id;
    let quoteCount = 0;
    for (const quote of quotesData) {
      db.prepare(`
        INSERT INTO sentences (course_id, content_en, content_cn, difficulty_level)
        VALUES (?, ?, ?, ?)
      `).run(courseId, quote.content, quote.author, quote.category);
      quoteCount++;
    }
    console.log(`✅ 名言课程导入完成：${quoteCount} 句名言\n`);
  }

  console.log('📝 导入基础句子课程...');
  const sentenceCourse: any = db.prepare(`
    INSERT OR IGNORE INTO courses (title, description, course_type, difficulty_level, author_name)
    VALUES ('基础句子练习', '从简单到复杂的英语句子练习', 'text', 'beginner', 'EnglishAI Team')
    RETURNING id
  `).get();

  if (sentenceCourse) {
    const courseId = sentenceCourse.id;
    let sentenceCount = 0;
    for (const sentence of sentencesData) {
      db.prepare(`
        INSERT INTO sentences (course_id, content_en, content_cn, difficulty_level)
        VALUES (?, ?, ?, ?)
      `).run(courseId, sentence.en, sentence.cn, sentence.level);
      sentenceCount++;
    }
    console.log(`✅ 句子课程导入完成：${sentenceCount} 个句子\n`);
  }

  console.log('🎉 所有数据导入完成！');

} catch (error: any) {
  console.error('❌ 数据导入失败:', error.message);
  process.exit(1);
}
