#!/usr/bin/env tsx
/**
 * 更新课程句子数量统计
 */

import { db } from '../src/database/sqlite.js';

console.log('📊 更新课程句子统计...\n');

// 为每门课程计算句子数量并添加封面图
const courses: any[] = db.prepare('SELECT id, title, difficulty_level FROM courses').all();

const coverImages = [
  'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
  'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
  'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
  'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)',
  'linear-gradient(135deg, #fa709a 0%, #fee140 100%)',
  'linear-gradient(135deg, #30cfd0 0%, #330867 100%)',
  'linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)',
  'linear-gradient(135deg, #ff9a9e 0%, #fecfef 99%, #fecfef 100%)',
  'linear-gradient(135deg, #f6d365 0%, #fda085 100%)',
  'linear-gradient(135deg, #84fab0 0%, #8fd3f4 100%)',
];

let index = 0;
for (const course of courses) {
  const sentenceCount: any = db.prepare(
    'SELECT COUNT(*) as count FROM sentences WHERE course_id = ?'
  ).get(course.id);
  
  const coverImage = coverImages[index % coverImages.length];
  
  db.prepare(`
    UPDATE courses SET cover_image = ? WHERE id = ?
  `).run(coverImage, course.id);
  
  console.log(`✓ ${course.title}: ${sentenceCount.count} 句`);
  index++;
}

console.log(`\n✅ 已更新 ${courses.length} 门课程的封面图`);
