<template>
  <div class="min-h-screen bg-gradient-to-br from-indigo-50 to-purple-50 p-8">
    <div class="max-w-6xl mx-auto">
      <!-- 页面标题 -->
      <h1 class="text-3xl font-bold text-gray-800 mb-2">我的学习进度</h1>
      <p class="text-gray-600 mb-8">追踪你的每一分进步</p>

      <!-- 总览统计 -->
      <div class="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div class="bg-white rounded-xl shadow-lg p-6">
          <div class="flex items-center justify-between">
            <div>
              <div class="text-sm text-gray-600 mb-1">已学习课程</div>
              <div class="text-3xl font-bold text-indigo-600">{{ stats.courses }}</div>
            </div>
            <div class="text-4xl">📚</div>
          </div>
        </div>
        
        <div class="bg-white rounded-xl shadow-lg p-6">
          <div class="flex items-center justify-between">
            <div>
              <div class="text-sm text-gray-600 mb-1">已掌握句子</div>
              <div class="text-3xl font-bold text-green-600">{{ stats.sentences }}</div>
            </div>
            <div class="text-4xl">✅</div>
          </div>
        </div>
        
        <div class="bg-white rounded-xl shadow-lg p-6">
          <div class="flex items-center justify-between">
            <div>
              <div class="text-sm text-gray-600 mb-1">总学习时长</div>
              <div class="text-3xl font-bold text-purple-600">{{ stats.minutes }}<span class="text-sm">分钟</span></div>
            </div>
            <div class="text-4xl">⏱️</div>
          </div>
        </div>
        
        <div class="bg-white rounded-xl shadow-lg p-6">
          <div class="flex items-center justify-between">
            <div>
              <div class="text-sm text-gray-600 mb-1">平均准确率</div>
              <div class="text-3xl font-bold text-pink-600">{{ stats.accuracy }}%</div>
            </div>
            <div class="text-4xl">🎯</div>
          </div>
        </div>
      </div>

      <!-- 加载状态 -->
      <div v-if="isLoading" class="text-center py-20">
        <div class="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-500"></div>
        <p class="text-gray-600 mt-4">加载进度数据...</p>
      </div>

      <!-- 课程进度列表 -->
      <template v-else>
        <h2 class="text-xl font-bold text-gray-800 mb-4">课程进度</h2>
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <ProgressCard
            v-for="course in progressList"
            :key="course.courseId"
            :title="course.title"
            :difficulty="course.difficulty"
            :total="course.totalSentences"
            :completed="course.completed"
            :learning="course.learning"
            :last-practiced="course.lastPracticed"
            @continue="goToCourse(course.courseId)"
            @reset="resetProgress(course.courseId)"
          />
        </div>

        <!-- 空状态 -->
        <div v-if="progressList.length === 0" class="text-center py-20 bg-white rounded-xl shadow-lg">
          <div class="text-6xl mb-4">📚</div>
          <h3 class="text-xl font-bold text-gray-800 mb-2">还没有学习记录</h3>
          <p class="text-gray-600 mb-6">快去课程广场开始学习吧！</p>
          <router-link
            to="/courses"
            class="inline-block px-6 py-3 bg-indigo-600 text-white font-bold rounded-lg hover:bg-indigo-700 transition"
          >
            浏览课程
          </router-link>
        </div>
      </template>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { apiGet, apiPost } from '../api/apiClient'
import ProgressCard from '../components/ProgressCard.vue'

const router = useRouter()
const isLoading = ref(true)
const progressList = ref<any[]>([])

const stats = computed(() => {
  const totalCompleted = progressList.value.reduce((sum, c) => sum + c.completed, 0)
  const totalLearning = progressList.value.reduce((sum, c) => sum + c.learning, 0)
  
  return {
    courses: progressList.value.filter(c => c.progress > 0).length,
    sentences: totalCompleted,
    minutes: Math.floor((totalCompleted + totalLearning) * 2), // 假设每个句子 2 分钟
    accuracy: 85 // TODO: 从后端计算
  }
})

async function loadProgress() {
  try {
    const result = await apiGet('/api/progress/all')
    if (result.success && result.data) {
      progressList.value = result.data
    }
  } catch (error) {
    console.error('加载进度失败:', error)
  } finally {
    isLoading.value = false
  }
}

function goToCourse(courseId: number) {
  router.push(`/lesson/${courseId}`)
}

async function resetProgress(courseId: number) {
  if (!confirm('确定要重置这个课程的学习进度吗？')) return
  
  try {
    const result = await apiPost(`/api/progress/course/${courseId}/reset`)
    if (result.success) {
      await loadProgress()
    }
  } catch (error) {
    console.error('重置进度失败:', error)
  }
}

onMounted(() => {
  loadProgress()
})
</script>
