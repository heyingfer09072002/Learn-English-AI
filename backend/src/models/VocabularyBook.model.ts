import { pool } from '../database/index.js';

/**
 * 生词记录接口
 */
export interface VocabularyBookEntry {
  id: number;
  userId: number;
  wordId: number;
  sentenceId?: number;
  note?: string;
  masteryLevel: number;
  reviewCount: number;
  lastReviewedAt?: Date;
  nextReviewAt?: Date;
  isMastered: boolean;
  createdAt: Date;
}

/**
 * 生词本模型类
 */
export class VocabularyBookModel {
  /**
   * 添加生词
   */
  static async addWord(
    userId: number,
    wordId: number,
    sentenceId?: number,
    note?: string
  ): Promise<VocabularyBookEntry> {
    const query = `
      INSERT INTO vocabulary_books (user_id, word_id, sentence_id, note)
      VALUES ($1, $2, $3, $4)
      ON CONFLICT (user_id, word_id) DO NOTHING
      RETURNING *
    `;
    const result = await pool.query(query, [userId, wordId, sentenceId || null, note || null]);
    return result.rows[0];
  }

  /**
   * 获取用户的生词本
   */
  static async getUserVocabularyBook(
    userId: number,
    options: {
      isMastered?: boolean;
      page?: number;
      limit?: number;
    } = {}
  ): Promise<{
    entries: VocabularyBookEntry[];
    total: number;
  }> {
    const page = options.page || 1;
    const limit = options.limit || 50;
    const offset = (page - 1) * limit;

    const conditions = ['user_id = $1'];
    const values: any[] = [userId];
    let paramCount = 2;

    if (options.isMastered !== undefined) {
      conditions.push(`is_mastered = $${paramCount}`);
      values.push(options.isMastered);
      paramCount++;
    }

    const whereClause = conditions.join(' AND ');

    // 查询总数
    const countQuery = `SELECT COUNT(*) FROM vocabulary_books WHERE ${whereClause}`;
    const countResult = await pool.query(countQuery, values);
    const total = parseInt(countResult.rows[0].count);

    // 查询数据
    const dataQuery = `
      SELECT * FROM vocabulary_books
      WHERE ${whereClause}
      ORDER BY created_at DESC
      LIMIT $${paramCount} OFFSET $${paramCount + 1}
    `;
    values.push(limit, offset);
    const dataResult = await pool.query(dataQuery, values);

    return {
      entries: dataResult.rows,
      total,
    };
  }

  /**
   * 移除生词
   */
  static async removeWord(userId: number, wordId: number): Promise<boolean> {
    const query = 'DELETE FROM vocabulary_books WHERE user_id = $1 AND word_id = $2 RETURNING id';
    const result = await pool.query(query, [userId, wordId]);
    return result.rowCount !== null && result.rowCount > 0;
  }

  /**
   * 更新掌握度
   */
  static async updateMasteryLevel(
    userId: number,
    wordId: number,
    masteryLevel: number
  ): Promise<VocabularyBookEntry | null> {
    const isMastered = masteryLevel >= 100;
    const query = `
      UPDATE vocabulary_books
      SET mastery_level = $1, is_mastered = $2, updated_at = CURRENT_TIMESTAMP
      WHERE user_id = $3 AND word_id = $4
      RETURNING *
    `;
    const result = await pool.query(query, [masteryLevel, isMastered, userId, wordId]);
    return result.rows[0] || null;
  }

  /**
   * 记录复习
   */
  static async recordReview(
    userId: number,
    wordId: number,
    nextReviewAt: Date
  ): Promise<VocabularyBookEntry | null> {
    const query = `
      UPDATE vocabulary_books
      SET review_count = review_count + 1,
          last_reviewed_at = CURRENT_TIMESTAMP,
          next_review_at = $1
      WHERE user_id = $2 AND word_id = $3
      RETURNING *
    `;
    const result = await pool.query(query, [nextReviewAt, userId, wordId]);
    return result.rows[0] || null;
  }

  /**
   * 获取待复习的生词
   */
  static async getDueReviews(userId: number): Promise<VocabularyBookEntry[]> {
    const query = `
      SELECT * FROM vocabulary_books
      WHERE user_id = $1
        AND is_mastered = false
        AND (next_review_at IS NULL OR next_review_at <= CURRENT_TIMESTAMP)
      ORDER BY next_review_at ASC NULLS FIRST
      LIMIT 50
    `;
    const result = await pool.query(query, [userId]);
    return result.rows;
  }

  /**
   * 批量添加生词
   */
  static async batchAddWords(
    userId: number,
    wordIds: number[]
  ): Promise<number> {
    if (wordIds.length === 0) return 0;

    const values = wordIds.map((wordId, i) => [userId, wordId]);
    const query = `
      INSERT INTO vocabulary_books (user_id, word_id)
      VALUES ${wordIds.map((_, i) => `($${i * 2 + 1}, $${i * 2 + 2})`).join(', ')}
      ON CONFLICT (user_id, word_id) DO NOTHING
      RETURNING id
    `;

    const flatValues = values.flat();
    const result = await pool.query(query, flatValues);
    return result.rowCount || 0;
  }

  /**
   * 统计生词本
   */
  static async getStatistics(userId: number): Promise<{
    totalWords: number;
    masteredWords: number;
    dueReviews: number;
  }> {
    const query = `
      SELECT 
        COUNT(*) as "totalWords",
        COUNT(CASE WHEN is_mastered = true THEN 1 END) as "masteredWords",
        COUNT(CASE WHEN is_mastered = false AND (next_review_at IS NULL OR next_review_at <= CURRENT_TIMESTAMP) THEN 1 END) as "dueReviews"
      FROM vocabulary_books
      WHERE user_id = $1
    `;
    const result = await pool.query(query, [userId]);
    const row = result.rows[0];

    return {
      totalWords: parseInt(row.totalWords),
      masteredWords: parseInt(row.masteredWords),
      dueReviews: parseInt(row.dueReviews),
    };
  }
}

export const validateCriteria = (criteria: string[]) => criteria;
