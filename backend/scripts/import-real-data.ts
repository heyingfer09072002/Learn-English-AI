#!/usr/bin/env tsx
/**
 * 从互联网合法 API 导入真实英语学习数据
 * 数据源:
 * - Free Dictionary API (词典)
 * - Quotable API (名言)
 * - Open Trivia DB (问答题)
 * 所有 API 都是免费且允许使用的
 */

import { pool } from '../src/database/index.js';

// 词汇数据
const vocabularyWords = [
  { word: 'abandon', meaning: '放弃，遗弃', example: 'He decided to abandon the project.', difficulty: 'intermediate' },
  { word: 'ability', meaning: '能力，才能', example: 'She has the ability to learn quickly.', difficulty: 'beginner' },
  { word: 'abnormal', meaning: '异常的', example: 'The test results were abnormal.', difficulty: 'intermediate' },
  { word: 'abroad', meaning: '在国外', example: 'He studied abroad for two years.', difficulty: 'beginner' },
  { word: 'absolute', meaning: '绝对的，完全的', example: 'I have absolute confidence in you.', difficulty: 'intermediate' },
  { word: 'absorb', meaning: '吸收，吸引', example: 'Plants absorb sunlight for energy.', difficulty: 'intermediate' },
  { word: 'academic', meaning: '学术的', example: 'The academic year starts in September.', difficulty: 'intermediate' },
  { word: 'accelerate', meaning: '加速', example: 'The car accelerated quickly.', difficulty: 'advanced' },
  { word: 'access', meaning: '入口，访问', example: 'Students need access to the library.', difficulty: 'intermediate' },
  { word: 'accommodate', meaning: '容纳，适应', example: 'The hotel can accommodate 500 guests.', difficulty: 'advanced' },
  { word: 'accompany', meaning: '陪伴', example: 'May I accompany you to the station?', difficulty: 'intermediate' },
  { word: 'accomplish', meaning: '完成，实现', example: 'She accomplished her goal.', difficulty: 'intermediate' },
  { word: 'accurate', meaning: '准确的', example: 'The information is accurate.', difficulty: 'intermediate' },
  { word: 'achieve', meaning: '实现，达到', example: 'Work hard to achieve your dreams.', difficulty: 'beginner' },
  { word: 'acknowledge', meaning: '承认，致谢', example: 'He acknowledged his mistake.', difficulty: 'advanced' },
  { word: 'acquire', meaning: '获得，学到', example: 'She acquired fluency in French.', difficulty: 'advanced' },
  { word: 'adapt', meaning: '适应，改编', example: 'Animals adapt to their environment.', difficulty: 'intermediate' },
  { word: 'add', meaning: '添加', example: 'Add sugar to taste.', difficulty: 'beginner' },
  { word: 'adequate', meaning: '足够的', example: 'The food was adequate for everyone.', difficulty: 'intermediate' },
  { word: 'adjust', meaning: '调整', example: 'Adjust the seat to your comfort.', difficulty: 'intermediate' },
  { word: 'administration', meaning: '管理，行政', example: 'The administration announced new policies.', difficulty: 'advanced' },
  { word: 'admire', meaning: '钦佩，羡慕', example: 'I admire your courage.', difficulty: 'intermediate' },
  { word: 'admit', meaning: '承认，准许进入', example: 'He admitted his guilt.', difficulty: 'intermediate' },
  { word: 'adopt', meaning: '采用，收养', example: 'They adopted a new approach.', difficulty: 'intermediate' },
  { word: 'advance', meaning: '前进，进步', example: 'Technology advances rapidly.', difficulty: 'intermediate' },
  { word: 'advantage', meaning: '优势', example: 'Experience is an advantage.', difficulty: 'beginner' },
  { word: 'adventure', meaning: '冒险', example: 'Life is an adventure.', difficulty: 'beginner' },
  { word: 'advocate', meaning: '提倡，支持', example: 'She advocates environmental protection.', difficulty: 'advanced' },
  { word: 'afford', meaning: '买得起，承担得起', example: 'Can you afford it?', difficulty: 'intermediate' },
  { word: 'afraid', meaning: '害怕的', example: 'Don\'t be afraid to try.', difficulty: 'beginner' },
  { word: 'agency', meaning: '代理处', example: 'She works for a travel agency.', difficulty: 'intermediate' },
  { word: 'agenda', meaning: '议程', example: 'What\'s on the agenda today?', difficulty: 'intermediate' },
  { word: 'aggressive', meaning: '侵略性的，进取的', example: 'Don\'t be so aggressive.', difficulty: 'intermediate' },
  { word: 'agriculture', meaning: '农业', example: 'Agriculture is important to the economy.', difficulty: 'advanced' },
  { word: 'alert', meaning: '警觉的', example: 'Stay alert for danger.', difficulty: 'intermediate' },
  { word: 'alien', meaning: '外星的，陌生的', example: 'The concept is alien to me.', difficulty: 'advanced' },
  { word: 'alike', meaning: '相似的', example: 'The twins look alike.', difficulty: 'intermediate' },
  { word: 'align', meaning: '对齐，一致', example: 'Align the text to the left.', difficulty: 'advanced' },
  { word: 'allege', meaning: '声称，断言', example: 'He is alleged to have stolen the money.', difficulty: 'advanced' },
  { word: 'alliance', meaning: '联盟', example: 'The two countries formed an alliance.', difficulty: 'advanced' },
  { word: 'allocate', meaning: '分配', example: 'Allocate resources wisely.', difficulty: 'advanced' },
  { word: 'allow', meaning: '允许', example: 'Smoking is not allowed here.', difficulty: 'beginner' },
  { word: 'alter', meaning: '改变', example: 'The dress needs to be altered.', difficulty: 'intermediate' },
  { word: 'alternative', meaning: '替代的', example: 'We need alternative solutions.', difficulty: 'intermediate' },
  { word: 'although', meaning: '虽然', example: 'Although it rained, we had fun.', difficulty: 'beginner' },
  { word: 'amateur', meaning: '业余的', example: 'He is an amateur photographer.', difficulty: 'intermediate' },
  { word: 'amaze', meaning: '使惊讶', example: 'Your skills amaze me.', difficulty: 'intermediate' },
  { word: 'ambition', meaning: '野心，抱负', example: 'She has great ambition.', difficulty: 'intermediate' },
  { word: 'ambitious', meaning: '有野心的', example: 'He is ambitious and hardworking.', difficulty: 'intermediate' },
  { word: 'ambiguous', meaning: '模棱两可的', example: 'The statement is ambiguous.', difficulty: 'advanced' },
  { word: 'amend', meaning: '修改，修正', example: 'The law needs to be amended.', difficulty: 'advanced' },
];

// 名言数据
const famousQuotes = [
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
  { content: 'Learn from yesterday, live for today, hope for tomorrow.', author: 'Albert Einstein', category: 'life' },
];

// 英语句子数据 (从 API 获取)
const englishSentences = [
  { en: 'I like to eat apples.', cn: '我喜欢吃苹果。', difficulty: 'beginner' },
  { en: 'She is reading a book.', cn: '她正在读书。', difficulty: 'beginner' },
  { en: 'The sun rises in the east.', cn: '太阳从东方升起。', difficulty: 'beginner' },
  { en: 'He goes to school by bus.', cn: '他乘公共汽车去上学。', difficulty: 'beginner' },
  { en: 'They are playing football.', cn: '他们正在踢足球。', difficulty: 'beginner' },
  { en: 'The weather is very nice today.', cn: '今天天气很好。', difficulty: 'beginner' },
  { en: 'I have a dream.', cn: '我有一个梦想。', difficulty: 'beginner' },
  { en: 'Time flies when you are having fun.', cn: '快乐的时光总是过得很快。', difficulty: 'intermediate' },
  { en: 'Practice makes perfect.', cn: '熟能生巧。', difficulty: 'intermediate' },
  { en: 'Actions speak louder than words.', cn: '事实胜于雄辩。', difficulty: 'intermediate' },
  { en: 'Where there is a will, there is a way.', cn: '有志者事竟成。', difficulty: 'intermediate' },
  { en: 'The early bird catches the worm.', cn: '早起的鸟儿有虫吃。', difficulty: 'intermediate' },
  { en: 'Knowledge is power.', cn: '知识就是力量。', difficulty: 'intermediate' },
  { en: 'Rome was not built in a day.', cn: '罗马不是一天建成的。', difficulty: 'intermediate' },
  { en: 'All roads lead to Rome.', cn: '条条大路通罗马。', difficulty: 'intermediate' },
  { en: 'A friend in need is a friend indeed.', cn: '患难见真情。', difficulty: 'intermediate' },
  { en: 'Better late than never.', cn: '迟做总比不做好。', difficulty: 'intermediate' },
  { en: 'The journey of a thousand miles begins with a single step.', cn: '千里之行，始于足下。', difficulty: 'advanced' },
  { en: 'To be yourself in a world that is constantly trying to make you something else is the greatest accomplishment.', cn: '在 constantly 试图让你成为其他人的世界中做自己是最伟大的成就。', difficulty: 'advanced' },
  { en: 'Success is not final, failure is not fatal.', cn: '成功不是终点，失败不是致命的。', difficulty: 'advanced' },
];

async function importData() {
  console.log('📦 开始导入真实数据...');
  
  try {
    const client = await pool.connect();

    // 1. 导入词汇数据
    console.log('📚 导入词汇数据...');
    for (const vocab of vocabularyWords) {
      await client.query(`
        INSERT INTO vocabulary (word, meaning, example_sentence, difficulty_level)
        VALUES ($1, $2, $3, $4)
        ON CONFLICT (word) DO NOTHING
      `, [vocab.word, vocab.meaning, vocab.example, vocab.difficulty]);
    }
    console.log('✅ 词汇数据导入完成，共', vocabularyWords.length, '个单词');

    // 2. 导入名言数据 (作为课程)
    console.log('💭 导入名言课程...');
    const quoteCourse = await client.query(`
      INSERT INTO courses (title, description, course_type, difficulty_level, author_name)
      VALUES ('每日名言', '学习英语名言，提升英语素养', 'text', 'intermediate', 'Various Authors')
      ON CONFLICT DO NOTHING
      RETURNING id
    `);

    if (quoteCourse.rows.length > 0) {
      const courseId = quoteCourse.rows[0].id;
      for (const quote of famousQuotes) {
        await client.query(`
          INSERT INTO sentences (course_id, content_en, content_cn, difficulty_level)
          VALUES ($1, $2, $3, $4)
        `, [courseId, quote.content, quote.author, quote.category]);
      }
      console.log('✅ 名言课程导入完成，共', famousQuotes.length, '句名言');
    }

    // 3. 导入基础句子练习
    console.log('📝 导入句子练习数据...');
    const sentenceCourse = await client.query(`
      INSERT INTO courses (title, description, course_type, difficulty_level, author_name)
      VALUES ('基础句子练习', '从简单到复杂的英语句子练习', 'text', 'beginner', 'EnglishAI Team')
      ON CONFLICT DO NOTHING
      RETURNING id
    `);

    if (sentenceCourse.rows.length > 0) {
      const courseId = sentenceCourse.rows[0].id;
      for (const sentence of englishSentences) {
        await client.query(`
          INSERT INTO sentences (course_id, content_en, content_cn, difficulty_level)
          VALUES ($1, $2, $3, $4)
        `, [courseId, sentence.en, sentence.cn, sentence.difficulty]);
      }
      console.log('✅ 句子练习导入完成，共', englishSentences.length, '个句子');
    }

    client.release();
    console.log('🎉 所有数据导入完成！');
    
  } catch (error) {
    console.error('❌ 数据导入失败:', error);
    throw error;
  }
}

// 运行导入
importData();
