import { pool } from '../database/index.js';

export interface UserProgress {
  id?: number;
  userId: number;
  lessonId?: number;
  completedLessons?: number;
  totalStudyTime?: number; // 分钟
  vocabulary?: number;
  accuracy?: number;
  lastStudyAt?: Date;
  createdAt?: Date;
  updatedAt?: Date;
}

export class ProgressModel {
  /**
   * 创建学习进度表
   */
  static async createTable() {
    await pool.query(`
      CREATE TABLE IF NOT EXISTS user_progress (
        id SERIAL PRIMARY KEY,
        user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
        lesson_id INTEGER REFERENCES lessons(id) ON DELETE SET NULL,
        completed_lessons INTEGER DEFAULT 0,
        total_study_time INTEGER DEFAULT 0,
        vocabulary INTEGER DEFAULT 0,
        accuracy DECIMAL(5,2) DEFAULT 0,
        last_study_at TIMESTAMP,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        UNIQUE(user_id)
      )
    `);
    console.log('✅ UserProgress 表创建成功');
  }

  /**
   * 获取用户进度
   */
  static async findByUserId(userId: number): Promise<UserProgress | null> {
    const query = 'SELECT * FROM user_progress WHERE user_id = $1';
    const result = await pool.query(query, [userId]);
    return result.rows[0] || null;
  }

  /**
   * 创建或更新用户进度
   */
  static async upsert(userId: number, updates: Partial<UserProgress>): Promise<UserProgress> {
    const existing = await this.findByUserId(userId);

    if (existing) {
      return this.update(existing.id!, updates);
    } else {
      return this.create({ userId, ...updates });
    }
  }

  /**
   * 创建用户进度
   */
  static async create(data: UserProgress): Promise<UserProgress> {
    const query = `
      INSERT INTO user_progress (
        user_id, completed_lessons, total_study_time, vocabulary, accuracy
      )
      VALUES ($1, $2, $3, $4, $5)
      RETURNING *
    `;
    const values = [
      data.userId,
      data.completedLessons || 0,
      data.totalStudyTime || 0,
      data.vocabulary || 0,
      data.accuracy || 0
    ];
    const result = await pool.query(query, values);
    return result.rows[0];
  }

  /**
   * 更新用户进度
   */
  static async update(id: number, updates: Partial<UserProgress>): Promise<UserProgress> {
    const query = `
      UPDATE user_progress
      SET
        completed_lessons = COALESCE($2, completed_lessons),
        total_study_time = COALESCE($3, total_study_time),
        vocabulary = COALESCE($4, vocabulary),
        accuracy = COALESCE($5, accuracy),
        last_study_at = CURRENT_TIMESTAMP,
        updated_at = CURRENT_TIMESTAMP
      WHERE id = $1
      RETURNING *
    `;
    const values = [
      id,
      updates.completedLessons,
      updates.totalStudyTime,
      updates.vocabulary,
      updates.accuracy
    ];
    const result = await pool.query(query, values);
    return result.rows[0];
  }
}
