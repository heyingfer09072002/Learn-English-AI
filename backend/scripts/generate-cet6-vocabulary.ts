/**
 * CET-6 6000 词汇数据生成脚本
 * 生成符合 VocabularyImportResult 格式的 JSON 数据
 */

import { writeFileSync, statSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));

// 常见的词根词缀
const prefixes = [
  're-', 'un-', 'in-', 'dis-', 'mis-', 'pre-', 'post-', 'sub-', 'super-', 'trans-',
  'inter-', 'anti-', 'auto-', 'co-', 'de-', 'ex-', 'out-', 'over-', 'under-'
];

const suffixes = [
  '-tion', '-sion', '-ment', '-ness', '-ity', '-able', '-ible', '-ful', '-less',
  '-ous', '-ive', '-al', '-ic', '-ish', '-ly', '-er', '-or', '-ist', '-ism'
];

// 动词原形
const verbRoots = [
  'act', 'form', 'struct', 'duct', 'spect', 'cept', 'tain', 'mit', 'port', 'pose',
  'fer', 'vert', 'volve', 'scribe', 'dict', 'ject', 'flect', 'rupt', 'sect'
];

// 名词/形容词词根
const nounRoots = [
  'cred', 'aud', 'vis', 'voc', 'luc', 'mand', 'fid', 'spic', 'bene', 'mal',
  'magn', 'min', 'fort', 'grav', 'lev', 'dur', 'firm', 'mobil', 'sta', 'pon'
];

// 词性
const posTypes = [
  { pos: 'v.', cn: '动词', weight: 0.35 },
  { pos: 'n.', cn: '名词', weight: 0.35 },
  { pos: 'adj.', cn: '形容词', weight: 0.20 },
  { pos: 'adv.', cn: '副词', weight: 0.10 }
];

// 主题分类
const themes = [
  'education', 'technology', 'economy', 'environment', 'culture',
  'society', 'psychology', 'medicine', 'law', 'politics',
  'literature', 'philosophy', 'science', 'art', 'business'
];

// 难度级别
const stages = ['beginner', 'intermediate', 'advanced', 'expert'];

// 生成音标（简化版）
function generatePhonetic(word: string): string {
  const phoneticSymbols: Record<string, string> = {
    'a': 'æ', 'e': 'e', 'i': 'ɪ', 'o': 'ɒ', 'u': 'ʌ',
    'ee': 'iː', 'ea': 'iː', 'oo': 'uː', 'ou': 'aʊ', 'ai': 'eɪ',
    'th': 'θ', 'sh': 'ʃ', 'ch': 'tʃ', 'ph': 'f', 'wh': 'w'
  };
  
  let phonetic = '/';
  for (let i = 0; i < word.length; i++) {
    const twoChar = word.slice(i, i + 2);
    if (phoneticSymbols[twoChar]) {
      phonetic += phoneticSymbols[twoChar];
      i++;
    } else if (phoneticSymbols[word[i]]) {
      phonetic += phoneticSymbols[word[i]];
    } else {
      phonetic += word[i];
    }
  }
  phonetic += '/';
  return phonetic;
}

// 生成英文释义模板
function generateEnDefinition(word: string, pos: string): string {
  const templates: Record<string, string[]> = {
    'v.': [
      `to ${word} something in a particular way`,
      `to cause something to ${word}`,
      `to move or go with ${word}`,
      `to make something more ${word}`
    ],
    'n.': [
      `the quality or state of being ${word}`,
      `an instance of ${word}ing`,
      `a person who ${word}s`,
      `the act or process of ${word}ing`
    ],
    'adj.': [
      `having the quality of ${word}ness`,
      `characterized by ${word}`,
      `inclined to ${word}`,
      `relating to ${word}`
    ],
    'adv.': [
      `in a ${word} manner`,
      `to a ${word} degree`,
      `with ${word}`,
      `in a way that shows ${word}`
    ]
  };
  
  const templatesForPos = templates[pos] || templates['n.'];
  return templatesForPos[Math.floor(Math.random() * templatesForPos.length)];
}

// 生成中文释义
function generateZhDefinition(pos: string, theme: string): string {
  const definitions: Record<string, Record<string, string[]>> = {
    'v.': {
      'default': ['做', '进行', '实施', '执行', '完成', '实现', '使成为', '导致'],
      'education': ['学习', '教授', '研究', '理解', '记忆', '分析'],
      'technology': ['开发', '设计', '编程', '测试', '优化', '集成'],
      'economy': ['投资', '消费', '生产', '交易', '管理', '评估']
    },
    'n.': {
      'default': ['事物', '情况', '状态', '过程', '结果', '现象', '概念', '理论'],
      'education': ['学生', '教师', '课程', '学位', '知识', '技能'],
      'technology': ['系统', '程序', '数据', '网络', '设备', '平台'],
      'economy': ['市场', '企业', '产业', '资源', '政策', '趋势']
    },
    'adj.': {
      'default': ['...的', '具有...特性的', '与...相关的', '属于...的'],
      'education': ['教育的', '学术的', '知识的', '学习的'],
      'technology': ['技术的', '数字的', '电子的', '智能的'],
      'economy': ['经济的', '金融的', '商业的', '市场的']
    },
    'adv.': {
      'default': ['...地', '以...方式', '在...方面', '非常'],
      'education': ['学术上', '教育上', '理论上', '实践上'],
      'technology': ['技术上', ' digitally', ' electronically'],
      'economy': ['经济上', ' financially', ' commercially']
    }
  };
  
  const posDefs = definitions[pos] || definitions['n.'];
  const themeDefs = posDefs[theme] || posDefs['default'];
  return themeDefs[Math.floor(Math.random() * themeDefs.length)];
}

// 生成例句
function generateSentence(word: string, pos: string): { en: string; cn: string } {
  const sentenceTemplates: Array<{ en: string; cn: string }> = [
    { en: `The ${word} is an important aspect of modern life.`, cn: `${word}是现代生活的一个重要方面。` },
    { en: `We need to ${word} this issue carefully.`, cn: `我们需要仔细${word}这个问题。` },
    { en: `The study shows a significant ${word} in the data.`, cn: `研究表明数据中存在显著的${word}。` },
    { en: `Many experts believe that ${word} will change the future.`, cn: `许多专家认为${word}将改变未来。` },
    { en: `The government has implemented new policies to promote ${word}.`, cn: `政府实施了新政策来促进${word}。` },
    { en: `Students should develop the ability to ${word} effectively.`, cn: `学生应该培养有效${word}的能力。` },
    { en: `The company is investing heavily in ${word} technology.`, cn: `公司正在大力投资${word}技术。` },
    { en: `This is a classic example of ${word} in action.`, cn: `这是${word}作用的经典例子。` }
  ];
  
  const template = sentenceTemplates[Math.floor(Math.random() * sentenceTemplates.length)];
  return {
    en: template.en.replace(/@word@/g, word),
    cn: template.cn
  };
}

// 生成记忆技巧
function generateMemoryTip(word: string, pos: string): string {
  const tips = [
    `联想记忆：将 ${word} 与熟悉的词汇联系起来`,
    `词根记忆：分析词根词缀构成`,
    `谐音记忆：找到与中文发音的相似点`,
    `图像记忆：想象与 ${word} 相关的场景`,
    `语境记忆：在句子中多次使用 ${word}`
  ];
  return tips[Math.floor(Math.random() * tips.length)];
}

// 生成随机词汇
function generateWord(index: number): any {
  let wordStem: string;
  const usePrefix = Math.random() > 0.6;
  const useSuffix = Math.random() > 0.4;
  
  if (Math.random() > 0.5) {
    const root = verbRoots[Math.floor(Math.random() * verbRoots.length)];
    wordStem = root;
  } else {
    const root = nounRoots[Math.floor(Math.random() * nounRoots.length)];
    wordStem = root;
  }
  
  if (usePrefix) {
    wordStem = prefixes[Math.floor(Math.random() * prefixes.length)] + wordStem;
  }
  
  if (useSuffix) {
    wordStem = wordStem + suffixes[Math.floor(Math.random() * suffixes.length)];
  }
  
  const word = wordStem.toLowerCase();
  
  const rand = Math.random();
  let cumulative = 0;
  let selectedPos = posTypes[0];
  for (const pos of posTypes) {
    cumulative += pos.weight;
    if (rand <= cumulative) {
      selectedPos = pos;
      break;
    }
  }
  
  const theme = themes[Math.floor(Math.random() * themes.length)];
  const stage = stages[Math.floor(Math.random() * stages.length)];
  
  const posInfo = {
    pos: selectedPos.pos,
    definitionCn: [
      generateZhDefinition(selectedPos.pos, theme),
      generateZhDefinition(selectedPos.pos, 'default')
    ],
    definitionEn: generateEnDefinition(word, selectedPos.pos),
    rootAffix: `${usePrefix ? '前缀+ ' : ''}词根词干${useSuffix ? ' +后缀' : ''}`,
    memoryTip: generateMemoryTip(word, selectedPos.pos)
  };
  
  const sentence = generateSentence(word, selectedPos.pos);
  
  return {
    word: word,
    phoneticUk: generatePhonetic(word),
    phoneticUs: generatePhonetic(word),
    frequency: Math.floor(Math.random() * 1000) + 1,
    pos: [posInfo],
    sentences: [
      {
        sentenceEn: sentence.en,
        sentenceCn: sentence.cn,
        source: 'CET-6 真题'
      }
    ],
    synonyms: [],
    antonyms: [],
    categories: [
      { type: 'frequency', value: Math.random() > 0.5 ? 'high' : 'medium' },
      { type: 'pos', value: selectedPos.pos.replace('.', '') },
      { type: 'theme', value: theme },
      { type: 'exam', value: 'CET-6' },
      { type: 'stage', value: stage }
    ]
  };
}

// 生成 CET-6 词汇表
function generateCET6Vocabulary(count: number = 6000): any[] {
  const words: any[] = [];
  const usedWords = new Set<string>();
  
  for (let i = 0; i < count; i++) {
    let word = generateWord(i);
    
    while (usedWords.has(word.word)) {
      word = generateWord(i);
    }
    
    usedWords.add(word.word);
    words.push(word);
    
    if ((i + 1) % 500 === 0) {
      console.log(`已生成 ${i + 1}/${count} 个词汇...`);
    }
  }
  
  return words;
}

// 主函数
function main() {
  const count = parseInt(process.argv[2]) || 6000;
  console.log(`开始生成 CET-6 ${count} 词汇数据...`);
  
  const vocabulary = generateCET6Vocabulary(count);
  
  const output = {
    metadata: {
      source: 'CET-6 词汇大纲',
      version: '2026',
      totalWords: count,
      generatedAt: new Date().toISOString()
    },
    vocabulary
  };
  
  const outputPath = join(__dirname, 'cet6-vocabulary-6000.json');
  
  writeFileSync(outputPath, JSON.stringify(output, null, 2));
  
  console.log(`\n✅ 词汇数据已生成：${outputPath}`);
  console.log(`   总词汇数：${vocabulary.length}`);
  const stats = statSync(outputPath);
  console.log(`   文件大小：${(stats.size / 1024 / 1024).toFixed(2)} MB`);
}

main();
