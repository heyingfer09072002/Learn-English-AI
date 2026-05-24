import axios, { AxiosInstance, AxiosRequestConfig } from 'axios'

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api'

export interface ApiResponse<T = any> {
  success: boolean
  data: T
  message?: string
}

class ApiClient {
  private client: AxiosInstance

  constructor() {
    this.client = axios.create({
      baseURL: API_BASE_URL,
      headers: {
        'Content-Type': 'application/json'
      },
      timeout: 30000
    })

    // 请求拦截器
    this.client.interceptors.request.use(
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
    this.client.interceptors.response.use(
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
  }

  // 认证接口
  async register(data: { email: string; password: string; username: string }) {
    return this.client.post<ApiResponse<{ token: string; user: any }>>('/auth/register', data)
  }

  async login(data: { email: string; password: string }) {
    return this.client.post<ApiResponse<{ token: string; user: any }>>('/auth/login', data)
  }

  async logout() {
    return this.client.post<ApiResponse>('/auth/logout')
  }

  // 用户接口
  async getProfile() {
    return this.client.get<ApiResponse>('/users/profile')
  }

  async updateProfile(data: { username?: string; avatar?: string }) {
    return this.client.put<ApiResponse>('/users/profile', data)
  }

  async getLearningProgress() {
    return this.client.get<ApiResponse>('/users/progress')
  }

  async getStatistics() {
    return this.client.get<ApiResponse>('/users/statistics')
  }

  // 课程接口
  async getLessons() {
    return this.client.get<ApiResponse[]>('/lessons')
  }

  async getLessonById(id: string) {
    return this.client.get<ApiResponse>(`/lessons/${id}`)
  }

  async getSentences(lessonId: string) {
    return this.client.get<ApiResponse>(`/lessons/${lessonId}/sentences`)
  }

  async updateLessonProgress(lessonId: string, data: { completed: boolean }) {
    return this.client.post<ApiResponse>(`/lessons/${lessonId}/progress`, data)
  }

  // AI 接口
  async chat(message: string, context?: string) {
    return this.client.post<ApiResponse>('/ai/chat', { message, context })
  }

  async assessWriting(text: string) {
    return this.client.post<ApiResponse>('/ai/writing-assessment', { text })
  }

  async analyzeSentence(sentence: string) {
    return this.client.post<ApiResponse>('/ai/sentence-analysis', { sentence })
  }
}

// 导出单例
export const api = new ApiClient()
export default api
