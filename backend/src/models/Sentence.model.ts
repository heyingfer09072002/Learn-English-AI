import { pool } from '../database/index.js';

/**
 * 句子拆分单词接口
 */
export interface SentenceWord {
  word: string;
  pos?: string;
  phonetic?: string;
  definition?: string[];
  startTime?: number;
  endTime?: number;
}

/**
 * 句子信息接口
 */
export interface Sentence {
  id: number;
  courseId: number;
  contentEn: string;
  contentCn?: string;
  audioUrl?: string;
  videoUrl?: string;
  difficultyLevel: number;
  wordCount?: number;
  estimatedTime?: number;
  sortOrder: number;
  createdAt?: Date;
  updatedAt?: Date;
}

/**
 * 句子详情接口（包含拆分的单词）
 */
export interface SentenceDetail extends Sentence {
  words?: SentenceWord[];
}

/**
 * 句子查询参数接口
 */
export interface SentenceQueryParams {
  courseId?: number;
  difficulty?: number;
  search?: string;
  page?: number;
  limit?: number;
}

/**
 * 句子模型类
 */
export class SentenceModel {
  /**
   * 根据 ID 查找句子
   */
  static async findById(id: number): Promise<Sentence | null> {
    const query = 'SELECT * FROM sentences WHERE id = $1';
    const result = await pool.query(query, [id]);
    return result.rows[0] || null;
  }

  /**
   * 根据课程 ID 查找句子列表
   */
  static async findByCourseId(courseId: number): Promise<Sentence[]> {
    const query = `
      SELECT * FROM sentences
      WHERE course_id = $1
      ORDER BY sort_order ASC
    `;
    const result = await pool.query(query, [courseId]);
    return result.rows;
  }

  /**
   * 查询句子列表（支持分页和筛选）
   */
  static async findSentences(params: SentenceQueryParams): Promise<{
    sentences: Sentence[];
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

    if (params.courseId) {
      conditions.push(`course_id = $${paramCount}`);
      values.push(params.courseId);
      paramCount++;
    }

    if (params.difficulty) {
      conditions.push(`difficulty_level = $${paramCount}`);
      values.push(params.difficulty);
      paramCount++;
    }

    if (params.search) {
      conditions.push(`content_en ILIKE $${paramCount}`);
      values.push(`%${params.search}%`);
      paramCount++;
    }

    const whereClause = conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : '';

    // 查询总数
    const countQuery = `SELECT COUNT(*) FROM sentences ${whereClause}`;
    const countResult = await pool.query(countQuery, values);
    const total = parseInt(countResult.rows[0].count);

    // 查询数据
    const dataQuery = `
      SELECT * FROM sentences
      ${whereClause}
      ORDER BY sort_order ASC
      LIMIT $${paramCount} OFFSET $${paramCount + 1}
    `;
    values.push(limit, offset);
    const dataResult = await pool.query(dataQuery, values);

    return {
      sentences: dataResult.rows,
      total,
      page,
      limit,
    };
  }

  /**
   * 创建句子
   */
  static async create(sentenceData: {
    courseId: number;
    contentEn: string;
    contentCn?: string;
    audioUrl?: string;
    videoUrl?: string;
    difficultyLevel?: number;
    wordCount?: number;
    estimatedTime?: number;
    sortOrder: number;
  }): Promise<Sentence> {
    const query = `
      INSERT INTO sentences (
        course_id, content_en, content_cn, audio_url, video_url,
        difficulty_level, word_count, estimated_time, sort_order
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
      RETURNING *
    `;

    const values = [
      sentenceData.courseId,
      sentenceData.contentEn,
      sentenceData.contentCn || null,
      sentenceData.audioUrl || null,
      sentenceData.videoUrl || null,
      sentenceData.difficultyLevel || 1,
      sentenceData.wordCount || null,
      sentenceData.estimatedTime || null,
      sentenceData.sortOrder,
    ];

    const result = await pool.query(query, values);
    return result.rows[0];
  }

  /**
   * 更新句子
   */
  static async update(id: number, sentenceData: Partial<{
    contentEn: string;
    contentCn?: string;
    audioUrl?: string;
    videoUrl?: string;
    difficultyLevel?: number;
    wordCount?: number;
    estimatedTime?: number;
    sortOrder?: number;
  }>): Promise<Sentence | null> {
    const fields: string[] = [];
    const values: any[] = [];
    let paramCount = 1;

    if (sentenceData.contentEn !== undefined) {
      fields.push(`content_en = $${paramCount}`);
      values.push(sentenceData.contentEn);
      paramCount++;
    }

    if (sentenceData.contentCn !== undefined) {
      fields.push(`content_cn = $${paramCount}`);
      values.push(sentenceData.contentCn);
      paramCount++;
    }

    if (sentenceData.audioUrl !== undefined) {
      fields.push(`audio_url = $${paramCount}`);
      values.push(sentenceData.audioUrl);
      paramCount++;
    }

    if (sentenceData.videoUrl !== undefined) {
      fields.push(`video_url = $${paramCount}`);
      values.push(sentenceData.videoUrl);
      paramCount++;
    }

    if (sentenceData.difficultyLevel !== undefined) {
      fields.push(`difficulty_level = $${paramCount}`);
      values.push(sentenceData.difficultyLevel);
      paramCount++;
    }

    if (sentenceData.wordCount !== undefined) {
      fields.push(`word_count = $${paramCount}`);
      values.push(sentenceData.wordCount);
      paramCount++;
    }

    if (sentenceData.estimatedTime !== undefined) {
      fields.push(`estimated_time = $${paramCount}`);
      values.push(sentenceData.estimatedTime);
      paramCount++;
    }

    if (sentenceData.sortOrder !== undefined) {
      fields.push(`sort_order = $${paramCount}`);
      values.push(sentenceData.sortOrder);
      paramCount++;
    }

    fields.push(`updated_at = CURRENT_TIMESTAMP`);
    values.push(id);

    const query = `
      UPDATE sentences
      SET ${fields.join(', ')}
      WHERE id = $${paramCount}
      RETURNING *
    `;

    const result = await pool.query(query, values);
    return result.rows[0] || null;
  }

  /**
   * 删除句子
   */
  static async delete(id: number): Promise<boolean> {
    const query = 'DELETE FROM sentences WHERE id = $1 RETURNING id';
    const result = await pool.query(query, [id]);
    return result.rowCount !== null && result.rowCount > 0;
  }

  /**
   * 批量创建句子
   */
  static async batchInsert(sentences: Array<{
    courseId: number;
    contentEn: string;
    contentCn?: string;
    audioUrl?: string;
    videoUrl?: string;
    difficultyLevel?: number;
    sortOrder: number;
  }>): Promise<number> {
    if (sentences.length === 0) return 0;

    const values = sentences.map((s, i) => [
      s.courseId,
      s.contentEn,
      s.contentCn || null,
      s.audioUrl || null,
      s.videoUrl || null,
      s.difficultyLevel || 1,
      s.sortOrder,
    ]);

    const query = `
      INSERT INTO sentences (
        course_id, content_en, content_cn, audio_url, video_url,
        difficulty_level, sort_order
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
   * 解析句子结构（分词）
   * 将句子拆分为单词列表
   */
  static async parseSentence(sentenceId: number): Promise<SentenceWord[]> {
    const sentence = await this.findById(sentenceId);
    if (!sentence) {
      throw new Error('句子不存在');
    }

    // 简单的分词实现（按空格分隔）
    // TODO: 后续可以集成 NLP 库进行更精确的分词和词性标注
    const words = sentence.contentEn.split(/\s+/).filter(w => w.length > 0);
    
    const sentenceWords: SentenceWord[] = words.map(word => {
      // 去除标点符号
      const cleanWord = word.replace(/[.,!?;:"'()]/g, '');
      
      return {
        word: cleanWord.toLowerCase(),
        startTime: 0,
        endTime: 0,
      };
    });

    return sentenceWords;
  }

  /**
   * 统计课程的句子数量
   */
  static async countByCourseId(courseId: number): Promise<number> {
    const query = 'SELECT COUNT(*) FROM sentences WHERE course_id = $1';
    const result = await pool.query(query, [courseId]);
    return parseInt(result.rows[0].count);
  }

  /**
   * 搜索包含特定单词的句子
   */
  static async searchByWord(word: string, limit: number = 50): Promise<Sentence[]> {
    const query = `
      SELECT * FROM sentences
      WHERE content_en ILIKE $1
      ORDER BY sort_order ASC
      LIMIT $2
    `;
    const result = await pool.query(query, [`%${word}%`], limit);
    return result.rows;
  }

  /**
   * 更新课程的句子总数
   */
  static async updateCourseTotalSentences(courseId: number): Promise<void> {
    const count = await this.countByCourseId(courseId);
    const query = `
      UPDATE courses
      SET total_sentences = $1, updated_at = CURRENT_TIMESTAMP
      WHERE id = $2
    `;
    await pool.query(query, [count, courseId]);
  }
}
