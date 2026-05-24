import { Pool } from 'pg'
import dotenv from 'dotenv'

dotenv.config()

const pool = new Pool({
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '5432'),
  database: process.env.DB_NAME || 'english_ai',
  user: process.env.DB_USER || 'english_ai',
  password: process.env.DB_PASSWORD || 'english_ai_pass',
  max: 20,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
})

// 在线课程数据源配置
const COURSE_SOURCES = [
  {
    name: '日常对话',
    level: 'beginner',
    icon: '💬',
    description: '学习日常英语对话，掌握基础交流能力',
    keywords: ['greeting', 'introduction', 'daily conversation', 'shopping', 'restaurant'],
  },
  {
    name: '旅行英语',
    level: 'beginner',
    icon: '✈️',
    description: '掌握旅行场景下的英语表达，轻松出游',
    keywords: ['airport', 'hotel', 'directions', 'sightseeing', 'transportation'],
  },
  {
    name: '商务沟通',
    level: 'intermediate',
    icon: '💼',
    description: '提升商务英语能力，应对职场沟通',
    keywords: ['meeting', 'presentation', 'email', 'negotiation', 'interview'],
  },
  {
    name: '学术英语',
    level: 'advanced',
    icon: '🎓',
    description: '学术场景英语，适用于留学和研究',
    keywords: ['lecture', 'research', 'essay', 'discussion', 'presentation'],
  },
  {
    name: '文化生活',
    level: 'intermediate',
    icon: '🌍',
    description: '了解英语国家文化和生活方式',
    keywords: ['culture', 'tradition', 'festival', 'customs', 'lifestyle'],
  },
  {
    name: '科技前沿',
    level: 'advanced',
    icon: '🤖',
    description: '学习科技领域的英语词汇和表达',
    keywords: ['technology', 'AI', 'programming', 'innovation', 'digital'],
  },
  {
    name: '健康医疗',
    level: 'intermediate',
    icon: '🏥',
    description: '医疗健康场景英语，应对就医需求',
    keywords: ['health', 'doctor', 'symptoms', 'treatment', 'medicine'],
  },
  {
    name: '娱乐休闲',
    level: 'beginner',
    icon: '🎮',
    description: '在娱乐中学习英语，轻松有趣',
    keywords: ['movies', 'music', 'games', 'sports', 'hobbies'],
  },
]

// 模拟句子数据生成器
function generateSentences(topic: string, count: number = 10) {
  const sentenceTemplates: Record<string, { en: string; cn: string; words: string[] }[]> = {
    greeting: [
      { en: 'Hello, how are you today?', cn: '你好，今天过得怎么样？', words: ['Hello', 'how', 'are', 'you', 'today'] },
      { en: 'Good morning! Nice to see you.', cn: '早上好！很高兴见到你。', words: ['Good', 'morning', 'Nice', 'to', 'see', 'you'] },
      { en: 'How is everything going?', cn: '一切都还好吗？', words: ['How', 'is', 'everything', 'going'] },
      { en: 'It\'s great to meet you.', cn: '很高兴认识你。', words: ['It\'s', 'great', 'to', 'meet', 'you'] },
      { en: 'What have you been up to lately?', cn: '你最近在忙什么？', words: ['What', 'have', 'you', 'been', 'up', 'to', 'lately'] },
    ],
    introduction: [
      { en: 'My name is John Smith.', cn: '我的名字叫约翰·史密斯。', words: ['My', 'name', 'is', 'John', 'Smith'] },
      { en: 'I\'m from New York, USA.', cn: '我来自美国纽约。', words: ['I\'m', 'from', 'New', 'York', 'USA'] },
      { en: 'I work as a software engineer.', cn: '我是一名软件工程师。', words: ['I', 'work', 'as', 'a', 'software', 'engineer'] },
      { en: 'Nice to meet you, I\'m Sarah.', cn: '很高兴认识你，我是莎拉。', words: ['Nice', 'to', 'meet', 'you', 'I\'m', 'Sarah'] },
      { en: 'I\'m studying at Harvard University.', cn: '我在哈佛大学学习。', words: ['I\'m', 'studying', 'at', 'Harvard', 'University'] },
    ],
    restaurant: [
      { en: 'Could I see the menu, please?', cn: '请给我看看菜单好吗？', words: ['Could', 'I', 'see', 'the', 'menu', 'please'] },
      { en: 'I\'d like to order the steak.', cn: '我想点牛排。', words: ['I\'d', 'like', 'to', 'order', 'the', 'steak'] },
      { en: 'How would you like your steak cooked?', cn: '您的牛排想要几分熟？', words: ['How', 'would', 'you', 'like', 'your', 'steak', 'cooked'] },
      { en: 'Medium rare, please.', cn: '三分熟，谢谢。', words: ['Medium', 'rare', 'please'] },
      { en: 'Could we have the bill, please?', cn: '请给我们账单好吗？', words: ['Could', 'we', 'have', 'the', 'bill', 'please'] },
    ],
    airport: [
      { en: 'Where is the check-in counter?', cn: '值机柜台在哪里？', words: ['Where', 'is', 'the', 'check-in', 'counter'] },
      { en: 'I have a window seat, please.', cn: '我想要一个靠窗的座位。', words: ['I', 'have', 'a', 'window', 'seat', 'please'] },
      { en: 'What time does the flight board?', cn: '航班什么时候开始登机？', words: ['What', 'time', 'does', 'the', 'flight', 'board'] },
      { en: 'Is this a direct flight?', cn: '这是直飞航班吗？', words: ['Is', 'this', 'a', 'direct', 'flight'] },
      { en: 'Where is the baggage claim?', cn: '行李提取处在哪里？', words: ['Where', 'is', 'the', 'baggage', 'claim'] },
    ],
    shopping: [
      { en: 'How much does this cost?', cn: '这个多少钱？', words: ['How', 'much', 'does', 'this', 'cost'] },
      { en: 'Can I try this on?', cn: '我可以试穿这个吗？', words: ['Can', 'I', 'try', 'this', 'on'] },
      { en: 'Do you have this in a smaller size?', cn: '这个有小一码的吗？', words: ['Do', 'you', 'have', 'this', 'in', 'a', 'smaller', 'size'] },
      { en: 'I\'m just looking, thank you.', cn: '我只是看看，谢谢。', words: ['I\'m', 'just', 'looking', 'thank', 'you'] },
      { en: 'Is this on sale?', cn: '这个在打折吗？', words: ['Is', 'this', 'on', 'sale'] },
    ],
    meeting: [
      { en: 'Let\'s get started with the meeting.', cn: '我们开始开会吧。', words: ['Let\'s', 'get', 'started', 'with', 'the', 'meeting'] },
      { en: 'I\'d like to make a suggestion.', cn: '我想提个建议。', words: ['I\'d', 'like', 'to', 'make', 'a', 'suggestion'] },
      { en: 'Could you elaborate on that point?', cn: '你能详细说明那一点吗？', words: ['Could', 'you', 'elaborate', 'on', 'that', 'point'] },
      { en: 'I agree with your proposal.', cn: '我同意你的提议。', words: ['I', 'agree', 'with', 'your', 'proposal'] },
      { en: 'Let\'s schedule a follow-up meeting.', cn: '我们安排一次后续会议吧。', words: ['Let\'s', 'schedule', 'a', 'follow-up', 'meeting'] },
    ],
    technology: [
      { en: 'Artificial intelligence is transforming industries.', cn: '人工智能正在改变各个行业。', words: ['Artificial', 'intelligence', 'is', 'transforming', 'industries'] },
      { en: 'The software needs to be updated.', cn: '软件需要更新。', words: ['The', 'software', 'needs', 'to', 'be', 'updated'] },
      { en: 'Cloud computing offers scalability.', cn: '云计算提供可扩展性。', words: ['Cloud', 'computing', 'offers', 'scalability'] },
      { en: 'Data security is our top priority.', cn: '数据安全是我们的首要任务。', words: ['Data', 'security', 'is', 'our', 'top', 'priority'] },
      { en: 'The algorithm processes data efficiently.', cn: '该算法高效地处理数据。', words: ['The', 'algorithm', 'processes', 'data', 'efficiently'] },
    ],
  }

  const topicKey = Object.keys(sentenceTemplates).find(
    key => topic.toLowerCase().includes(key) || 
           COURSE_SOURCES.some(c => c.name.includes(topic) && c.keywords.includes(key))
  ) || 'greeting'

  const templates = sentenceTemplates[topicKey] || sentenceTemplates.greeting
  
  // 随机选择句子
  const selected: typeof templates = []
  const usedIndices = new Set<number>()
  
  while (selected.length < Math.min(count, templates.length)) {
    const index = Math.floor(Math.random() * templates.length)
    if (!usedIndices.has(index)) {
      usedIndices.add(index)
      selected.push(templates[index])
    }
  }

  return selected.map((item, index) => ({
    english: item.en,
    chinese: item.cn,
    words: item.words,
    order: index,
  }))
}

// 单词解析生成器
function generateWordBreakdown(word: string) {
  const wordData: Record<string, { meaning: string; pos: string; phonetic?: string; example?: string }> = {
    'Hello': { meaning: '你好，喂', pos: 'int.', phonetic: '/həˈloʊ/', example: 'Hello, how are you?' },
    'morning': { meaning: '早晨，上午', pos: 'n.', phonetic: '/ˈmɔːrnɪŋ/', example: 'Good morning!' },
    'name': { meaning: '名字，名称', pos: 'n.', phonetic: '/neɪm/', example: 'What\'s your name?' },
    'work': { meaning: '工作，劳动', pos: 'v./n.', phonetic: '/wɜːrk/', example: 'I work in an office.' },
    'engineer': { meaning: '工程师', pos: 'n.', phonetic: '/ˌendʒɪˈnɪr/', example: 'She is a software engineer.' },
    'menu': { meaning: '菜单', pos: 'n.', phonetic: '/ˈmenjuː/', example: 'Can I see the menu?' },
    'order': { meaning: '点餐，命令', pos: 'v./n.', phonetic: '/ˈɔːrdər/', example: 'I\'d like to order food.' },
    'steak': { meaning: '牛排', pos: 'n.', phonetic: '/steɪk/', example: 'The steak is delicious.' },
    'flight': { meaning: '航班，飞行', pos: 'n.', phonetic: '/flaɪt/', example: 'My flight is at 3 PM.' },
    'airport': { meaning: '机场', pos: 'n.', phonetic: '/ˈerpɔːrt/', example: 'We arrived at the airport.' },
    'meeting': { meaning: '会议，会面', pos: 'n.', phonetic: '/ˈmiːtɪŋ/', example: 'I have a meeting tomorrow.' },
    'suggestion': { meaning: '建议，提议', pos: 'n.', phonetic: '/səˈdʒestʃən/', example: 'That\'s a great suggestion.' },
    'software': { meaning: '软件', pos: 'n.', phonetic: '/ˈsɔːftwer/', example: 'This software is easy to use.' },
    'data': { meaning: '数据，资料', pos: 'n.', phonetic: '/ˈdeɪtə/', example: 'We need to analyze the data.' },
    'algorithm': { meaning: '算法', pos: 'n.', phonetic: '/ˈælɡərɪðəm/', example: 'The algorithm is very efficient.' },
  }

  const data = wordData[word] || { meaning: '含义', pos: 'n.', phonetic: '/?/', example: 'Example sentence' }
  
  return {
    word,
    meaning: data.meaning,
    pos: data.pos,
    phonetic: data.phonetic,
    example: data.example,
    role: 'unknown',
  }
}

async function importCourses() {
  console.log('🚀 开始导入在线课程数据...')

  const client = await pool.connect()

  try {
    await client.query('BEGIN')

    // 清空现有课程数据（可选）
    console.log('📋 清空现有课程数据...')
    await client.query('TRUNCATE TABLE word_breakdowns, sentences, lessons RESTART IDENTITY CASCADE')

    // 导入课程
    for (const source of COURSE_SOURCES) {
      console.log(`\n📚 导入课程：${source.name}`)

      // 插入课程
      const lessonResult = await client.query(
        `INSERT INTO lessons (title, description, level, lessons_count, icon, "order", created_at)
         VALUES ($1, $2, $3, $4, $5, $6, NOW())
         RETURNING id`,
        [
          source.name,
          source.description,
          source.level,
          Math.floor(Math.random() * 10) + 10,
          source.icon,
          COURSE_SOURCES.indexOf(source) + 1,
        ]
      )

      const lessonId = lessonResult.rows[0].id
      console.log(`  ✅ 课程 ID: ${lessonId}`)

      // 为每个课程生成句子
      const keywords = source.keywords.slice(0, 3)
      let sentenceOrder = 0

      for (const keyword of keywords) {
        const sentences = generateSentences(keyword, 5)

        for (const sentence of sentences) {
          // 插入句子
          const sentenceResult = await client.query(
            `INSERT INTO sentences (lesson_id, english, chinese, phonetic, audio_url, "order", created_at)
             VALUES ($1, $2, $3, $4, $5, $6, NOW())
             RETURNING id`,
            [
              lessonId,
              sentence.english,
              sentence.chinese,
              generatePhonetic(sentence.english),
              null,
              sentenceOrder++,
            ]
          )

          const sentenceId = sentenceResult.rows[0].id
          
          // 为每个单词生成解析
          let wordOrder = 0
          for (const word of sentence.words) {
            const breakdown = generateWordBreakdown(word)
            
            await client.query(
              `INSERT INTO word_breakdowns (sentence_id, word, meaning, pos, phonetic, example, role, "order", created_at)
               VALUES ($1, $2, $3, $4, $5, $6, $7, $8, NOW())`,
              [
                sentenceId,
                word,
                breakdown.meaning,
                breakdown.pos,
                breakdown.phonetic,
                breakdown.example,
                determineWordRole(word, sentence.english),
                wordOrder++,
              ]
            )
          }
        }

        console.log(`  📝 导入关键词 "${keyword}": ${sentences.length} 个句子`)
      }
    }

    await client.query('COMMIT')
    console.log('\n✅ 课程数据导入完成！')

    // 查询统计信息
    const stats = await client.query(`
      SELECT 
        (SELECT COUNT(*) FROM lessons) as lessons,
        (SELECT COUNT(*) FROM sentences) as sentences,
        (SELECT COUNT(*) FROM word_breakdowns) as word_breakdowns
    `)

    console.log('\n📊 数据统计:')
    console.log(`  课程数：${stats.rows[0].lessons}`)
    console.log(`  句子数：${stats.rows[0].sentences}`)
    console.log(`  单词解析数：${stats.rows[0].word_breakdowns}`)

  } catch (error) {
    await client.query('ROLLBACK')
    console.error('❌ 导入失败:', error)
    throw error
  } finally {
    client.release()
    await pool.end()
  }
}

// 生成音标（简化版）
function generatePhonetic(text: string): string {
  // 这里只是示例，实际应该使用音标库
  return `/${text.split(' ').map(() => 'ˈwɜːd').join(' ')}/`
}

// 确定单词在句子中的角色
function determineWordRole(word: string, sentence: string): string {
  const firstWord = sentence.split(' ')[0]
  if (word === firstWord) return 'subject'
  if (word.match(/^(the|a|an|this|that|these|those)$/i)) return 'determiner'
  if (word.match(/^(is|are|am|was|were|be|been|being)$/i)) return 'verb'
  if (word.match(/^(and|or|but|if|then|because)$/i)) return 'conjunction'
  if (word.match(/^(in|on|at|to|for|with|by|from)$/i)) return 'preposition'
  return 'noun'
}

// 主函数
async function main() {
  try {
    await importCourses()
    process.exit(0)
  } catch (error) {
    console.error('导入过程出错:', error)
    process.exit(1)
  }
}

main()
