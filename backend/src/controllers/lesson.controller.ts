import { Request, Response } from 'express';
import { asyncHandler } from '../middleware/error.middleware.js';
import { pool } from '../database/index.js';

// 获取所有课程
export const getCourses = asyncHandler(async (req: Request, res: Response) => {
  const result = await pool.query('SELECT * FROM courses ORDER BY order_index');
  
  res.json({
    success: true,
    data: result.rows
  });
});

// 获取课程详情
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

// 获取课程信息（兼容旧 API）
export const getLessons = asyncHandler(async (req: Request, res: Response) => {
  const result = await pool.query('SELECT * FROM courses ORDER BY order_index');
  
  res.json({
    success: true,
    data: result.rows.map(c => ({
      id: c.id,
      level: c.level,
      title: c.title,
      description: c.description,
      lessons: c.lesson_count,
      progress: c.progress || 0
    }))
  });
});
