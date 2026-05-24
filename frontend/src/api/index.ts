import axios from 'axios'

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api'

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json'
  },
  timeout: 30000
})

apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

apiClient.interceptors.response.use(
  (response) => {
    return response.data
  },
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token')
      window.location.href = '/login'
    }
    return Promise.reject(error)
  }
)

export interface User {
  id: number;
  email: string;
  username: string;
  avatar?: string;
  level?: number;
}

export interface Course {
  id: number;
  level: string;
  title: string;
  description: string;
  lessons: number;
  progress: number;
}

export const api = {
  async register(data: { username: string; email: string; password: string }) {
    return apiClient.post('/auth/register', data);
  },

  async login(email: string, password: string) {
    return apiClient.post('/auth/login', { email, password });
  },

  async logout() {
    return apiClient.post('/auth/logout');
  },

  async getUserProfile() {
    return apiClient.get('/users/profile');
  },

  async getUserProgress() {
    return apiClient.get('/users/progress');
  },

  async getVocabularyGroups(type?: string) {
    const url = type ? `/vocabulary/groups?type=${type}` : '/vocabulary/groups';
    return apiClient.get(url);
  },
  
  async getWordsInGroup(groupId: number, page = 1, limit = 20) {
    return apiClient.get(`/vocabulary/groups/${groupId}/words?page=${page}&limit=${limit}`);
  },
  
  async getWordDetail(wordId: number) {
    return apiClient.get(`/vocabulary/words/${wordId}`);
  },
  
  async searchVocabulary(query: string, limit = 20) {
    return apiClient.get(`/vocabulary/words/search?q=${query}&limit=${limit}`);
  },
  
  async recordLearning(wordId: number, action: string, timeSpent = 0) {
    return apiClient.post(`/vocabulary/words/${wordId}/learn`, { action, timeSpent });
  },
  
  async recordReview(wordId: number, isCorrect: boolean, timeSpent = 0) {
    return apiClient.post(`/vocabulary/words/${wordId}/review`, { isCorrect, timeSpent });
  },
  
  async getVocabularyProgress() {
    return apiClient.get('/vocabulary/progress');
  },
  
  async getDueReviews(date?: string) {
    const url = date ? `/vocabulary/review/due?date=${date}` : '/vocabulary/review/due';
    return apiClient.get(url);
  },
  
  async getVocabularyStatistics(timeRange = 'all') {
    return apiClient.get(`/vocabulary/statistics?timeRange=${timeRange}`);
  },

  async getCourses() {
    return apiClient.get('/lessons/courses');
  },
  
  async getCourseDetail(courseId: number) {
    return apiClient.get(`/lessons/courses/${courseId}`);
  },
}

export default api
