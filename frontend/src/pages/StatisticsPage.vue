<template>
  <div class="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 p-8">
    <div class="max-w-7xl mx-auto">
      <h1 class="text-3xl font-bold text-gray-800 mb-2">学习统计</h1>
      <p class="text-gray-600 mb-8">用数据见证你的成长</p>

      <!-- 加载状态 -->
      <div v-if="isLoading" class="text-center py-20">
        <div class="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
        <p class="text-gray-600 mt-4">加载统计数据...</p>
      </div>

      <template v-else>
        <!-- 等级卡片 -->
        <LevelCard
          :level-info="levelInfo"
          :achievements-unlocked="achievementsUnlocked"
          class="mb-8"
        />

        <!-- 总览卡片 -->
        <div class="grid grid-cols-2 md:grid-cols-4 gap-6 mb-8">
          <div class="bg-white rounded-xl shadow-lg p-6">
            <div class="text-sm text-gray-600 mb-1">已学课程</div>
            <div class="text-3xl font-bold text-blue-600">{{ overview.coursesLearned }}</div>
          </div>
          <div class="bg-white rounded-xl shadow-lg p-6">
            <div class="text-sm text-gray-600 mb-1">已学句子</div>
            <div class="text-3xl font-bold text-green-600">{{ overview.sentencesLearned }}</div>
          </div>
          <div class="bg-white rounded-xl shadow-lg p-6">
            <div class="text-sm text-gray-600 mb-1">已掌握</div>
            <div class="text-3xl font-bold text-purple-600">{{ overview.sentencesMastered }}</div>
          </div>
          <div class="bg-white rounded-xl shadow-lg p-6">
            <div class="text-sm text-gray-600 mb-1">平均准确率</div>
            <div class="text-3xl font-bold text-orange-600">{{ overview.avgAccuracy }}%</div>
          </div>
        </div>

        <!-- 学习时长和打卡 -->
        <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div class="bg-white rounded-xl shadow-lg p-6">
            <div class="flex items-center gap-3 mb-2">
              <span class="text-3xl">⏱️</span>
              <div>
                <div class="text-sm text-gray-600">总学习时长</div>
                <div class="text-2xl font-bold text-gray-800">
                  {{ overview.learningTime.hours }}小时{{ overview.learningTime.minutes }}分钟
                </div>
              </div>
            </div>
          </div>
          <div class="bg-white rounded-xl shadow-lg p-6">
            <div class="flex items-center gap-3 mb-2">
              <span class="text-3xl">🔥</span>
              <div>
                <div class="text-sm text-gray-600">最大连续打卡</div>
                <div class="text-2xl font-bold text-gray-800">{{ overview.maxStreak }}天</div>
              </div>
            </div>
          </div>
          <div class="bg-white rounded-xl shadow-lg p-6">
            <div class="flex items-center gap-3 mb-2">
              <span class="text-3xl">⭐</span>
              <div>
                <div class="text-sm text-gray-600">总打卡天数</div>
                <div class="text-2xl font-bold text-gray-800">{{ overview.checkinDays }}天</div>
              </div>
            </div>
          </div>
        </div>

        <!-- 学习趋势图 -->
        <div class="bg-white rounded-xl shadow-lg p-6 mb-8">
          <h2 class="text-xl font-bold text-gray-800 mb-4">📈 学习趋势（近 30 天）</h2>
          <div class="h-64 flex items-end gap-2">
            <div
              v-for="(day, idx) in trendData"
              :key="idx"
              class="flex-1 flex flex-col items-center"
            >
              <div
                class="w-full bg-blue-500 rounded-t transition-all"
                :style="{ height: `${(day.count / maxCount) * 100}%`, minHeight: '4px' }"
              ></div>
              <div class="text-xs text-gray-500 mt-2">{{ day.date.slice(5) }}</div>
            </div>
          </div>
        </div>

        <!-- 课程进度 -->
        <div class="bg-white rounded-xl shadow-lg p-6 mb-8">
          <h2 class="text-xl font-bold text-gray-800 mb-4">📚 课程进度</h2>
          <div class="space-y-4">
            <div
              v-for="course in courseData"
              :key="course.courseId"
              class="flex items-center gap-4"
            >
              <div class="w-32 text-sm font-bold text-gray-700 truncate">{{ course.title }}</div>
              <div class="flex-1 h-4 bg-gray-200 rounded-full overflow-hidden">
                <div
                  class="h-full bg-gradient-to-r from-blue-500 to-purple-500"
                  :style="{ width: `${course.progress}%` }"
                ></div>
              </div>
              <div class="text-sm text-gray-600 w-20">{{ course.progress }}%</div>
            </div>
          </div>
        </div>

        <!-- 难度分布 -->
        <div class="bg-white rounded-xl shadow-lg p-6">
          <h2 class="text-xl font-bold text-gray-800 mb-4">🎯 难度分布</h2>
          <div class="grid grid-cols-2 md:grid-cols-5 gap-4">
            <div
              v-for="item in difficultyData"
              :key="item.difficulty"
              class="text-center p-4 rounded-lg bg-gray-50"
            >
              <div class="text-2xl mb-2">{{ getDifficultyIcon(item.difficulty) }}</div>
              <div class="text-sm text-gray-600 mb-1">{{ formatDifficulty(item.difficulty) }}</div>
              <div class="text-xl font-bold text-gray-800">{{ item.count }}句</div>
              <div class="text-xs text-green-600">掌握{{ item.percent }}%</div>
            </div>
          </div>
        </div>
      </template>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { apiGet } from '../api/apiClient'
import LevelCard from '../components/LevelCard.vue'

const isLoading = ref(true)
const levelInfo = ref<any>({
  level: 1,
  title: '英语新手',
  experience: 0,
  icon: '👶',
  percent: 0,
  expNeeded: 0,
  expToNextLevel: 0,
  nextLevel: null,
})
const achievementsUnlocked = ref(0)
const overview = ref<any>({
  coursesLearned: 0,
  sentencesLearned: 0,
  sentencesMastered: 0,
  avgAccuracy: 0,
  learningTime: { hours: 0, minutes: 0 },
  maxStreak: 0,
  checkinDays: 0,
})
const trendData = ref<any[]>([])
const courseData = ref<any[]>([])
const difficultyData = ref<any[]>([])

const maxCount = computed(() => {
  return Math.max(...trendData.value.map(d => d.count), 1)
})

function formatDifficulty(diff: string) {
  const map: Record<string, string> = {
    beginner: '入门',
    elementary: '基础',
    intermediate: '中级',
    upperIntermediate: '中高级',
    advanced: '高级',
  }
  return map[diff] || diff
}

function getDifficultyIcon(diff: string) {
  const icons: Record<string, string> = {
    beginner: '👶',
    elementary: '📖',
    intermediate: '📚',
    upperIntermediate: '🎓',
    advanced: '🏆',
  }
  return icons[diff] || '📌'
}

async function loadStatistics() {
  try {
    const [levelRes, overviewRes, trendRes, courseRes, difficultyRes] = await Promise.all([
      apiGet('/api/achievements/level'),
      apiGet('/api/statistics/overview'),
      apiGet('/api/statistics/trend?days=30'),
      apiGet('/api/statistics/courses'),
      apiGet('/api/statistics/difficulty'),
    ])

    if (levelRes.success) {
      levelInfo.value = levelRes.data
      achievementsUnlocked.value = levelRes.data.newAchievements?.length || 0
    }
    if (overviewRes.success) overview.value = overviewRes.data
    if (trendRes.success) trendData.value = trendRes.data.slice(-15)
    if (courseRes.success) courseData.value = courseRes.data.slice(0, 5)
    if (difficultyRes.success) difficultyData.value = difficultyRes.data
  } catch (error) {
    console.error('加载统计失败:', error)
  } finally {
    isLoading.value = false
  }
}

onMounted(() => {
  loadStatistics()
})
</script>
