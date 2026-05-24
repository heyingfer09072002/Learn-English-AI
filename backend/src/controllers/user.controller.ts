import { Response } from 'express';
import { AuthRequest } from '../middleware/auth.middleware.js';
import { UserModel } from '../models/User.model.js';
import { ProgressModel } from '../models/Progress.model.js';

export const getProfile = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.userId;
    if (!userId) {
      return res.json({ 
        success: true, 
        data: { id: 0, username: "访客", email: "guest@example.com", level: 1 } 
      });
    }

    const user = await UserModel.findById(parseInt(userId));
    if (!user) {
      return res.status(404).json({
        success: false,
        message: '用户不存在'
      });
    }

    res.json({
      success: true,
      data: {
        id: user.id,
        email: user.email,
        username: user.username,
        avatar: user.avatar,
        level: user.level,
        createdAt: user.createdAt,
        lastLoginAt: user.lastLoginAt,
        totalLearnTime: user.totalLearnTime,
        streakDays: user.streakDays,
      }
    });
  } catch (error) {
    console.error('获取用户信息失败:', error);
    res.status(500).json({
      success: false,
      message: '获取用户信息失败'
    });
  }
};

export const updateProfile = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.userId;
    if (!userId) {
      return res.json({ success: true, message: '需要登录' });
    }

    const { username, avatar } = req.body;
    const user = await UserModel.update(parseInt(userId), { username, avatar });
    
    res.json({
      success: true,
      data: user
    });
  } catch (error) {
    console.error('更新用户信息失败:', error);
    res.status(500).json({
      success: false,
      message: '更新用户信息失败'
    });
  }
};

export const getLearningProgress = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.userId;
    if (!userId) {
      return res.json({ success: true, data: { totalLearnTime: 0, streakDays: 0 } });
    }

    const progress = await ProgressModel.getByUserId(parseInt(userId));
    res.json({
      success: true,
      data: progress
    });
  } catch (error) {
    console.error('获取学习进度失败:', error);
    res.status(500).json({
      success: false,
      message: '获取学习进度失败'
    });
  }
};

export const getStatistics = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.userId;
    if (!userId) {
      return res.json({ success: true, data: { totalWords: 0, learnedWords: 0 } });
    }

    const progress = await ProgressModel.getByUserId(parseInt(userId));
    res.json({
      success: true,
      data: progress
    });
  } catch (error) {
    console.error('获取统计数据失败:', error);
    res.status(500).json({
      success: false,
      message: '获取统计数据失败'
    });
  }
};
