import { Response } from 'express';
import { AuthRequest } from '../middleware/auth.middleware.js';

// 临时课程数据
const lessons = [
  {
    id: '1',
    title: '衣物与穿搭',
    description: '学习日常衣物相关词汇和表达',
    level: '初级',
    lessonsCount: 12,
    icon: 'shirt'
  },
  {
    id: '2',
    title: '食物与烹饪',
    description: '掌握餐厅点餐和烹饪相关对话',
    level: '中级',
    lessonsCount: 15,
    icon: 'utensils'
  },
  {
    id: '3',
    title: '商务会谈',
    description: '提升商务英语沟通能力',
    level: '高级',
    lessonsCount: 20,
    icon: 'briefcase'
  }
];

/**
 * 获取课程列表
 */
export const getLessons = (req: AuthRequest, res: Response) => {
  res.json({
    success: true,
    data: lessons
  });
};

/**
 * 获取单个课程
 */
export const getLessonById = (req: AuthRequest, res: Response) => {
  const { id } = req.params;
  const lesson = lessons.find(l => l.id === id);
  
  if (!lesson) {
    return res.status(404).json({
      success: false,
      message: '课程不存在'
    });
  }
  
  res.json({
    success: true,
    data: lesson
  });
};

/**
 * 获取句子列表
 */
export const getSentences = (req: AuthRequest, res: Response) => {
  const { id } = req.params;
  
  res.json({
    success: true,
    data: [
      {
        id: 's1',
        english: 'I wear earrings.',
        chinese: '我戴耳环。',
        phonetic: '/aɪ wɪr ˈɪrɪŋz/',
        audio: '',
        segments: [
          { word: 'I', meaning: '我' },
          { word: 'wear', meaning: '穿戴' },
          { word: 'earrings', meaning: '耳环' }
        ]
      },
      {
        id: 's2',
        english: 'She is wearing a scarf.',
        chinese: '她戴着一条围巾。',
        phonetic: '/ʃi ˈɪz ˈwɛrɪŋ ə skɑrf/',
        audio: '',
        segments: [
          { word: 'She', meaning: '她' },
          { word: 'is wearing', meaning: '正穿着' },
          { word: 'a', meaning: '一条' },
          { word: 'scarf', meaning: '围巾' }
        ]
      }
    ]
  });
};

/**
 * 更新学习进度
 */
export const updateProgress = (req: AuthRequest, res: Response) => {
  const { id } = req.params;
  const { completed } = req.body;
  
  res.json({
    success: true,
    message: '进度已更新',
    data: {
      lessonId: id,
      completed
    }
  });
};
