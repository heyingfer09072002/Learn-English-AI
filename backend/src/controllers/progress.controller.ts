import { Request, Response } from 'express';
import { db } from '../database/sqlite.js';

export class ProgressController {
  /**
   * 保存学习进度
   */
  static saveProgress(req: Request, res: Response) {
    try {
      const userId = (req as any).user?.userId;
      const { courseId, sentenceId, accuracy, isCompleted } = req.body;

      if (!userId) {
        return res.status(401).json({
          success: false,
          error: '未登录'
        });
      }

      if (!sentenceId) {
        return res.status(400).json({
          success: false,
          error: '缺少句子 ID'
        });
      }

      // 检查是否已存在进度记录
      const existing: any = db.prepare(`
        SELECT * FROM user_progress 
        WHERE user_id = ? AND sentence_id = ?
      `).get(userId, sentenceId);

      if (existing) {
        // 更新现有记录
        db.prepare(`
          UPDATE user_progress 
          SET status = ?,
              accuracy = COALESCE(?, accuracy),
              attempts = attempts + 1,
              last_practiced = CURRENT_TIMESTAMP
          WHERE user_id = ? AND sentence_id = ?
        `).run(
          isCompleted ? 'mastered' : 'learning',
          accuracy || null,
          userId,
          sentenceId
        );
      } else {
        // 创建新记录
        db.prepare(`
          INSERT INTO user_progress 
          (user_id, course_id, sentence_id, status, accuracy, attempts)
          VALUES (?, ?, ?, ?, ?, 1)
        `).run(
          userId,
          courseId || null,
          sentenceId,
          isCompleted ? 'mastered' : 'learning',
          accuracy || null
        );
      }

      res.json({
        success: true,
        message: '进度已保存'
      });

    } catch (error: any) {
      console.error('保存进度失败:', error.message);
      res.status(500).json({
        success: false,
        error: '保存进度失败'
      });
    }
  }

  /**
   * 获取课程进度
   */
  static getCourseProgress(req: Request, res: Response) {
    try {
      const userId = (req as any).user?.userId;
      const { courseId } = req.params;

      if (!userId) {
        return res.status(401).json({
          success: false,
          error: '未登录'
        });
      }

      // 获取课程总句子数
      const totalSentences: any = db.prepare(`
        SELECT COUNT(*) as count FROM sentences WHERE course_id = ?
      `).get(courseId);

      // 获取已完成的句子数
      const completedSentences: any = db.prepare(`
        SELECT COUNT(*) as count 
        FROM user_progress 
        WHERE user_id = ? AND course_id = ? AND status = 'mastered'
      `).get(userId, courseId);

      // 获取学习中的句子数
      const learningSentences: any = db.prepare(`
        SELECT COUNT(*) as count 
        FROM user_progress 
        WHERE user_id = ? AND course_id = ? AND status = 'learning'
      `).get(userId, courseId);

      // 获取准确率
      const avgAccuracy: any = db.prepare(`
        SELECT AVG(accuracy) as avg FROM user_progress 
        WHERE user_id = ? AND course_id = ?
      `).get(userId, courseId);

      res.json({
        success: true,
        data: {
          courseId,
          totalSentences: totalSentences.count,
          completedSentences: completedSentences.count,
          learningSentences: learningSentences.count,
          newSentences: totalSentences.count - completedSentences.count - learningSentences.count,
          progress: totalSentences.count > 0 
            ? Math.round((completedSentences.count / totalSentences.count) * 100) 
            : 0,
          avgAccuracy: avgAccuracy.avg || 0
        }
      });

    } catch (error: any) {
      console.error('获取课程进度失败:', error.message);
      res.status(500).json({
        success: false,
        error: '获取课程进度失败'
      });
    }
  }

  /**
   * 获取用户所有课程进度
   */
  static getAllProgress(req: Request, res: Response) {
    try {
      const userId = (req as any).user?.userId;

      if (!userId) {
        return res.status(401).json({
          success: false,
          error: '未登录'
        });
      }

      const courses = db.prepare(`
        SELECT 
          c.id,
          c.title,
          c.difficulty_level,
          COUNT(DISTINCT s.id) as total_sentences,
          COUNT(DISTINCT CASE WHEN up.status = 'mastered' THEN s.id END) as completed,
          COUNT(DISTINCT CASE WHEN up.status = 'learning' THEN s.id END) as learning
        FROM courses c
        LEFT JOIN sentences s ON s.course_id = c.id
        LEFT JOIN user_progress up ON up.sentence_id = s.id AND up.user_id = ?
        GROUP BY c.id
        ORDER BY c.created_at DESC
      `).all(userId);

      // 计算完成率和最后学习时间
      const progressData = courses.map((course: any) => {
        const lastPractice: any = db.prepare(`
          SELECT MAX(last_practiced) as last_time 
          FROM user_progress 
          WHERE user_id = ? AND course_id = ?
        `).get(userId, course.id);

        return {
          courseId: course.id,
          title: course.title,
          difficulty: course.difficulty_level,
          totalSentences: course.total_sentences,
          completed: course.completed,
          learning: course.learning,
          progress: course.total_sentences > 0 
            ? Math.round((course.completed / course.total_sentences) * 100) 
            : 0,
          lastPracticed: lastPractice?.last_time || null
        };
      });

      res.json({
        success: true,
        data: progressData,
        total: progressData.length
      });

    } catch (error: any) {
      console.error('获取所有进度失败:', error.message);
      res.status(500).json({
        success: false,
        error: '获取进度失败'
      });
    }
  }

  /**
   * 获取单个句子进度
   */
  static getSentenceProgress(req: Request, res: Response) {
    try {
      const userId = (req as any).user?.userId;
      const { sentenceId } = req.params;

      if (!userId) {
        return res.status(401).json({
          success: false,
          error: '未登录'
        });
      }

      const progress: any = db.prepare(`
        SELECT status, accuracy, attempts, last_practiced
        FROM user_progress
        WHERE user_id = ? AND sentence_id = ?
      `).get(userId, sentenceId);

      if (!progress) {
        res.json({
          success: true,
          data: {
            sentenceId,
            status: 'new',
            accuracy: 0,
            attempts: 0,
            lastPracticed: null
          }
        });
      } else {
        res.json({
          success: true,
          data: {
            sentenceId,
            status: progress.status,
            accuracy: progress.accuracy,
            attempts: progress.attempts,
            lastPracticed: progress.last_practiced
          }
        });
      }

    } catch (error: any) {
      console.error('获取句子进度失败:', error.message);
      res.status(500).json({
        success: false,
        error: '获取句子进度失败'
      });
    }
  }

  /**
   * 清除课程进度
   */
  static resetCourseProgress(req: Request, res: Response) {
    try {
      const userId = (req as any).user?.userId;
      const { courseId } = req.params;

      if (!userId) {
        return res.status(401).json({
          success: false,
          error: '未登录'
        });
      }

      db.prepare(`
        DELETE FROM user_progress 
        WHERE user_id = ? AND course_id = ?
      `).run(userId, courseId);

      res.json({
        success: true,
        message: '进度已重置'
      });

    } catch (error: any) {
      console.error('重置进度失败:', error.message);
      res.status(500).json({
        success: false,
        error: '重置进度失败'
      });
    }
  }
}
