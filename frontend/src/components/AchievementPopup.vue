<template>
  <div v-if="visible" class="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 animate-fade-in">
    <div class="bg-gradient-to-br from-purple-600 via-pink-600 to-red-600 rounded-2xl p-8 max-w-md mx-4 shadow-2xl transform animate-bounce-in">
      <!-- 庆祝图标 -->
      <div class="text-center mb-6">
        <div class="text-7xl mb-4 animate-pulse">{{ popupData.icon || '🎉' }}</div>
        <h2 class="text-3xl font-bold text-white mb-2">{{ popupData.title }}</h2>
        <p class="text-white text-opacity-90">{{ popupData.message }}</p>
      </div>

      <!-- 升级信息 -->
      <div v-if="popupData.type === 'levelup'" class="bg-white bg-opacity-20 rounded-xl p-4 mb-4">
        <div class="flex items-center justify-between text-white">
          <div>
            <div class="text-sm opacity-80">升级到</div>
            <div class="text-2xl font-bold">{{ popupData.newTitle }}</div>
          </div>
          <div class="text-5xl">{{ popupData.newIcon }}</div>
        </div>
      </div>

      <!-- 成就信息 -->
      <div v-if="popupData.type === 'achievement'" class="bg-white bg-opacity-20 rounded-xl p-4 mb-4">
        <div class="flex items-center gap-4 text-white">
          <div class="text-5xl">{{ popupData.achievementIcon }}</div>
          <div>
            <div class="text-lg font-bold">{{ popupData.achievementName }}</div>
            <div class="text-sm opacity-80">{{ popupData.achievementDesc }}</div>
          </div>
        </div>
      </div>

      <!-- 经验值动画 -->
      <div v-if="popupData.expGained" class="bg-yellow-500 rounded-xl p-3 mb-4 text-center">
        <div class="text-white font-bold text-xl">+{{ popupData.expGained }} 经验值</div>
      </div>

      <!-- 关闭按钮 -->
      <button
        @click="close"
        class="w-full py-3 bg-white text-purple-600 font-bold rounded-xl hover:bg-opacity-90 transition"
      >
        太棒了！
      </button>
    </div>

    <!-- 背景烟花效果 -->
    <div class="absolute inset-0 pointer-events-none overflow-hidden">
      <div
        v-for="i in 10"
        :key="i"
        class="absolute w-2 h-2 rounded-full animate-firework"
        :style="{
          backgroundColor: ['#FFD700', '#FF69B4', '#00CED1', '#7CFC00', '#FF6347'][i % 5],
          left: `${Math.random() * 100}%`,
          top: `${Math.random() * 100}%`,
          animationDelay: `${Math.random() * 0.5}s`,
          animationDuration: `${0.5 + Math.random() * 0.5}s`
        }"
      ></div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'

const visible = ref(false)
const popupData = ref<any>({
  type: 'achievement',
  title: '🎉 新成就解锁',
  message: '',
  icon: '🏆',
})

let closeTimeout: any = null

function show(data: any) {
  popupData.value = { ...popupData.value, ...data }
  visible.value = true
  
  // 5 秒后自动关闭（除非用户点击关闭）
  clearTimeout(closeTimeout)
  closeTimeout = setTimeout(() => {
    close()
  }, 5000)
}

function close() {
  visible.value = false
}

defineExpose({ show })
</script>

<style scoped>
@keyframes bounce-in {
  0% { transform: scale(0.3); opacity: 0; }
  50% { transform: scale(1.05); }
  70% { transform: scale(0.9); }
  100% { transform: scale(1); opacity: 1; }
}

@keyframes fade-in {
  from { opacity: 0; }
  to { opacity: 1; }
}

@keyframes firework {
  0% { transform: scale(0); opacity: 1; }
  100% { transform: scale(1.5); opacity: 0; }
}

.animate-bounce-in {
  animation: bounce-in 0.6s ease-out;
}

.animate-fade-in {
  animation: fade-in 0.3s ease-out;
}

.animate-firework {
  animation: firework 1s ease-out infinite;
}
</style>
