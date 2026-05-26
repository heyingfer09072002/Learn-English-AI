import { Request, Response, NextFunction } from 'express';
import { PracticeRecordModel } from '../models/PracticeRecord.model';
import { ComboService } from '../services/combo.service';
import { RatingService } from '../services/rating.service';
import { PracticeMode } from '../models/PracticeRecord.model';

/**
 * 练习请求体接口
 */
interface PracticeRequest {
  sentenceId: number;
  courseId: number;
  practiceMode: PracticeMode;
  answer: string;
  timeSpent: number;
}

/**
 * 练习控制器
 * 处理练习相关的 HTTP 请求
 */
export class PracticeController {
  /**
   * 提交练习
   * POST /api/practice/sentence
   */
  static async submitPractice(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = (req as any).user?.id;
      if (!userId) {
        return res.status(401).json({
          success: false,
          error: { message: '未登录' },
        });
      }

      const { sentenceId, courseId, practiceMode, answer, timeSpent }: PracticeRequest = req.body;

      // 验证必填字段
      if (!sentenceId || !practiceMode) {
        return res.status(400).json({
          success: false,
          error: { message: '缺少必填字段' },
        });
      }

      // 生成会话 ID（实际应该从前端传递或使用 UUID）
      const sessionId = `session_${userId}_${Date.now()}`;

      // 判断答案是否正确（简化实现，实际应该有更复杂的判题逻辑）
      const isCorrect = await this.checkAnswer(sentenceId, answer);

      // 处理连击
      const comboResult = isCorrect
        ? await ComboService.handleCorrect(userId, sessionId)
        : await ComboService.handleWrong(userId, sessionId);

      // 计算评级（基于单次答题）
      const ratingResult = RatingService.calculateSingleAttemptRating(
        isCorrect,
        timeSpent,
        comboResult.state.count
      );

      // 计算得分（考虑连击倍数）
      const score = Math.round(ratingResult.score * comboResult.state.multiplier);

      // 创建练习记录
      const practiceRecord = await PracticeRecordModel.create({
        userId,
        sentenceId,
        courseId,
        practiceMode,
        answerText: answer,
        isCorrect,
        timeSpent,
        attemptCount: 1,
        accuracy: isCorrect ? 1.0 : 0.0,
        comboCount: comboResult.state.count,
        rating: ratingResult.level,
        score,
      });

      // 返回结果
      return res.status(200).json({
        success: true,
        data: {
          record: practiceRecord,
          combo: comboResult.state,
          rating: ratingResult,
          isCorrect,
          message: comboResult.message,
        },
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * 获取练习历史
   * GET /api/practice/history
   */
  static async getHistory(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = (req as any).user?.id;
      if (!userId) {
        return res.status(401).json({
          success: false,
          error: { message: '未登录' },
        });
      }

      const { page = 1, limit = 20, courseId, practiceMode } = req.query;

      const params: any = {
        userId,
        page: parseInt(page as string),
        limit: parseInt(limit as string),
      };

      if (courseId) params.courseId = parseInt(courseId as string);
      if (practiceMode) params.practiceMode = practiceMode as PracticeMode;

      const result = await PracticeRecordModel.findPracticeRecords(params);

      return res.status(200).json({
        success: true,
        data: {
          records: result.records,
          total: result.total,
          page: result.page,
          limit: result.limit,
        },
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * 获取练习统计
   * GET /api/practice/stats
   */
  static async getStats(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = (req as any).user?.id;
      if (!userId) {
        return res.status(401).json({
          success: false,
          error: { message: '未登录' },
        });
      }

      const stats = await PracticeRecordModel.getUserStatistics(userId);

      if (!stats) {
        return res.status(200).json({
          success: true,
          data: {
            totalPractices: 0,
            correctCount: 0,
            accuracy: 0,
            averageTime: 0,
            bestCombo: 0,
            averageScore: 0,
            practiceCountByMode: {
              sentence_builder: 0,
              dictation: 0,
              listening: 0,
              speaking: 0,
              choice: 0,
            },
            practiceTrend: [],
          },
        });
      }

      return res.status(200).json({
        success: true,
        data: stats,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * 检查答案是否正确
   * 简化实现，实际应该调用句子模型获取正确答案
   */
  private static async checkAnswer(sentenceId: number, userAnswer: string): Promise<boolean> {
    // TODO: 实际实现应该从数据库获取句子并比较
    // 这里简化处理：只要答案不为空就认为正确
    return userAnswer && userAnswer.trim().length > 0;
  }
}
