import { pool } from '../database/index.js';

/**
 * 学习统计服务
 */
export class StatisticsService {
  /**
   * 获取用户学习概览
   */
  static async getUserOverview(userId: number): Promise<{
    totalStudyTime: number;
    totalPractices: number;
    currentStreak: number;
    bestStreak: number;
    masteredWords: number;
    averageAccuracy: number;
  }> {
    const query = `
      SELECT 
        total_study_time as "totalStudyTime",
        current_streak as "currentStreak",
        best_streak as "bestStreak"
      FROM users
      WHERE id = $1
    `;
    
    const userResult = await pool.query(query, [userId]);
    const user = userResult.rows[0];

    const statsQuery = `
      SELECT 
        COUNT(*) as "totalPractices",
        AVG(accuracy) as "averageAccuracy"
      FROM user_practice_records
      WHERE user_id = $1
    `;
    const statsResult = await pool.query(statsQuery, [userId]);
    const stats = statsResult.rows[0];

    const masteryQuery = `
      SELECT COUNT(*) as "masteredWords"
      FROM vocabulary_books
      WHERE user_id = $1 AND is_mastered = true
    `;
    const masteryResult = await pool.query(masteryQuery, [userId]);

    return {
      totalStudyTime: user?.totalStudyTime || 0,
      totalPractices: parseInt(stats.totalPractices),
      currentStreak: user?.currentStreak || 0,
      bestStreak: user?.bestStreak || 0,
      masteredWords: parseInt(masteryResult.rows[0].masteredWords),
      averageAccuracy: stats.averageAccuracy ? parseFloat(stats.averageAccuracy) : 0,
    };
  }

  /**
   * 获取学习热力图数据
   */
  static async getHeatmapData(userId: number, days: number = 90): Promise<Array<{
    date: string;
    count: number;
    duration: number;
  }>> {
    const query = `
      SELECT 
        DATE(created_at) as "date",
        COUNT(*) as "count",
        SUM(time_spent) / 1000 / 60 as "duration"
      FROM user_practice_records
      WHERE user_id = $1
        AND created_at >= CURRENT_DATE - INTERVAL '${days} days'
      GROUP BY DATE(created_at)
      ORDER BY date ASC
    `;
    
    const result = await pool.query(query, [userId]);
    return result.rows;
  }

  /**
   * 获取能力雷达图数据
   */
  static async getAbilityRadar(userId: number): Promise<{
    listening: number;
    speaking: number;
    reading: number;
    writing: number;
    vocabulary: number;
  }> {
    const query = `
      SELECT 
        practice_mode,
        AVG(accuracy) as "accuracy"
      FROM user_practice_records
      WHERE user_id = $1
      GROUP BY practice_mode
    `;
    
    const result = await pool.query(query, [userId]);
    
    const abilities: any = {
      listening: 0,
      speaking: 0,
      reading: 0,
      writing: 0,
      vocabulary: 0,
    };
    
    result.rows.forEach((row: any) => {
      const mode = row.practice_mode;
      const accuracy = parseFloat(row.accuracy) * 100;
      
      if (mode === 'listening') abilities.listening = accuracy;
      if (mode === 'speaking') abilities.speaking = accuracy;
      if (mode === 'sentence_builder') abilities.writing = accuracy;
      if (mode === 'choice') abilities.reading = accuracy;
      if (mode === 'dictation') abilities.vocabulary = accuracy;
    });
    
    return abilities;
  }

  /**
   * 获取成就统计
   */
  static async getAchievementStats(userId: number): Promise<{
    unlocked: number;
    total: number;
    progress: Array<{ key: string; current: number; target: number }>;
  }> {
    const unlockedQuery = `
      SELECT COUNT(*) FROM user_achievements
      WHERE user_id = $1 AND is_unlocked = true
    `;
    const unlockedResult = await pool.query(unlockedQuery, [userId]);
    const unlocked = parseInt(unlockedResult.rows[0].count);

    const progressQuery = `
      SELECT achievement_key, progress, target
      FROM user_achievements
      WHERE user_id = $1
    `;
    const progressResult = await pool.query(progressQuery, [userId]);
    
    return {
      unlocked,
      total: 4, // 预定义成就数量
      progress: progressResult.rows.map((row: any) => ({
        key: row.achievement_key,
        current: parseInt(row.progress),
        target: parseInt(row.target),
      })),
    };
  }
}
