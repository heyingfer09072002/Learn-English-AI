<script setup lang="ts">
import { ref, onMounted } from 'vue';

interface Achievement {
  key: string;
  name: string;
  description: string;
  icon: string;
  isUnlocked: boolean;
  progress: number;
  target: number;
}

interface User {
  id: number;
  username: string;
  email: string;
  avatar?: string;
  goldCoins: number;
  diamondCoins: number;
}

const user = ref<User>({
  id: 1,
  username: '测试用户',
  email: 'test@example.com',
  goldCoins: 1000,
  diamondCoins: 100,
});

const achievements = ref<Achievement[]>([
  { key: 'learning_streak', name: '学习达人', description: '连续学习天数', icon: '🔥', isUnlocked: true, progress: 30, target: 30 },
  { key: 'word_master', name: '词汇大师', description: '掌握单词数量', icon: '📚', isUnlocked: false, progress: 450, target: 500 },
  { key: 'combo_king', name: '连击王者', description: '最高连击数', icon: '👑', isUnlocked: true, progress: 25, target: 20 },
  { key: 'sss_master', name: '完美主义', description: '获得 SSS 评级次数', icon: '⭐', isUnlocked: false, progress: 50, target: 100 },
]);

const activeTab = ref('overview');
</script>

<template>
  <div class="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50 p-8">
    <div class="max-w-4xl mx-auto">
      <!-- 用户信息卡片 -->
      <div class="bg-white rounded-2xl shadow-xl p-8 mb-8">
        <div class="flex items-center gap-6">
          <!-- 头像 -->
          <div class="w-24 h-24 rounded-full bg-gradient-to-r from-purple-400 to-pink-500 flex items-center justify-center text-5xl">
            👤
          </div>
          
          <!-- 信息 -->
          <div class="flex-1">
            <h1 class="text-3xl font-bold text-gray-800 mb-2">{{ user.username }}</h1>
            <p class="text-gray-600 mb-4">{{ user.email }}</p>
            
            <!-- 货币 -->
            <div class="flex gap-4">
              <div class="flex items-center gap-2 bg-yellow-100 px-4 py-2 rounded-full">
                <span class="text-xl">💰</span>
                <span class="font-bold text-yellow-700">{{ user.goldCoins }} 金币</span>
              </div>
              <div class="flex items-center gap-2 bg-blue-100 px-4 py-2 rounded-full">
                <span class="text-xl">💎</span>
                <span class="font-bold text-blue-700">{{ user.diamondCoins }} 钻石</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Tab 切换 -->
      <div class="bg-white rounded-xl shadow-lg mb-8">
        <div class="flex border-b">
          <button
            :class="[
              'flex-1 py-4 px-6 text-center transition',
              activeTab === 'overview' ? 'border-b-2 border-purple-500 text-purple-600 font-bold' : 'text-gray-600 hover:text-gray-800',
            ]"
            @click="activeTab = 'overview'"
          >
            📊 学习概览
          </button>
          <button
            :class="[
              'flex-1 py-4 px-6 text-center transition',
              activeTab === 'achievements' ? 'border-b-2 border-purple-500 text-purple-600 font-bold' : 'text-gray-600 hover:text-gray-800',
            ]"
            @click="activeTab = 'achievements'"
          >
            🏆 成就墙
          </button>
          <button
            :class="[
              'flex-1 py-4 px-6 text-center transition',
              activeTab === 'settings' ? 'border-b-2 border-purple-500 text-purple-600 font-bold' : 'text-gray-600 hover:text-gray-800',
            ]"
            @click="activeTab = 'settings'"
          >
            ⚙️ 设置
          </button>
        </div>
      </div>

      <!-- 内容区域 -->
      <div v-if="activeTab === 'overview'" class="space-y-6">
        <h2 class="text-2xl font-bold">学习统计</h2>
        <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div class="bg-gradient-to-br from-blue-500 to-blue-600 text-white rounded-xl p-6">
            <div class="text-3xl font-bold mb-2">15 天</div>
            <div class="text-sm opacity-80">学习天数</div>
          </div>
          <div class="bg-gradient-to-br from-green-500 to-green-600 text-white rounded-xl p-6">
            <div class="text-3xl font-bold mb-2">50 小时</div>
            <div class="text-sm opacity-80">总学习时长</div>
          </div>
          <div class="bg-gradient-to-br from-orange-500 to-orange-600 text-white rounded-xl p-6">
            <div class="text-3xl font-bold mb-2">500 次</div>
            <div class="text-sm opacity-80">练习次数</div>
          </div>
          <div class="bg-gradient-to-br from-purple-500 to-purple-600 text-white rounded-xl p-6">
            <div class="text-3xl font-bold mb-2">85%</div>
            <div class="text-sm opacity-80">平均准确率</div>
          </div>
        </div>
      </div>

      <!-- 成就墙 -->
      <div v-if="activeTab === 'achievements'" class="space-y-6">
        <h2 class="text-2xl font-bold">成就墙 ({{ achievements.filter(a => a.isUnlocked).length }}/{{ achievements.length }})</h2>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div
            v-for="achievement in achievements"
            :key="achievement.key"
            :class="[
              'rounded-xl p-6 transition-all',
              achievement.isUnlocked
                ? 'bg-gradient-to-br from-yellow-100 to-orange-100 border-2 border-yellow-400'
                : 'bg-gray-100 opacity-60',
            ]"
          >
            <div class="flex items-start gap-4">
              <!-- 图标 -->
              <div :class="[
                'w-16 h-16 rounded-full flex items-center justify-center text-3xl',
                achievement.isUnlocked ? 'bg-white shadow-lg' : 'bg-gray-300 grayscale',
              ]">
                {{ achievement.icon }}
              </div>
              
              <!-- 信息 -->
              <div class="flex-1">
                <h3 :class="['font-bold text-lg mb-1', achievement.isUnlocked ? 'text-gray-800' : 'text-gray-500']">
                  {{ achievement.name }}
                </h3>
                <p class="text-sm text-gray-600 mb-3">{{ achievement.description }}</p>
                
                <!-- 进度条 -->
                <div class="w-full bg-gray-300 rounded-full h-2">
                  <div
                    :class="[
                      'h-full rounded-full transition-all',
                      achievement.isUnlocked ? 'bg-gradient-to-r from-yellow-400 to-orange-500' : 'bg-gray-500',
                    ]"
                    :style="{ width: `${Math.min((achievement.progress / achievement.target) * 100, 100)}%` }"
                  ></div>
                </div>
                <div class="text-xs text-gray-600 mt-1">
                  {{ achievement.progress }} / {{ achievement.target }}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- 设置 -->
      <div v-if="activeTab === 'settings'" class="space-y-6">
        <h2 class="text-2xl font-bold">个人设置</h2>
        <div class="bg-white rounded-xl p-6 space-y-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">昵称</label>
            <input type="text" :value="user.username" class="w-full px-4 py-2 border border-gray-300 rounded-lg" />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">邮箱</label>
            <input type="email" :value="user.email" class="w-full px-4 py-2 border border-gray-300 rounded-lg" />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">每日学习提醒</label>
            <input type="time" class="w-full px-4 py-2 border border-gray-300 rounded-lg" />
          </div>
          <button class="w-full py-3 bg-gradient-to-r from-purple-500 to-pink-600 text-white rounded-lg font-bold hover:opacity-90 transition">
            保存设置
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
