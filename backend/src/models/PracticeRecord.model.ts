import { pool } from '../database/index.js';

/**
 * 练习模式类型
 */
export type PracticeMode = 'sentence_builder' | 'dictation' | 'listening' | 'speaking' | 'choice';

/**
 * 评级等级类型
 */
export type RatingLevel = 'C' | 'B' | 'A' | 'S' | 'SS' | 'SSS';

/**
 * 练习记录接口
 */
export interface PracticeRecord {
  id: number;
  userId: number;
  sentenceId?: number;
  courseId?: number;
  practiceMode: PracticeMode;
  answerText?: string;
  isCorrect?: boolean;
  timeSpent?: number;
  attemptCount: number;
  accuracy?: number;
  comboCount: number;
  rating?: RatingLevel;
  score?: number;
  createdAt: Date;
}

/**
 * 练习记录查询参数接口
 */
export interface PracticeRecordQueryParams {
  userId?: number;
  courseId?: number;
  sentenceId?: number;
  practiceMode?: PracticeMode;
  isCorrect?: boolean;
  startDate?: Date;
  endDate?: Date;
  page?: number;
  limit?: number;
}

/**
 * 练习统计信息接口
 */
export interface PracticeStatistics {
  totalPractices: number;
  correctCount: number;
  accuracy: number;
  averageTime: number;
  bestCombo: number;
  averageScore: number;
  practiceCountByMode: Record<PracticeMode, number>;
  practiceTrend: Array<{
    date: string;
    count: number;
    accuracy: number;
  }>;
}

/**
 * 用户进度信息接口
 */
export interface UserProgress {
  courseId: number;
  courseTitle: string;
  completedSentences: number;
  totalSentences: number;
  accuracy: number;
  bestRating: RatingLevel;
  lastPracticedAt: Date;
  progressPercentage: number;
}

/**
 * 练习记录模型类
 */
export class PracticeRecordModel {
  /**
   * 根据 ID 查找练习记录
   */
  static async findById(id: number): Promise<PracticeRecord | null> {
    const query = 'SELECT * FROM user_practice_records WHERE id = $1';
    const result = await pool.query(query, [id]);
    return result.rows[0] || null;
  }

  /**
   * 根据用户 ID 查找练习记录列表
   */
  static async findByUserId(userId: number, params: {
    page?: number;
    limit?: number;
  } = {}): Promise<PracticeRecord[]> {
    const page = params.page || 1;
    const limit = params.limit || 50;
    const offset = (page - 1) * limit;

    const query = `
      SELECT * FROM user_practice_records
      WHERE user_id = $1
      ORDER BY created_at DESC
      LIMIT $2 OFFSET $3
    `;
    const result = await pool.query(query, [userId, limit, offset]);
    return result.rows;
  }

  /**
   * 查询练习记录（支持多条件筛选）
   */
  static async findPracticeRecords(params: PracticeRecordQueryParams): Promise<{
    records: PracticeRecord[];
    total: number;
    page: number;
    limit: number;
  }> {
    const page = params.page || 1;
    const limit = params.limit || 20;
    const offset = (page - 1) * limit;

    const conditions: string[] = [];
    const values: any[] = [];
    let paramCount = 1;

    if (params.userId) {
      conditions.push(`user_id = $${paramCount}`);
      values.push(params.userId);
      paramCount++;
    }

    if (params.courseId) {
      conditions.push(`course_id = $${paramCount}`);
      values.push(params.courseId);
      paramCount++;
    }

    if (params.sentenceId) {
      conditions.push(`sentence_id = $${paramCount}`);
      values.push(params.sentenceId);
      paramCount++;
    }

    if (params.practiceMode) {
      conditions.push(`practice_mode = $${paramCount}`);
      values.push(params.practiceMode);
      paramCount++;
    }

    if (params.isCorrect !== undefined) {
      conditions.push(`is_correct = $${paramCount}`);
      values.push(params.isCorrect);
      paramCount++;
    }

    if (params.startDate) {
      conditions.push(`created_at >= $${paramCount}`);
      values.push(params.startDate);
      paramCount++;
    }

    if (params.endDate) {
      conditions.push(`created_at <= $${paramCount}`);
      values.push(params.endDate);
      paramCount++;
    }

    const whereClause = conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : '';

    // 查询总数
    const countQuery = `SELECT COUNT(*) FROM user_practice_records ${whereClause}`;
    const countResult = await pool.query(countQuery, values);
    const total = parseInt(countResult.rows[0].count);

    // 查询数据
    const dataQuery = `
      SELECT * FROM user_practice_records
      ${whereClause}
      ORDER BY created_at DESC
      LIMIT $${paramCount} OFFSET $${paramCount + 1}
    `;
    values.push(limit, offset);
    const dataResult = await pool.query(dataQuery, values);

    return {
      records: dataResult.rows,
      total,
      page,
      limit,
    };
  }

  /**
   * 创建练习记录
   */
  static async create(recordData: {
    userId: number;
    sentenceId?: number;
    courseId?: number;
    practiceMode: PracticeMode;
    answerText?: string;
    isCorrect?: boolean;
    timeSpent?: number;
    attemptCount?: number;
    accuracy?: number;
    comboCount?: number;
    rating?: RatingLevel;
    score?: number;
  }): Promise<PracticeRecord> {
    const query = `
      INSERT INTO user_practice_records (
        user_id, sentence_id, course_id, practice_mode,
        answer_text, is_correct, time_spent, attempt_count,
        accuracy, combo_count, rating, score
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)
      RETURNING *
    `;

    const values = [
      recordData.userId,
      recordData.sentenceId || null,
      recordData.courseId || null,
      recordData.practiceMode,
      recordData.answerText || null,
      recordData.isCorrect !== undefined ? recordData.isCorrect : null,
      recordData.timeSpent || null,
      recordData.attemptCount || 1,
      recordData.accuracy || null,
      recordData.comboCount || 0,
      recordData.rating || null,
      recordData.score || null,
    ];

    const result = await pool.query(query, values);
    return result.rows[0];
  }

  /**
   * 批量创建练习记录
   */
  static async batchInsert(records: Array<{
    userId: number;
    sentenceId?: number;
    courseId?: number;
    practiceMode: PracticeMode;
    isCorrect?: boolean;
    timeSpent?: number;
    accuracy?: number;
  }>): Promise<number> {
    if (records.length === 0) return 0;

    const values = records.map((r, i) => [
      r.userId,
      r.sentenceId || null,
      r.courseId || null,
      r.practiceMode,
      r.isCorrect !== undefined ? r.isCorrect : null,
      r.timeSpent || null,
      r.accuracy || null,
    ]);

    const query = `
      INSERT INTO user_practice_records (
        user_id, sentence_id, course_id, practice_mode,
        is_correct, time_spent, accuracy
      ) VALUES ${values.map((_, i) => 
        `($${i * 7 + 1}, $${i * 7 + 2}, $${i * 7 + 3}, $${i * 7 + 4}, $${i * 7 + 5}, $${i * 7 + 6}, $${i * 7 + 7})`
      ).join(', ')}
      RETURNING id
    `;

    const flatValues = values.flat();
    const result = await pool.query(query, flatValues);
    
    return result.rowCount || 0;
  }

  /**
   * 获取用户练习统计信息
   */
  static async getUserStatistics(userId: number): Promise<PracticeStatistics | null> {
    const query = `
      SELECT 
        COUNT(*) as "totalPractices",
        COUNT(CASE WHEN is_correct = true THEN 1 END) as "correctCount",
        AVG(CASE WHEN is_correct = true THEN accuracy ELSE NULL END) as "accuracy",
        AVG(time_spent) as "averageTime",
        MAX(combo_count) as "bestCombo",
        AVG(score) as "averageScore"
      FROM user_practice_records
      WHERE user_id = $1
    `;
    
    const result = await pool.query(query, [userId]);
    const row = result.rows[0];
    
    if (!row || row.totalPractices === 0) {
      return null;
    }

    // 按模式统计
    const modeQuery = `
      SELECT practice_mode, COUNT(*) as count
      FROM user_practice_records
      WHERE user_id = $1
      GROUP BY practice_mode
    `;
    const modeResult = await pool.query(modeQuery, [userId]);
    const practiceCountByMode: Record<PracticeMode, number> = {
      sentence_builder: 0,
      dictation: 0,
      listening: 0,
      speaking: 0,
      choice: 0,
    };
    modeResult.rows.forEach((row: any) => {
      practiceCountByMode[row.practice_mode] = parseInt(row.count);
    });

    // 按日期统计趋势（最近 7 天）
    const trendQuery = `
      SELECT 
        DATE(created_at) as date,
        COUNT(*) as count,
        AVG(accuracy) as accuracy
      FROM user_practice_records
      WHERE user_id = $1
        AND created_at >= CURRENT_DATE - INTERVAL '7 days'
      GROUP BY DATE(created_at)
      ORDER BY date ASC
    `;
    const trendResult = await pool.query(trendQuery, [userId]);
    const practiceTrend = trendResult.rows.map((row: any) => ({
      date: row.date,
      count: parseInt(row.count),
      accuracy: row.accuracy ? parseFloat(row.accuracy) : 0,
    }));

    return {
      totalPractices: parseInt(row.totalPractices),
      correctCount: parseInt(row.correctCount),
      accuracy: row.accuracy ? parseFloat(row.accuracy) : 0,
      averageTime: row.averageTime ? parseInt(row.averageTime) : 0,
      bestCombo: parseInt(row.bestCombo),
      averageScore: row.averageScore ? parseFloat(row.averageScore) : 0,
      practiceCountByMode,
      practiceTrend,
    };
  }

  /**
   * 获取用户在课程中的进度
   */
  static async getUserCourseProgress(userId: number, courseId: number): Promise<UserProgress | null> {
    const query = `
      SELECT 
        c.id as "courseId",
        c.title as "courseTitle",
        c.total_sentences as "totalSentences",
        COUNT(DISTINCT upr.sentence_id) as "completedSentences",
        AVG(upr.accuracy) as "accuracy",
        MAX(upr.rating) as "bestRating",
        MAX(upr.created_at) as "lastPracticedAt"
      FROM courses c
      LEFT JOIN user_practice_records upr ON c.id = upr.course_id AND upr.user_id = $1
      WHERE c.id = $2
      GROUP BY c.id, c.title, c.total_sentences
    `;
    
    const result = await pool.query(query, [userId, courseId]);
    if (result.rows.length === 0) return null;

    const row = result.rows[0];
    const completedSentences = parseInt(row.completedSentences) || 0;
    const totalSentences = parseInt(row.totalSentences) || 0;
    const progressPercentage = totalSentences > 0 
      ? Math.round((completedSentences / totalSentences) * 100) 
      : 0;

    return {
      courseId: row.courseId,
      courseTitle: row.courseTitle,
      completedSentences,
      totalSentences,
      accuracy: row.accuracy ? parseFloat(row.accuracy) : 0,
      bestRating: row.bestRating as RatingLevel,
      lastPracticedAt: row.lastPracticedAt,
      progressPercentage,
    };
  }

  /**
   * 获取课程的整体统计信息
   */
  static async getCourseStatistics(courseId: number): Promise<{
    totalPractices: number;
    uniqueLearners: number;
    averageAccuracy: number;
    averageRating: string;
  } | null> {
    const query = `
      SELECT 
        COUNT(*) as "totalPractices",
        COUNT(DISTINCT user_id) as "uniqueLearners",
        AVG(accuracy) as "averageAccuracy"
      FROM user_practice_records
      WHERE course_id = $1
    `;
    
    const result = await pool.query(query, [courseId]);
    if (result.rows.length === 0) return null;

    const row = result.rows[0];
    return {
      totalPractices: parseInt(row.totalPractices),
      uniqueLearners: parseInt(row.uniqueLearners),
      averageAccuracy: row.averageAccuracy ? parseFloat(row.averageAccuracy) : 0,
      averageRating: row.averageRating || 'N/A',
    };
  }

  /**
   * 删除练习记录
   */
  static async delete(id: number): Promise<boolean> {
    const query = 'DELETE FROM user_practice_records WHERE id = $1 RETURNING id';
    const result = await pool.query(query, [id]);
    return result.rowCount !== null && result.rowCount > 0;
  }

  /**
   * 清理用户的旧练习记录（保留最近 N 条）
   */
  static async cleanupOldRecords(userId: number, keepCount: number = 1000): Promise<number> {
    const query = `
      DELETE FROM user_practice_records
      WHERE user_id = $1
        AND id NOT IN (
          SELECT id
          FROM user_practice_records
          WHERE user_id = $1
          ORDER BY created_at DESC
          LIMIT $2
        )
      RETURNING id
    `;
    
    const result = await pool.query(query, [userId, keepCount]);
    return result.rowCount || 0;
  }
}
