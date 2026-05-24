import { pool } from '../database/index.js';

/**
 * 艾宾浩斯记忆曲线复习间隔（分钟）
 */
export const REVIEW_INTERVALS = [
  5,      // 初次学习后 5 分钟
  30,     // 30 分钟
  720,    // 12 小时
  1440,   // 1 天
  2880,   // 2 天
  5760,   // 4 天
  10080,  // 7 天
  21600   // 15 天
];

/**
 * 用户词汇进度接口
 */
interface UserWordProgress {
  id: number;
  userId: number;
  wordId: number;
  status: 'new' | 'learning' | 'mastered' | 'review';
  learnedTimes: number;
  errorTimes: number;
  lastLearnedAt: Date;
  nextReviewAt: Date | null;
  masteryLevel: number;
}

/**
 * 学习记录接口
 */
interface LearningRecord {
  id: number;
  userId: number;
  wordId: number;
  actionType: 'learn' | 'review' | 'practice_spelling' | 'practice_choice' | 'practice_listening';
  isCorrect: boolean;
  timeSpent: number;
  createdAt: Date;
}

/**
 * 复习调度器
 * 基于艾宾浩斯记忆曲线计算复习时间
 */
export class ReviewScheduler {
  /**
   * 计算下次复习时间
   * @param learningTimes 已学习次数
   * @param isCorrect 本次是否正确
   * @returns 下次复习时间
   */
  static calculateNextReview(learningTimes: number, isCorrect: boolean): Date | null {
    if (!isCorrect) {
      // 错误则 5 分钟后重新复习
      return new Date(Date.now() + 5 * 60 * 1000);
    }

    if (learningTimes >= REVIEW_INTERVALS.length) {
      // 已掌握，不需要复习
      return null;
    }

    const intervalMinutes = REVIEW_INTERVALS[learningTimes];
    return new Date(Date.now() + intervalMinutes * 60 * 1000);
  }

  /**
   * 计算掌握度
   * @param learnedTimes 学习次数
   * @param errorTimes 错误次数
   * @returns 掌握度 0-100
   */
  static calculateMasteryLevel(learnedTimes: number, errorTimes: number): number {
    if (learnedTimes === 0) return 0;
    
    const accuracy = 1 - (errorTimes / learnedTimes);
    const progressWeight = Math.min(learnedTimes / REVIEW_INTERVALS.length, 1);
    
    // 掌握度 = 准确率 * 进度权重 * 100
    return Math.round(accuracy * progressWeight * 100);
  }

  /**
   * 获取或创建用户词汇进度
   */
  static async getOrCreateProgress(userId: number, wordId: number): Promise<UserWordProgress> {
    // 尝试获取现有进度
    const query = 'SELECT * FROM user_word_progress WHERE user_id = $1 AND word_id = $2';
    const result = await pool.query(query, [userId, wordId]);
    
    if (result.rows[0]) {
      return result.rows[0];
    }

    // 创建新进度
    const insertQuery = `
      INSERT INTO user_word_progress (user_id, word_id, status, learned_times, error_times, mastery_level)
      VALUES ($1, $2, 'new', 0, 0, 0)
      RETURNING *
    `;
    const insertResult = await pool.query(insertQuery, [userId, wordId]);
    return insertResult.rows[0];
  }

  /**
   * 记录学习行为
   */
  static async recordLearning(
    userId: number,
    wordId: number,
    isCorrect: boolean,
    timeSpent: number,
    actionType: 'learn' | 'review' | 'practice_spelling' | 'practice_choice' | 'practice_listening'
  ): Promise<{
    progress: UserWordProgress;
    record: LearningRecord;
  }> {
    const client = await pool.connect();
    
    try {
      await client.query('BEGIN');

      // 获取或创建进度
      const progressQuery = `
        SELECT * FROM user_word_progress
        WHERE user_id = $1 AND word_id = $2
        FOR UPDATE
      `;
      const progressResult = await client.query(progressQuery, [userId, wordId]);
      
      let progress = progressResult.rows[0];
      
      if (!progress) {
        // 创建新进度
        const createQuery = `
          INSERT INTO user_word_progress (user_id, word_id, status, learned_times, error_times, mastery_level)
          VALUES ($1, $2, 'new', 0, 0, 0)
          RETURNING *
        `;
        const createResult = await client.query(createQuery, [userId, wordId]);
        progress = createResult.rows[0];
      }

      // 更新进度
      const newLearnedTimes = progress.learned_times + 1;
      const newErrorTimes = progress.error_times + (isCorrect ? 0 : 1);
      const nextReviewAt = this.calculateNextReview(newLearnedTimes, isCorrect);
      const masteryLevel = this.calculateMasteryLevel(newLearnedTimes, newErrorTimes);
      
      // 确定状态
      let status: UserWordProgress['status'] = 'learning';
      if (masteryLevel >= 80) {
        status = 'mastered';
      } else if (nextReviewAt) {
        status = 'review';
      }

      const updateQuery = `
        UPDATE user_word_progress
        SET 
          status = $1,
          learned_times = $2,
          error_times = $3,
          last_learned_at = CURRENT_TIMESTAMP,
          next_review_at = $4,
          mastery_level = $5,
          updated_at = CURRENT_TIMESTAMP
        WHERE user_id = $6 AND word_id = $7
        RETURNING *
      `;
      const updateResult = await client.query(updateQuery, [
        status,
        newLearnedTimes,
        newErrorTimes,
        nextReviewAt,
        masteryLevel,
        userId,
        wordId
      ]);

      // 插入学习记录
      const recordQuery = `
        INSERT INTO learning_records (user_id, word_id, action_type, is_correct, time_spent)
        VALUES ($1, $2, $3, $4, $5)
        RETURNING *
      `;
      const recordResult = await client.query(recordQuery, [
        userId,
        wordId,
        actionType,
        isCorrect,
        timeSpent
      ]);

      await client.query('COMMIT');

      return {
        progress: updateResult.rows[0],
        record: recordResult.rows[0]
      };
    } catch (error) {
      await client.query('ROLLBACK');
      throw error;
    } finally {
      client.release();
    }
  }

  /**
   * 获取用户待复习词汇
   * @param userId 用户 ID
   * @param date 日期（默认今天）
   * @returns 待复习词汇列表
   */
  static async getDueReviews(userId: number, date: Date = new Date()): Promise<any[]> {
    const startOfDay = new Date(date);
    startOfDay.setHours(0, 0, 0, 0);
    
    const endOfDay = new Date(date);
    endOfDay.setHours(23, 59, 59, 999);

    const query = `
      SELECT w.*, uwp.status, uwp.learned_times, uwp.next_review_at
      FROM user_word_progress uwp
      JOIN words w ON uwp.word_id = w.id
      WHERE uwp.user_id = $1
        AND uwp.next_review_at IS NOT NULL
        AND uwp.next_review_at >= $2
        AND uwp.next_review_at <= $3
        AND uwp.status != 'mastered'
      ORDER BY uwp.next_review_at ASC
    `;

    const result = await pool.query(query, [userId, startOfDay, endOfDay]);
    return result.rows;
  }

  /**
   * 获取用户词汇学习统计
   */
  static async getUserStatistics(userId: number): Promise<{
    totalWords: number;
    learnedWords: number;
    masteredWords: number;
    reviewDueToday: number;
    totalLearnTime: number;
    accuracy: number;
    streakDays: number;
  }> {
    // 总词汇量
    const totalQuery = 'SELECT COUNT(*) as count FROM user_word_progress WHERE user_id = $1';
    const totalResult = await pool.query(totalQuery, [userId]);
    const totalWords = parseInt(totalResult.rows[0].count);

    // 已学习词汇
    const learnedQuery = `
      SELECT COUNT(*) as count
      FROM user_word_progress
      WHERE user_id = $1 AND learned_times > 0
    `;
    const learnedResult = await pool.query(learnedQuery, [userId]);
    const learnedWords = parseInt(learnedResult.rows[0].count);

    // 已掌握词汇
    const masteredQuery = `
      SELECT COUNT(*) as count
      FROM user_word_progress
      WHERE user_id = $1 AND status = 'mastered'
    `;
    const masteredResult = await pool.query(masteredQuery, [userId]);
    const masteredWords = parseInt(masteredResult.rows[0].count);

    // 今日待复习
    const dueReviews = await this.getDueReviews(userId);
    const reviewDueToday = dueReviews.length;

    // 总学习时长（秒）
    const timeQuery = `
      SELECT COALESCE(SUM(time_spent), 0) as total_time
      FROM learning_records
      WHERE user_id = $1
    `;
    const timeResult = await pool.query(timeQuery, [userId]);
    const totalLearnTime = parseInt(timeResult.rows[0].total_time);

    // 准确率
    const accuracyQuery = `
      SELECT 
        COUNT(*) as total,
        COUNT(*) FILTER (WHERE is_correct = true) as correct
      FROM learning_records
      WHERE user_id = $1
    `;
    const accuracyResult = await pool.query(accuracyQuery, [userId]);
    const total = parseInt(accuracyResult.rows[0].total);
    const correct = parseInt(accuracyResult.rows[0].correct);
    const accuracy = total > 0 ? Math.round((correct / total) * 100) : 0;

    // 连续学习天数（简化实现）
    const streakQuery = `
      SELECT DATE(created_at) as learning_date
      FROM learning_records
      WHERE user_id = $1
      GROUP BY DATE(created_at)
      ORDER BY learning_date DESC
      LIMIT 30
    `;
    const streakResult = await pool.query(streakQuery, [userId]);
    const learningDates = streakResult.rows.map((r: any) => new Date(r.learning_date).getTime());
    
    let streakDays = 0;
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const todayTime = today.getTime();
    
    for (let i = 0; i < learningDates.length; i++) {
      const expectedDate = todayTime - (i * 24 * 60 * 60 * 1000);
      if (learningDates.includes(expectedDate)) {
        streakDays++;
      } else {
        break;
      }
    }

    return {
      totalWords,
      learnedWords,
      masteredWords,
      reviewDueToday,
      totalLearnTime,
      accuracy,
      streakDays
    };
  }
}
