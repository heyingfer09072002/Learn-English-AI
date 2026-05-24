<template>
  <div class="min-h-screen bg-[#0a0e27] text-white overflow-hidden relative">
    <!-- 动态背景 -->
    <div class="fixed inset-0 overflow-hidden pointer-events-none">
      <div class="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1635070041078-e363dbe005cb?q=80&w=2070&auto=format&fit=crop')] bg-cover bg-center opacity-20"></div>
      <div class="absolute inset-0 bg-gradient-to-b from-[#0a0e27]/90 via-[#0a0e27]/80 to-[#0a0e27]"></div>
      <div class="absolute -top-40 -right-40 w-[600px] h-[600px] bg-blue-500/15 rounded-full blur-3xl animate-pulse"></div>
      <div class="absolute top-1/3 -left-40 w-[500px] h-[500px] bg-purple-500/15 rounded-full blur-3xl animate-pulse delay-700"></div>
      <div class="absolute -bottom-40 right-1/4 w-[400px] h-[400px] bg-cyan-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
    </div>
    
    <!-- 导航栏 -->
    <nav class="relative border-b border-white/10 bg-[#0a0e27]/60 backdrop-blur-xl">
      <div class="container mx-auto px-8">
        <div class="flex h-20 items-center justify-between">
          <div class="flex items-center space-x-4">
            <div class="w-12 h-12 bg-gradient-to-br from-blue-500 via-purple-500 to-cyan-500 rounded-2xl flex items-center justify-center shadow-lg shadow-blue-500/30">
              <span class="text-2xl font-black">E</span>
            </div>
            <div>
              <span class="text-3xl font-black bg-gradient-to-r from-blue-400 via-purple-400 to-cyan-400 bg-clip-text text-transparent">EnglishAI</span>
              <p class="text-xs text-gray-400 -mt-1">AI-Powered Learning</p>
            </div>
          </div>
          <div class="flex items-center space-x-2">
            <button 
              v-for="item in navItems" 
              :key="item.name"
              @click="navigateTo(item.path)"
              class="px-5 py-2.5 text-sm font-medium rounded-xl transition-all border border-transparent hover:border-white/20"
            >
              {{ item.name }}
            </button>
          </div>
          <div class="flex items-center space-x-4 pl-4 border-l border-white/10">
            <div @click="navigateToProfile" class="flex items-center space-x-3 px-4 py-2 bg-white/5 rounded-xl border border-white/10 hover:border-white/20 transition-all cursor-pointer">
              <div class="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                <span class="text-sm font-bold">U</span>
              </div>
              <div>
                <div class="text-sm font-semibold">User</div>
                <div class="text-xs text-gray-400">Level B1</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </nav>

    <!-- 主内容区 -->
    <main class="relative container mx-auto px-8 py-16">
      <!-- Hero 区域 -->
      <div class="text-center mb-20">
        <div class="inline-flex items-center space-x-2 px-5 py-2.5 bg-blue-500/10 border border-blue-400/30 rounded-full mb-8 backdrop-blur-sm">
          <span class="w-2.5 h-2.5 bg-green-400 rounded-full animate-pulse shadow-lg shadow-green-400/50"></span>
          <span class="text-sm font-medium text-blue-200">AI 智能学习引擎 2.0</span>
        </div>
        
        <h1 class="text-7xl font-black mb-8 leading-tight">
          <span class="bg-gradient-to-r from-white via-blue-100 to-purple-100 bg-clip-text text-transparent drop-shadow-2xl">
            掌握英语<br/>
            <span class="text-5xl bg-gradient-to-r from-blue-400 via-purple-400 to-cyan-400 bg-clip-text text-transparent">
              从未如此简单
            </span>
          </span>
        </h1>
        
        <p class="text-2xl text-gray-300 max-w-3xl mx-auto mb-12 leading-relaxed">
          基于先进 AI 技术，深度分析你的学习程度<br/>
          智能定制专属学习路径，让进步看得见
        </p>
        
        <div class="flex justify-center space-x-6">
          <button @click="navigateTo('/learning')" class="group px-10 py-5 bg-gradient-to-r from-blue-600 via-purple-600 to-cyan-600 hover:from-blue-500 hover:via-purple-500 hover:to-cyan-500 rounded-2xl font-bold text-lg transition-all transform hover:scale-105 shadow-2xl shadow-blue-500/40 flex items-center space-x-3">
            <span>立即开始</span>
            <svg class="w-6 h-6 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </svg>
          </button>
          <button class="px-10 py-5 bg-white/5 hover:bg-white/10 border border-white/20 rounded-2xl font-bold text-lg transition-all backdrop-blur-sm">
            了解更多
          </button>
        </div>
      </div>

      <!-- 统计数据 -->
      <div class="grid grid-cols-2 md:grid-cols-4 gap-6 mb-20">
        <div class="group p-8 bg-gradient-to-br from-white/[0.05] to-white/[0.02] border border-white/10 rounded-3xl hover:border-blue-500/50 transition-all duration-500 backdrop-blur-sm">
          <div class="text-5xl font-black mb-3 bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">10K+</div>
          <div class="text-lg text-gray-400 font-medium">活跃用户</div>
          <div class="mt-4 flex items-center text-sm text-green-400">
            <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
            </svg>
            <span>+25% 本周</span>
          </div>
        </div>
        
        <div class="group p-8 bg-gradient-to-br from-white/[0.05] to-white/[0.02] border border-white/10 rounded-3xl hover:border-purple-500/50 transition-all duration-500 backdrop-blur-sm">
          <div class="text-5xl font-black mb-3 bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">500K+</div>
          <div class="text-lg text-gray-400 font-medium">练习次数</div>
          <div class="mt-4 flex items-center text-sm text-green-400">
            <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
            </svg>
            <span>+42% 本周</span>
          </div>
        </div>
        
        <div class="group p-8 bg-gradient-to-br from-white/[0.05] to-white/[0.02] border border-white/10 rounded-3xl hover:border-cyan-500/50 transition-all duration-500 backdrop-blur-sm">
          <div class="text-5xl font-black mb-3 bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">95%</div>
          <div class="text-lg text-gray-400 font-medium">满意度</div>
          <div class="mt-4 flex items-center text-sm text-gray-400">
            <span>用户好评率</span>
          </div>
        </div>
        
        <div class="group p-8 bg-gradient-to-br from-white/[0.05] to-white/[0.02] border border-white/10 rounded-3xl hover:border-orange-500/50 transition-all duration-500 backdrop-blur-sm">
          <div class="text-5xl font-black mb-3 bg-gradient-to-r from-orange-400 to-red-400 bg-clip-text text-transparent">3x</div>
          <div class="text-lg text-gray-400 font-medium">学习效率</div>
          <div class="mt-4 flex items-center text-sm text-gray-400">
            <span>对比传统方法</span>
          </div>
        </div>
      </div>

      <!-- 功能卡片 -->
      <div class="text-center mb-16">
        <h2 class="text-5xl font-black mb-4">
          <span class="bg-gradient-to-r from-white via-blue-100 to-purple-100 bg-clip-text text-transparent">
            核心功能
          </span>
        </h2>
        <p class="text-xl text-gray-400">
          全方位提升你的英语能力
        </p>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-20">
        <!-- 学习分析 -->
        <div 
          @click="navigateTo('/learning')"
          class="group relative p-10 bg-gradient-to-br from-white/[0.05] to-white/[0.02] border border-white/10 rounded-3xl hover:border-blue-500/50 transition-all duration-500 hover:transform hover:-translate-y-3 cursor-pointer backdrop-blur-sm overflow-hidden"
        >
          <div class="absolute inset-0 bg-gradient-to-br from-blue-500/15 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
          <div class="relative">
            <div class="w-20 h-20 bg-gradient-to-br from-blue-500/30 to-blue-600/30 rounded-3xl flex items-center justify-center mb-8 group-hover:scale-110 group-hover:rotate-3 transition-all duration-500 shadow-lg shadow-blue-500/20">
              <svg class="w-10 h-10 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </div>
            <h3 class="text-3xl font-bold mb-4">智能分析</h3>
            <p class="text-gray-400 leading-relaxed text-lg">
              AI 深度分析词汇量和语法掌握度，生成个性化学习报告
            </p>
            <div class="mt-8 flex items-center text-blue-400 group-hover:text-blue-300 transition-colors">
              <span class="text-lg font-semibold">开始评估</span>
              <svg class="w-5 h-5 ml-3 group-hover:translate-x-2 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
              </svg>
            </div>
          </div>
        </div>

        <!-- 写作评估 -->
        <div 
          @click="navigateTo('/writing')"
          class="group relative p-10 bg-gradient-to-br from-white/[0.05] to-white/[0.02] border border-white/10 rounded-3xl hover:border-purple-500/50 transition-all duration-500 hover:transform hover:-translate-y-3 cursor-pointer backdrop-blur-sm overflow-hidden"
        >
          <div class="absolute inset-0 bg-gradient-to-br from-purple-500/15 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
          <div class="relative">
            <div class="w-20 h-20 bg-gradient-to-br from-purple-500/30 to-purple-600/30 rounded-3xl flex items-center justify-center mb-8 group-hover:scale-110 group-hover:rotate-3 transition-all duration-500 shadow-lg shadow-purple-500/20">
              <svg class="w-10 h-10 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
            </div>
            <h3 class="text-3xl font-bold mb-4">写作评估</h3>
            <p class="text-gray-400 leading-relaxed text-lg">
              实时评估英语写作，提供语法、用词和表达的专业建议
            </p>
            <div class="mt-8 flex items-center text-purple-400 group-hover:text-purple-300 transition-colors">
              <span class="text-lg font-semibold">开始写作</span>
              <svg class="w-5 h-5 ml-3 group-hover:translate-x-2 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
              </svg>
            </div>
          </div>
        </div>

        <!-- 对话练习 -->
        <div 
          @click="navigateTo('/chat')"
          class="group relative p-10 bg-gradient-to-br from-white/[0.05] to-white/[0.02] border border-white/10 rounded-3xl hover:border-cyan-500/50 transition-all duration-500 hover:transform hover:-translate-y-3 cursor-pointer backdrop-blur-sm overflow-hidden"
        >
          <div class="absolute inset-0 bg-gradient-to-br from-cyan-500/15 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
          <div class="relative">
            <div class="w-20 h-20 bg-gradient-to-br from-cyan-500/30 to-cyan-600/30 rounded-3xl flex items-center justify-center mb-8 group-hover:scale-110 group-hover:rotate-3 transition-all duration-500 shadow-lg shadow-cyan-500/20">
              <svg class="w-10 h-10 text-cyan-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
            </div>
            <h3 class="text-3xl font-bold mb-4">AI 对话</h3>
            <p class="text-gray-400 leading-relaxed text-lg">
              与 AI 进行自然对话练习，沉浸式提升口语和听力
            </p>
            <div class="mt-8 flex items-center text-cyan-400 group-hover:text-cyan-300 transition-colors">
              <span class="text-lg font-semibold">开始对话</span>
              <svg class="w-5 h-5 ml-3 group-hover:translate-x-2 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
              </svg>
            </div>
          </div>
        </div>

        <!-- 进度追踪 -->
        <div 
          @click="navigateTo('/progress')"
          class="group relative p-10 bg-gradient-to-br from-white/[0.05] to-white/[0.02] border border-white/10 rounded-3xl hover:border-orange-500/50 transition-all duration-500 hover:transform hover:-translate-y-3 cursor-pointer backdrop-blur-sm overflow-hidden"
        >
          <div class="absolute inset-0 bg-gradient-to-br from-orange-500/15 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
          <div class="relative">
            <div class="w-20 h-20 bg-gradient-to-br from-orange-500/30 to-orange-600/30 rounded-3xl flex items-center justify-center mb-8 group-hover:scale-110 group-hover:rotate-3 transition-all duration-500 shadow-lg shadow-orange-500/20">
              <svg class="w-10 h-10 text-orange-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 class="text-3xl font-bold mb-4">进步追踪</h3>
            <p class="text-gray-400 leading-relaxed text-lg">
              可视化学习进度和成长轨迹，见证每一步提升
            </p>
            <div class="mt-8 flex items-center text-orange-400 group-hover:text-orange-300 transition-colors">
              <span class="text-lg font-semibold">查看进度</span>
              <svg class="w-5 h-5 ml-3 group-hover:translate-x-2 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
              </svg>
            </div>
          </div>
        </div>
      </div>

      <!-- 课程展示 -->
      <div class="text-center mb-16">
        <h2 class="text-5xl font-black mb-4">
          <span class="bg-gradient-to-r from-white via-blue-100 to-purple-100 bg-clip-text text-transparent">
            精选课程
          </span>
        </h2>
        <p class="text-xl text-gray-400">
          8 大主题课程，科学系统化学习
        </p>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-20">
        <div
          v-for="course in courses"
          :key="course.id"
          @click="navigateTo(`/lesson/${course.id}`)"
          class="group p-6 bg-gradient-to-br from-white/[0.05] to-white/[0.02] border border-white/10 rounded-2xl hover:border-purple-500/50 transition-all duration-500 hover:transform hover:-translate-y-2 cursor-pointer backdrop-blur-sm"
        >
          <div class="flex items-start justify-between mb-4">
            <div class="text-4xl">{{ course.icon }}</div>
            <span
              class="px-3 py-1 text-xs font-medium rounded-full"
              :class="getLevelClass(course.level)"
            >
              {{ getLevelName(course.level) }}
            </span>
          </div>
          <h3 class="text-xl font-bold mb-2 text-white">{{ course.title }}</h3>
          <p class="text-gray-400 text-sm mb-4 line-clamp-2">{{ course.description }}</p>
          <div class="flex items-center justify-between">
            <span class="text-xs text-gray-500">{{ course.lessons_count }} 课时</span>
            <svg class="w-5 h-5 text-purple-400 group-hover:translate-x-2 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
            </svg>
          </div>
        </div>
      </div>

      <!-- 特点展示 -->
      <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
        <!-- 特点 1 -->
        <div class="group p-8 bg-gradient-to-br from-white/[0.05] to-white/[0.02] border border-white/10 rounded-3xl hover:border-blue-500/50 transition-all duration-500 backdrop-blur-sm">
          <div class="flex items-center space-x-6 mb-6">
            <div class="w-16 h-16 bg-blue-500/20 rounded-2xl flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform">
              <svg class="w-8 h-8 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <h3 class="text-2xl font-bold">智能高效</h3>
          </div>
          <p class="text-gray-400 leading-relaxed text-lg">
            AI 智能分析你的强项和薄弱环节，精准推送学习内容，效率提升 3 倍
          </p>
        </div>

        <!-- 特点 2 -->
        <div class="group p-8 bg-gradient-to-br from-white/[0.05] to-white/[0.02] border border-white/10 rounded-3xl hover:border-purple-500/50 transition-all duration-500 backdrop-blur-sm">
          <div class="flex items-center space-x-6 mb-6">
            <div class="w-16 h-16 bg-purple-500/20 rounded-2xl flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform">
              <svg class="w-8 h-8 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
              </svg>
            </div>
            <h3 class="text-2xl font-bold">权威认证</h3>
          </div>
          <p class="text-gray-400 leading-relaxed text-lg">
            对标 CEFR、TOEFL、IELTS 等国际标准，科学评估你的真实水平
          </p>
        </div>

        <!-- 特点 3 -->
        <div class="group p-8 bg-gradient-to-br from-white/[0.05] to-white/[0.02] border border-white/10 rounded-3xl hover:border-cyan-500/50 transition-all duration-500 backdrop-blur-sm">
          <div class="flex items-center space-x-6 mb-6">
            <div class="w-16 h-16 bg-cyan-500/20 rounded-2xl flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform">
              <svg class="w-8 h-8 text-cyan-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>
            </div>
            <h3 class="text-2xl font-bold">个性化学习</h3>
          </div>
          <p class="text-gray-400 leading-relaxed text-lg">
            根据你的学习习惯和目标，定制专属学习计划和内容推荐
          </p>
        </div>
      </div>
    </main>

    <!-- 底部 -->
    <footer class="relative border-t border-white/10 mt-20">
      <div class="container mx-auto px-8 py-8">
        <div class="flex items-center justify-between text-sm text-gray-400">
          <div>© 2024 EnglishAI. All rights reserved.</div>
          <div class="flex items-center space-x-6">
            <a href="#" class="hover:text-white transition-colors">隐私政策</a>
            <a href="#" class="hover:text-white transition-colors">使用条款</a>
            <a href="#" class="hover:text-white transition-colors">联系我们</a>
          </div>
        </div>
      </div>
    </footer>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { api } from '@/api'

interface Course {
  id: number
  title: string
  description: string
  level: string
  icon: string
  lessons_count: number
}

const router = useRouter()
const courses = ref<Course[]>([])

const navItems = [
  { name: '学习中心', path: '/learning' },
  { name: 'AI 对话', path: '/chat' },
  { name: '写作评估', path: '/writing' },
  { name: '进度追踪', path: '/progress' }
]

const navigateTo = (path: string) => {
  router.push(path)
}

const navigateToProfile = () => {
  router.push('/profile')
}

const getLevelName = (level: string) => {
  const levelMap: Record<string, string> = {
    beginner: '初级',
    intermediate: '中级',
    advanced: '高级',
  }
  return levelMap[level] || '初级'
}

const getLevelClass = (level: string) => {
  const classMap: Record<string, string> = {
    beginner: 'bg-green-500/20 text-green-300 border border-green-500/30',
    intermediate: 'bg-yellow-500/20 text-yellow-300 border border-yellow-500/30',
    advanced: 'bg-red-500/20 text-red-300 border border-red-500/30',
  }
  return classMap[level] || 'bg-gray-500/20 text-gray-300'
}

const loadCourses = async () => {
  try {
    const response = await api.getLessons()
    if (response.success) {
      courses.value = response.data.slice(0, 8)
    }
  } catch (error) {
    console.error('Failed to load courses:', error)
  }
}

onMounted(() => {
  loadCourses()
})
</script>

<style>
.delay-700 {
  animation-delay: 700ms;
}
.delay-1000 {
  animation-delay: 1000ms;
}
.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>
