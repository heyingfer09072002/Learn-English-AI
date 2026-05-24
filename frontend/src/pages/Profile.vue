<template>
  <div class="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 py-8">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <!-- 页面标题 -->
      <div class="mb-8">
        <h1 class="text-4xl font-bold text-white mb-2">个人中心</h1>
        <p class="text-gray-400">管理您的学习进度和个人信息</p>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <!-- 左侧：用户信息卡片 -->
        <div class="lg:col-span-1">
          <div class="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20">
            <!-- 头像和基本信息 -->
            <div class="text-center mb-6">
              <div class="w-24 h-24 mx-auto mb-4 rounded-full bg-gradient-to-br from-purple-400 to-pink-400 flex items-center justify-center text-4xl font-bold text-white">
                {{ userInitials }}
              </div>
              <h2 class="text-2xl font-bold text-white">{{ user?.username || '用户' }}</h2>
              <p class="text-gray-400 text-sm mt-1">{{ user?.email }}</p>
              <div class="mt-3 inline-flex items-center px-3 py-1 rounded-full bg-purple-500/20 border border-purple-500/30">
                <span class="text-purple-300 text-sm">{{ levelBadge }}</span>
              </div>
            </div>

            <!-- 统计数据 -->
            <div class="space-y-4">
              <div class="bg-white/5 rounded-xl p-4">
                <div class="flex items-center justify-between">
                  <div class="flex items-center space-x-3">
                    <div class="w-10 h-10 rounded-lg bg-blue-500/20 flex items-center justify-center">
                      <svg class="w-5 h-5 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253m9 11.747c1.168-.776 2.754-1.253 4.5-1.253s3.332.477 4.5 1.253M3 6.253C4.168 5.477 5.754 5 7.5 5s3.332.477 4.5 1.253"/>
                      </svg>
                    </div>
                    <div>
                      <p class="text-gray-400 text-xs">学习天数</p>
                      <p class="text-white font-bold text-lg">{{ statistics?.learningDays || 0 }}</p>
                    </div>
                  </div>
                </div>
              </div>

              <div class="bg-white/5 rounded-xl p-4">
                <div class="flex items-center justify-between">
                  <div class="flex items-center space-x-3">
                    <div class="w-10 h-10 rounded-lg bg-green-500/20 flex items-center justify-center">
                      <svg class="w-5 h-5 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
                      </svg>
                    </div>
                    <div>
                      <p class="text-gray-400 text-xs">完成课程</p>
                      <p class="text-white font-bold text-lg">{{ statistics?.completedLessons || 0 }}</p>
                    </div>
                  </div>
                </div>
              </div>

              <div class="bg-white/5 rounded-xl p-4">
                <div class="flex items-center justify-between">
                  <div class="flex items-center space-x-3">
                    <div class="w-10 h-10 rounded-lg bg-yellow-500/20 flex items-center justify-center">
                      <svg class="w-5 h-5 text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"/>
                      </svg>
                    </div>
                    <div>
                      <p class="text-gray-400 text-xs">掌握词汇</p>
                      <p class="text-white font-bold text-lg">{{ statistics?.vocabularyCount || 0 }}</p>
                    </div>
                  </div>
                </div>
              </div>

              <div class="bg-white/5 rounded-xl p-4">
                <div class="flex items-center justify-between">
                  <div class="flex items-center space-x-3">
                    <div class="w-10 h-10 rounded-lg bg-purple-500/20 flex items-center justify-center">
                      <svg class="w-5 h-5 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"/>
                      </svg>
                    </div>
                    <div>
                      <p class="text-gray-400 text-xs">总学习时长</p>
                      <p class="text-white font-bold text-lg">{{ formatMinutes(statistics?.totalTime || 0) }}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- 退出登录按钮 -->
            <button
              @click="handleLogout"
              class="w-full mt-6 py-3 px-4 bg-red-500/20 hover:bg-red-500/30 border border-red-500/30 rounded-xl text-red-300 font-medium transition-all duration-200 flex items-center justify-center space-x-2"
            >
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"/>
              </svg>
              <span>退出登录</span>
            </button>
          </div>
        </div>

        <!-- 右侧：学习进度和成就 -->
        <div class="lg:col-span-2 space-y-6">
          <!-- 学习进度 -->
          <div class="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20">
            <h3 class="text-xl font-bold text-white mb-4">学习进度</h3>
            
            <!-- 进度概览 -->
            <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <div class="bg-white/5 rounded-xl p-4">
                <div class="flex items-center justify-between mb-2">
                  <span class="text-gray-400 text-sm">总课程数</span>
                  <svg class="w-5 h-5 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253m9 11.747c1.168-.776 2.754-1.253 4.5-1.253s3.332.477 4.5 1.253M3 6.253C4.168 5.477 5.754 5 7.5 5s3.332.477 4.5 1.253"/>
                  </svg>
                </div>
                <p class="text-2xl font-bold text-white">{{ totalLessons }}</p>
              </div>
              
              <div class="bg-white/5 rounded-xl p-4">
                <div class="flex items-center justify-between mb-2">
                  <span class="text-gray-400 text-sm">进行中</span>
                  <svg class="w-5 h-5 text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/>
                  </svg>
                </div>
                <p class="text-2xl font-bold text-white">{{ inProgressLessons }}</p>
              </div>
              
              <div class="bg-white/5 rounded-xl p-4">
                <div class="flex items-center justify-between mb-2">
                  <span class="text-gray-400 text-sm">完成率</span>
                  <svg class="w-5 h-5 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z"/>
                  </svg>
                </div>
                <p class="text-2xl font-bold text-white">{{ completionRate }}%</p>
              </div>
            </div>

            <!-- 课程列表 -->
            <div class="space-y-3">
              <h4 class="text-lg font-semibold text-white">我的课程</h4>
              <div v-if="loading" class="text-center py-8">
                <div class="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
              </div>
              <div v-else-if="lessons.length === 0" class="text-center py-8">
                <p class="text-gray-400">暂无学习记录</p>
              </div>
              <div v-else class="space-y-3">
                <div
                  v-for="lesson in lessons"
                  :key="lesson.id"
                  class="bg-white/5 rounded-xl p-4 hover:bg-white/10 transition-all duration-200 cursor-pointer"
                  @click="navigateToLesson(lesson.id)"
                >
                  <div class="flex items-center justify-between">
                    <div class="flex items-center space-x-4 flex-1">
                      <div class="w-12 h-12 rounded-lg bg-gradient-to-br from-purple-400 to-pink-400 flex items-center justify-center text-xl">
                        {{ lesson.icon || '📚' }}
                      </div>
                      <div class="flex-1">
                        <h5 class="text-white font-semibold">{{ lesson.title }}</h5>
                        <p class="text-gray-400 text-sm mt-1">{{ lesson.description }}</p>
                        <div class="flex items-center space-x-4 mt-2">
                          <span class="text-xs text-gray-500">{{ getLevelName(lesson.level) }}</span>
                          <span class="text-xs text-gray-500">{{ lesson.sentences?.length || 0 }} 个句子</span>
                        </div>
                      </div>
                    </div>
                    
                    <div class="flex items-center space-x-3">
                      <!-- 进度条 -->
                      <div class="w-32">
                        <div class="flex items-center justify-between mb-1">
                          <span class="text-xs text-gray-400">进度</span>
                          <span class="text-xs text-white font-medium">{{ getProgress(lesson.id) }}%</span>
                        </div>
                        <div class="w-full h-2 bg-white/10 rounded-full overflow-hidden">
                          <div
                            class="h-full bg-gradient-to-r from-purple-400 to-pink-400 transition-all duration-300"
                            :style="{ width: `${getProgress(lesson.id)}%` }"
                          ></div>
                        </div>
                      </div>
                      
                      <svg class="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/>
                      </svg>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- 学习成就 -->
          <div class="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20">
            <h3 class="text-xl font-bold text-white mb-4">学习成就</h3>
            <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div
                v-for="achievement in achievements"
                :key="achievement.id"
                class="bg-white/5 rounded-xl p-4 text-center hover:bg-white/10 transition-all duration-200"
                :class="{ 'opacity-50': !achievement.unlocked }"
              >
                <div class="text-4xl mb-2">{{ achievement.icon }}</div>
                <h5 class="text-white font-semibold text-sm">{{ achievement.name }}</h5>
                <p class="text-gray-400 text-xs mt-1">{{ achievement.description }}</p>
                <div
                  v-if="achievement.unlocked"
                  class="mt-2 inline-flex items-center px-2 py-1 rounded-full bg-green-500/20 border border-green-500/30"
                >
                  <span class="text-green-300 text-xs">已解锁</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { api } from '@/api'

interface User {
  id: number
  email: string
  username: string
  avatar?: string
  level: string
}

interface Lesson {
  id: number
  title: string
  description: string
  level: string
  icon?: string
  sentences?: any[]
}

interface Statistics {
  learningDays: number
  completedLessons: number
  vocabularyCount: number
  totalTime: number
}

interface Achievement {
  id: number
  name: string
  description: string
  icon: string
  unlocked: boolean
}

const router = useRouter()
const user = ref<User | null>(null)
const statistics = ref<Statistics | null>(null)
const lessons = ref<Lesson[]>([])
const loading = ref(true)

// 成就列表
const achievements = ref<Achievement[]>([
  { id: 1, name: '初学者', description: '完成第一个课程', icon: '🎓', unlocked: true },
  { id: 2, name: '词汇大师', description: '掌握 100 个词汇', icon: '📚', unlocked: false },
  { id: 3, name: '持之以恒', description: '连续学习 7 天', icon: '🔥', unlocked: false },
  { id: 4, name: '口语达人', description: '完成 50 次对话练习', icon: '💬', unlocked: false },
])

// 用户首字母
const userInitials = computed(() => {
  if (!user.value?.username) return 'U'
  return user.value.username.charAt(0).toUpperCase()
})

// 等级徽章
const levelBadge = computed(() => {
  const level = user.value?.level || 'beginner'
  const levelMap: Record<string, string> = {
    beginner: '初级',
    intermediate: '中级',
    advanced: '高级',
  }
  return levelMap[level] || '初级'
})

// 总课程数
const totalLessons = computed(() => lessons.value.length)

// 进行中课程数
const inProgressLessons = computed(() => {
  return lessons.value.filter(l => getProgress(l.id) > 0 && getProgress(l.id) < 100).length
})

// 完成率
const completionRate = computed(() => {
  if (lessons.value.length === 0) return 0
  const completed = lessons.value.filter(l => getProgress(l.id) === 100).length
  return Math.round((completed / lessons.value.length) * 100)
})

// 获取进度
const getProgress = (lessonId: number) => {
  // TODO: 从后端获取实际进度
  return Math.floor(Math.random() * 100)
}

// 格式化分钟数
const formatMinutes = (minutes: number) => {
  if (minutes < 60) return `${minutes}分钟`
  const hours = Math.floor(minutes / 60)
  const mins = minutes % 60
  return `${hours}小时${mins}分钟`
}

// 获取等级名称
const getLevelName = (level: string) => {
  const levelMap: Record<string, string> = {
    beginner: '初级',
    intermediate: '中级',
    advanced: '高级',
  }
  return levelMap[level] || '初级'
}

// 导航到课程
const navigateToLesson = (lessonId: number) => {
  router.push(`/lesson/${lessonId}`)
}

// 退出登录
const handleLogout = () => {
  localStorage.removeItem('token')
  router.push('/')
}

// 加载用户数据
const loadUserData = async () => {
  try {
    const [profileResp, progressResp, statsResp, lessonsResp] = await Promise.all([
      api.getProfile().catch(() => null),
      api.getLearningProgress().catch(() => null),
      api.getStatistics().catch(() => null),
      api.getLessons().catch(() => ({ data: { success: true, data: [] } })),
    ])

    if (profileResp?.success) {
      user.value = profileResp.data
    }

    if (progressResp?.success) {
      statistics.value = progressResp.data
    }

    if (statsResp?.success) {
      statistics.value = { ...statistics.value, ...statsResp.data }
    }

    if (lessonsResp?.success) {
      lessons.value = lessonsResp.data || []
    }
  } catch (error) {
    console.error('Failed to load user data:', error)
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  loadUserData()
})
</script>
