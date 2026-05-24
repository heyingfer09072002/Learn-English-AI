<template>
  <div class="min-h-screen bg-[#0a0e27] text-white">
    <Navbar />
    
    <main class="container mx-auto px-6 py-8">
      <div class="mb-12">
        <h1 class="text-5xl font-black mb-4 bg-gradient-to-r from-white via-blue-100 to-purple-100 bg-clip-text text-transparent">学习中心</h1>
        <p class="text-xl text-gray-400">AI 智能分析你的英语水平，制定个性化学习路径</p>
      </div>

      <!-- 评估入口 -->
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-16">
        <!-- 词汇分析 -->
        <div class="group p-10 bg-gradient-to-br from-white/[0.05] to-white/[0.02] border border-white/10 rounded-3xl hover:border-blue-500/50 transition-all duration-500 backdrop-blur-sm">
          <div class="flex items-start justify-between mb-8">
            <div>
              <h3 class="text-3xl font-bold mb-3">词汇能力评估</h3>
              <p class="text-gray-400 text-lg">测试你的词汇量和记忆曲线</p>
            </div>
            <div class="w-20 h-20 bg-gradient-to-br from-blue-500/30 to-blue-600/30 rounded-3xl flex items-center justify-center group-hover:scale-110 transition-transform shadow-lg shadow-blue-500/20">
              <svg class="w-10 h-10 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
            </div>
          </div>
          <button class="w-full py-5 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-500 hover:to-blue-600 rounded-2xl font-bold text-lg transition-all transform hover:scale-105 shadow-lg shadow-blue-500/30">
            开始词汇测试
          </button>
        </div>

        <!-- 语法分析 -->
        <div class="group p-10 bg-gradient-to-br from-white/[0.05] to-white/[0.02] border border-white/10 rounded-3xl hover:border-purple-500/50 transition-all duration-500 backdrop-blur-sm">
          <div class="flex items-start justify-between mb-8">
            <div>
              <h3 class="text-3xl font-bold mb-3">语法能力评估</h3>
              <p class="text-gray-400 text-lg">全面检测语法掌握程度</p>
            </div>
            <div class="w-20 h-20 bg-gradient-to-br from-purple-500/30 to-purple-600/30 rounded-3xl flex items-center justify-center group-hover:scale-110 transition-transform shadow-lg shadow-purple-500/20">
              <svg class="w-10 h-10 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
              </svg>
            </div>
          </div>
          <button class="w-full py-5 bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-500 hover:to-purple-600 rounded-2xl font-bold text-lg transition-all transform hover:scale-105 shadow-lg shadow-purple-500/30">
            开始语法测试
          </button>
        </div>
      </div>

      <!-- 课程列表 -->
      <div class="mb-16">
        <div class="flex items-center justify-between mb-8">
          <h2 class="text-4xl font-black">推荐课程</h2>
          <button class="px-6 py-3 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl font-semibold transition-all">
            查看全部
          </button>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div 
            v-for="course in courses" 
            :key="course.id"
            class="group p-6 bg-gradient-to-br from-white/[0.05] to-white/[0.02] border border-white/10 rounded-2xl hover:border-cyan-500/50 transition-all duration-500 cursor-pointer"
            @click="navigateTo('/lesson')"
          >
            <div class="flex items-center justify-between mb-4">
              <span class="px-3 py-1.5 bg-cyan-500/20 text-cyan-400 text-sm font-bold rounded-full">{{ course.level }}</span>
              <span class="text-sm text-gray-400">{{ course.lessons }} 课</span>
            </div>
            <h3 class="text-2xl font-bold mb-2">{{ course.title }}</h3>
            <p class="text-gray-400 mb-4">{{ course.description }}</p>
            <div class="space-y-3">
              <div class="flex items-center justify-between text-sm">
                <span class="text-gray-400">学习进度</span>
                <span class="text-cyan-400 font-semibold">{{ course.progress }}%</span>
              </div>
              <div class="w-full bg-white/10 rounded-full h-2">
                <div 
                  class="bg-gradient-to-r from-cyan-500 to-blue-500 h-2 rounded-full transition-all duration-500"
                  :style="{ width: `${course.progress}%` }"
                ></div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- 学习报告 -->
      <div class="p-10 bg-gradient-to-br from-white/[0.05] to-white/[0.02] border border-white/10 rounded-3xl backdrop-blur-sm">
        <h3 class="text-3xl font-bold mb-8">最近学习报告</h3>
        <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div class="p-8 bg-white/5 rounded-2xl">
            <div class="flex items-center justify-between mb-4">
              <span class="text-gray-400 text-lg">词汇量</span>
              <span class="text-blue-400 font-bold">+12%</span>
            </div>
            <div class="text-6xl font-black mb-4 bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">3,245</div>
            <div class="w-full bg-white/10 rounded-full h-3">
              <div class="bg-gradient-to-r from-blue-500 to-cyan-500 h-3 rounded-full" style="width: 65%"></div>
            </div>
            <div class="text-sm text-gray-400 mt-3">当前等级：B1 中级</div>
          </div>
          
          <div class="p-8 bg-white/5 rounded-2xl">
            <div class="flex items-center justify-between mb-4">
              <span class="text-gray-400 text-lg">语法准确率</span>
              <span class="text-purple-400 font-bold">+8%</span>
            </div>
            <div class="text-6xl font-black mb-4 bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">78%</div>
            <div class="w-full bg-white/10 rounded-full h-3">
              <div class="bg-gradient-to-r from-purple-500 to-pink-500 h-3 rounded-full" style="width: 78%"></div>
            </div>
            <div class="text-sm text-gray-400 mt-3">超越 65% 的学习者</div>
          </div>
          
          <div class="p-8 bg-white/5 rounded-2xl">
            <div class="flex items-center justify-between mb-4">
              <span class="text-gray-400 text-lg">本周学习</span>
              <span class="text-cyan-400 font-bold">12.5h</span>
            </div>
            <div class="text-6xl font-black mb-4 bg-gradient-to-r from-cyan-400 to-green-400 bg-clip-text text-transparent">12.5h</div>
            <div class="space-y-2">
              <div class="flex items-center justify-between text-sm">
                <span class="text-gray-400">日均</span>
                <span class="text-gray-300">1.8 小时</span>
              </div>
              <div class="flex items-center justify-between text-sm">
                <span class="text-gray-400">目标</span>
                <span class="text-cyan-400">85%</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import Navbar from '@/components/layout/Navbar.vue'

const router = useRouter()

const navigateTo = (path: string) => {
  router.push(path)
}

const courses = ref([
  { 
    id: 1, 
    level: '初级',
    title: '衣物与穿搭', 
    description: '学习日常衣物相关词汇和表达',
    lessons: 12,
    progress: 25
  },
  { 
    id: 2, 
    level: '中级',
    title: '食物与烹饪', 
    description: '掌握餐厅点餐和烹饪相关对话',
    lessons: 15,
    progress: 60
  },
  { 
    id: 3, 
    level: '高级',
    title: '商务会谈', 
    description: '提升商务英语沟通能力',
    lessons: 20,
    progress: 10
  }
])
</script>
