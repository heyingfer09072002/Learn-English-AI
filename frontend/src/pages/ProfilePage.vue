<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { apiGet } from '../api/apiClient';

interface User {
  id: number;
  username: string;
  email: string;
  avatar?: string;
  goldCoins: number;
  diamondCoins: number;
}

interface Achievement {
  key: string;
  name: string;
  description: string;
  icon: string;
  isUnlocked: boolean;
  progress: number;
  target: number;
  unlockedAt?: string;
}

const user = ref<User | null>(null);
const achievements = ref<Achievement[]>([]);
const isLoading = ref(true);
const isLoadingAchievements = ref(false);
const activeTab = ref('overview');

// 加载用户信息
async function loadUserInfo() {
  isLoading.value = true;
  try {
    const result = await apiGet<User>('/api/users/profile');
    
    if (result.success && result.data) {
      user.value = result.data;
    } else {
      // 未登录或获取失败，显示空状态
      user.value = null;
    }
  } catch (error) {
    console.error('加载用户信息失败:', error);
    user.value = null;
  } finally {
    isLoading.value = false;
  }
}

// 加载成就列表
async function loadAchievements() {
  isLoadingAchievements.value = true;
  try {
    const result = await apiGet<Achievement[]>('/api/statistics/achievements');
    
    if (result.success && result.data) {
      achievements.value = result.data;
    } else {
      // 无成就数据
      achievements.value = [];
    }
  } catch (error) {
    console.error('加载成就失败:', error);
    achievements.value = [];
  } finally {
    isLoadingAchievements.value = false;
  }
}

// 格式化货币
function formatCoins(amount: number): string {
  return amount.toLocaleString();
}

onMounted(async () => {
  await Promise.all([
    loadUserInfo(),
    loadAchievements(),
  ]);
});
</script>

<template>
  <div class="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50 p-8">
    <div class="max-w-4xl mx-auto">
      <!-- 加载状态 -->
      <div v-if="isLoading" class="text-center py-20">
        <div class="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500 mb-4"></div>
        <p class="text-gray-600">加载用户信息...</p>
      </div>

      <!-- 未登录状态 -->
      <div v-else-if="!user" class="text-center py-20">
        <div class="text-6xl mb-4">👤</div>
        <h2 class="text-2xl font-bold text-gray-800 mb-2">请先登录</h2>
        <p class="text-gray-600 mb-6">登录后可以查看个人信息和成就</p>
        <router-link 
          to="/login"
          class="px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-600 text-white font-bold rounded-lg hover:opacity-90 transition"
        >
          立即登录
        </router-link>
      </div>

      <!-- 用户信息卡片 -->
      <div v-else class="bg-white rounded-2xl shadow-xl p-8 mb-8">
        <div class="flex items-center gap-6">
          <!-- 头像 -->
          <div class="w-24 h-24 rounded-full bg-gradient-to-r from-purple-400 to-pink-500 flex items-center justify-center text-5xl">
            👤
          </div>
          
          <!-- 信息 -->
          <div class="flex-1">
            <h1 class="text-3xl font-bold text-gray-800 mb-2">{{ user.username || '匿名用户' }}</h1>
            <p class="text-gray-600 mb-4">{{ user.email }}</p>
            
            <!-- 货币 -->
            <div class="flex gap-4">
              <div class="flex items-center gap-2 bg-yellow-100 px-4 py-2 rounded-full">
                <span class="text-xl">💰</span>
                <span class="font-bold text-yellow-700">{{ formatCoins(user.goldCoins) }}</span>
              </div>
              <div class="flex items-center gap-2 bg-blue-100 px-4 py-2 rounded-full">
                <span class="text-xl">💎</span>
                <span class="font-bold text-blue-700">{{ formatCoins(user.diamondCoins) }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- 选项卡 -->
      <div class="bg-white rounded-xl shadow-lg mb-8">
        <div class="flex border-b">
          <button
            @click="activeTab = 'overview'"
            :class="[
              'px-6 py-4 font-bold transition',
              activeTab === 'overview'
                ? 'border-b-2 border-purple-500 text-purple-600'
                : 'text-gray-600 hover:text-gray-800',
            ]"
          >
            我的成就
          </button>
          <button
            @click="activeTab = 'settings'"
            :class="[
              'px-6 py-4 font-bold transition',
              activeTab === 'settings'
                ? 'border-b-2 border-purple-500 text-purple-600'
                : 'text-gray-600 hover:text-gray-800',
            ]"
          >
            设置
          </button>
        </div>
      </div>

      <!-- 成就列表 -->
      <div v-if="activeTab === 'overview'">
        <div v-if="isLoadingAchievements" class="text-center py-10">
          <div class="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-purple-500"></div>
        </div>
        
        <div v-else-if="achievements.length === 0" class="text-center py-10 bg-white rounded-xl">
          <div class="text-4xl mb-4">🏆</div>
          <p class="text-gray-600">暂无成就数据</p>
        </div>

        <div v-else class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div
            v-for="achievement in achievements"
            :key="achievement.key"
            :class="[
              'bg-white rounded-xl p-6 shadow-lg transition',
              achievement.isUnlocked ? 'opacity-100' : 'opacity-60',
            ]"
          >
            <div class="flex items-start gap-4">
              <div class="text-4xl">
                {{ achievement.icon }}
              </div>
              <div class="flex-1">
                <h3 class="text-lg font-bold text-gray-800 mb-2">
                  {{ achievement.name }}
                  <span v-if="achievement.isUnlocked" class="ml-2 text-green-600">✅</span>
                </h3>
                <p class="text-sm text-gray-600 mb-3">{{ achievement.description }}</p>
                <div class="bg-gray-200 rounded-full h-3 overflow-hidden">
                  <div
                    :class="[
                      'h-full transition-all',
                      achievement.isUnlocked ? 'bg-gradient-to-r from-yellow-400 to-yellow-600' : 'bg-gray-400',
                    ]"
                    :style="{ width: `${Math.min((achievement.progress / achievement.target) * 100, 100)}%` }"
                  ></div>
                </div>
                <p class="text-xs text-gray-500 mt-2">
                  {{ achievement.progress }} / {{ achievement.target }}
                  <span v-if="achievement.unlockedAt" class="ml-2">
                    解锁于 {{ new Date(achievement.unlockedAt).toLocaleDateString() }}
                  </span>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- 设置 -->
      <div v-if="activeTab === 'settings'" class="bg-white rounded-xl p-6">
        <h3 class="text-xl font-bold text-gray-800 mb-6">账号设置</h3>
        
        <div class="space-y-4">
          <div class="flex justify-between items-center py-3 border-b">
            <span class="text-gray-700">账号状态</span>
            <span class="text-green-600 font-bold">正常</span>
          </div>
          <div class="flex justify-between items-center py-3 border-b">
            <span class="text-gray-700">邮箱</span>
            <span class="text-gray-800">{{ user?.email }}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
