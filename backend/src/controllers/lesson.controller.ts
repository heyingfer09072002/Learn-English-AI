import { Response } from 'express';
import { AuthRequest } from '../middleware/auth.middleware.js';
import { LessonModel } from '../models/Lesson.model.js';
import { ProgressModel } from '../models/Progress.model.js';

/**
 * 获取课程列表
 */
export const getLessons = async (req: AuthRequest, res: Response) => {
  try {
    // 尝试从数据库获取，如果失败则返回示例数据
    let lessons;
    try {
      lessons = await LessonModel.findAll();
    } catch (error) {
      lessons = [
        { id: 1, title: '衣物与穿搭', description: '学习日常衣物相关词汇和表达', level: '初级', lessonsCount: 12, icon: 'shirt' },
        { id: 2, title: '食物与烹饪', description: '掌握餐厅点餐和烹饪相关对话', level: '中级', lessonsCount: 15, icon: 'utensils' },
        { id: 3, title: '商务会谈', description: '提升商务英语沟通能力', level: '高级', lessonsCount: 20, icon: 'briefcase' }
      ];
    }

    res.json({
      success: true,
      data: lessons
    });
  } catch (error) {
    console.error('Get lessons error:', error);
    res.status(500).json({
      success: false,
      message: '获取课程列表失败'
    });
  }
};

/**
 * 获取单个课程
 */
export const getLessonById = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const lesson = await LessonModel.findById(parseInt(id));

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
  } catch (error) {
    console.error('Get lesson error:', error);
    res.status(500).json({
      success: false,
      message: '获取课程失败'
    });
  }
};

/**
 * 获取句子列表
 */
export const getSentences = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    let sentences;

    try {
      sentences = await LessonModel.findSentences(parseInt(id));
    } catch (error) {
      // 返回示例数据
      sentences = [
        {
          id: 1,
          english: 'I wear earrings.',
          chinese: '我戴耳环。',
          phonetic: '/aɪ wɪr ˈɪrɪŋz/',
          words: [
            { word: 'I', meaning: '我', pos: 'pron.', role: '主语' },
            { word: 'wear', meaning: '穿戴', pos: 'v.', role: '谓语' },
            { word: 'earrings', meaning: '耳环', pos: 'n.', role: '宾语' }
          ]
        },
        {
          id: 2,
          english: 'She is wearing a scarf.',
          chinese: '她戴着一条围巾。',
          phonetic: '/ʃi ˈɪz ˈwɛrɪŋ ə skɑrf/',
          words: [
            { word: 'She', meaning: '她', pos: 'pron.', role: '主语' },
            { word: 'is wearing', meaning: '正穿着', pos: 'v.', role: '谓语' },
            { word: 'a', meaning: '一条', pos: 'art.', role: '冠词' },
            { word: 'scarf', meaning: '围巾', pos: 'n.', role: '宾语' }
          ]
        }
      ];
    }

    res.json({
      success: true,
      data: sentences
    });
  } catch (error) {
    console.error('Get sentences error:', error);
    res.status(500).json({
      success: false,
      message: '获取句子失败'
    });
  }
};

/**
 * 更新学习进度
 */
export const updateProgress = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const userId = req.user?.userId;
    const { completed } = req.body;

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: '未授权'
      });
    }

    // 更新进度
    await ProgressModel.upsert(parseInt(userId), {
      userId: parseInt(userId),
      completedLessons: completed ? undefined : undefined
    });

    res.json({
      success: true,
      message: '进度已更新',
      data: {
        lessonId: id,
        completed,
        userId
      }
    });
  } catch (error) {
    console.error('Update progress error:', error);
    res.status(500).json({
      success: false,
      message: '更新进度失败'
    });
  }
};
