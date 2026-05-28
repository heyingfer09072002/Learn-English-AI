<template>
  <div class="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50 p-8">
    <div class="max-w-6xl mx-auto">
      <h1 class="text-3xl font-bold text-gray-800 mb-2">🏆 成就系统</h1>
      <p class="text-gray-600 mb-8">解锁成就，见证成长</p>

      <!-- 加载状态 -->
      <div v-if="isLoading" class="text-center py-20">
        <div class="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500"></div>
        <p class="text-gray-600 mt-4">加载成就...</p>
      </div>

      <template v-else>
        <!-- 当前等级卡片 -->
        <div class="bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl shadow-lg p-6 mb-8 text-white">
          <div class="flex items-center justify-between">
            <div>
              <div class="text-6xl mb-2">{{ levelInfo.icon }}</div>
              <div class="text-2xl font-bold">{{ levelInfo.title }}</div>
              <div class="text-sm opacity-90">等级 {{ levelInfo.level }}</div>
            </div>
            <div class="flex-1 mx-8">
              <div class="text-sm mb-2">经验值：{{ levelInfo.experience }} / {{ levelInfo.expToNextLevel || 'MAX' }}</div>
              <div class="h-4 bg-white bg-opacity-30 rounded-full overflow-hidden">
                <div
                  class="h-full bg-yellow-400 transition-all"
                  :style="{ width: `${levelInfo.percent}%` }"
                ></div>
              </div>
              <div v-if="levelInfo.nextLevel" class="text-xs mt-2 text-right">
                还需 {{ levelInfo.expNeeded }} 经验升级到 Lv.{{ levelInfo.nextLevel }}
              </div>
            </div>
            <div class="text-right">
              <div class="text-4xl font-bold">{{ achievementsUnlocked }}/{{ achievementsTotal }}</div>
              <div class="text-sm opacity-90">已解锁成就</div>
            </div>
          </div>
        </div>

        <!-- 新成就提示 -->
        <div v-if="levelInfo.newAchievements?.length > 0" class="mb-8">
          <h2 class="text-xl font-bold text-gray-800 mb-4">🎉 新解锁成就</h2>
          <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div
              v-for="ach in levelInfo.newAchievements"
              :key="ach.id"
              class="bg-gradient-to-br from-yellow-100 to-orange-100 rounded-xl p-4 border-2 border-yellow-400"
            >
              <div class="text-4xl mb-2">{{ ach.icon }}</div>
              <div class="font-bold text-gray-800">{{ ach.name }}</div>
              <div class="text-sm text-gray-600">{{ ach.description }}</div>
            </div>
          </div>
        </div>

        <!-- 成就分类 -->
        <div class="space-y-8">
          <div v-for="(categoryAchs, category) in groupedAchievements" :key="category">
            <h2 class="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
              {{ getCategoryIcon(category) }} {{ formatCategory(category) }}
            </h2>
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div
                v-for="ach in categoryAchs"
                :key="ach.id"
                class="bg-white rounded-xl shadow-lg p-4 transition"
                :class="{ 'opacity-60': !ach.unlocked }"
              >
                <div class="flex items-start gap-3">
                  <div class="text-4xl">
                    {{ ach.unlocked ? ach.icon : '🔒' }}
                  </div>
                  <div class="flex-1">
                    <div class="font-bold text-gray-800">{{ ach.name }}</div>
                    <div class="text-sm text-gray-600 mb-2">{{ ach.description }}</div>
                    
                    <div v-if="!ach.unlocked" class="text-xs text-gray-500">
                      进度：{{ ach.progress }} / {{ ach.requirement_value }}
                    </div>
                    <div v-else class="text-xs text-green-600 font-bold">
                      ✅ 已解锁 • {{ formatDate(ach.unlocked_at) }}
                    </div>
                    
                    <!-- 进度条 -->
                    <div v-if="!ach.unlocked && ach.requirement_value > 0" class="mt-2">
                      <div class="h-2 bg-gray-200 rounded-full overflow-hidden">
                        <div
                          class="h-full bg-purple-500 transition-all"
                          :style="{ width: `${ach.percent}%` }"
                        ></div>
                      </div>
                    </div>
                  </div>
                  <div
                    class="px-2 py-1 rounded text-xs font-bold"
                    :class="getBadgeClass(ach.badge_level)"
                  >
                    {{ formatBadgeLevel(ach.badge_level) }}
                  </div>
                </div>
              </div>
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

const isLoading = ref(true)
const achievementsTotal = ref(0)
const achievementsUnlocked = ref(0)
const groupedAchievements = ref<any>({})
const levelInfo = ref<any>({
  level: 1,
  title: '英语新手',
  experience: 0,
  icon: '👶',
  percent: 0,
  expNeeded: 0,
  expToNextLevel: 0,
  nextLevel: null,
  newAchievements: [],
})

const categoryIcons: Record<string, string> = {
  learning: '📚',
  mastery: '🎯',
  checkin: '📅',
  favorites: '⭐',
  courses: '📖',
  points: '💰',
  accuracy: '🎯',
}

const badgeLevels: Record<string, string> = {
  bronze: '青铜',
  silver: '白银',
  gold: '黄金',
  platinum: '铂金',
}

function formatCategory(cat: string) {
  const map: Record<string, string> = {
    learning: '学习成就',
    mastery: '掌握成就',
    checkin: '打卡成就',
    favorites: '收藏成就',
    courses: '课程成就',
    points: '积分成就',
    accuracy: '准确成就',
  }
  return map[cat] || cat
}

function getCategoryIcon(cat: string) {
  return categoryIcons[cat] || '📌'
}

function formatBadgeLevel(level: string) {
  return badgeLevels[level] || level
}

function getBadgeClass(level: string) {
  const map: Record<string, string> = {
    bronze: 'bg-amber-100 text-amber-700',
    silver: 'bg-gray-100 text-gray-700',
    gold: 'bg-yellow-100 text-yellow-700',
    platinum: 'bg-cyan-100 text-cyan-700',
  }
  return map[level] || 'bg-gray-100 text-gray-700'
}

function formatDate(dateStr: string) {
  const date = new Date(dateStr)
  const now = new Date()
  const diff = now.getTime() - date.getTime()
  const days = Math.floor(diff / (1000 * 60 * 60 * 24))
  
  if (days === 0) return '今天'
  if (days === 1) return '昨天'
  if (days < 7) return `${days}天前`
  return date.toLocaleDateString('zh-CN')
}

async function loadData() {
  try {
    const [levelRes, achRes] = await Promise.all([
      apiGet('/api/achievements/level'),
      apiGet('/api/achievements'),
    ])
    
    if (levelRes.success && levelRes.data) {
      levelInfo.value = levelRes.data
    }
    
    if (achRes.success && achRes.data) {
      achievementsTotal.value = achRes.data.total
      achievementsUnlocked.value = achRes.data.unlocked
      groupedAchievements.value = achRes.data.grouped
    }
  } catch (error) {
    console.error('加载成就失败:', error)
  } finally {
    isLoading.value = false
  }
}

onMounted(() => {
  loadData()
})
</script>
