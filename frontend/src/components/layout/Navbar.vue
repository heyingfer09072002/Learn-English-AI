<template>
  <nav class="relative border-b border-white/10 bg-[#0a0e27]/80 backdrop-blur-xl">
    <div class="container mx-auto px-6">
      <div class="flex h-20 items-center justify-between">
        <div class="flex items-center space-x-3">
          <div class="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center cursor-pointer" @click="navigateTo('/')">
            <span class="text-xl font-bold">E</span>
          </div>
          <span class="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent cursor-pointer" @click="navigateTo('/')">EnglishAI</span>
        </div>
        <div class="flex items-center space-x-1">
          <button 
            v-for="item in navItems" 
            :key="item.path"
            @click="navigateTo(item.path)"
            class="px-4 py-2 text-sm text-gray-300 hover:text-white hover:bg-white/5 rounded-lg transition-all"
          >
            {{ item.name }}
          </button>
          <div class="w-px h-6 bg-white/10 mx-2"></div>
          <button class="px-4 py-2 text-sm bg-white/5 hover:bg-white/10 rounded-lg transition-all flex items-center space-x-2">
            <div class="w-5 h-5 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full"></div>
            <span>个人中心</span>
          </button>
        </div>
      </div>
    </div>
  </nav>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'

const router = useRouter()

const navItems = [
  { name: '学习中心', path: '/learning' },
  { name: 'AI 对话', path: '/chat' },
  { name: '写作评估', path: '/writing' },
  { name: '进度追踪', path: '/progress' }
]

const navigateTo = (path: string) => {
  router.push(path)
}
</script>
