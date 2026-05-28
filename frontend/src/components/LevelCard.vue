<template>
  <div class="bg-gradient-to-r from-purple-600 to-pink-600 rounded-xl shadow-lg p-6 text-white">
    <div class="flex items-center justify-between mb-4">
      <div class="flex items-center gap-4">
        <div class="text-6xl">{{ levelInfo.icon }}</div>
        <div>
          <div class="text-2xl font-bold">{{ levelInfo.title }}</div>
          <div class="text-sm opacity-80">等级 {{ levelInfo.level }}</div>
        </div>
      </div>
      <div class="text-right">
        <div class="text-3xl font-bold">{{ achievementsUnlocked }}</div>
        <div class="text-sm opacity-80">已解锁成就</div>
      </div>
    </div>
    
    <!-- 经验条 -->
    <div class="mb-2">
      <div class="flex items-center justify-between text-sm mb-2">
        <span>经验值：{{ levelInfo.experience }} / {{ levelInfo.expToNextLevel || 'MAX' }}</span>
        <span v-if="levelInfo.nextLevel">升级还需 {{ levelInfo.expNeeded }}</span>
      </div>
      <div class="h-4 bg-white bg-opacity-30 rounded-full overflow-hidden">
        <div
          class="h-full bg-gradient-to-r from-yellow-400 to-orange-400 transition-all"
          :style="{ width: `${levelInfo.percent}%` }"
        ></div>
      </div>
    </div>
    
    <!-- 快捷链接 -->
    <div class="flex gap-2 mt-4">
      <router-link
        to="/achievements"
        class="flex-1 py-2 bg-white bg-opacity-20 rounded-lg text-center text-sm hover:bg-opacity-30 transition"
      >
        查看详细成就 →
      </router-link>
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  levelInfo: {
    level: number
    title: string
    experience: number
    icon: string
    percent: number
    expNeeded: number
    expToNextLevel: number | null
    nextLevel: number | null
  }
  achievementsUnlocked: number
}>()
</script>
