import { pool } from '../database/index.js';

/**
 * 词汇接口
 */
export interface Word {
  id: number;
  word: string;
  phoneticUk?: string;
  phoneticUs?: string;
  difficultyLevel?: number;
  frequencyLevel?: 'high' | 'medium' | 'low';
  createdAt?: Date;
}

/**
 * 词性信息接口
 */
export interface WordPos {
  id: number;
  wordId: number;
  pos: string;
  definitionCn: string[];
  definitionEn?: string;
  rootAffix?: string;
  memoryTip?: string;
}

/**
 * 例句接口
 */
export interface WordSentence {
  id: number;
  wordId: number;
  sentenceEn: string;
  sentenceCn: string;
  audioUrl?: string;
}

/**
 * 词汇关系接口
 */
export interface WordRelation {
  id: number;
  wordId: number;
  relatedWordId: number;
  relationType: 'synonym' | 'antonym';
  similarityScore?: number;
}

/**
 * 完整词汇详情接口
 */
export interface WordDetail extends Word {
  pos?: WordPos[];
  sentences?: WordSentence[];
  synonyms?: string[];
  antonyms?: string[];
}

/**
 * 词汇查询参数接口
 */
export interface WordQueryParams {
  page?: number;
  limit?: number;
  difficulty?: number;
  frequency?: 'high' | 'medium' | 'low';
  search?: string;
  pos?: string;
}

/**
 * 词汇模型类
 */
export class VocabularyModel {
  /**
   * 根据 ID 查找词汇
   */
  static async findById(id: number): Promise<Word | null> {
    const query = 'SELECT * FROM words WHERE id = $1';
    const result = await pool.query(query, [id]);
    return result.rows[0] || null;
  }

  /**
   * 根据单词拼写查找
   */
  static async findByWord(word: string): Promise<Word | null> {
    const query = 'SELECT * FROM words WHERE LOWER(word) = LOWER($1)';
    const result = await pool.query(query, [word]);
    return result.rows[0] || null;
  }

  /**
   * 查询词汇列表（支持分页和筛选）
   */
  static async findWords(params: WordQueryParams): Promise<{
    words: Word[];
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

    if (params.difficulty) {
      conditions.push(`difficulty_level = $${paramCount}`);
      values.push(params.difficulty);
      paramCount++;
    }

    if (params.frequency) {
      conditions.push(`frequency_level = $${paramCount}`);
      values.push(params.frequency);
      paramCount++;
    }

    if (params.search) {
      conditions.push(`word ILIKE $${paramCount}`);
      values.push(`%${params.search}%`);
      paramCount++;
    }

    const whereClause = conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : '';

    // 查询总数
    const countQuery = `SELECT COUNT(*) FROM words ${whereClause}`;
    const countResult = await pool.query(countQuery, values);
    const total = parseInt(countResult.rows[0].count);

    // 查询数据
    const dataQuery = `
      SELECT * FROM words
      ${whereClause}
      ORDER BY word ASC
      LIMIT $${paramCount} OFFSET $${paramCount + 1}
    `;
    values.push(limit, offset);
    const dataResult = await pool.query(dataQuery, values);

    return {
      words: dataResult.rows,
      total,
      page,
      limit,
    };
  }

  /**
   * 获取词汇完整详情（包含词性、例句、同反义词）
   */
  static async findWordDetail(wordId: number): Promise<WordDetail | null> {
    const word = await this.findById(wordId);
    if (!word) return null;

    // 查询词性信息
    const posQuery = 'SELECT * FROM word_pos WHERE word_id = $1';
    const posResult = await pool.query(posQuery, [wordId]);
    const pos: WordPos[] = posResult.rows.map((row: any) => ({
      ...row,
      definitionCn: typeof row.definition_cn === 'string' 
        ? JSON.parse(row.definition_cn) 
        : row.definition_cn,
    }));

    // 查询例句
    const sentenceQuery = 'SELECT * FROM word_sentences WHERE word_id = $1 ORDER BY id ASC';
    const sentenceResult = await pool.query(sentenceQuery, [wordId]);
    const sentences: WordSentence[] = sentenceResult.rows;

    // 查询同义词
    const synonymQuery = `
      SELECT w.word
      FROM word_relations wr
      JOIN words w ON wr.related_word_id = w.id
      WHERE wr.word_id = $1 AND wr.relation_type = 'synonym'
    `;
    const synonymResult = await pool.query(synonymQuery, [wordId]);
    const synonyms: string[] = synonymResult.rows.map((r: any) => r.word);

    // 查询反义词
    const antonymQuery = `
      SELECT w.word
      FROM word_relations wr
      JOIN words w ON wr.related_word_id = w.id
      WHERE wr.word_id = $1 AND wr.relation_type = 'antonym'
    `;
    const antonymResult = await pool.query(antonymQuery, [wordId]);
    const antonyms: string[] = antonymResult.rows.map((r: any) => r.word);

    return {
      ...word,
      pos,
      sentences,
      synonyms,
      antonyms,
    };
  }

  /**
   * 批量插入词汇
   */
  static async batchInsert(wordList: Array<{
    word: string;
    phoneticUk?: string;
    phoneticUs?: string;
    difficultyLevel?: number;
    frequencyLevel?: 'high' | 'medium' | 'low';
  }>): Promise<number> {
    if (wordList.length === 0) return 0;

    const values = wordList.map(w => [
      w.word,
      w.phoneticUk || null,
      w.phoneticUs || null,
      w.difficultyLevel || null,
      w.frequencyLevel || null,
    ]);

    const query = `
      INSERT INTO words (word, phonetic_uk, phonetic_us, difficulty_level, frequency_level)
      VALUES ${values.map((_, i) => 
        `($${i * 5 + 1}, $${i * 5 + 2}, $${i * 5 + 3}, $${i * 5 + 4}, $${i * 5 + 5})`
      ).join(', ')}
      ON CONFLICT (word) DO UPDATE SET
        phonetic_uk = EXCLUDED.phonetic_uk,
        phonetic_us = EXCLUDED.phonetic_us,
        difficulty_level = EXCLUDED.difficulty_level,
        frequency_level = EXCLUDED.frequency_level,
        updated_at = CURRENT_TIMESTAMP
      RETURNING id
    `;

    const flatValues = values.flat();
    const result = await pool.query(query, flatValues);
    
    return result.rowCount || 0;
  }

  /**
   * 插入词性信息
   */
  static async insertWordPos(wordId: number, posData: Omit<WordPos, 'id' | 'wordId'>): Promise<number> {
    const query = `
      INSERT INTO word_pos (word_id, pos, definition_cn, definition_en, root_affix, memory_tip)
      VALUES ($1, $2, $3, $4, $5, $6)
      RETURNING id
    `;
    const values = [
      wordId,
      posData.pos,
      JSON.stringify(posData.definitionCn),
      posData.definitionEn || null,
      posData.rootAffix || null,
      posData.memoryTip || null,
    ];
    const result = await pool.query(query, values);
    return result.rows[0].id;
  }

  /**
   * 插入例句
   */
  static async insertSentence(wordId: number, sentenceData: Omit<WordSentence, 'id' | 'wordId'>): Promise<number> {
    const query = `
      INSERT INTO word_sentences (word_id, sentence_en, sentence_cn, audio_url)
      VALUES ($1, $2, $3, $4)
      RETURNING id
    `;
    const values = [
      wordId,
      sentenceData.sentenceEn,
      sentenceData.sentenceCn,
      sentenceData.audioUrl || null,
    ];
    const result = await pool.query(query, values);
    return result.rows[0].id;
  }

  /**
   * 插入词汇关系（同义词/反义词）
   */
  static async insertRelation(
    wordId: number,
    relatedWordId: number,
    relationType: 'synonym' | 'antonym',
    similarityScore?: number
  ): Promise<void> {
    const query = `
      INSERT INTO word_relations (word_id, related_word_id, relation_type, similarity_score)
      VALUES ($1, $2, $3, $4)
      ON CONFLICT (word_id, related_word_id, relation_type) DO NOTHING
    `;
    await pool.query(query, [wordId, relatedWordId, relationType, similarityScore || null]);
  }

  /**
   * 搜索词汇（模糊匹配）
   */
  static async searchWords(query: string, limit: number = 20): Promise<Word[]> {
    const searchQuery = `
      SELECT * FROM words
      WHERE word ILIKE $1 OR EXISTS (
        SELECT 1 FROM word_pos wp
        WHERE wp.word_id = words.id
        AND wp.definition_cn ILIKE $1
      )
      ORDER BY
        CASE WHEN LOWER(word) = LOWER($1) THEN 0 ELSE 1 END,
        difficulty_level ASC
      LIMIT $2
    `;
    const result = await pool.query(searchQuery, [`%${query}%`, limit]);
    return result.rows;
  }

  /**
   * 获取随机词汇（用于练习）
   */
  static async getRandomWords(
    count: number,
    difficulty?: number,
    excludeWordIds?: number[]
  ): Promise<Word[]> {
    const conditions = ['TRUE'];
    const values: any[] = [];
    let paramCount = 1;

    if (difficulty) {
      conditions.push(`difficulty_level = $${paramCount}`);
      values.push(difficulty);
      paramCount++;
    }

    if (excludeWordIds && excludeWordIds.length > 0) {
      conditions.push(`id NOT IN (${excludeWordIds.map(() => `$${paramCount++}`).join(',')})`);
      values.push(...excludeWordIds);
    }

    const query = `
      SELECT * FROM words
      WHERE ${conditions.join(' AND ')}
      ORDER BY RANDOM()
      LIMIT $${paramCount}
    `;
    values.push(count);

    const result = await pool.query(query, values);
    return result.rows;
  }

  /**
   * 统计词汇总数
   */
  static async count(params?: { difficulty?: number; frequency?: string }): Promise<number> {
    let query = 'SELECT COUNT(*) FROM words';
    const values: any[] = [];

    if (params) {
      const conditions: string[] = [];
      let paramCount = 1;

      if (params.difficulty) {
        conditions.push(`difficulty_level = $${paramCount}`);
        values.push(params.difficulty);
        paramCount++;
      }

      if (params.frequency) {
        conditions.push(`frequency_level = $${paramCount}`);
        values.push(params.frequency);
        paramCount++;
      }

      if (conditions.length > 0) {
        query += ` WHERE ${conditions.join(' AND ')}`;
      }
    }

    const result = await pool.query(query, values);
    return parseInt(result.rows[0].count);
  }
}
