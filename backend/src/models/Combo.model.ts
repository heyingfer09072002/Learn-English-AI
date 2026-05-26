import { pool } from '../database/index.js';

/**
 * 连击记录接口
 */
export interface ComboRecord {
  id: number;
  userId: number;
  sessionId: string;
  maxCombo: number;
  currentCombo: number;
  isActive: boolean;
  startedAt: Date;
  endedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * 连击模型类
 */
export class ComboModel {
  /**
   * 获取用户当前活跃的连击
   */
  static async getActiveCombo(userId: number): Promise<ComboRecord | null> {
    const query = `
      SELECT * FROM user_combos
      WHERE user_id = $1 AND is_active = true
      ORDER BY started_at DESC
      LIMIT 1
    `;
    const result = await pool.query(query, [userId]);
    return result.rows[0] || null;
  }

  /**
   * 创建或更新连击
   */
  static async updateCombo(userId: number, sessionId: string, comboCount: number): Promise<ComboRecord> {
    // 检查是否存在活跃连击
    const activeCombo = await this.getActiveCombo(userId);
    
    if (activeCombo) {
      // 更新现有连击
      const updateQuery = `
        UPDATE user_combos
        SET current_combo = $1,
            max_combo = GREATEST(max_combo, $1),
            updated_at = CURRENT_TIMESTAMP
        WHERE user_id = $2 AND session_id = $3
        RETURNING *
      `;
      const result = await pool.query(updateQuery, [comboCount, userId, sessionId]);
      return result.rows[0];
    } else {
      // 创建新连击
      const createQuery = `
        INSERT INTO user_combos (user_id, session_id, current_combo, max_combo)
        VALUES ($1, $2, $3, $3)
        RETURNING *
      `;
      const result = await pool.query(createQuery, [userId, sessionId, comboCount]);
      return result.rows[0];
    }
  }

  /**
   * 重置连击
   */
  static async resetCombo(userId: number, sessionId: string): Promise<void> {
    const query = `
      UPDATE user_combos
      SET is_active = false, ended_at = CURRENT_TIMESTAMP, updated_at = CURRENT_TIMESTAMP
      WHERE user_id = $1 AND session_id = $2
    `;
    await pool.query(query, [userId, sessionId]);
  }

  /**
   * 获取用户历史最高连击
   */
  static async getMaxCombo(userId: number): Promise<number> {
    const query = `
      SELECT MAX(max_combo) as max_combo
      FROM user_combos
      WHERE user_id = $1
    `;
    const result = await pool.query(query, [userId]);
    return parseInt(result.rows[0].max_combo) || 0;
  }
}

export const validateCriteria = (criteria: string[]) => criteria;
