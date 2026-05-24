import { Response } from 'express';
import { AuthRequest } from '../middleware/auth.middleware.js';
import { UserModel } from '../models/User.model.js';
import { ProgressModel } from '../models/Progress.model.js';

/**
 * 获取用户信息
 */
export const getProfile = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.userId;
    if (!userId) {
      return res.status(401).json({
        success: false,
        message: '未授权'
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
        level: user.level
      }
    });
  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({
      success: false,
      message: '获取用户信息失败'
    });
  }
};

/**
 * 更新用户信息
 */
export const updateProfile = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.userId;
    if (!userId) {
      return res.status(401).json({
        success: false,
        message: '未授权'
      });
    }

    const { username, avatar } = req.body;
    const user = await UserModel.update(parseInt(userId), { username, avatar });

    res.json({
      success: true,
      message: '更新成功',
      data: user
    });
  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json({
      success: false,
      message: '更新失败'
    });
  }
};

/**
 * 获取学习进度
 */
export const getLearningProgress = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.userId;
    if (!userId) {
      return res.status(401).json({
        success: false,
        message: '未授权'
      });
    }

    const progress = await ProgressModel.findByUserId(parseInt(userId));

    // 默认进度数据
    const defaultProgress = {
      totalLessons: 12,
      completedLessons: progress?.completedLessons || 3,
      currentLevel: 'B1',
      vocabulary: progress?.vocabulary || 3245,
      accuracy: parseFloat((progress?.accuracy || 78).toString()),
      weeklyStudyTime: Math.floor((progress?.totalStudyTime || 750) / 60)
    };

    res.json({
      success: true,
      data: defaultProgress
    });
  } catch (error) {
    console.error('Get progress error:', error);
    res.status(500).json({
      success: false,
      message: '获取进度失败'
    });
  }
};

/**
 * 获取学习统计
 */
export const getStatistics = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.userId;
    if (!userId) {
      return res.status(401).json({
        success: false,
        message: '未授权'
      });
    }

    // TODO: 从数据库统计真实数据
    res.json({
      success: true,
      data: {
        today: {
          lessons: 2,
          time: 45,
          words: 50
        },
        week: {
          lessons: 8,
          time: 320,
          words: 350
        },
        month: {
          lessons: 35,
          time: 1400,
          words: 1500
        }
      }
    });
  } catch (error) {
    console.error('Get statistics error:', error);
    res.status(500).json({
      success: false,
      message: '获取统计失败'
    });
  }
};
