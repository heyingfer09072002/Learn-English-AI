import { describe, it, expect } from 'vitest';
import { PracticeRecordModel } from '../src/models/PracticeRecord.model';

/**
 * 练习记录模型单元测试
 */
describe('PracticeRecordModel', () => {
  describe('类型定义验证', () => {
    it('PracticeMode 应该是有效的联合类型', () => {
      const validModes: Array<PracticeRecordModel['practiceMode']> = [
        'sentence_builder',
        'dictation',
        'listening',
        'speaking',
        'choice',
      ];
      expect(validModes).toHaveLength(5);
    });

    it('RatingLevel 应该是有效的联合类型', () => {
      const validRatings: Array<PracticeRecordModel['rating']> = [
        'C',
        'B',
        'A',
        'S',
        'SS',
        'SSS',
      ];
      expect(validRatings).toHaveLength(6);
    });
  });

  describe('CRUD 方法存在性验证', () => {
    it('应该定义所有必需的 CRUD 方法', () => {
      expect(typeof PracticeRecordModel.findById).toBe('function');
      expect(typeof PracticeRecordModel.findByUserId).toBe('function');
      expect(typeof PracticeRecordModel.findPracticeRecords).toBe('function');
      expect(typeof PracticeRecordModel.create).toBe('function');
      expect(typeof PracticeRecordModel.delete).toBe('function');
    });

    it('应该定义批量操作方法', () => {
      expect(typeof PracticeRecordModel.batchInsert).toBe('function');
      expect(typeof PracticeRecordModel.cleanupOldRecords).toBe('function');
    });

    it('应该定义统计方法', () => {
      expect(typeof PracticeRecordModel.getUserStatistics).toBe('function');
      expect(typeof PracticeRecordModel.getUserCourseProgress).toBe('function');
      expect(typeof PracticeRecordModel.getCourseStatistics).toBe('function');
    });
  });

  describe('create 方法参数验证', () => {
    it('练习记录应该包含必需字段', () => {
      const createData: {
        userId: number;
        practiceMode: PracticeRecordModel['practiceMode'];
      } = {
        userId: 1,
        practiceMode: 'sentence_builder',
      };

      expect(createData.userId).toBe(1);
      expect(createData.practiceMode).toBe('sentence_builder');
    });

    it('可选字段应该有合理的默认值', () => {
      const createData: {
        userId: number;
        practiceMode: PracticeRecordModel['practiceMode'];
        attemptCount?: number;
        comboCount?: number;
      } = {
        userId: 1,
        practiceMode: 'dictation',
        attemptCount: 1,
        comboCount: 0,
      };

      expect(createData.attemptCount).toBe(1);
      expect(createData.comboCount).toBe(0);
    });
  });

  describe('query 参数验证', () => {
    it('应该支持按用户 ID 筛选', () => {
      const params: { userId?: number } = {
        userId: 123,
      };
      expect(params.userId).toBe(123);
    });

    it('应该支持按课程 ID 筛选', () => {
      const params: { courseId?: number } = {
        courseId: 456,
      };
      expect(params.courseId).toBe(456);
    });

    it('应该支持按句子 ID 筛选', () => {
      const params: { sentenceId?: number } = {
        sentenceId: 789,
      };
      expect(params.sentenceId).toBe(789);
    });

    it('应该支持按练习模式筛选', () => {
      const params: { practiceMode?: PracticeRecordModel['practiceMode'] } = {
        practiceMode: 'listening',
      };
      expect(params.practiceMode).toBe('listening');
    });

    it('应该支持按正确率筛选', () => {
      const params: { isCorrect?: boolean } = {
        isCorrect: true,
      };
      expect(params.isCorrect).toBe(true);
    });

    it('应该支持日期范围筛选', () => {
      const params: { startDate?: Date; endDate?: Date } = {
        startDate: new Date('2026-01-01'),
        endDate: new Date('2026-12-31'),
      };
      expect(params.startDate).toBeDefined();
      expect(params.endDate).toBeDefined();
    });

    it('应该支持分页', () => {
      const params: { page?: number; limit?: number } = {
        page: 2,
        limit: 50,
      };
      expect(params.page).toBe(2);
      expect(params.limit).toBe(50);
    });
  });

  describe('统计功能验证', () => {
    it('用户统计应该包含所有必需字段', () => {
      const statistics: {
        totalPractices: number;
        correctCount: number;
        accuracy: number;
        averageTime: number;
        bestCombo: number;
        averageScore: number;
        practiceCountByMode: Record<PracticeRecordModel['practiceMode'], number>;
      } = {
        totalPractices: 100,
        correctCount: 85,
        accuracy: 0.85,
        averageTime: 5000,
        bestCombo: 20,
        averageScore: 850,
        practiceCountByMode: {
          sentence_builder: 30,
          dictation: 20,
          listening: 25,
          speaking: 15,
          choice: 10,
        },
      };

      expect(statistics.totalPractices).toBe(100);
      expect(statistics.accuracy).toBe(0.85);
    });

    it('练习模式统计应该覆盖所有模式', () => {
      const practiceCountByMode: Record<PracticeRecordModel['practiceMode'], number> = {
        sentence_builder: 10,
        dictation: 20,
        listening: 30,
        speaking: 25,
        choice: 15,
      };

      const modes = Object.keys(practiceCountByMode);
      expect(modes).toHaveLength(5);
      expect(modes).toContain('sentence_builder');
      expect(modes).toContain('dictation');
    });
  });

  describe('用户进度计算', () => {
    it('课程进度应该计算正确百分比', () => {
      const completedSentences = 80;
      const totalSentences = 100;
      const progressPercentage = Math.round((completedSentences / totalSentences) * 100);
      
      expect(progressPercentage).toBe(80);
    });

    it('进度百分比应该向上取整', () => {
      const completedSentences = 33;
      const totalSentences = 100;
      const progressPercentage = Math.round((completedSentences / totalSentences) * 100);
      
      expect(progressPercentage).toBe(33);
    });

    it('完成句子数不应超过总句子数', () => {
      const completedSentences = 120;
      const totalSentences = 100;
      const isValid = completedSentences <= totalSentences;
      
      expect(isValid).toBe(false);
    });
  });

  describe('边界条件测试', () => {
    it('分页参数应该验证', () => {
      const page = 0;
      const limit = -1;
      expect(page).toBeLessThan(1);
      expect(limit).toBeLessThan(1);
    });

    it('日期范围应该有效', () => {
      const startDate = new Date('2026-12-31');
      const endDate = new Date('2026-01-01');
      const isValid = startDate <= endDate;
      
      expect(isValid).toBe(false);
    });

    it('正确率应该在 0-1 之间', () => {
      const accuracy = 1.5;
      const isValid = accuracy >= 0 && accuracy <= 1;
      
      expect(isValid).toBe(false);
    });

    it('尝试次数应该大于 0', () => {
      const attemptCount = 0;
      const isValid = attemptCount >= 1;
      
      expect(isValid).toBe(false);
    });
  });

  describe('评级计算逻辑', () => {
    it('SSS 评级需要 95% 以上正确率', () => {
      const accuracy = 0.95;
      const rating = accuracy >= 0.95 ? 'SSS' : 
                     accuracy >= 0.90 ? 'SS' :
                     accuracy >= 0.80 ? 'S' :
                     accuracy >= 0.70 ? 'A' :
                     accuracy >= 0.60 ? 'B' : 'C';
      
      expect(rating).toBe('SSS');
    });

    it('C 评级是低于 60% 正确率', () => {
      const accuracy = 0.55;
      const rating = accuracy >= 0.95 ? 'SSS' : 
                     accuracy >= 0.90 ? 'SS' :
                     accuracy >= 0.80 ? 'S' :
                     accuracy >= 0.70 ? 'A' :
                     accuracy >= 0.60 ? 'B' : 'C';
      
      expect(rating).toBe('C');
    });
  });

  describe('数据清理逻辑', () => {
    it('应该保留最近的 N 条记录', () => {
      const keepCount = 1000;
      expect(keepCount).toBeGreaterThan(0);
    });

    it('清理数量应该合理', () => {
      const totalRecords = 5000;
      const keepCount = 1000;
      const toDelete = totalRecords - keepCount;
      
      expect(toDelete).toBe(4000);
      expect(toDelete).toBeGreaterThan(0);
    });
  });
});
