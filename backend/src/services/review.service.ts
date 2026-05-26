import { pool } from '../database/index.js';
import { ReviewScheduler, REVIEW_INTERVALS } from '../utils/review-scheduler.js';

/**
 * 复习记录接口
 */
interface ReviewRecord {
  userId: number;
  sentenceId: number;
  isCorrect: boolean;
  timeSpent: number;
}

/**
 * 复习推荐接口
 */
export interface ReviewRecommendation {
  sentenceId: number;
  courseId: number;
  contentEn: string;
  contentCn?: string;
  dueAt: Date;
  priority: number;
}

/**
 * 复习服务
 * 基于艾宾浩斯记忆曲线的智能复习系统
 */
export class ReviewService {
  /**
   * 获取用户待复习的句子
   */
  static async getDueReviews(userId: number, limit: number = 50): Promise<ReviewRecommendation[]> {
    const query = `
      SELECT 
        s.id as "sentenceId",
        s.course_id as "courseId",
        s.content_en as "contentEn",
        s.content_cn as "contentCn",
        uwp.next_review_at as "dueAt",
        uwp.mastery_level as "masteryLevel"
      FROM user_word_progress uwp
      JOIN sentences s ON uwp.word_id = s.id
      WHERE uwp.user_id = $1
        AND uwp.status != 'mastered'
        AND (uwp.next_review_at IS NULL OR uwp.next_review_at <= CURRENT_TIMESTAMP)
      ORDER BY uwp.next_review_at ASC NULLS FIRST
      LIMIT $2
    `;
    
    const result = await pool.query(query, [userId, limit]);
    
    return result.rows.map((row: any) => ({
      sentenceId: row.sentenceId,
      courseId: row.courseId,
      contentEn: row.contentEn,
      contentCn: row.contentCn,
      dueAt: row.dueAt,
      priority: this.calculatePriority(row.masteryLevel, row.dueAt),
    }));
  }

  /**
   * 记录复习结果
   */
  static async recordReview(record: ReviewRecord): Promise<void> {
    const nextReviewAt = ReviewScheduler.calculateNextReview(0, record.isCorrect);
    
    const query = `
      INSERT INTO user_practice_records (
        user_id, sentence_id, is_correct, time_spent, created_at
      ) VALUES ($1, $2, $3, $4, CURRENT_TIMESTAMP)
    `;
    
    await pool.query(query, [
      record.userId,
      record.sentenceId,
      record.isCorrect,
      record.timeSpent,
    ]);

    // 更新下次复习时间
    if (nextReviewAt) {
      const updateQuery = `
        UPDATE user_word_progress
        SET 
          review_count = review_count + 1,
          last_reviewed_at = CURRENT_TIMESTAMP,
          next_review_at = $1
        WHERE user_id = $2 AND word_id = $3
      `;
      await pool.query(updateQuery, [nextReviewAt, record.userId, record.sentenceId]);
    }
  }

  /**
   * 计算复习优先级
   */
  private static calculatePriority(masteryLevel: number, dueAt: Date): number {
    const now = new Date();
    const overdue = dueAt ? (now.getTime() - dueAt.getTime()) / (1000 * 60 * 60) : 999;
    
    // 越紧急优先级越高，掌握度越低优先级越高
    return overdue * (100 - masteryLevel);
  }

  /**
   * 获取复习统计
   */
  static async getReviewStatistics(userId: number): Promise<{
    totalReviews: number;
    dueToday: number;
    masteredCount: number;
    learningCount: number;
  }> {
    const query = `
      SELECT 
        COUNT(*) as "totalReviews",
        COUNT(CASE WHEN next_review_at <= CURRENT_TIMESTAMP THEN 1 END) as "dueToday",
        COUNT(CASE WHEN status = 'mastered' THEN 1 END) as "masteredCount",
        COUNT(CASE WHEN status = 'learning' THEN 1 END) as "learningCount"
      FROM user_word_progress
      WHERE user_id = $1
    `;
    
    const result = await pool.query(query, [userId]);
    const row = result.rows[0];
    
    return {
      totalReviews: parseInt(row.totalReviews),
      dueToday: parseInt(row.dueToday),
      masteredCount: parseInt(row.masteredCount),
      learningCount: parseInt(row.learningCount),
    };
  }
}
