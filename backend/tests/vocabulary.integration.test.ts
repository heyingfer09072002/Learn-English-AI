import { describe, it, expect, beforeAll, afterAll, beforeEach } from 'vitest';
import request from 'supertest';
import app from '../src/index';
import { pool } from '../src/database/index';

describe('Vocabulary API Integration Tests', () => {
  let authToken: string;
  let testUserId: number;
  let wordId: number;

  // 测试前准备
  beforeAll(async () => {
    // 创建测试用户
    const registerRes = await request(app)
      .post('/api/auth/register')
      .send({
        email: 'test_vocabulary@test.com',
        password: 'password123',
        username: 'test_vocabulary'
      });
    
    if (registerRes.body.data?.token) {
      authToken = registerRes.body.data.token;
      testUserId = registerRes.body.data.user.id;
    }

    // 插入测试词汇
    const insertResult = await pool.query(
      `INSERT INTO words (word, phonetic_uk, phonetic_us, difficulty_level, frequency_level)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING id`,
      ['testword', '[test]', '[test]', 5, 'high']
    );
    wordId = insertResult.rows[0].id;
  });

  // 清理测试数据
  afterAll(async () => {
    if (wordId) {
      await pool.query('DELETE FROM words WHERE id = $1', [wordId]);
    }
    if (testUserId) {
      await pool.query('DELETE FROM users WHERE id = $1', [testUserId]);
    }
  });

  describe('GET /api/vocabulary/groups', () => {
    it('should return vocabulary groups list', async () => {
      const res = await request(app)
        .get('/api/vocabulary/groups')
        .set('Authorization', `Bearer ${authToken}`);

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data).toBeInstanceOf(Array);
      expect(res.body.data.length).toBeGreaterThan(0);
      expect(res.body.data[0]).toHaveProperty('id');
      expect(res.body.data[0]).toHaveProperty('name');
      expect(res.body.data[0]).toHaveProperty('wordCount');
    });

    it('should filter groups by type', async () => {
      const res = await request(app)
        .get('/api/vocabulary/groups?type=pos')
        .set('Authorization', `Bearer ${authToken}`);

      expect(res.status).toBe(200);
      res.body.data.forEach((group: any) => {
        expect(group.categoryType).toBe('pos');
      });
    });
  });

  describe('GET /api/vocabulary/words/:id', () => {
    it('should return word details', async () => {
      const res = await request(app)
        .get(`/api/vocabulary/words/${wordId}`)
        .set('Authorization', `Bearer ${authToken}`);

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data).toHaveProperty('word', 'testword');
      expect(res.body.data).toHaveProperty('phoneticUk');
      expect(res.body.data).toHaveProperty('id', wordId);
    });

    it('should return 404 for non-existent word', async () => {
      const res = await request(app)
        .get('/api/vocabulary/words/999999')
        .set('Authorization', `Bearer ${authToken}`);

      expect(res.status).toBe(404);
      expect(res.body.success).toBe(false);
    });
  });

  describe('GET /api/vocabulary/words/search', () => {
    it('should search words by query', async () => {
      const res = await request(app)
        .get('/api/vocabulary/words/search?q=test')
        .set('Authorization', `Bearer ${authToken}`);

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data).toHaveProperty('words');
      expect(res.body.data.words).toBeInstanceOf(Array);
    });

    it('should require query parameter', async () => {
      const res = await request(app)
        .get('/api/vocabulary/words/search')
        .set('Authorization', `Bearer ${authToken}`);

      expect(res.status).toBe(400);
      expect(res.body.success).toBe(false);
    });
  });

  describe('POST /api/vocabulary/words/:id/learn', () => {
    it('should record learning action', async () => {
      const res = await request(app)
        .post(`/api/vocabulary/words/${wordId}/learn`)
        .set('Authorization', `Bearer ${authToken}`)
        .send({ action: 'complete', timeSpent: 10 });

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data).toHaveProperty('progress');
      expect(res.body.data.progress).toHaveProperty('wordId', wordId);
    });

    it('should require authentication', async () => {
      const res = await request(app)
        .post(`/api/vocabulary/words/${wordId}/learn`)
        .send({ action: 'complete' });

      expect(res.status).toBe(401);
    });
  });

  describe('POST /api/vocabulary/words/:id/review', () => {
    it('should record review with correct answer', async () => {
      const res = await request(app)
        .post(`/api/vocabulary/words/${wordId}/review`)
        .set('Authorization', `Bearer ${authToken}`)
        .send({ isCorrect: true, timeSpent: 5 });

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.progress).toHaveProperty('masteryLevel');
    });

    it('should record review with incorrect answer', async () => {
      const res = await request(app)
        .post(`/api/vocabulary/words/${wordId}/review`)
        .set('Authorization', `Bearer ${authToken}`)
        .send({ isCorrect: false, timeSpent: 5 });

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
    });
  });

  describe('GET /api/vocabulary/progress', () => {
    it('should return user learning progress', async () => {
      const res = await request(app)
        .get('/api/vocabulary/progress')
        .set('Authorization', `Bearer ${authToken}`);

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data).toHaveProperty('totalWords');
      expect(res.body.data).toHaveProperty('learnedWords');
      expect(res.body.data).toHaveProperty('masteredWords');
      expect(res.body.data).toHaveProperty('accuracy');
    });
  });

  describe('GET /api/vocabulary/review/due', () => {
    it('should return due reviews for today', async () => {
      const res = await request(app)
        .get('/api/vocabulary/review/due')
        .set('Authorization', `Bearer ${authToken}`);

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data).toHaveProperty('words');
      expect(res.body.data).toHaveProperty('count');
    });
  });

  describe('GET /api/vocabulary/statistics', () => {
    it('should return learning statistics', async () => {
      const res = await request(app)
        .get('/api/vocabulary/statistics?timeRange=week')
        .set('Authorization', `Bearer ${authToken}`);

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data).toHaveProperty('totalWords');
      expect(res.body.data).toHaveProperty('streakDays');
      expect(res.body.data.timeRange).toBe('week');
    });
  });
});
