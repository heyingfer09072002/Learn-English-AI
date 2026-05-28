import { Request, Response } from 'express';
import { db } from '../database/sqlite.js';
import { asyncHandler } from '../middleware/error.middleware.js';
import type { AuthRequest } from '../middleware/auth.middleware.js';

export const addFavorite = asyncHandler(async (req: AuthRequest, res: Response) => {
  const userId = req.user!.userId;
  const { sentenceId, courseId, note } = req.body;

  if (!sentenceId) {
    return res.status(400).json({ success: false, error: '句子 ID 不能为空' });
  }

  const existing = db.prepare('SELECT id FROM user_favorites WHERE user_id = ? AND sentence_id = ?')
    .get(userId, sentenceId);

  if (existing) {
    db.prepare('UPDATE user_favorites SET note = ?, course_id = ?, updated_at = CURRENT_TIMESTAMP WHERE user_id = ? AND sentence_id = ?')
      .run(note || null, courseId || null, userId, sentenceId);
  } else {
    db.prepare('INSERT INTO user_favorites (user_id, sentence_id, course_id, note) VALUES (?, ?, ?, ?)')
      .run(userId, sentenceId, courseId || null, note || null);
  }

  res.json({ success: true, message: '收藏成功' });
});

export const removeFavorite = asyncHandler(async (req: AuthRequest, res: Response) => {
  const userId = req.user!.userId;
  const { id } = req.params;
  db.prepare('DELETE FROM user_favorites WHERE id = ? AND user_id = ?').run(parseInt(id), userId);
  res.json({ success: true, message: '已取消收藏' });
});

export const getFavorites = asyncHandler(async (req: AuthRequest, res: Response) => {
  const userId = req.user!.userId;
  const courseId = req.query.courseId ? parseInt(req.query.courseId as string) : null;

  const query = courseId ? `
    SELECT f.*, s.english, s.chinese, s.translation, s.grammar_point as grammarPoint, s.difficulty,
           c.title as courseTitle
    FROM user_favorites f
    JOIN sentences s ON f.sentence_id = s.id
    LEFT JOIN courses c ON f.course_id = c.id
    WHERE f.user_id = ? AND f.course_id = ?
    ORDER BY f.created_at DESC` : `
    SELECT f.*, s.english, s.chinese, s.translation, s.grammar_point as grammarPoint, s.difficulty,
           c.title as courseTitle
    FROM user_favorites f
    JOIN sentences s ON f.sentence_id = s.id
    LEFT JOIN courses c ON f.course_id = c.id
    WHERE f.user_id = ?
    ORDER BY f.created_at DESC`;

  const favorites = db.prepare(query).all(courseId ? [userId, courseId] : userId);

  const formatted = favorites.map((f: any) => ({
    ...f,
    sentence: {
      id: f.sentence_id,
      english: f.english,
      chinese: f.chinese,
      translation: f.translation,
      grammarPoint: f.grammarPoint,
      difficulty: f.difficulty,
    },
    course: f.courseTitle ? { id: f.course_id, title: f.courseTitle } : null,
  }));

  res.json({ success: true, data: formatted, total: formatted.length });
});

export const updateNote = asyncHandler(async (req: AuthRequest, res: Response) => {
  const userId = req.user!.userId;
  const { id } = req.params;
  const { note } = req.body;
  db.prepare('UPDATE user_favorites SET note = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ? AND user_id = ?')
    .run(note || null, parseInt(id), userId);
  res.json({ success: true, message: '笔记已更新' });
});

export const getFavoritesStats = asyncHandler(async (req: AuthRequest, res: Response) => {
  const userId = req.user!.userId;
  const stats = db.prepare('SELECT course_id, COUNT(*) as count FROM user_favorites WHERE user_id = ? AND course_id IS NOT NULL GROUP BY course_id').all(userId) as any[];
  const total = db.prepare('SELECT COUNT(*) as count FROM user_favorites WHERE user_id = ?').get(userId) as any;
  
  res.json({
    success: true,
    data: {
      total: total.count,
      byCourse: stats.reduce((acc, s) => ({ ...acc, [s.course_id]: s.count }), {}),
    },
  });
});

export const FavoritesController = {
  addFavorite,
  removeFavorite,
  getFavorites,
  updateNote,
  getFavoritesStats,
};
