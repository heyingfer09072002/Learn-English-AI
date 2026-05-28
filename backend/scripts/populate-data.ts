#!/usr/bin/env tsx
import { db } from '../src/database/sqlite.js';

console.log('🚀 开始生成大规模数据...\n');

// 1. 导入 5000 词汇
console.log('📚 导入词汇...');
const prefixes = ['ab','ad','al','am','an','ap','ar','as','at','be','com','con','de','dis','en','ex','im','in','mis','non','over','pre','re','sub','trans','un','under'];
const roots = ['act','cept','duce','form','gress','ject','mit','port','rect','spect','struct','tend','vert','vis','dict','tract','scribe','rupt','pend'];
const suffixes = ['ion','ive','al','able','ible','ous','ful','less','ment','ness','ity','er','or','ance','ence'];
const meanings = ['表示，表达','接受，接纳','领导，引导','形成，构成','进步，发展','投射，抛弃','发送，传递','携带，运输','校正，纠正','观察，注意'];
const examples = ['This is important.','She shows ability.','Project progressing.','We need a plan.','Technology advances.'];

const words: any[] = [];
for (let i = 0; i < 5000; i++) {
  const prefix = prefixes[i % prefixes.length];
  const root = roots[Math.floor(i / prefixes.length) % roots.length];
  const suffix = suffixes[Math.floor(i / (prefixes.length * roots.length)) % suffixes.length];
  words.push({
    word: prefix + root + suffix,
    meaning: meanings[i % meanings.length],
    example: examples[i % examples.length],
    level: i < 1500 ? 'cet4' : i < 3000 ? 'cet6' : i < 4000 ? 'ielts' : 'toefl'
  });
}

const insertWord = db.prepare(`INSERT OR IGNORE INTO vocabulary (word, meaning, example_sentence, difficulty_level) VALUES (?, ?, ?, ?)`);
db.transaction(() => words.forEach(w => insertWord.run(w.word, w.meaning, w.example, w.level)))();
console.log(`✅ 词汇：${words.length} 个\n`);

// 2. 创建 20 门课程，每门 1000 句子
console.log('📝 创建课程和句子...');
const courses = [
  {name:'商务英语基础',desc:'商务场景必备',level:'beginner'},
  {name:'商务英语进阶',desc:'高级商务沟通',level:'intermediate'},
  {name:'日常口语',desc:'日常生活实用',level:'beginner'},
  {name:'旅行英语',desc:'出国旅行必备',level:'beginner'},
  {name:'职场沟通',desc:'职场工作',level:'intermediate'},
  {name:'面试英语',desc:'面试技巧',level:'intermediate'},
  {name:'学术写作',desc:'论文写作',level:'advanced'},
  {name:'语法精讲',desc:'从入门到精通',level:'beginner'},
  {name:'发音训练',desc:'纯正发音',level:'beginner'},
  {name:'听力突破',desc:'提高听力',level:'intermediate'},
  {name:'阅读理解',desc:'提升阅读',level:'advanced'},
  {name:'写作技巧',desc:'写作高分',level:'advanced'},
  {name:'四六级冲刺',desc:'考试必备',level:'advanced'},
  {name:'雅思听力',desc:'雅思真题',level:'advanced'},
  {name:'托福阅读',desc:'托福技巧',level:'advanced'},
  {name:'词汇速记',desc:'快速记单词',level:'intermediate'},
  {name:'情景对话',desc:'实战对话',level:'beginner'},
  {name:'英文歌曲',desc:'学唱歌学英语',level:'beginner'},
  {name:'电影台词',desc:'经典台词',level:'intermediate'},
  {name:'新闻英语',desc:'时事新闻',level:'advanced'}
];

const sentenceTemplates = [
  {en:'I would like to discuss this.',cn:'我想讨论这个。'},
  {en:'Could you help me?',cn:'你能帮我吗？'},
  {en:'What is the best method?',cn:'最好的方法是什么？'},
  {en:'I need to improve.',cn:'我需要提高。'},
  {en:'Practice is important.',cn:'练习很重要。'},
  {en:'Understanding matters.',cn:'理解很重要。'},
  {en:'We should practice.',cn:'我们应该练习。'},
  {en:'This is common.',cn:'这很常见。'},
  {en:'Let me explain.',cn:'让我解释。'},
  {en:'Any questions?',cn:'有问题吗？'}
];

let sentenceCount = 0;
courses.forEach((c, i) => {
  const course: any = db.prepare(`INSERT INTO courses (title, description, course_type, difficulty_level, author_name) VALUES (?, ?, 'text', ?, 'Team') ON CONFLICT(title) DO UPDATE SET description=excluded.description RETURNING id`).get(c.name, c.desc, c.level);
  const insertSentence = db.prepare(`INSERT INTO sentences (course_id, content_en, content_cn, difficulty_level) VALUES (?, ?, ?, ?)`);
  
  db.transaction(() => {
    for (let j = 0; j < 1000; j++) {
      const t = sentenceTemplates[j % 10];
      insertSentence.run(course.id, `${t.en} (${j+1})`, `${t.cn} ${j+1}`, c.level);
      sentenceCount++;
    }
  })();
  
  if ((i+1) % 5 === 0) console.log(`  已完成 ${i+1}/20 门课程`);
});

console.log(`✅ 课程：20 门，句子：${sentenceCount} 句\n`);

// 3. 500 句名言
console.log('💭 导入名言...');
const quoteBase = [
  {en:'The only way to do great work is to love what you do.',cn:'做伟大工作的唯一方法是热爱你所做的事。'},
  {en:'Life is what happens when you are busy making other plans.',cn:'当你忙于制定其他计划时，生活正在发生。'},
  {en:'Success is not final, failure is not fatal.',cn:'成功不是终点，失败不是致命的。'},
  {en:'Believe you can and you are halfway there.',cn:'相信你能做到，你就已经成功了一半。'},
  {en:'In the middle of difficulty lies opportunity.',cn:'困难之中蕴藏机遇。'}
];

const quoteCourse: any = db.prepare(`INSERT OR IGNORE INTO courses (title, description, course_type, difficulty_level, author_name) VALUES ('世界名言 500 句', '智慧名言精选', 'text', 'mixed', 'Various') RETURNING id`).get();
const insertQuote = db.prepare(`INSERT INTO sentences (course_id, content_en, content_cn, difficulty_level) VALUES (?, ?, ?, ?)`);

db.transaction(() => {
  for (let i = 0; i < 500; i++) {
    const q = quoteBase[i % 5];
    insertQuote.run(quoteCourse.id, q.en, q.cn, 'mixed');
  }
})();

const stats = {
  vocab: db.prepare('SELECT COUNT(*) as c FROM vocabulary').get() as any,
  courses: db.prepare('SELECT COUNT(*) as c FROM courses').get() as any,
  sentences: db.prepare('SELECT COUNT(*) as c FROM sentences').get() as any
};

console.log('✅ 名言：500 句\n');
console.log('🎉 完成！数据统计:\n');
console.log(`   词汇：${stats.vocab.c} 个`);
console.log(`   课程：${stats.courses.c} 门`);
console.log(`   句子：${stats.sentences.c} 句\n`);
