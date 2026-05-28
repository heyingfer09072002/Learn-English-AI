import { Request, Response } from 'express';
import { db } from '../database/sqlite.js';

export class CourseControllerSQLite {
  static getCourses(req: Request, res: Response) {
    try {
      const courses = db.prepare(`
        SELECT 
          c.*,
          (SELECT COUNT(*) FROM sentences WHERE course_id = c.id) as sentence_count
        FROM courses c
        ORDER BY c.created_at DESC
      `).all();
      
      res.json({
        success: true,
        data: courses,
        total: courses.length
      });
    } catch (error: any) {
      console.error('获取课程失败:', error.message);
      res.status(500).json({
        success: false,
        error: '获取课程失败'
      });
    }
  }

  static getCourseById(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const course = db.prepare('SELECT * FROM courses WHERE id = ?').get(id);
      
      if (!course) {
        return res.status(404).json({
          success: false,
          error: '课程不存在'
        });
      }
      
      const sentences = db.prepare(`
        SELECT * FROM sentences WHERE course_id = ? ORDER BY id ASC
      `).all(id);
      
      res.json({
        success: true,
        data: {
          ...course,
          sentences
        }
      });
    } catch (error: any) {
      console.error('获取课程详情失败:', error.message);
      res.status(500).json({
        success: false,
        error: '获取课程详情失败'
      });
    }
  }
}
