<script setup lang="ts">
import { computed } from 'vue';

interface Props {
  count: number;
  maxCombo: number;
  multiplier: number;
  isPerfect?: boolean;
  isGreat?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  isPerfect: false,
  isGreat: false,
});

// 计算样式
const comboStyle = computed(() => {
  const scale = 1 + Math.min(props.count / 50, 0.5);
  return {
    transform: `scale(${scale})`,
  };
});

// 颜色映射
const comboColor = computed(() => {
  if (props.isPerfect) return 'from-yellow-400 to-orange-500';
  if (props.isGreat) return 'from-purple-400 to-pink-500';
  if (props.count >= 10) return 'from-blue-400 to-cyan-500';
  if (props.count >= 5) return 'from-green-400 to-emerald-500';
  return 'from-gray-400 to-gray-600';
});

// 显示消息
const message = computed(() => {
  if (props.isPerfect) return '🔥 Perfect!';
  if (props.isGreat) return '✨ Great!';
  if (props.count >= 10) return '🎯 Amazing!';
  if (props.count >= 5) return '👍 Good!';
  return '';
});
</script>

<template>
  <Transition name="combo" appear>
    <div v-if="count > 0" class="fixed top-20 left-1/2 transform -translate-x-1/2 z-50 pointer-events-none">
      <!-- 连击数字 -->
      <div
        :style="comboStyle"
        :class="[
          'px-6 py-3 rounded-full bg-gradient-to-r text-white font-bold shadow-lg',
          comboColor,
        ]"
      >
        <div class="text-4xl md:text-6xl">
          {{ count }} <span class="text-lg md:text-2xl">Combo</span>
        </div>
        
        <!-- 消息 -->
        <div v-if="message" class="text-sm md:text-base mt-1 animate-pulse">
          {{ message }}
        </div>
        
        <!-- 倍数 -->
        <div v-if="multiplier > 1.0" class="text-xs md:text-sm mt-1 bg-white/20 px-2 py-1 rounded inline-block">
          x{{ multiplier.toFixed(1) }} Score
        </div>
      </div>
      
      <!-- 进度条 -->
      <div class="mt-2 w-48 md:w-64 h-2 bg-gray-700 rounded-full overflow-hidden">
        <div
          :class="['h-full bg-gradient-to-r transition-all duration-300', comboColor]"
          :style="{ width: `${Math.min((count / 50) * 100, 100)}%` }"
        />
      </div>
    </div>
  </Transition>
</template>

<style scoped>
.combo-enter-active,
.combo-leave-active {
  transition: all 0.3s ease;
}

.combo-enter-from {
  opacity: 0;
  transform: translate(-50%, -20px);
}

.combo-leave-to {
  opacity: 0;
  transform: translate(-50%, 20px);
}
</style>
