import axios from 'axios'

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api'

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json'
  },
  timeout: 30000
})

// 请求拦截器
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

// 响应拦截器
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

// 词汇学习相关接口
export interface User {
  id: number;
  email: string;
  username: string;
  avatar?: string;
  level?: number;
}

export interface VocabularyGroup {
  id: number;
  name: string;
  description: string;
  categoryType: string;
  categoryValue: string;
  wordCount: number;
  learnedCount: number;
  masteryRate: number;
}

export interface Word {
  id: number;
  word: string;
  phoneticUk?: string;
  phoneticUs?: string;
  difficultyLevel?: number;
  frequencyLevel?: 'high' | 'medium' | 'low';
}

export interface WordDetail extends Word {
  pos?: Array<{
    pos: string;
    definitionCn: string[];
    definitionEn?: string;
    rootAffix?: string;
    memoryTip?: string;
  }>;
  sentences?: Array<{
    sentenceEn: string;
    sentenceCn: string;
    audioUrl?: string;
  }>;
  synonyms?: string[];
  antonyms?: string[];
}

export interface LearningProgress {
  totalWords: number;
  learnedWords: number;
  masteredWords: number;
  reviewDueToday: number;
  totalLearnTime: number;
  accuracy: number;
  streakDays: number;
}

export const api = {
  // 认证相关接口
  async register(data: { username: string; email: string; password: string }) {
    return apiClient.post('/auth/register', data);
  },

  async login(email: string, password: string) {
    return apiClient.post('/auth/login', { email, password });
  },

  async logout() {
    return apiClient.post('/auth/logout');
  },

  // 用户相关接口
  async getUserProfile() {
    return apiClient.get('/users/profile');
  },

  async getUserProgress() {
    return apiClient.get('/users/progress');
  },

  // 词汇学习相关接口
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
}

export default api
