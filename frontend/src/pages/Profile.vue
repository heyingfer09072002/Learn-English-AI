<template>
  <div class="min-h-screen bg-[#0a0e27] text-white">
    <Navbar />
    
    <main class="container mx-auto px-6 py-8">
      <!-- 页面标题 -->
      <div class="mb-12">
        <h1 class="text-5xl font-black mb-4 bg-gradient-to-r from-white via-blue-100 to-purple-100 bg-clip-text text-transparent">
          个人中心
        </h1>
        <p class="text-xl text-gray-400">管理您的学习进度和设置</p>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <!-- 用户信息卡片 -->
        <div class="lg:col-span-1">
          <div class="bg-gradient-to-br from-white/[0.05] to-white/[0.02] border border-white/10 rounded-3xl p-8 backdrop-blur-sm">
            <!-- 头像 -->
            <div class="text-center mb-6">
              <div class="w-24 h-24 mx-auto bg-gradient-to-br from-cyan-500 to-blue-600 rounded-full flex items-center justify-center mb-4">
                <span class="text-4xl font-black">{{ userInitial }}</span>
              </div>
              <h2 class="text-2xl font-bold">{{ user.username }}</h2>
              <p class="text-gray-400">{{ user.email }}</p>
            </div>

            <!-- 学习统计 -->
            <div class="space-y-4">
              <div class="p-4 bg-white/5 rounded-2xl">
                <div class="flex items-center justify-between">
                  <span class="text-gray-400">学习天数</span>
                  <span class="text-2xl font-bold text-cyan-400">{{ stats.streakDays }}</span>
                </div>
              </div>
              <div class="p-4 bg-white/5 rounded-2xl">
                <div class="flex items-center justify-between">
                  <span class="text-gray-400">总学习时长</span>
                  <span class="text-2xl font-bold text-blue-400">{{ formattedLearnTime }}</span>
                </div>
              </div>
              <div class="p-4 bg-white/5 rounded-2xl">
                <div class="flex items-center justify-between">
                  <span class="text-gray-400">已掌握词汇</span>
                  <span class="text-2xl font-bold text-green-400">{{ stats.masteredWords }}</span>
                </div>
              </div>
              <div class="p-4 bg-white/5 rounded-2xl">
                <div class="flex items-center justify-between">
                  <span class="text-gray-400">平均准确率</span>
                  <span class="text-2xl font-bold text-purple-400">{{ stats.accuracy }}%</span>
                </div>
              </div>
            </div>

            <!-- 退出登录按钮 -->
            <button
              @click="handleLogout"
              class="w-full mt-6 py-4 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-500 hover:to-red-600 rounded-2xl font-bold transition-all"
            >
              退出登录
            </button>
          </div>
        </div>

        <!-- 学习进度和图表 -->
        <div class="lg:col-span-2 space-y-8">
          <!-- 学习进度图表 -->
          <div class="bg-gradient-to-br from-white/[0.05] to-white/[0.02] border border-white/10 rounded-3xl p-8 backdrop-blur-sm">
            <h3 class="text-2xl font-bold mb-6">学习进度</h3>
            
            <!-- 词汇量进度 -->
            <div class="mb-8">
              <div class="flex items-center justify-between mb-4">
                <span class="text-lg font-semibold">已学习词汇</span>
                <span class="text-cyan-400 font-bold">{{ stats.learnedWords }} / {{ stats.totalWords }}</span>
              </div>
              <div class="w-full bg-white/10 rounded-full h-4">
                <div 
                  class="bg-gradient-to-r from-cyan-500 to-blue-500 h-4 rounded-full transition-all duration-500"
                  :style="{ width: `${(stats.learnedWords / stats.totalWords) * 100}%` }"
                ></div>
              </div>
              <p class="text-sm text-gray-400 mt-2">
                完成度：{{ Math.round((stats.learnedWords / stats.totalWords) * 100) }}%
              </p>
            </div>

            <!-- 记忆曲线图表 -->
            <div>
              <h4 class="text-lg font-semibold mb-4">艾宾浩斯记忆曲线</h4>
              <div class="relative h-64">
                <svg class="w-full h-full" viewBox="0 0 800 200" preserveAspectRatio="none">
                  <!-- 网格线 -->
                  <line x1="0" y1="0" x2="800" y2="0" stroke="rgba(255,255,255,0.1)" stroke-width="1"/>
                  <line x1="0" y1="50" x2="800" y2="50" stroke="rgba(255,255,255,0.1)" stroke-width="1"/>
                  <line x1="0" y1="100" x2="800" y2="100" stroke="rgba(255,255,255,0.1)" stroke-width="1"/>
                  <line x1="0" y1="150" x2="800" y2="150" stroke="rgba(255,255,255,0.1)" stroke-width="1"/>
                  <line x1="0" y1="200" x2="800" y2="200" stroke="rgba(255,255,255,0.1)" stroke-width="1"/>
                  
                  <!-- 记忆曲线 -->
                  <path
                    d="M 0,10 
                       C 50,30 100,60 150,80 
                       S 250,120 350,140
                       S 500,150 650,160
                       S 800,170 800,175"
                    fill="none"
                    stroke="url(#gradient)"
                    stroke-width="3"
                  />
                  
                  <!-- 渐变定义 -->
                  <defs>
                    <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                      <stop offset="0%" style="stop-color:#06b6d4;stop-opacity:1" />
                      <stop offset="50%" style="stop-color:#3b82f6;stop-opacity:1" />
                      <stop offset="100%" style="stop-color:#8b5cf6;stop-opacity:1" />
                    </linearGradient>
                  </defs>
                  
                  <!-- 关键点 -->
                  <circle cx="0" cy="10" r="5" fill="#06b6d4"/>
                  <circle cx="150" cy="80" r="5" fill="#3b82f6"/>
                  <circle cx="350" cy="140" r="5" fill="#8b5cf6"/>
                  <circle cx="650" cy="160" r="5" fill="#8b5cf6"/>
                  <circle cx="800" cy="175" r="5" fill="#8b5cf6"/>
                  
                  <!-- 时间标签 -->
                  <text x="0" y="195" fill="rgba(255,255,255,0.5)" font-size="12">现在</text>
                  <text x="150" y="195" fill="rgba(255,255,255,0.5)" font-size="12">1 天</text>
                  <text x="350" y="195" fill="rgba(255,255,255,0.5)" font-size="12">4 天</text>
                  <text x="650" y="195" fill="rgba(255,255,255,0.5)" font-size="12">7 天</text>
                  <text x="800" y="195" fill="rgba(255,255,255,0.5)" font-size="12">15 天</text>
                </svg>
              </div>
              <div class="grid grid-cols-5 gap-4 mt-4 text-center">
                <div class="p-3 bg-white/5 rounded-xl">
                  <div class="text-2xl font-bold text-cyan-400">100%</div>
                  <div class="text-xs text-gray-400">学习时</div>
                </div>
                <div class="p-3 bg-white/5 rounded-xl">
                  <div class="text-2xl font-bold text-blue-400">65%</div>
                  <div class="text-xs text-gray-400">1 天后</div>
                </div>
                <div class="p-3 bg-white/5 rounded-xl">
                  <div class="text-2xl font-bold text-purple-400">35%</div>
                  <div class="text-xs text-gray-400">4 天后</div>
                </div>
                <div class="p-3 bg-white/5 rounded-xl">
                  <div class="text-2xl font-bold text-purple-400">25%</div>
                  <div class="text-xs text-gray-400">7 天后</div>
                </div>
                <div class="p-3 bg-white/5 rounded-xl">
                  <div class="text-2xl font-bold text-purple-400">21%</div>
                  <div class="text-xs text-gray-400">15 天后</div>
                </div>
              </div>
              <p class="text-sm text-gray-400 mt-4">
                💡 根据艾宾浩斯遗忘曲线，及时复习可以将记忆保留率提升至 90% 以上
              </p>
            </div>
          </div>

          <!-- 学习趋势图表 -->
          <div class="bg-gradient-to-br from-white/[0.05] to-white/[0.02] border border-white/10 rounded-3xl p-8 backdrop-blur-sm">
            <h3 class="text-2xl font-bold mb-6">本周学习趋势</h3>
            <div class="relative h-48">
              <svg class="w-full h-full" viewBox="0 0 700 200">
                <!-- 柱状图 - 每天学习词汇数 -->
                <rect x="20" y="120" width="60" height="80" rx="8" fill="rgba(6,182,212,0.3)"/>
                <rect x="120" y="100" width="60" height="100" rx="8" fill="rgba(6,182,212,0.4)"/>
                <rect x="220" y="80" width="60" height="120" rx="8" fill="rgba(6,182,212,0.5)"/>
                <rect x="320" y="60" width="60" height="140" rx="8" fill="rgba(6,182,212,0.6)"/>
                <rect x="420" y="90" width="60" height="110" rx="8" fill="rgba(6,182,212,0.7)"/>
                <rect x="520" y="50" width="60" height="150" rx="8" fill="rgba(6,182,212,0.8)"/>
                <rect x="620" y="40" width="60" height="160" rx="8" fill="rgba(6,182,212,1)"/>
                
                <!-- 天数标签 -->
                <text x="50" y="220" fill="rgba(255,255,255,0.6)" font-size="14" text-anchor="middle">一</text>
                <text x="150" y="220" fill="rgba(255,255,255,0.6)" font-size="14" text-anchor="middle">二</text>
                <text x="250" y="220" fill="rgba(255,255,255,0.6)" font-size="14" text-anchor="middle">三</text>
                <text x="350" y="220" fill="rgba(255,255,255,0.6)" font-size="14" text-anchor="middle">四</text>
                <text x="450" y="220" fill="rgba(255,255,255,0.6)" font-size="14" text-anchor="middle">五</text>
                <text x="550" y="220" fill="rgba(255,255,255,0.6)" font-size="14" text-anchor="middle">六</text>
                <text x="650" y="220" fill="rgba(255,255,255,0.6)" font-size="14" text-anchor="middle">日</text>
                
                <!-- Y 轴标签 -->
                <text x="10" y="200" fill="rgba(255,255,255,0.4)" font-size="12">0</text>
                <text x="10" y="150" fill="rgba(255,255,255,0.4)" font-size="12">50</text>
                <text x="10" y="100" fill="rgba(255,255,255,0.4)" font-size="12">100</text>
                <text x="10" y="50" fill="rgba(255,255,255,0.4)" font-size="12">150</text>
              </svg>
            </div>
            <div class="text-center mt-4">
              <p class="text-gray-400">本周共学习 <span class="text-cyan-400 font-bold">760</span> 个词汇，比上周增长 <span class="text-green-400 font-bold">+23%</span></p>
            </div>
          </div>

          <!-- 待复习提醒 -->
          <div class="bg-gradient-to-br from-yellow-500/10 to-orange-500/10 border border-yellow-500/20 rounded-3xl p-8 backdrop-blur-sm">
            <div class="flex items-center justify-between mb-6">
              <h3 class="text-2xl font-bold">待复习词汇</h3>
              <span class="px-4 py-2 bg-yellow-500/20 text-yellow-400 font-bold rounded-full">
                {{ stats.reviewDueToday }} 个
              </span>
            </div>
            
            <div v-if="dueReviews.length > 0" class="space-y-3">
              <div 
                v-for="word in dueReviews.slice(0, 5)" 
                :key="word.id"
                class="p-4 bg-white/5 rounded-2xl flex items-center justify-between"
              >
                <div>
                  <div class="text-xl font-bold">{{ word.word }}</div>
                  <div class="text-sm text-gray-400">到期时间：{{ word.dueDate }}</div>
                </div>
                <button class="px-6 py-2 bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-400 rounded-xl font-bold transition-colors">
                  立即复习
                </button>
              </div>
            </div>
            <div v-else class="text-center py-12">
              <div class="text-6xl mb-4">🎉</div>
              <p class="text-xl text-gray-400">太棒了！所有词汇都已复习完成</p>
            </div>
          </div>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import Navbar from '@/components/layout/Navbar.vue'
import { api } from '@/api'

const router = useRouter()

const user = ref({
  id: 0,
  email: '',
  username: '',
  avatar: ''
})

const stats = ref({
  streakDays: 0,
  learnedWords: 0,
  masteredWords: 0,
  totalWords: 6005,
  accuracy: 0,
  reviewDueToday: 0,
  totalLearnTime: 0
})

const dueReviews = ref<any[]>([])

const userInitial = computed(() => {
  return user.value.username?.charAt(0).toUpperCase() || 'U'
})

const formattedLearnTime = computed(() => {
  const hours = Math.floor(stats.value.totalLearnTime / 3600)
  const minutes = Math.floor((stats.value.totalLearnTime % 3600) / 60)
  return `${hours}小时${minutes}分钟`
})

// 加载用户信息
const loadUserProfile = async () => {
  try {
    const res = await api.getUserProfile()
    user.value = res.data
  } catch (error) {
    console.error('加载用户信息失败:', error)
  }
}

// 加载统计数据
const loadStats = async () => {
  try {
    const res = await api.getVocabularyStatistics()
    stats.value = {
      ...stats.value,
      ...res.data
    }
  } catch (error) {
    console.error('加载统计数据失败:', error)
  }
}

// 加载待复习词汇
const loadDueReviews = async () => {
  try {
    const res = await api.getDueReviews()
    dueReviews.value = res.data || []
  } catch (error) {
    console.error('加载待复习词汇失败:', error)
  }
}

// 退出登录
const handleLogout = () => {
  localStorage.removeItem('token')
  localStorage.removeItem('user')
  router.push('/login')
}

onMounted(() => {
  loadUserProfile()
  loadStats()
  loadDueReviews()
})
</script>
