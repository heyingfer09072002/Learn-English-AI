import { pool } from '../database/index.js';

/**
 * 成就等级类型
 */
export type AchievementLevel = 'bronze' | 'silver' | 'gold' | 'platinum';

/**
 * 成就记录接口
 */
export interface AchievementRecord {
  id: number;
  userId: number;
  achievementKey: string;
  achievementLevel: AchievementLevel;
  progress: number;
  target: number;
  isUnlocked: boolean;
  unlockedAt?: Date;
  createdAt: Date;
}

/**
 * 成就定义接口
 */
export interface AchievementDefinition {
  key: string;
  name: string;
  description: string;
  category: string;
  icon: string;
  levels: {
    bronze: number;
    silver: number;
    gold: number;
    platinum: number;
  };
}

/**
 * 成就模型类
 */
export class AchievementModel {
  /**
   * 成就定义（预定义）
   */
  static readonly ACHIEVEMENTS: AchievementDefinition[] = [
    {
      key: 'learning_streak',
      name: '学习达人',
      description: '连续学习天数',
      category: '学习',
      icon: '🔥',
      levels: { bronze: 3, silver: 7, gold: 30, platinum: 100 },
    },
    {
      key: 'word_master',
      name: '词汇大师',
      description: '掌握单词数量',
      category: '学习',
      icon: '📚',
      levels: { bronze: 100, silver: 500, gold: 1000, platinum: 5000 },
    },
    {
      key: 'combo_king',
      name: '连击王者',
      description: '最高连击数',
      category: '成就',
      icon: '👑',
      levels: { bronze: 10, silver: 20, gold: 50, platinum: 100 },
    },
    {
      key: 'sss_master',
      name: '完美主义',
      description: '获得 SSS 评级次数',
      category: '成就',
      icon: '⭐',
      levels: { bronze: 10, silver: 50, gold: 100, platinum: 500 },
    },
  ];

  /**
   * 获取用户成就列表
   */
  static async getUserAchievements(userId: number): Promise<AchievementRecord[]> {
    const query = 'SELECT * FROM user_achievements WHERE user_id = $1 ORDER BY achievement_key';
    const result = await pool.query(query, [userId]);
    return result.rows;
  }

  /**
   * 更新成就进度
   */
  static async updateProgress(
    userId: number,
    achievementKey: string,
    progress: number
  ): Promise<AchievementRecord> {
    // 查找成就定义
    const achievement = this.ACHIEVEMENTS.find(a => a.key === achievementKey);
    if (!achievement) {
      throw new Error(`成就 ${achievementKey} 不存在`);
    }

    // 确定当前等级
    let level: AchievementLevel = 'bronze';
    if (progress >= achievement.levels.platinum) level = 'platinum';
    else if (progress >= achievement.levels.gold) level = 'gold';
    else if (progress >= achievement.levels.silver) level = 'silver';
    else if (progress >= achievement.levels.bronze) level = 'bronze';
    else {
      // 还未达到最低等级，插入或更新进度
      return this.insertOrUpdate(userId, achievementKey, progress, 'bronze', achievement.levels.bronze, false);
    }

    const target = achievement.levels[level];
    const isUnlocked = progress >= target;

    return this.insertOrUpdate(userId, achievementKey, progress, level, target, isUnlocked);
  }

  /**
   * 插入或更新成就
   */
  private static async insertOrUpdate(
    userId: number,
    achievementKey: string,
    progress: number,
    level: AchievementLevel,
    target: number,
    isUnlocked: boolean
  ): Promise<AchievementRecord> {
    const upsertQuery = `
      INSERT INTO user_achievements (user_id, achievement_key, achievement_level, progress, target, is_unlocked, unlocked_at)
      VALUES ($1, $2, $3, $4, $5, $6, $7)
      ON CONFLICT (user_id, achievement_key)
      DO UPDATE SET
        progress = GREATEST(user_achievements.progress, $4),
        achievement_level = EXCLUDED.achievement_level,
        target = EXCLUDED.target,
        is_unlocked = EXCLUDED.is_unlocked,
        unlocked_at = CASE WHEN EXCLUDED.is_unlocked THEN CURRENT_TIMESTAMP ELSE user_achievements.unlocked_at END
      RETURNING *
    `;

    const result = await pool.query(upsertQuery, [
      userId,
      achievementKey,
      level,
      progress,
      target,
      isUnlocked,
      isUnlocked ? new Date() : null,
    ]);

    return result.rows[0];
  }

  /**
   * 检查成就是否已解锁
   */
  static async isUnlocked(userId: number, achievementKey: string): Promise<boolean> {
    const query = `
      SELECT is_unlocked FROM user_achievements
      WHERE user_id = $1 AND achievement_key = $2
    `;
    const result = await pool.query(query, [userId, achievementKey]);
    return result.rows[0]?.is_unlocked || false;
  }

  /**
   * 获取已解锁成就数量
   */
  static async getUnlockedCount(userId: number): Promise<number> {
    const query = `
      SELECT COUNT(*) FROM user_achievements
      WHERE user_id = $1 AND is_unlocked = true
    `;
    const result = await pool.query(query, [userId]);
    return parseInt(result.rows[0].count);
  }
}

export const validateCriteria = (criteria: string[]) => criteria;
