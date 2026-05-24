import { Request, Response } from 'express';
import { asyncHandler } from '../middleware/error.middleware.js';
import { pool } from '../database/index.js';

export const getCourses = asyncHandler(async (req: Request, res: Response) => {
  const result = await pool.query('SELECT * FROM courses ORDER BY order_index');
  
  res.json({
    success: true,
    data: result.rows
  });
});

export const getLessons = asyncHandler(async (req: Request, res: Response) => {
  const result = await pool.query('SELECT * FROM courses ORDER BY order_index');
  
  res.json({
    success: true,
    data: result.rows.map(c => ({
      id: c.id,
      lessons: c.lesson_count,
      level: c.level,
      lessons_count: c.lesson_count,
      title: c.title,
      description: c.description
    }))
  });
});

export const getCourseDetail = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  
  const result = await pool.query(
    'SELECT * FROM courses WHERE id = $1',
    [id]
  );
  
  if (!result.rows.length) {
    return res.status(404).json({
      success: false,
      error: { code: 'NOT_FOUND', message: '课程不存在' }
    });
  }
  
  res.json({
    success: true,
    data: result.rows[0]
  });
});
