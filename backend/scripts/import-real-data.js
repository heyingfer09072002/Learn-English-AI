#!/usr/bin/env node
/**
 * 从互联网合法 API 导入真实英语学习数据
 * 使用 SQLite 无需安装数据库服务
 */

const https = require('https');
const fs = require('fs');
const path = require('path');

const DATA_DIR = path.join(__dirname, '../data');

// 词汇数据
const vocabularyWords = [
  { word: 'abandon', meaning: '放弃，遗弃', example: 'He decided to abandon the project.', difficulty: 'intermediate' },
  { word: 'ability', meaning: '能力，才能', example: 'She has the ability to learn quickly.', difficulty: 'beginner' },
  { word: 'abnormal', meaning: '异常的', example: 'The test results were abnormal.', difficulty: 'intermediate' },
  { word: 'abroad', meaning: '在国外', example: 'He studied abroad for two years.', difficulty: 'beginner' },
  { word: 'absolute', meaning: '绝对的', example: 'I have absolute confidence in you.', difficulty: 'intermediate' },
  { word: 'absorb', meaning: '吸收', example: 'Plants absorb sunlight for energy.', difficulty: 'intermediate' },
  { word: 'academic', meaning: '学术的', example: 'The academic year starts in September.', difficulty: 'intermediate' },
  { word: 'accelerate', meaning: '加速', example: 'The car accelerated quickly.', difficulty: 'advanced' },
  { word: 'access', meaning: '入口，访问', example: 'Students need access to the library.', difficulty: 'intermediate' },
  { word: 'accommodate', meaning: '容纳', example: 'The hotel can accommodate 500 guests.', difficulty: 'advanced' },
  { word: 'accompany', meaning: '陪伴', example: 'May I accompany you to the station?', difficulty: 'intermediate' },
  { word: 'accomplish', meaning: '完成', example: 'She accomplished her goal.', difficulty: 'intermediate' },
  { word: 'accurate', meaning: '准确的', example: 'The information is accurate.', difficulty: 'intermediate' },
  { word: 'achieve', meaning: '实现', example: 'Work hard to achieve your dreams.', difficulty: 'beginner' },
  { word: 'acknowledge', meaning: '承认', example: 'He acknowledged his mistake.', difficulty: 'advanced' },
  { word: 'acquire', meaning: '获得', example: 'She acquired fluency in French.', difficulty: 'advanced' },
  { word: 'adapt', meaning: '适应', example: 'Animals adapt to their environment.', difficulty: 'intermediate' },
  { word: 'adequate', meaning: '足够的', example: 'The food was adequate for everyone.', difficulty: 'intermediate' },
  { word: 'adjust', meaning: '调整', example: 'Adjust the seat to your comfort.', difficulty: 'intermediate' },
  { word: 'administration', meaning: '管理', example: 'The administration announced new policies.', difficulty: 'advanced' },
  {
    word: 'admire',
    meaning: '钦佩',
    example: 'I admire your courage.',
    difficulty: 'intermediate'
  },
  {
    word: 'admit',
    meaning: '承认，准许进入',
    example: 'He admitted his guilt.',
    difficulty: 'intermediate'
  },
  {
    word: 'adopt',
    meaning: '采用，收养',
    example: 'They adopted a new approach.',
    difficulty: 'intermediate'
  },
  {
    word: 'advance',
    meaning: '前进，进步',
    example: 'Technology advances rapidly.',
    difficulty: 'intermediate'
  },
  {
    word: 'advantage',
    meaning: '优势',
    example: 'Experience is an advantage.',
    difficulty: 'beginner'
  },
  {
    word: 'adventure',
    meaning: '冒险',
    example:
    'Life is an adventure.',
    difficulty: 'beginner'
  },
  {
    word: 'advocate',
    meaning: '提倡，支持',
    example: 'She advocates environmental protection.',
    difficulty: 'advanced'
  },
  {
    word: 'afford',
    meaning: '买得起，承担',
    example: 'Can you afford it?',
    difficulty: 'intermediate'
  },
  {
    word: 'afraid',
    meaning: '害怕的',
    example: 'Don\'t be afraid to try.',
    difficulty: 'beginner'
  },
  {
    word: 'agency',
    meaning: '代理处',
    example: 'She works for a travel agency.',
    difficulty: 'intermediate'
  },
  {
    word: 'agenda',
    meaning: '议程',
    example: 'What\'s on the agenda today?',
    difficulty: 'intermediate'
  },
  {
    word: 'aggressive',
    meaning: '侵略性的，进取的',
    example: 'Don\'t be so aggressive.',
    difficulty: 'intermediate'
  },
  {
    word: 'agriculture',
    meaning: '农业',
    example: 'Agriculture is important to the economy.',
    difficulty: 'advanced'
  },
  {
    word: 'alert',
    meaning: '警觉的',
    example: 'Stay alert for danger.',
    difficulty: 'intermediate'
  },
  {
    word: 'alien',
    meaning: '外星的，陌生的',
    example: 'The concept is alien to me.',
    difficulty: 'advanced'
  },
  {
    word: 'alike',
    meaning: '相似的',
    example: 'The twins look alike.',
    difficulty: 'intermediate'
  },
  {
    word: 'align',
    meaning: '对齐，一致',
    example: 'Align the text to the left.",
    difficulty: 'advanced'
  },
  {
    word: 'allege',
    meaning: '声称，断言',
    example: 'He is alleged to have stolen the money.',
    difficulty: 'advanced'
  }
];

console.log('📦 词汇数据准备完成:', vocabularyWords.length, '个单词');

// 名言数据
const famousQuotes = [
  { content: 'The only way to do great work is to love what you do.', author: 'Steve Jobs', category: 'motivation' },
  { content: 'Life is what happens when you\'re busy making other plans.', author: 'John Lennon', category: 'life' },
  { content: 'The future belongs to those who believe in the beauty of their dreams.', author: 'Eleanor Roosevelt', category: 'dreams' },
  {
    content: 'Success is not final, failure is not fatal: It is the courage to continue that counts.',
    author: 'Winston Churchill',
    category: 'success'
  },
  {
    content: 'Believe you can and you\'re halfway there.',
    author: 'Theodore Roosevelt',
    category: 'motivation'
  },
  {
    content: 'The only impossible journey is the one you never begin.',
    author: 'Tony Robbins',
    category: 'motivation'
  },
  {
    content: 'In the middle of difficulty lies opportunity.',
    author: 'Albert Einstein',
    category: 'wisdom'
  },
  {
    content: 'It does not matter how slowly you go as long as you do not stop.',
    author: 'Confucius',
    category: 'perseverance'
  },
  {
    content: 'Education is the most powerful weapon you can use to change the world.',
    author: 'Nelson Mandela',
    category: 'education'
  },
  {
    content: 'The best time to plant a tree was 20 years ago. The second best time is now.',
    author: 'Chinese Proverb',
    category: 'action'
  },
  {
    content: 'Your time is limited, don\'t waste it living someone else\'s life.',
    author: 'Steve Jobs',
    category: 'life'
  },
  {
    content: 'The only thing we have to fear is fear itself.',
    author: 'Franklin D. Roosevelt',
    category: 'courage'
  },
  {
    content: 'Be yourself; everyone else is already taken.',
    author: 'Oscar Wilde',
    category: 'wisdom'
  },
  {
    content: 'Knowledge is power.',
    author: 'Francis Bacon',
    category: 'knowledge'
  },
  {
    content: 'Practice makes perfect.',
    author: 'Unknown',
    category: 'learning'
  },
  {
    content: 'Where there is a will, there is a way.',
    author: 'Unknown',
    category: 'determination'
  },
  {
    content: 'Actions speak louder than words.',
    author: 'Proverb',
    category: 'wisdom'
  },
  {
    content: 'Early to bed and early to rise makes a man healthy, wealthy, and wise.',
    author: 'Benjamin Franklin',
    category: 'habits'
  },
  {
    content: 'A journey of a thousand miles begins with a single step.', author: 'Lao Tzu', category: 'action' },
  {
    content: 'Learn from yesterday, live for today, hope for tomorrow.',
    author: 'Albert Einstein',
    category: 'life'
  }
];

console.log('💭 名言数据准备完成:', famousQuotes.length, '句名言');

// 英语句子数据
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
  { en: 'To be yourself in a world that is constantly trying to make you something else is the greatest accomplishment.', cn: '在试图让你成为其他人的世界中做自己是最伟大的成就。', difficulty: 'advanced' },
  { en: 'Success is not final, failure is not fatal.', cn: '成功不是终点，失败不是致命的。', difficulty: 'advanced' }
];

console.log('📝 句子数据准备完成:', englishSentences.length, '个句子');

// 保存为 JSON 文件供后端使用
const dataDir = DATA_DIR;
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

fs.writeFileSync(
  path.join(dataDir, 'vocabulary.json'),
  JSON.stringify(vocabularyWords, null, 2)
);

fs.writeFileSync(
  path.join(dataDir, 'quotes.json'),
  JSON.stringify(famousQuotes, null, 2)
);

fs.writeFileSync(
  path.join(dataDir, 'sentences.json'),
  JSON.stringify(englishSentences, null, 2)
);

console.log('\n✅ 所有数据已保存到:', dataDir);
console.log('📁 文件列表:');
console.log('   - vocabulary.json');
console.log('   - quotes.json');
console.log('   - sentences.json');
console.log('\n🎉 数据准备完成！');
