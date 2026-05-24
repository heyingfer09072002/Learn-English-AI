import { apiClient } from './index'

export interface Course {
  id: number;
  level: string;
  title: string;
  description: string;
  lessons: number;
  progress: number;
}

export interface Lesson {
  id: number;
  courseId: number;
  title: string;
  description: string;
  sentences: Array<{
    id: number;
    english: string;
    chinese: string;
    phonetic: string;
    audio?: string;
    answer?: string;
    words?: Array<{
      word: string;
      pos: string;
      definition: string;
    }>;
  }>;
}

export const lessonApi = {
  // 获取所有课程
  async getCourses() {
    return apiClient.get('/lessons/courses');
  },

  // 获取课程详情
  async getCourseDetail(courseId: number) {
    return apiClient.get(`/lessons/courses/${courseId}`);
  },

  // 获取课程下的课程
  async getLessonsInCourse(courseId: number) {
    return apiClient.get(`/lessons/courses/${courseId}/lessons`);
  },

  // 获取具体课程
  async getLessonDetail(lessonId: number) {
    return apiClient.get(`/lessons/${lessonId}`);
  },

  // 获取课程句子
  async getLessonSentences(lessonId: number) {
    return apiClient.get(`/lessons/${lessonId}/sentences`);
  }
}
