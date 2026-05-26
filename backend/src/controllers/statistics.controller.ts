import { Request, Response, NextFunction } from 'express';
import { StatisticsService } from '../services/statistics.service';
import { PracticeRecordModel } from '../models/PracticeRecord.model';

/**
 * 统计控制器
 */
export class StatisticsController {
  /**
   * 获取学习概览
   * GET /api/statistics/overview
   */
  static async getOverview(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = (req as any).user?.id;
      if (!userId) {
        return res.status(401).json({
          success: false,
          error: { message: '未登录' },
        });
      }

      const overview = await StatisticsService.getUserOverview(userId);

      return res.status(200).json({
        success: true,
        data: overview,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * 获取学习热力图数据
   * GET /api/statistics/heatmap
   */
  static async getHeatmap(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = (req as any).user?.id;
      if (!userId) {
        return res.status(401).json({
          success: false,
          error: { message: '未登录' },
        });
      }

      const { days = 90 } = req.query;
      const heatmapData = await StatisticsService.getHeatmapData(
        userId,
        parseInt(days as string)
      );

      return res.status(200).json({
        success: true,
        data: heatmapData,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * 获取能力雷达图数据
   * GET /api/statistics/radar
   */
  static async getRadar(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = (req as any).user?.id;
      if (!userId) {
        return res.status(401).json({
          success: false,
          error: { message: '未登录' },
        });
      }

      const radarData = await StatisticsService.getAbilityRadar(userId);

      return res.status(200).json({
        success: true,
        data: radarData,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * 获取成就统计
   * GET /api/statistics/achievements
   */
  static async getAchievements(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = (req as any).user?.id;
      if (!userId) {
        return res.status(401).json({
          success: false,
          error: { message: '未登录' },
        });
      }

      const achievementStats = await StatisticsService.getAchievementStats(userId);

      return res.status(200).json({
        success: true,
        data: achievementStats,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * 获取课程进度
   * GET /api/statistics/course-progress/:courseId
   */
  static async getCourseProgress(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = (req as any).user?.id;
      if (!userId) {
        return res.status(401).json({
          success: false,
          error: { message: '未登录' },
        });
      }

      const courseId = parseInt(req.params.courseId);
      const progress = await PracticeRecordModel.getUserCourseProgress(userId, courseId);

      if (!progress) {
        return res.status(404).json({
          success: false,
          error: { message: '课程不存在' },
        });
      }

      return res.status(200).json({
        success: true,
        data: progress,
      });
    } catch (error) {
      next(error);
    }
  }
}
