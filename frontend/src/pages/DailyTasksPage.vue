<template>
  <div class="min-h-screen bg-gradient-to-br from-orange-50 to-yellow-50 p-8">
    <div class="max-w-4xl mx-auto">
      <!-- 页面标题 -->
      <h1 class="text-3xl font-bold text-gray-800 mb-2">每日任务</h1>
      <p class="text-gray-600 mb-8">完成每日目标，养成学习习惯</p>

      <!-- 加载状态 -->
      <div v-if="isLoading" class="text-center py-20">
        <div class="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500"></div>
        <p class="text-gray-600 mt-4">加载任务...</p>
      </div>

      <!-- 错误状态 -->
      <div v-else-if="error" class="text-center py-20">
        <div class="text-6xl mb-4">⚠️</div>
        <p class="text-gray-600 mb-4">{{ error }}</p>
        <router-link to="/auth/login" class="px-6 py-3 bg-orange-600 text-white font-bold rounded-lg hover:bg-orange-700 transition">
          去登录
        </router-link>
      </div>

      <template v-else>
        <!-- 打卡状态栏 -->
        <div class="bg-gradient-to-r from-orange-500 to-yellow-500 rounded-xl shadow-lg p-6 mb-8 text-white">
          <div class="flex items-center justify-between">
            <div>
              <div class="text-sm opacity-90 mb-1">📅 {{ date }}</div>
              <div class="text-2xl font-bold">连续打卡 {{ streak }} 天</div>
            </div>
            <div class="flex items-center gap-6">
              <div class="text-center">
                <div class="text-3xl font-bold">{{ points.available }}</div>
                <div class="text-sm opacity-90">可用积分</div>
              </div>
              <button
                v-if="!hasCheckin"
                @click="doCheckin"
                class="px-6 py-3 bg-white text-orange-600 font-bold rounded-lg hover:bg-opacity-90 transition shadow-lg"
              >
                🔥 立即打卡
              </button>
              <div v-else class="px-6 py-3 bg-white text-green-600 font-bold rounded-lg">
                ✅ 已打卡
              </div>
            </div>
          </div>
        </div>

        <!-- 任务列表 -->
        <div class="space-y-4">
          <div
            v-for="task in tasks"
            :key="task.id"
            class="bg-white rounded-xl shadow-lg p-6 transition"
            :class="{ 'opacity-75': task.is_completed }"
          >
            <div class="flex items-start justify-between mb-4">
              <div class="flex-1">
                <div class="flex items-center gap-3 mb-2">
                  <span class="text-2xl">{{ getTaskIcon(task.task_type) }}</span>
                  <div>
                    <h3 class="font-bold text-lg text-gray-800">{{ task.title }}</h3>
                    <p class="text-sm text-gray-600">{{ task.description }}</p>
                  </div>
                </div>
              </div>
              <div class="text-right">
                <div class="text-2xl font-bold text-orange-600">{{ task.points }} 分</div>
                <div v-if="task.is_completed" class="text-sm text-green-600 font-bold">✅ 已完成</div>
              </div>
            </div>

            <!-- 进度条 -->
            <div class="mb-3">
              <div class="flex items-center justify-between text-sm text-gray-600 mb-2">
                <span>进度</span>
                <span>{{ task.progress }} / {{ task.total }}</span>
              </div>
              <div class="h-3 bg-gray-200 rounded-full overflow-hidden">
                <div
                  class="h-full bg-gradient-to-r from-orange-500 to-yellow-500 transition-all duration-500"
                  :style="{ width: `${task.percent}%` }"
                ></div>
              </div>
            </div>

            <!-- 完成按钮 -->
            <button
              v-if="!task.is_completed"
              @click="completeTask(task)"
              class="w-full py-2 bg-orange-100 text-orange-700 font-bold rounded-lg hover:bg-orange-200 transition"
            >
              完成 {{ task.progressIncrement || 1 }} 个 → 获得 {{ task.points }} 分
            </button>
            <div v-else class="text-center py-2 text-green-600 font-bold">
              🎉 已领取奖励
            </div>
          </div>
        </div>

        <!-- 积分记录 -->
        <div class="mt-8 bg-white rounded-xl shadow-lg p-6">
          <h2 class="text-xl font-bold text-gray-800 mb-4">💰 积分记录</h2>
          <div class="space-y-2">
            <div
              v-for="log in recentHistory"
              :key="log.id"
              class="flex items-center justify-between py-2 border-b border-gray-100"
            >
              <div>
                <div class="text-sm font-bold text-gray-800">{{ log.description }}</div>
                <div class="text-xs text-gray-500">{{ formatDate(log.created_at) }}</div>
              </div>
              <div class="text-green-600 font-bold">+{{ log.points }}</div>
            </div>
            <div v-if="recentHistory.length === 0" class="text-center text-gray-500 py-4">
              暂无积分记录
            </div>
          </div>
        </div>
      </template>
    </div>
    
    <!-- 成就弹窗和经验动画 -->
    <AchievementPopup ref="achievementPopup" />
    <ExpAnimation ref="expAnimation" />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { apiGet, apiPost } from '../api/apiClient'
import AchievementPopup from '../components/AchievementPopup.vue'
import ExpAnimation from '../components/ExpAnimation.vue'

const isLoading = ref(true)
const error = ref('')
const date = ref('')
const tasks = ref<any[]>([])
const points = ref({ total: 0, available: 0 })
const streak = ref(0)
const hasCheckin = ref(false)
const recentHistory = ref<any[]>([])
const achievementPopup = ref<any>(null)
const expAnimation = ref<any>(null)

const taskIcons: Record<string, string> = {
  learn_sentences: '📖',
  practice_speaking: '🎤',
  review_favorites: '⭐',
  complete_lesson: '🎯',
}

function getTaskIcon(type: string) {
  return taskIcons[type] || '📌'
}

function formatDate(dateStr: string) {
  const date = new Date(dateStr)
  const now = new Date()
  const diff = now.getTime() - date.getTime()
  const minutes = Math.floor(diff / (1000 * 60))
  const hours = Math.floor(diff / (1000 * 60 * 60))
  
  if (minutes < 60) return `${minutes}分钟前`
  if (hours < 24) return `${hours}小时前`
  return date.toLocaleDateString('zh-CN')
}

async function loadTasks() {
  try {
    const result = await apiGet('/api/daily-tasks')
    if (result.success && result.data) {
      date.value = result.data.date
      tasks.value = result.data.tasks
      points.value = result.data.points
      streak.value = result.data.streak
      hasCheckin.value = result.data.hasCheckin
      isLoading.value = false
    } else {
      // API 返回失败（可能是认证失败）
      console.error('加载任务失败:', result.error)
      error.value = result.error?.message || '加载失败，请刷新重试'
      isLoading.value = false
    }
  } catch (error) {
    console.error('加载任务异常:', error)
    error.value = '网络错误，请检查连接'
    isLoading.value = false
  }
}

async function loadHistory() {
  try {
    const result = await apiGet('/api/daily-tasks/history?limit=10')
    if (result.success && result.data) {
      recentHistory.value = result.data
    }
  } catch (error) {
    console.error('加载历史记录失败:', error)
  }
}

async function doCheckin() {
  try {
    const result = await apiPost('/api/daily-tasks/checkin')
    if (result.success) {
      // 显示经验动画
      if (expAnimation.value) {
        expAnimation.value.addExp(20 + result.data.streak)
      }
      
      // 显示成就弹窗
      if (achievementPopup.value && result.data.newAchievements?.length > 0) {
        const ach = result.data.newAchievements[0]
        achievementPopup.value.show({
          type: 'achievement',
          title: '🎉 新成就解锁',
          message: ach.description,
          icon: ach.icon,
          achievementIcon: ach.icon,
          achievementName: ach.name,
          achievementDesc: ach.description,
          expGained: 20 + result.data.streak,
        })
      } else {
        alert(`🎉 打卡成功！连续${result.data.streak}天，获得${result.data.points}积分`)
      }
      
      await loadTasks()
    }
  } catch (error) {
    console.error('打卡失败:', error)
    alert('打卡失败，请稍后重试')
  }
}

async function completeTask(task: any) {
  try {
    const increment = task.progressIncrement || 1
    const result = await apiPost('/api/daily-tasks/progress', {
      taskType: task.task_type,
      progress: increment,
    })
    
    if (result.success) {
      // 显示经验动画
      if (expAnimation.value && result.data.earned) {
        expAnimation.value.addExp(result.data.earned)
      }
      
      // 显示成就弹窗
      if (achievementPopup.value && result.data.newAchievements?.length > 0) {
        const ach = result.data.newAchievements[0]
        achievementPopup.value.show({
          type: 'achievement',
          title: '🎉 新成就解锁',
          message: ach.description,
          icon: ach.icon,
          achievementIcon: ach.icon,
          achievementName: ach.name,
          achievementDesc: ach.description,
          expGained: result.data.earned,
        })
      } else if (result.data.isCompleted) {
        alert(`🎉 任务完成！获得${result.data.earned}积分`)
      }
      
      await loadTasks()
    }
  } catch (error) {
    console.error('更新进度失败:', error)
  }
}

onMounted(() => {
  loadTasks()
  loadHistory()
})
</script>
