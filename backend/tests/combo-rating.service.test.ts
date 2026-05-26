import { describe, it, expect } from 'vitest';
import { ComboService } from '../src/services/combo.service';
import { RatingService } from '../src/services/rating.service';

describe('ComboService', () => {
  describe('calculateMultiplier', () => {
    it('应该返回正确的倍数 (0-4 连击)', () => {
      for (let i = 0; i < 5; i++) {
        expect(ComboService.calculateMultiplier(i)).toBe(1.0);
      }
    });

    it('应该返回正确的倍数 (5-9 连击)', () => {
      for (let i = 5; i < 10; i++) {
        expect(ComboService.calculateMultiplier(i)).toBe(1.2);
      }
    });

    it('应该返回正确的倍数 (10-19 连击)', () => {
      for (let i = 10; i < 20; i++) {
        expect(ComboService.calculateMultiplier(i)).toBe(1.5);
      }
    });

    it('应该返回正确的倍数 (20+ 连击)', () => {
      for (let i = 20; i < 100; i += 10) {
        expect(ComboService.calculateMultiplier(i)).toBe(2.0);
      }
    });
  });

  describe('generateMessage', () => {
    it('应该生成 Perfect 消息', () => {
      const message = ComboService.generateMessage(25, true, false);
      expect(message).toContain('Perfect');
    });

    it('应该生成 Great 消息', () => {
      const message = ComboService.generateMessage(15, false, true);
      expect(message).toContain('Great');
    });

    it('应该生成普通连击消息', () => {
      const message = ComboService.generateMessage(5, false, false);
      expect(message).toContain('连击');
    });

    it('低连击应该不生成消息', () => {
      const message = ComboService.generateMessage(2, false, false);
      expect(message).toBe('');
    });
  });

  describe('validateComboState', () => {
    it('应该验证有效的连击状态', () => {
      const state = {
        count: 10,
        maxCombo: 15,
        multiplier: 1.5,
        isPerfect: false,
        isGreat: true,
        sessionId: 'test',
      };
      expect(ComboService.validateComboState(state)).toBe(true);
    });

    it('连击数为负应该无效', () => {
      const state = {
        count: -1,
        maxCombo: 10,
        multiplier: 1.0,
        isPerfect: false,
        isGreat: false,
        sessionId: 'test',
      };
      expect(ComboService.validateComboState(state)).toBe(false);
    });

    it('最大连击小于当前连击应该无效', () => {
      const state = {
        count: 20,
        maxCombo: 15,
        multiplier: 2.0,
        isPerfect: true,
        isGreat: false,
        sessionId: 'test',
      };
      expect(ComboService.validateComboState(state)).toBe(false);
    });

    it('倍数超出范围应该无效', () => {
      const state = {
        count: 10,
        maxCombo: 15,
        multiplier: 3.0,
        isPerfect: false,
        isGreat: true,
        sessionId: 'test',
      };
      expect(ComboService.validateComboState(state)).toBe(false);
    });
  });
});

describe('RatingService', () => {
  describe('calculateRating', () => {
    it('应该返回 SSS 评级', () => {
      const result = RatingService.calculateRating(0.96, 2800, 25);
      expect(result.level).toBe('SSS');
      expect(result.score).toBeGreaterThanOrEqual(950);
    });

    it('应该返回 SS 评级', () => {
      const result = RatingService.calculateRating(0.92, 3800, 15);
      expect(result.level).toBe('SS');
      expect(result.score).toBeGreaterThanOrEqual(900);
      expect(result.score).toBeLessThan(950);
    });

    it('应该返回 S 评级', () => {
      const result = RatingService.calculateRating(0.85, 4800, 12);
      expect(result.level).toBe('S');
    });

    it('应该返回 A 评级', () => {
      const result = RatingService.calculateRating(0.75, 5500, 8);
      expect(result.level).toBe('A');
    });

    it('应该返回 B 评级', () => {
      const result = RatingService.calculateRating(0.65, 7000, 5);
      expect(result.level).toBe('B');
    });

    it('应该返回 C 评级', () => {
      const result = RatingService.calculateRating(0.50, 9000, 2);
      expect(result.level).toBe('C');
    });
  });

  describe('评级判定', () => {
    it('isPass 应该正确判定', () => {
      const levels: Array<{level: string, pass: boolean}> = [
        { level: 'SSS', pass: true },
        { level: 'SS', pass: true },
        { level: 'S', pass: true },
        { level: 'A', pass: true },
        { level: 'B', pass: true },
        { level: 'C', pass: false },
      ];

      levels.forEach(({level, pass}) => {
        expect(RatingService.isPass(level as any)).toBe(pass);
      });
    });

    it('isExcellent 应该正确判定', () => {
      expect(RatingService.isExcellent('SSS')).toBe(true);
      expect(RatingService.isExcellent('SS')).toBe(true);
      expect(RatingService.isExcellent('S')).toBe(true);
      expect(RatingService.isExcellent('A')).toBe(true);
      expect(RatingService.isExcellent('B')).toBe(false);
      expect(RatingService.isExcellent('C')).toBe(false);
    });

    it('isPerfect 应该只判定 SSS', () => {
      expect(RatingService.isPerfect('SSS')).toBe(true);
      expect(RatingService.isPerfect('SS')).toBe(false);
      expect(RatingService.isPerfect('S')).toBe(false);
      expect(RatingService.isPerfect('A')).toBe(false);
      expect(RatingService.isPerfect('B')).toBe(false);
      expect(RatingService.isPerfect('C')).toBe(false);
    });
  });

  describe('validateInputs', () => {
    it('有效输入不应该抛出异常', () => {
      const testCases = [
        { accuracy: 1.0, time: 1000, combo: 10 },
        { accuracy: 0.5, time: 5000, combo: 5 },
        { accuracy: 0.0, time: 10000, combo: 0 },
      ];

      testCases.forEach(({accuracy, time, combo}) => {
        expect(() => {
          RatingService.calculateRating(accuracy, time, combo);
        }).not.toThrow();
      });
    });

    it('准确率超出范围应该抛出异常', () => {
      expect(() => RatingService.calculateRating(-0.1, 1000, 0)).toThrow();
      expect(() => RatingService.calculateRating(1.1, 1000, 0)).toThrow();
    });

    it('时间不能为负', () => {
      expect(() => RatingService.calculateRating(0.5, -100, 0)).toThrow();
    });

    it('连击数不能为负', () => {
      expect(() => RatingService.calculateRating(0.5, 1000, -1)).toThrow();
    });
  });

  describe('边界值测试', () => {
    it('95% 准确率 3000ms 应该是 SSS', () => {
      const result = RatingService.calculateRating(0.95, 2999, 20);
      expect(result.level).toBe('SSS');
    });

    it('90% 准确率 4000ms 应该是 SS', () => {
      const result = RatingService.calculateRating(0.90, 3999, 15);
      expect(result.level).toBe('SS');
    });

    it('80% 准确率 5000ms 应该是 S', () => {
      const result = RatingService.calculateRating(0.80, 4999, 10);
      expect(result.level).toBe('S');
    });

    it('89.9% 准确率应该降级', () => {
      const result = RatingService.calculateRating(0.899, 3000, 10);
      expect(result.level).toBe('S'); // 因为时间符合 S 标准
    });
  });

  describe('分数计算', () => {
    it('满分应该接近 1000 分', () => {
      const result = RatingService.calculateRating(1.0, 1000, 50);
      expect(result.score).toBeGreaterThanOrEqual(950);
    });

    it('0 分正确率应该是 0 分', () => {
      const result = RatingService.calculateRating(0.0, 10000, 0);
      expect(result.score).toBeLessThan(100);
    });
  });
});
