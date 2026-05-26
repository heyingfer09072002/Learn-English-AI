import { Request, Response, NextFunction } from 'express';
import { CourseModel, CourseCreateData } from '../models/Course.model';
import { SentenceModel } from '../models/Sentence.model';
import { CourseCreatorService } from '../services/course-creator.service';

/**
 * 课程创建请求接口
 */
interface CourseCreateRequest {
  title: string;
  description?: string;
  courseType: 'text' | 'audio' | 'video' | 'music';
  difficultyLevel: 'beginner' | 'intermediate' | 'advanced';
  content?: string;
  tags?: string[];
}

/**
 * 课程控制器
 */
export class CourseController {
  /**
   * 获取课程列表
   * GET /api/courses
   */
  static async getCourses(req: Request, res: Response, next: NextFunction) {
    try {
      const { page, limit, courseType, difficultyLevel, search, sortBy, sortOrder } = req.query;

      const params: any = {
        page: page ? parseInt(page as string) : 1,
        limit: limit ? parseInt(limit as string) : 20,
      };

      if (courseType) params.courseType = courseType as any;
      if (difficultyLevel) params.difficultyLevel = difficultyLevel as any;
      if (search) params.search = search as string;
      if (sortBy) params.sortBy = sortBy as string;
      if (sortOrder) params.sortOrder = sortOrder as 'ASC' | 'DESC';

      const result = await CourseModel.findCourses(params);

      return res.status(200).json({
        success: true,
        data: result,
      });
    } catch (error: any) {
      // 数据库不可用时返回空数据
      if (error.code === 'ECONNREFUSED' || error.message?.includes('connect')) {
        console.warn('⚠️  数据库未连接，返回空课程列表');
        return res.status(200).json({
          success: true,
          data: {
            courses: [],
            total: 0,
            page: 1,
            limit: 20,
          },
        });
      }
      next(error);
    }
  }

  /**
   * 获取课程详情
   * GET /api/courses/:id
   */
  static async getCourseById(req: Request, res: Response, next: NextFunction) {
    try {
      const courseId = parseInt(req.params.id);

      const course = await CourseModel.findById(courseId);
      if (!course) {
        return res.status(404).json({
          success: false,
          error: { message: '课程不存在' },
        });
      }

      // 获取课程中的句子
      const sentences = await SentenceModel.findByCourseId(courseId);

      // 增加浏览量
      await CourseModel.incrementViewCount(courseId);

      return res.status(200).json({
        success: true,
        data: {
          course,
          sentences,
        },
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * 创建课程
   * POST /api/courses
   */
  static async createCourse(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = (req as any).user?.id;
      if (!userId) {
        return res.status(401).json({
          success: false,
          error: { message: '未登录' },
        });
      }

      const { title, description, courseType, difficultyLevel, content, tags }: CourseCreateRequest = req.body;

      // 验证必填字段
      if (!title || !courseType || !difficultyLevel) {
        return res.status(400).json({
          success: false,
          error: { message: '缺少必填字段' },
        });
      }

      // 自动分句和处理内容
      let sentences = [];
      let estimatedDuration = 0;

      if (content) {
        sentences = await CourseCreatorService.splitTextIntoSentences(content);
        const avgWordCount = sentences.reduce((sum, s) => sum + CourseCreatorService.countWords(s.contentEn), 0) / sentences.length;
        estimatedDuration = CourseCreatorService.estimateDuration(sentences.length, avgWordCount);
      }

      // 创建课程
      const courseData: CourseCreateData = {
        title,
        description,
        authorId: userId,
        courseType,
        difficultyLevel,
        estimatedDuration,
        tags,
        status: 'draft',
        isPublic: false,
      };

      const course = await CourseModel.create(courseData);

      // 批量创建句子
      if (sentences.length > 0) {
        const sentenceData = sentences.map((s, index) => ({
          courseId: course.id,
          contentEn: s.contentEn,
          contentCn: s.contentCn,
          sortOrder: s.sortOrder,
        }));
        await SentenceModel.batchInsert(sentenceData);
      }

      // 更新课程的句子总数
      await SentenceModel.updateCourseTotalSentences(course.id);

      return res.status(201).json({
        success: true,
        data: course,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * 更新课程
   * PUT /api/courses/:id
   */
  static async updateCourse(req: Request, res: Response, next: NextFunction) {
    try {
      const courseId = parseInt(req.params.id);
      const userId = (req as any).user?.id;

      // 检查权限
      const course = await CourseModel.findById(courseId);
      if (!course) {
        return res.status(404).json({
          success: false,
          error: { message: '课程不存在' },
        });
      }

      if (course.authorId !== userId) {
        return res.status(403).json({
          success: false,
          error: { message: '无权限修改此课程' },
        });
      }

      const updates = req.body;
      const updatedCourse = await CourseModel.update(courseId, updates);

      return res.status(200).json({
        success: true,
        data: updatedCourse,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * 删除课程
   * DELETE /api/courses/:id
   */
  static async deleteCourse(req: Request, res: Response, next: NextFunction) {
    try {
      const courseId = parseInt(req.params.id);
      const userId = (req as any).user?.id;

      const course = await CourseModel.findById(courseId);
      if (!course) {
        return res.status(404).json({
          success: false,
          error: { message: '课程不存在' },
        });
      }

      if (course.authorId !== userId) {
        return res.status(403).json({
          success: false,
          error: { message: '无权限删除此课程' },
        });
      }

      const deleted = await CourseModel.delete(courseId);

      return res.status(200).json({
        success: true,
        data: { deleted },
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * 发布课程
   * POST /api/courses/:id/publish
   */
  static async publishCourse(req: Request, res: Response, next: NextFunction) {
    try {
      const courseId = parseInt(req.params.id);

      const updatedCourse = await CourseModel.publish(courseId);
      if (!updatedCourse) {
        return res.status(404).json({
          success: false,
          error: { message: '课程不存在' },
        });
      }

      return res.status(200).json({
        success: true,
        data: updatedCourse,
      });
    } catch (error) {
      next(error);
    }
  }
}
