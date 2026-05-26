import { pool } from '../database/index.js';

/**
 * 课程类型
 */
export type CourseType = 'text' | 'audio' | 'video' | 'music';

/**
 * 课程难度级别
 */
export type CourseDifficulty = 'beginner' | 'intermediate' | 'advanced';

/**
 * 课程状态
 */
export type CourseStatus = 'draft' | 'pending' | 'published';

/**
 * CEFR 语言水平
 */
export type LanguageLevel = 'A1' | 'A2' | 'B1' | 'B2' | 'C1' | 'C2';

/**
 * 课程信息接口
 */
export interface Course {
  id: number;
  title: string;
  description?: string;
  coverImage?: string;
  authorId: number;
  authorName?: string;
  courseType: CourseType;
  difficultyLevel: CourseDifficulty;
  targetAudience?: string;
  languageLevel?: LanguageLevel;
  totalSentences: number;
  estimatedDuration?: number;
  isPublic: boolean;
  status: CourseStatus;
  viewCount: number;
  studyCount: number;
  likeCount: number;
  tags: string[];
  createdAt?: Date;
  updatedAt?: Date;
}

/**
 * 课程查询参数接口
 */
export interface CourseQueryParams {
  courseType?: CourseType;
  difficultyLevel?: CourseDifficulty;
  languageLevel?: LanguageLevel;
  status?: CourseStatus;
  isPublic?: boolean;
  search?: string;
  tags?: string[];
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: 'ASC' | 'DESC';
}

/**
 * 课程创建数据接口
 */
export interface CourseCreateData {
  title: string;
  description?: string;
  coverImage?: string;
  authorId: number;
  courseType: CourseType;
  difficultyLevel: CourseDifficulty;
  targetAudience?: string;
  languageLevel?: LanguageLevel;
  estimatedDuration?: number;
  isPublic?: boolean;
  status?: CourseStatus;
  tags?: string[];
}

/**
 * 课程更新数据接口
 */
export interface CourseUpdateData extends Partial<CourseCreateData> {
  viewCount?: number;
  studyCount?: number;
  likeCount?: number;
  totalSentences?: number;
}

/**
 * 课程统计信息接口
 */
export interface CourseStatistics {
  id: number;
  title: string;
  studyCount: number;
  averageAccuracy?: number;
  averageRating?: number;
  completionRate?: number;
}

/**
 * 课程模型类
 */
export class CourseModel {
  /**
   * 根据 ID 查找课程
   */
  static async findById(id: number): Promise<Course | null> {
    const query = `
      SELECT c.*, u.username as "authorName"
      FROM courses c
      LEFT JOIN users u ON c.author_id = u.id
      WHERE c.id = $1
    `;
    const result = await pool.query(query, [id]);
    return this.mapToCourse(result.rows[0]);
  }

  /**
   * 查找作者的所有课程
   */
  static async findByAuthorId(authorId: number): Promise<Course[]> {
    const query = `
      SELECT c.*, u.username as "authorName"
      FROM courses c
      LEFT JOIN users u ON c.author_id = u.id
      WHERE c.author_id = $1
      ORDER BY c.created_at DESC
    `;
    const result = await pool.query(query, [authorId]);
    return result.rows.map(this.mapToCourse);
  }

  /**
   * 查询课程列表（支持分页、筛选和排序）
   */
  static async findCourses(params: CourseQueryParams): Promise<{
    courses: Course[];
    total: number;
    page: number;
    limit: number;
  }> {
    const page = params.page || 1;
    const limit = params.limit || 20;
    const offset = (page - 1) * limit;

    const conditions: string[] = [];
    const values: any[] = [];
    let paramCount = 1;

    // 只查询已发布的公开课程（除非指定了状态）
    if (!params.status) {
      conditions.push(`c.status = $${paramCount}`);
      values.push('published');
      paramCount++;
    }

    // 只查询公开课程（除非指定了公开性）
    if (params.isPublic === undefined) {
      conditions.push(`c.is_public = $${paramCount}`);
      values.push(true);
      paramCount++;
    }

    if (params.courseType) {
      conditions.push(`c.course_type = $${paramCount}`);
      values.push(params.courseType);
      paramCount++;
    }

    if (params.difficultyLevel) {
      conditions.push(`c.difficulty_level = $${paramCount}`);
      values.push(params.difficultyLevel);
      paramCount++;
    }

    if (params.languageLevel) {
      conditions.push(`c.language_level = $${paramCount}`);
      values.push(params.languageLevel);
      paramCount++;
    }

    if (params.status) {
      conditions.push(`c.status = $${paramCount}`);
      values.push(params.status);
      paramCount++;
    }

    if (params.isPublic !== undefined) {
      conditions.push(`c.is_public = $${paramCount}`);
      values.push(params.isPublic);
      paramCount++;
    }

    if (params.search) {
      conditions.push(`(c.title ILIKE $${paramCount} OR c.description ILIKE $${paramCount})`);
      values.push(`%${params.search}%`);
      paramCount++;
    }

    if (params.tags && params.tags.length > 0) {
      conditions.push(`c.tags && $${paramCount}`);
      values.push(params.tags);
      paramCount++;
    }

    const whereClause = conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : '';

    // 查询总数
    const countQuery = `SELECT COUNT(*) FROM courses c ${whereClause}`;
    const countResult = await pool.query(countQuery, values);
    const total = parseInt(countResult.rows[0].count);

    // 排序
    const sortBy = params.sortBy || 'created_at';
    const sortOrder = params.sortOrder || 'DESC';
    const orderClause = `ORDER BY c.${sortBy} ${sortOrder}`;

    // 查询数据
    const dataQuery = `
      SELECT c.*, u.username as "authorName"
      FROM courses c
      LEFT JOIN users u ON c.author_id = u.id
      ${whereClause}
      ${orderClause}
      LIMIT $${paramCount} OFFSET $${paramCount + 1}
    `;
    values.push(limit, offset);
    const dataResult = await pool.query(dataQuery, values);

    return {
      courses: dataResult.rows.map(this.mapToCourse),
      total,
      page,
      limit,
    };
  }

  /**
   * 创建课程
   */
  static async create(courseData: CourseCreateData): Promise<Course> {
    const query = `
      INSERT INTO courses (
        title, description, cover_image, author_id,
        course_type, difficulty_level, target_audience, language_level,
        estimated_duration, is_public, status, tags
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)
      RETURNING *
    `;

    const values = [
      courseData.title,
      courseData.description || null,
      courseData.coverImage || null,
      courseData.authorId,
      courseData.courseType,
      courseData.difficultyLevel,
      courseData.targetAudience || null,
      courseData.languageLevel || null,
      courseData.estimatedDuration || null,
      courseData.isPublic !== undefined ? courseData.isPublic : false,
      courseData.status || 'draft',
      courseData.tags || [],
    ];

    const result = await pool.query(query, values);
    return this.mapToCourse(result.rows[0]);
  }

  /**
   * 更新课程
   */
  static async update(id: number, courseData: CourseUpdateData): Promise<Course | null> {
    const fields: string[] = [];
    const values: any[] = [];
    let paramCount = 1;

    if (courseData.title !== undefined) {
      fields.push(`title = $${paramCount}`);
      values.push(courseData.title);
      paramCount++;
    }

    if (courseData.description !== undefined) {
      fields.push(`description = $${paramCount}`);
      values.push(courseData.description);
      paramCount++;
    }

    if (courseData.coverImage !== undefined) {
      fields.push(`cover_image = $${paramCount}`);
      values.push(courseData.coverImage);
      paramCount++;
    }

    if (courseData.courseType !== undefined) {
      fields.push(`course_type = $${paramCount}`);
      values.push(courseData.courseType);
      paramCount++;
    }

    if (courseData.difficultyLevel !== undefined) {
      fields.push(`difficulty_level = $${paramCount}`);
      values.push(courseData.difficultyLevel);
      paramCount++;
    }

    if (courseData.targetAudience !== undefined) {
      fields.push(`target_audience = $${paramCount}`);
      values.push(courseData.targetAudience);
      paramCount++;
    }

    if (courseData.languageLevel !== undefined) {
      fields.push(`language_level = $${paramCount}`);
      values.push(courseData.languageLevel);
      paramCount++;
    }

    if (courseData.estimatedDuration !== undefined) {
      fields.push(`estimated_duration = $${paramCount}`);
      values.push(courseData.estimatedDuration);
      paramCount++;
    }

    if (courseData.isPublic !== undefined) {
      fields.push(`is_public = $${paramCount}`);
      values.push(courseData.isPublic);
      paramCount++;
    }

    if (courseData.status !== undefined) {
      fields.push(`status = $${paramCount}`);
      values.push(courseData.status);
      paramCount++;
    }

    if (courseData.tags !== undefined) {
      fields.push(`tags = $${paramCount}`);
      values.push(courseData.tags);
      paramCount++;
    }

    if (courseData.viewCount !== undefined) {
      fields.push(`view_count = $${paramCount}`);
      values.push(courseData.viewCount);
      paramCount++;
    }

    if (courseData.studyCount !== undefined) {
      fields.push(`study_count = $${paramCount}`);
      values.push(courseData.studyCount);
      paramCount++;
    }

    if (courseData.likeCount !== undefined) {
      fields.push(`like_count = $${paramCount}`);
      values.push(courseData.likeCount);
      paramCount++;
    }

    if (courseData.totalSentences !== undefined) {
      fields.push(`total_sentences = $${paramCount}`);
      values.push(courseData.totalSentences);
      paramCount++;
    }

    fields.push(`updated_at = CURRENT_TIMESTAMP`);
    values.push(id);

    const query = `
      UPDATE courses
      SET ${fields.join(', ')}
      WHERE id = $${paramCount}
      RETURNING *
    `;

    const result = await pool.query(query, values);
    return this.mapToCourse(result.rows[0]);
  }

  /**
   * 删除课程
   */
  static async delete(id: number): Promise<boolean> {
    const query = 'DELETE FROM courses WHERE id = $1 RETURNING id';
    const result = await pool.query(query, [id]);
    return result.rowCount !== null && result.rowCount > 0;
  }

  /**
   * 发布课程
   */
  static async publish(id: number): Promise<Course | null> {
    return this.update(id, { status: 'published', isPublic: true });
  }

  /**
   * 下架课程
   */
  static async unpublish(id: number): Promise<Course | null> {
    return this.update(id, { status: 'draft', isPublic: false });
  }

  /**
   * 增加课程浏览量
   */
  static async incrementViewCount(id: number): Promise<void> {
    const query = `
      UPDATE courses
      SET view_count = view_count + 1, updated_at = CURRENT_TIMESTAMP
      WHERE id = $1
    `;
    await pool.query(query, [id]);
  }

  /**
   * 增加课程学习次数
   */
  static async incrementStudyCount(id: number): Promise<void> {
    const query = `
      UPDATE courses
      SET study_count = study_count + 1, updated_at = CURRENT_TIMESTAMP
      WHERE id = $1
    `;
    await pool.query(query, [id]);
  }

  /**
   * 增加课程点赞数
   */
  static async incrementLikeCount(id: number): Promise<void> {
    const query = `
      UPDATE courses
      SET like_count = like_count + 1, updated_at = CURRENT_TIMESTAMP
      WHERE id = $1
    `;
    await pool.query(query, [id]);
  }

  /**
   * 获取热门课程
   */
  static async getPopularCourses(limit: number = 10): Promise<Course[]> {
    const query = `
      SELECT c.*, u.username as "authorName"
      FROM courses c
      LEFT JOIN users u ON c.author_id = u.id
      WHERE c.status = 'published' AND c.is_public = true
      ORDER BY c.study_count DESC, c.view_count DESC
      LIMIT $1
    `;
    const result = await pool.query(query, [limit]);
    return result.rows.map(this.mapToCourse);
  }

  /**
   * 获取最新课程
   */
  static async getLatestCourses(limit: number = 10): Promise<Course[]> {
    const query = `
      SELECT c.*, u.username as "authorName"
      FROM courses c
      LEFT JOIN users u ON c.author_id = u.id
      WHERE c.status = 'published' AND c.is_public = true
      ORDER BY c.created_at DESC
      LIMIT $1
    `;
    const result = await pool.query(query, [limit]);
    return result.rows.map(this.mapToCourse);
  }

  /**
   * 搜索课程
   */
  static async searchCourses(searchTerm: string, limit: number = 20): Promise<Course[]> {
    const query = `
      SELECT c.*, u.username as "authorName"
      FROM courses c
      LEFT JOIN users u ON c.author_id = u.id
      WHERE c.status = 'published' AND c.is_public = true
        AND (c.title ILIKE $1 OR c.description ILIKE $1 OR c.tags && $2)
      ORDER BY c.study_count DESC
      LIMIT $3
    `;
    const result = await pool.query(query, [`%${searchTerm}%`, [`%${searchTerm}%`], limit]);
    return result.rows.map(this.mapToCourse);
  }

  /**
   * 获取课程统计信息
   */
  static async getStatistics(courseId: number): Promise<CourseStatistics | null> {
    const query = `
      SELECT 
        c.id,
        c.title,
        c.study_count as "studyCount",
        AVG(upr.accuracy) as "averageAccuracy",
        COUNT(DISTINCT upr.user_id) as "uniqueLearners"
      FROM courses c
      LEFT JOIN user_practice_records upr ON c.id = upr.course_id
      WHERE c.id = $1
      GROUP BY c.id, c.title, c.study_count
    `;
    
    const result = await pool.query(query, [courseId]);
    if (result.rows.length === 0) return null;

    const row = result.rows[0];
    return {
      id: row.id,
      title: row.title,
      studyCount: row.studyCount,
      averageAccuracy: row.averageAccuracy ? parseFloat(row.averageAccuracy) : undefined,
      completionRate: undefined, // TODO: 需要计算完成率
      averageRating: undefined,  // TODO: 需要计算平均评级
    };
  }

  /**
   * 检查用户是否有权访问课程
   */
  static async checkAccess(courseId: number, userId: number): Promise<boolean> {
    const course = await this.findById(courseId);
    if (!course) return false;

    // 作者可以访问自己的所有课程
    if (course.authorId === userId) return true;

    // 只能访问已发布的公开课程
    return course.status === 'published' && course.isPublic;
  }

  /**
   * 将数据库行映射到 Course 对象
   */
  private static mapToCourse(row: any): Course {
    if (!row) return null!;
    
    return {
      id: row.id,
      title: row.title,
      description: row.description,
      coverImage: row.cover_image,
      authorId: row.author_id,
      authorName: row.authorName,
      courseType: row.course_type as CourseType,
      difficultyLevel: row.difficulty_level as CourseDifficulty,
      targetAudience: row.target_audience,
      languageLevel: row.language_level as LanguageLevel,
      totalSentences: row.total_sentences,
      estimatedDuration: row.estimated_duration,
      isPublic: row.is_public,
      status: row.status as CourseStatus,
      viewCount: row.view_count,
      studyCount: row.study_count,
      likeCount: row.like_count,
      tags: row.tags || [],
      createdAt: row.created_at,
      updatedAt: row.updated_at,
    };
  }
}
