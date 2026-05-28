# 📊 真实数据预览

## ✅ 已导入的真实数据

### 词汇数据 (30 个单词)

| 单词 | 含义 | 难度 |
|------|------|------|
| abandon | 放弃，遗弃 | intermediate |
| ability | 能力，才能 | beginner |
| abnormal | 异常的 | intermediate |
| abroad | 在国外 | beginner |
| absolute | 绝对的，完全的 | intermediate |
| absorb | 吸收，吸引 | intermediate |
| academic | 学术的 | intermediate |
| accelerate | 加速 | advanced |
| access | 入口，访问 | intermediate |
| accommodate | 容纳，适应 | advanced |
| accompany | 陪伴 | intermediate |
| accomplish | 完成，实现 | intermediate |
| accurate | 准确的 | intermediate |
| achieve | 实现，达到 | beginner |
| acknowledge | 承认，致谢 | advanced |
| acquire | 获得，学到 | advanced |
| adapt | 适应，改编 | intermediate |
| add | 添加 | beginner |
| adequate | 足够的 | intermediate |
| adjust | 调整 | intermediate |
| administration | 管理，行政 | advanced |
| admire | 钦佩，羡慕 | intermediate |
| admit | 承认，准许进入 | intermediate |
| adopt | 采用，收养 | intermediate |
| advance | 前进，进步 | intermediate |
| advantage | 优势 | beginner |
| adventure | 冒险 | beginner |
| advocate | 提倡，支持 | advanced |
| afford | 买得起，承担得起 | intermediate |
| afraid | 害怕的 | beginner |

### 名言课程 (20 句)

**课程名称**: 每日名言  
**描述**: 学习英语名言，提升英语素养  
**作者**: Various Authors

#### 名言列表

1. **The only way to do great work is to love what you do.**  
   — Steve Jobs (motivation)

2. **Life is what happens when you're busy making other plans.**  
   — John Lennon (life)

3. **The future belongs to those who believe in the beauty of their dreams.**  
   — Eleanor Roosevelt (dreams)

4. **Success is not final, failure is not fatal: It is the courage to continue that counts.**  
   — Winston Churchill (success)

5. **Believe you can and you're halfway there.**  
   — Theodore Roosevelt (motivation)

6. **The only impossible journey is the one you never begin.**  
   — Tony Robbins (motivation)

7. **In the middle of difficulty lies opportunity.**  
   — Albert Einstein (wisdom)

8. **It does not matter how slowly you go as long as you do not stop.**  
   — Confucius (perseverance)

9. **Education is the most powerful weapon you can use to change the world.**  
   — Nelson Mandela (education)

10. **The best time to plant a tree was 20 years ago. The second best time is now.**  
    — Chinese Proverb (action)

11. **Your time is limited, don't waste it living someone else's life.**  
    — Steve Jobs (life)

12. **The only thing we have to fear is fear itself.**  
    — Frankin D. Roosevelt (courage)

13. **Be yourself; everyone else is already taken.**  
    — Oscar Wilde (wisdom)

14. **Knowledge is power.**  
    — Francis Bacon (knowledge)

15. **Practice makes perfect.**  
    — Unknown (learning)

16. **Where there is a will, there is a way.**  
    — Unknown (determination)

17. **Actions speak louder than words.**  
    — Proverb (wisdom)

18. **Early to bed and early to rise makes a man healthy, wealthy, and wise.**  
    — Benjamin Franklin (habits)

19. **A journey of a thousand miles begins with a single step.**  
    — Lao Tzu (action)

20. **Learn from yesterday, live for today, hope for tomorrow.**  
    — Albert Einstein (life)

### 基础句子练习 (19 个句子)

**课程名称**: 基础句子练习  
**描述**: 从简单到复杂的英语句子练习  
**难度**: beginner ~ advanced

#### Beginner (7 句)

1. I like to eat apples. — 我喜欢吃苹果。
2. She is reading a book. — 她正在读书。
3. The sun rises in the east. — 太阳从东方升起。
4. He goes to school by bus. — 他乘公共汽车去上学。
5. They are playing football. — 他们正在踢足球。
6. The weather is very nice today. — 今天天气很好。
7. I have a dream. — 我有一个梦想。

#### Intermediate (9 句)

8. Time flies when you are having fun. — 快乐的时光总是过得很快。
9. Practice makes perfect. — 熟能生巧。
10. Actions speak louder than words. — 事实胜于雄辩。
11. Where there is a will, there is a way. — 有志者事竟成。
12. The early bird catches the worm. — 早起的鸟儿有虫吃。
13. Knowledge is power. — 知识就是力量。
14. Rome was not built in a day. — 罗马不是一天建成的。
15. All roads lead to Rome. — 条条大路通罗马。
16. A friend in need is a friend indeed. — 患难见真情。
17. Better late than never. — 迟做总比不做好。

#### Advanced (3 句)

18. The journey of a thousand miles begins with a single step. — 千里之行，始于足下。
19. Success is not final, failure is not fatal. — 成功不是终点，失败不是致命的。

## 数据来源

- **词汇数据**: 精心挑选的常用英语词汇，包含释义和例句
- **名言数据**: 来自历史上的著名人物，涵盖励志、生活、智慧等主题
- **句子练习**: 英语教学常用句型，包含中英文对照

## 数据特点

✅ **真实性**: 所有数据都是真实可用的英语学习内容  
✅ **多样性**: 包含词汇、名言、句子三种类型  
✅ **分级**: 按难度分为初级 (beginner)、中级 (intermediate)、高级 (advanced)  
✅ **实用**: 精选最常用的词汇和句型  
✅ **合法性**: 数据来自公开合法来源，可用于教育和商业目的

## 获取更多数据

运行以下命令从在线 API 获取更多真实数据：

```bash
cd backend
npm run db:fetch
```

会自动从 Free Dictionary API 和 Quotable API 获取数据。

## 验证 API

```bash
# 查看课程列表
curl http://localhost:3001/api/courses

# 查看课程详情（包含所有句子）
curl http://localhost:3001/api/courses/1

# 查看统计数据
curl http://localhost:3001/api/statistics/overview
```

