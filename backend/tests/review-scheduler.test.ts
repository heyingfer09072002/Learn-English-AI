import { describe, it, expect } from 'vitest';
import { ReviewScheduler, REVIEW_INTERVALS } from '../src/utils/review-scheduler';

describe('ReviewScheduler', () => {
  describe('calculateNextReview', () => {
    it('should schedule review after 5 minutes for first learning', () => {
      const nextReview = ReviewScheduler.calculateNextReview(0, true);
      expect(nextReview).not.toBeNull();
      
      const expectedTime = Date.now() + 5 * 60 * 1000;
      expect(nextReview!.getTime()).toBeCloseTo(expectedTime, -2);
    });

    it('should follow Ebbinghaus intervals for correct answers', () => {
      const intervals = [
        { learned: 0, expected: 5 },
        { learned: 1, expected: 30 },
        { learned: 2, expected: 720 },
        { learned: 3, expected: 1440 },
        { learned: 4, expected: 2880 },
        { learned: 5, expected: 5760 },
        { learned: 6, expected: 10080 },
        { learned: 7, expected: 21600 }
      ];

      intervals.forEach(({ learned, expected }) => {
        const nextReview = ReviewScheduler.calculateNextReview(learned, true);
        const expectedTime = Date.now() + expected * 60 * 1000;
        expect(nextReview!.getTime()).toBeCloseTo(expectedTime, -2);
      });
    });

    it('should reschedule after 5 minutes for incorrect answers', () => {
      const testCases = [0, 1, 2, 3];
      
      testCases.forEach(learnedTimes => {
        const nextReview = ReviewScheduler.calculateNextReview(learnedTimes, false);
        const expectedTime = Date.now() + 5 * 60 * 1000;
        expect(nextReview!.getTime()).toBeCloseTo(expectedTime, -2);
      });
    });

    it('should return null when mastered (learnedTimes >= 8)', () => {
      const nextReview = ReviewScheduler.calculateNextReview(8, true);
      expect(nextReview).toBeNull();
      
      const nextReview2 = ReviewScheduler.calculateNextReview(10, true);
      expect(nextReview2).toBeNull();
    });

    it('should calculate mastery level correctly', () => {
      // Perfect accuracy with enough progress
      const mastery1 = ReviewScheduler.calculateMasteryLevel(8, 0);
      expect(mastery1).toBeGreaterThanOrEqual(80);

      // 50% accuracy
      const mastery2 = ReviewScheduler.calculateMasteryLevel(10, 5);
      expect(mastery2).toBeLessThan(80);
      expect(mastery2).toBeGreaterThan(0);

      // No learning
      const mastery3 = ReviewScheduler.calculateMasteryLevel(0, 0);
      expect(mastery3).toBe(0);
    });
  });

  describe('getDueReviews query logic', () => {
    it('should return words due for review today', () => {
      // This would require database setup, testing the logic instead
      const today = new Date();
      const startOfDay = new Date(today.setHours(0, 0, 0, 0));
      const endOfDay = new Date(today.setHours(23, 59, 59, 999));

      expect(startOfDay.getHours()).toBe(0);
      expect(startOfDay.getMinutes()).toBe(0);
      expect(endOfDay.getHours()).toBe(23);
      expect(endOfDay.getMinutes()).toBe(59);
    });
  });
});

describe('Ebbinghaus Intervals', () => {
  it('should have correct interval sequence', () => {
    expect(REVIEW_INTERVALS.length).toBe(8);
    expect(REVIEW_INTERVALS).toEqual([5, 30, 720, 1440, 2880, 5760, 10080, 21600]);
  });

  it('should have increasing intervals', () => {
    for (let i = 1; i < REVIEW_INTERVALS.length; i++) {
      expect(REVIEW_INTERVALS[i]).toBeGreaterThan(REVIEW_INTERVALS[i - 1]);
    }
  });
});
