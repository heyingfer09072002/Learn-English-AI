#!/usr/bin/env node
/**
 * 从免费 API 获取真实英语数据
 * 数据源:
 * - Free Dictionary API (CC BY-SA 3.0): https://dictionaryapi.dev/
 * - Quotable API (CC0): https://github.com/lukePeavey/quotable
 */

import https from 'https';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const dataDir = path.join(__dirname, '../data');

if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

// 常用英语单词列表
const commonWords = [
  'hello', 'world', 'learn', 'english', 'practice', 'speak', 'write', 'read',
  'understand', 'communication', 'language', 'grammar', 'vocabulary', 'sentence',
  'pronunciation', 'fluency', 'conversation', 'dictionary', 'translate', 'meaning'
];

function fetchJson(url) {
  return new Promise((resolve, reject) => {
    https.get(url, { timeout: 10000 }, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          resolve(JSON.parse(data));
        } catch (e) {
          reject(new Error('解析 JSON 失败'));
        }
      });
    }).on('error', reject);
    
    setTimeout(() => reject(new Error('请求超时')), 10000);
  });
}

async function fetchDictionaryData() {
  console.log('📚 从 Free Dictionary API 获取词汇数据...');
  const vocabulary = [];
  
  for (const word of commonWords) {
    try {
      const data = await fetchJson(`https://api.dictionaryapi.dev/api/v2/entries/en/${word}`);
      if (Array.isArray(data) && data.length > 0) {
        const entry = data[0];
        const meaning = entry.meanings?.[0]?.definitions?.[0]?.definition || '';
        const example = entry.meanings?.[0]?.definitions?.[0]?.example || '';
        
        if (meaning) {
          vocabulary.push({
            word: entry.word,
            meaning: meaning.substring(0, 200),
            example: example ? example.substring(0, 300) : '',
            level: 'intermediate'
          });
          console.log(`  ✓ ${word}`);
        }
      }
    } catch (error) {
      console.log(`  ✗ ${word}: ${error.message}`);
    }
    
    // 避免请求过快
    await new Promise(resolve => setTimeout(resolve, 300));
  }
  
  fs.writeFileSync(
    path.join(dataDir, 'vocabulary-online.json'),
    JSON.stringify(vocabulary, null, 2)
  );
  console.log(`✅ 词汇数据获取完成：${vocabulary.length} 个单词\n`);
  return vocabulary;
}

async function fetchQuotes() {
  console.log('💭 从 Quotable API 获取名言数据...');
  
  try {
    const url = 'https://api.quotable.io/quotes/random?count=20&tags=wisdom|motivation|life';
    const data = await fetchJson(url);
    
    const quotes = data.map(quote => ({
      content: quote.content,
      author: quote.author,
      category: quote.tags?.[0] || 'general'
    }));
    
    fs.writeFileSync(
      path.join(dataDir, 'quotes-online.json'),
      JSON.stringify(quotes, null, 2)
    );
    console.log(`✅ 名言数据获取完成：${quotes.length} 句名言\n`);
    return quotes;
  } catch (error) {
    console.log('⚠️  名言 API 获取失败，使用备用数据');
    return [];
  }
}

async function main() {
  console.log('🌐 开始从在线 API 获取数据...\n');
  
  await fetchDictionaryData();
  await fetchQuotes();
  
  console.log('🎉 所有在线数据获取完成！');
  console.log('📁 保存位置:', dataDir);
}

main().catch(console.error);
