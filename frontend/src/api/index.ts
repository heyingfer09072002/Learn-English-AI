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
      // window.location.href = '/login'
    }
    return Promise.reject(error)
  }
)

export const api = {
  async getLessons() {
    return apiClient.get('/lessons')
  },
  async getLessonById(id: string) {
    return apiClient.get(`/lessons/${id}`)
  },
  async getSentences(lessonId: string) {
    return apiClient.get(`/lessons/${lessonId}/sentences`)
  },
  async login(data: { email: string; password: string }) {
    return apiClient.post('/auth/login', data)
  },
  async register(data: { email: string; password: string; username: string }) {
    return apiClient.post('/auth/register', data)
  },
  async getProfile() {
    return apiClient.get('/users/profile')
  },
  async getLearningProgress() {
    return apiClient.get('/users/progress')
  },
  async getStatistics() {
    return apiClient.get('/users/statistics')
  },
  async chat(message: string, context?: string) {
    return apiClient.post('/ai/chat', { message, context })
  },
  async assessWriting(text: string) {
    return apiClient.post('/ai/writing-assessment', { text })
  },
  async analyzeSentence(sentence: string) {
    return apiClient.post('/ai/sentence-analysis', { sentence })
  }
}

export default api
