<script setup lang="ts">
import { useRouter } from 'vue-router';

const router = useRouter();

const menuItems = [
  { path: '/courses', label: '课程广场', icon: '📚' },
  { path: '/practice', label: '练习', icon: '✏️' },
  { path: '/pk-arena', label: 'PK 对战', icon: '⚔️' },
  { path: '/statistics', label: '统计', icon: '📊' },
  { path: '/profile', label: '我的', icon: '👤' },
];
</script>

<template>
  <nav class="bg-white shadow-lg">
    <div class="max-w-7xl mx-auto px-4">
      <div class="flex justify-between items-center h-16">
        <!-- Logo -->
        <div class="flex items-center gap-2 cursor-pointer" @click="router.push('/')">
          <span class="text-2xl">🎓</span>
          <span class="text-xl font-bold text-gray-800">EnglishAI</span>
        </div>
        
        <!-- 菜单 -->
        <div class="hidden md:flex items-center gap-1">
          <button
            v-for="item in menuItems"
            :key="item.path"
            @click="router.push(item.path)"
            class="px-4 py-2 rounded-lg text-gray-700 hover:bg-gray-100 transition flex items-center gap-2"
          >
            <span>{{ item.icon }}</span>
            <span>{{ item.label }}</span>
          </button>
        </div>
        
        <!-- 创建课程按钮 -->
        <button
          @click="router.push('/courses/create')"
          class="hidden md:flex px-4 py-2 bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-lg hover:opacity-90 transition items-center gap-2"
        >
          <span>➕</span>
          <span>创建课程</span>
        </button>
        
        <!-- 移动端菜单按钮 -->
        <button class="md:hidden p-2">
          <span class="text-2xl">☰</span>
        </button>
      </div>
    </div>
  </nav>
</template>
