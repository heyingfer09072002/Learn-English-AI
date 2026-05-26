import { Request, Response, NextFunction } from 'express';
import { AIService } from '../services/ai.service';

/**
 * AI 助手控制器
 */
export class AIController {
  /**
   * 提问 AI
   * POST /api/ai/assistant/ask
   */
  static async ask(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = (req as any).user?.id;
      if (!userId) {
        return res.status(401).json({
          success: false,
          error: { message: '未登录' },
        });
      }

      const { question, sentenceId } = req.body;

      if (!question) {
        return res.status(400).json({
          success: false,
          error: { message: '问题不能为空' },
        });
      }

      // 检查每日限制
      const canAsk = await AIService.checkDailyLimit(userId, 2);
      if (!canAsk) {
        return res.status(429).json({
          success: false,
          error: { message: '今日免费提问次数已用完' },
        });
      }

      const startTime = Date.now();
      
      // 调用 AI 服务
      const response = await AIService.askQuestion(question, { sentenceId });

      const responseTime = Date.now() - startTime;

      // 记录日志
      await AIService.logUsage(
        userId,
        question,
        response.answer,
        0, // token 数需要 OpenAI 返回
        responseTime,
        sentenceId
      );

      return res.status(200).json({
        success: true,
        data: response,
        remaining: 2 - (await AIService.getDailyQuestionCount(userId)) - 1,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * 分析句子
   * POST /api/ai/assistant/analyze/:sentenceId
   */
  static async analyzeSentence(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = (req as any).user?.id;
      if (!userId) {
        return res.status(401).json({
          success: false,
          error: { message: '未登录' },
        });
      }

      const { sentenceId } = req.params;

      // TODO: 实际实现应该先从数据库获取句子内容
      // 这里仅作框架演示

      return res.status(200).json({
        success: true,
        data: {
          message: '句子分析功能开发中',
        },
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * 获取对话历史
   * GET /api/ai/assistant/history
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

      // TODO: 实现对话历史查询

      return res.status(200).json({
        success: true,
        data: {
          history: [],
        },
      });
    } catch (error) {
      next(error);
    }
  }
}

// 兼容旧路由的导出
export const chat = AIController.ask;
export const assessWriting = AIController.ask;
export const analyzeSentence = AIController.analyzeSentence;
export const evaluateSpeaking = AIController.ask;
