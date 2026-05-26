/**
 * 评级等级类型
 */
export type RatingLevel = 'C' | 'B' | 'A' | 'S' | 'SS' | 'SSS';

/**
 * 评级结果接口
 */
export interface RatingResult {
  level: RatingLevel;
  accuracy: number;
  averageTime: number;
  bestCombo: number;
  score: number;
  feedback: string;
}

/**
 * 评级配置接口
 */
interface RatingConfig {
  level: RatingLevel;
  minAccuracy: number;
  maxTime: number; // 毫秒
  scoreRange: [number, number];
  color: string;
}

/**
 * 评级计算服务
 * 根据准确率、时间和连击计算评级
 */
export class RatingService {
  /**
   * 评级配置
   */
  private static readonly RATING_CONFIGS: RatingConfig[] = [
    {
      level: 'SSS',
      minAccuracy: 0.95,
      maxTime: 3000,
      scoreRange: [950, 1000],
      color: '#FFD700', // 金色
    },
    {
      level: 'SS',
      minAccuracy: 0.90,
      maxTime: 4000,
      scoreRange: [900, 949],
      color: '#C0C0C0', // 银色
    },
    {
      level: 'S',
      minAccuracy: 0.80,
      maxTime: 5000,
      scoreRange: [800, 899],
      color: '#CD7F32', // 铜色
    },
    {
      level: 'A',
      minAccuracy: 0.70,
      maxTime: 6000,
      scoreRange: [700, 799],
      color: '#4169E1', // 蓝色
    },
    {
      level: 'B',
      minAccuracy: 0.60,
      maxTime: 8000,
      scoreRange: [600, 699],
      color: '#32CD32', // 绿色
    },
    {
      level: 'C',
      minAccuracy: 0.0,
      maxTime: Infinity,
      scoreRange: [0, 599],
      color: '#808080', // 灰色
    },
  ];

  /**
   * 计算练习评级
   * @param accuracy 准确率 (0-1)
   * @param averageTime 平均答题时间（毫秒）
   * @param bestCombo 最佳连击
   * @returns 评级结果
   */
  static calculateRating(
    accuracy: number,
    averageTime: number,
    bestCombo: number
  ): RatingResult {
    // 验证输入
    this.validateInputs(accuracy, averageTime, bestCombo);

    // 确定评级
    const rating = this.determineRating(accuracy, averageTime);
    const config = this.getRatingConfig(rating);

    // 计算分数
    const score = this.calculateScore(accuracy, averageTime, bestCombo, config);

    // 生成分数反馈
    const feedback = this.generateFeedback(rating, accuracy, averageTime, bestCombo);

    return {
      level: rating,
      accuracy,
      averageTime,
      bestCombo,
      score,
      feedback,
    };
  }

  /**
   * 根据单次答题计算评级
   */
  static calculateSingleAttemptRating(
    isCorrect: boolean,
    timeSpent: number,
    comboCount: number
  ): RatingResult {
    const accuracy = isCorrect ? 1.0 : 0.0;
    return this.calculateRating(accuracy, timeSpent, comboCount);
  }

  /**
   * 确定评级等级
   */
  private static determineRating(
    accuracy: number,
    averageTime: number
  ): RatingLevel {
    for (const config of this.RATING_CONFIGS) {
      if (accuracy >= config.minAccuracy && averageTime <= config.maxTime) {
        return config.level;
      }
    }
    return 'C';
  }

  /**
   * 计算分数
   */
  private static calculateScore(
    accuracy: number,
    averageTime: number,
    bestCombo: number,
    config: RatingConfig
  ): number {
    // 基础分：准确率 * 100
    const baseScore = accuracy * 100;

    // 时间奖励：越快分数越高
    const timeBonus = Math.max(0, (10000 - averageTime) / 100);

    // 连击奖励
    const comboBonus = Math.min(bestCombo * 2, 100);

    // 总分
    const totalScore = Math.round(baseScore * 0.6 + timeBonus * 0.2 + comboBonus * 0.2);

    // 确保分数在配置范围内
    return Math.min(Math.max(totalScore, config.scoreRange[0]), config.scoreRange[1]);
  }

  /**
   * 生成分数反馈
   */
  private static generateFeedback(
    level: RatingLevel,
    accuracy: number,
    averageTime: number,
    bestCombo: number
  ): string {
    const feedbacks: Record<RatingLevel, string[]> = {
      SSS: [
        '太完美了！你就是英语天才！',
        '不可思议的表现！继续保持！',
        '完美无缺！你已经掌握这个课程了！',
      ],
      SS: [
        '非常优秀！离完美只差一步！',
        '出色的表现！再接再厉！',
        '太棒了！你学得非常快！',
      ],
      S: [
        '做得很好！继续保持这个状态！',
        '优秀的表现！你已经掌握大部分内容了！',
        '很棒！你的进步很明显！',
      ],
      A: [
        '不错！继续保持努力！',
        '良好的表现！再加油就能更好！',
        '还可以更好，你可以的！',
      ],
      B: [
        '还可以，但有进步空间！',
        '继续努力，你会越来越好的！',
        '不要放弃，多练习几次！',
      ],
      C: [
        '别灰心，失败是成功之母！',
        '重新开始，这次一定会更好！',
        '多加练习，你一定能做到！',
      ],
    };

    const messages = feedbacks[level];
    const randomIndex = Math.floor(Math.random() * messages.length);
    return messages[randomIndex];
  }

  /**
   * 获取评级配置
   */
  private static getRatingConfig(level: RatingLevel): RatingConfig {
    const config = this.RATING_CONFIGS.find(c => c.level === level);
    if (!config) {
      throw new Error(`未知的评级等级：${level}`);
    }
    return config;
  }

  /**
   * 验证输入参数
   */
  private static validateInputs(
    accuracy: number,
    averageTime: number,
    bestCombo: number
  ): void {
    if (accuracy < 0 || accuracy > 1) {
      throw new Error(`准确率必须在 0-1 之间，当前：${accuracy}`);
    }

    if (averageTime < 0) {
      throw new Error(`答题时间不能为负数：${averageTime}`);
    }

    if (bestCombo < 0) {
      throw new Error(`连击数不能为负数：${bestCombo}`);
    }
  }

  /**
   * 获取所有评级等级
   */
  static getAllRatingLevels(): RatingLevel[] {
    return ['C', 'B', 'A', 'S', 'SS', 'SSS'];
  }

  /**
   * 获取评级的颜色
   */
  static getRatingColor(level: RatingLevel): string {
    const config = this.getRatingConfig(level);
    return config.color;
  }

  /**
   * 判断是否通过（C 级以上）
   */
  static isPass(level: RatingLevel): boolean {
    return level !== 'C';
  }

  /**
   * 判断是否优秀（A 级以上）
   */
  static isExcellent(level: RatingLevel): boolean {
    return ['A', 'S', 'SS', 'SSS'].includes(level);
  }

  /**
   * 判断是否完美（SSS 级）
   */
  static isPerfect(level: RatingLevel): boolean {
    return level === 'SSS';
  }
}
