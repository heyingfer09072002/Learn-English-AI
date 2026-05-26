import { ComboModel } from '../models/Combo.model';

/**
 * 连击状态接口
 */
export interface ComboState {
  count: number;
  maxCombo: number;
  multiplier: number;
  isPerfect: boolean;
  isGreat: boolean;
  sessionId: string;
}

/**
 * 连击结果接口
 */
export interface ComboResult {
  state: ComboState;
  isNewMax: boolean;
  message?: string;
}

/**
 * 连击计算服务
 * 负责连击的计算、倍数判定和特效触发
 */
export class ComboService {
  /**
   * 连击倍数配置
   */
  private static readonly COMBO_MULTIPLIERS = {
    THRESHOLD_5: { combo: 5, multiplier: 1.2 },
    THRESHOLD_10: { combo: 10, multiplier: 1.5 },
    THRESHOLD_20: { combo: 20, multiplier: 2.0 },
  };

  /**
   * 特效触发阈值
   */
  private static readonly EFFECT_THRESHOLDS = {
    PERFECT: 20,
    GREAT: 10,
    GOOD: 5,
  };

  /**
   * 处理正确答案（增加连击）
   */
  static async handleCorrect(
    userId: number,
    sessionId: string
  ): Promise<ComboResult> {
    // 获取当前连击
    const activeCombo = await ComboModel.getActiveCombo(userId);
    
    const currentCombo = activeCombo ? activeCombo.currentCombo + 1 : 1;
    const maxCombo = activeCombo ? Math.max(activeCombo.maxCombo, currentCombo) : currentCombo;
    
    // 更新连击
    const updatedCombo = await ComboModel.updateCombo(userId, sessionId, currentCombo);
    
    // 计算倍数
    const multiplier = this.calculateMultiplier(currentCombo);
    
    // 判定特效
    const isPerfect = currentCombo >= this.EFFECT_THRESHOLDS.PERFECT;
    const isGreat = currentCombo >= this.EFFECT_THRESHOLDS.GREAT && !isPerfect;
    
    // 是否创造了新记录
    const isNewMax = currentCombo === maxCombo && (!activeCombo || currentCombo > activeCombo.maxCombo);
    
    // 生成消息
    const message = this.generateMessage(currentCombo, isPerfect, isGreat);

    return {
      state: {
        count: currentCombo,
        maxCombo: updatedCombo.max_combo,
        multiplier,
        isPerfect,
        isGreat,
        sessionId,
      },
      isNewMax,
      message,
    };
  }

  /**
   * 处理错误答案（重置连击）
   */
  static async handleWrong(
    userId: number,
    sessionId: string
  ): Promise<ComboResult> {
    // 获取当前连击
    const activeCombo = await ComboModel.getActiveCombo(userId);
    const previousCombo = activeCombo ? activeCombo.currentCombo : 0;
    
    // 重置连击
    await ComboModel.resetCombo(userId, sessionId);
    
    // 创建新的不活跃连击记录（用于统计）
    await ComboModel.updateCombo(userId, sessionId, 0);

    return {
      state: {
        count: 0,
        maxCombo: activeCombo?.max_combo || previousCombo,
        multiplier: 1.0,
        isPerfect: false,
        isGreat: false,
        sessionId,
      },
      isNewMax: false,
      message: '连击中断了，继续加油！',
    };
  }

  /**
   * 计算连击倍数
   */
  static calculateMultiplier(comboCount: number): number {
    if (comboCount >= this.COMBO_MULTIPLIERS.THRESHOLD_20.combo) {
      return this.COMBO_MULTIPLIERS.THRESHOLD_20.multiplier;
    }
    if (comboCount >= this.COMBO_MULTIPLIERS.THRESHOLD_10.combo) {
      return this.COMBO_MULTIPLIERS.THRESHOLD_10.multiplier;
    }
    if (comboCount >= this.COMBO_MULTIPLIERS.THRESHOLD_5.combo) {
      return this.COMBO_MULTIPLIERS.THRESHOLD_5.multiplier;
    }
    return 1.0;
  }

  /**
   * 生成连击消息
   */
  static generateMessage(
    comboCount: number,
    isPerfect: boolean,
    isGreat: boolean
  ): string {
    if (isPerfect) {
      return `🔥 Perfect! ${comboCount} 连击！`;
    }
    if (isGreat) {
      return `✨ Great! ${comboCount} 连击！`;
    }
    if (comboCount >= 3) {
      return `👍 ${comboCount} 连击！`;
    }
    return '';
  }

  /**
   * 获取用户历史最高连击
   */
  static async getUserMaxCombo(userId: number): Promise<number> {
    return await ComboModel.getMaxCombo(userId);
  }

  /**
   * 获取当前连击状态
   */
  static async getCurrentCombo(userId: number): Promise<ComboState | null> {
    const activeCombo = await ComboModel.getActiveCombo(userId);
    
    if (!activeCombo) {
      return null;
    }

    const multiplier = this.calculateMultiplier(activeCombo.currentCombo);
    const isPerfect = activeCombo.currentCombo >= this.EFFECT_THRESHOLDS.PERFECT;
    const isGreat = activeCombo.currentCombo >= this.EFFECT_THRESHOLDS.GREAT && !isPerfect;

    return {
      count: activeCombo.currentCombo,
      maxCombo: activeCombo.maxCombo,
      multiplier,
      isPerfect,
      isGreat,
      sessionId: activeCombo.sessionId,
    };
  }

  /**
   * 验证连击状态的有效性
   */
  static validateComboState(state: ComboState): boolean {
    // 连击数不能为负
    if (state.count < 0) return false;
    
    // 最大连击不能小于当前连击
    if (state.maxCombo < state.count) return false;
    
    // 倍数必须在合理范围内
    if (state.multiplier < 1.0 || state.multiplier > 2.0) return false;
    
    // 倍数应该与连击数匹配
    const expectedMultiplier = this.calculateMultiplier(state.count);
    if (Math.abs(state.multiplier - expectedMultiplier) > 0.01) return false;
    
    return true;
  }
}
