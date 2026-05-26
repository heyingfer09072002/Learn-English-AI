<script setup lang="ts">
import { useRouter } from 'vue-router';

const router = useRouter();

const originalFeatures = [
  { 
    name: '词汇学习', 
    icon: '📖', 
    desc: '艾宾浩斯记忆曲线',
    route: '/vocabulary',
    color: 'from-blue-500 to-cyan-500'
  },
  { 
    name: 'AI 对话', 
    icon: '🤖', 
    desc: '智能英语助手',
    route: '/chat',
    color: 'from-purple-500 to-pink-500'
  },
  { 
    name: '课程学习', 
    icon: '📚', 
    desc: '系统化课程',
    route: '/lessons',
    color: 'from-green-500 to-emerald-500'
  },
  { 
    name: '写作练习', 
    icon: '✍️', 
    desc: 'AI 智能批改',
    route: '/writing',
    color: 'from-orange-500 to-red-500'
  },
];

const julebuFeatures = [
  { 
    name: '课程广场', 
    icon: '🎯', 
    desc: '海量优质课程',
    route: '/courses',
    color: 'from-indigo-500 to-purple-500'
  },
  { 
    name: '句子练习', 
    icon: '✏️', 
    desc: '完整句子训练',
    route: '/practice',
    color: 'from-pink-500 to-rose-500'
  },
  { 
    name: 'PK 对战', 
    icon: '⚔️', 
    desc: '实时竞技比拼',
    route: '/pk-arena',
    color: 'from-red-500 to-orange-500'
  },
  { 
    name: '学习统计', 
    icon: '📊', 
    desc: '数据可视化',
    route: '/statistics',
    color: 'from-cyan-500 to-blue-500'
  },
  { 
    name: '创建课程', 
    icon: '➕', 
    desc: 'AI 辅助创作',
    route: '/courses/create',
    color: 'from-green-500 to-teal-500'
  },
  { 
    name: '个人中心', 
    icon: '👤', 
    desc: '成就与设置',
    route: '/profile',
    color: 'from-violet-500 to-purple-500'
  },
];
</script>

<template>
  <div class="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
    <!-- Hero Area -->
    <div class="bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-16">
      <div class="max-w-7xl mx-auto px-4 text-center">
        <h1 class="text-5xl font-bold mb-4">🎓 EnglishAI + Julebu</h1>
        <p class="text-xl text-indigo-100">融合游戏平台 + 系统学习，打造最佳英语学习体验</p>
      </div>
    </div>

    <!-- Original Features -->
    <div class="max-w-7xl mx-auto px-4 py-12">
      <h2 class="text-3xl font-bold text-gray-800 mb-8 flex items-center gap-3">
        <span class="text-4xl">📖</span>
        原有功能
      </h2>
      
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div
          v-for="feature in originalFeatures"
          :key="feature.name"
          @click="router.push(feature.route)"
          class="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition cursor-pointer transform hover:-translate-y-1"
        >
          <div :class="['w-16 h-16 rounded-full bg-gradient-to-r ' + feature.color, 'flex items-center justify-center text-3xl mb-4']">
            {{ feature.icon }}
          </div>
          <h3 class="text-xl font-bold text-gray-800 mb-2">{{ feature.name }}</h3>
          <p class="text-gray-600">{{ feature.desc }}</p>
        </div>
      </div>
    </div>

    <!-- Julebu Features -->
    <div class="max-w-7xl mx-auto px-4 py-12">
      <h2 class="text-3xl font-bold text-gray-800 mb-8 flex items-center gap-3">
        <span class="text-4xl">🎮</span>
        游戏化学习新功能
      </h2>
      
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div
          v-for="feature in julebuFeatures"
          :key="feature.name"
          @click="router.push(feature.route)"
          class="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition cursor-pointer transform hover:-translate-y-1"
        >
          <div :class="['w-16 h-16 rounded-full bg-gradient-to-r ' + feature.color, 'flex items-center justify-center text-3xl mb-4']">
            {{ feature.icon }}
          </div>
          <h3 class="text-xl font-bold text-gray-800 mb-2">{{ feature.name }}</h3>
          <p class="text-gray-600">{{ feature.desc }}</p>
        </div>
      </div>
    </div>

    <!-- Stats -->
    <div class="bg-white py-12">
      <div class="max-w-7xl mx-auto px-4">
        <h3 class="text-2xl font-bold text-center text-gray-800 mb-8">📈 项目融合统计</h3>
        <div class="grid grid-cols-2 md:grid-cols-4 gap-6">
          <div class="text-center">
            <div class="text-4xl font-bold text-indigo-600 mb-2">18+</div>
            <div class="text-gray-600">页面组件</div>
          </div>
          <div class="text-center">
            <div class="text-4xl font-bold text-purple-600 mb-2">15+</div>
            <div class="text-gray-600">API 端点</div>
          </div>
          <div class="text-center">
            <div class="text-4xl font-bold text-pink-600 mb-2">10+</div>
            <div class="text-gray-600">数据模型</div>
          </div>
          <div class="text-center">
            <div class="text-4xl font-bold text-green-600 mb-2">7+</div>
            <div class="text-gray-600">业务服务</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
