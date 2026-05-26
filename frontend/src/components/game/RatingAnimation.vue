<script setup lang="ts">
import { computed, onMounted, ref } from 'vue';

interface Props {
  level: 'C' | 'B' | 'A' | 'S' | 'SS' | 'SSS';
  accuracy: number;
  score: number;
  bestCombo: number;
  show?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  show: true,
});

const emit = defineEmits<{
  close: [];
}>();

const visible = ref(props.show);
const currentScore = ref(0);

// 颜色映射
const ratingColors: Record<string, string> = {
  SSS: 'from-yellow-400 via-orange-500 to-red-500',
  SS: 'from-gray-300 via-gray-400 to-gray-500',
  S: 'from-orange-300 via-orange-400 to-orange-500',
  A: 'from-blue-400 via-blue-500 to-blue-600',
  B: 'from-green-400 via-green-500 to-green-600',
  C: 'from-gray-400 via-gray-500 to-gray-600',
};

const ratingEmojis: Record<string, string> = {
  SSS: '🏆',
  SS: '⭐',
  S: '✨',
  A: '👍',
  B: '💪',
  C: '🔥',
};

// 评级描述
const ratingDescriptions: Record<string, string> = {
  SSS: '完美无缺！',
  SS: '非常出色！',
  S: '做得很好！',
  A: '不错的表现！',
  B: '继续努力！',
  C: '不要放弃！',
};

// 分数动画
onMounted(() => {
  const duration = 1500;
  const steps = 60;
  const increment = props.score / steps;
  let current = 0;

  const timer = setInterval(() => {
    current += increment;
    if (current >= props.score) {
      current = props.score;
      clearInterval(timer);
    }
    currentScore.value = Math.floor(current);
  }, duration / steps);
});

const close = () => {
  visible.value = false;
  emit('close');
};
</script>

<template>
  <Transition name="rating" appear>
    <div v-if="visible" class="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4">
      <div class="bg-white rounded-2xl p-8 max-w-md w-full text-center shadow-2xl">
        <!-- 评级徽章 -->
        <div 
          :class="[
            'w-32 h-32 mx-auto rounded-full bg-gradient-to-r flex items-center justify-center mb-4 animate-bounce',
            ratingColors[level],
          ]"
        >
          <span class="text-6xl">{{ ratingEmojis[level] }}</span>
        </div>

        <!-- 评级等级 -->
        <h2 :class="[
          'text-6xl font-bold mb-2',
          level === 'SSS' ? 'text-yellow-500' :
          level === 'SS' ? 'text-gray-400' :
          level === 'S' ? 'text-orange-500' :
          level === 'A' ? 'text-blue-500' :
          level === 'B' ? 'text-green-500' : 'text-gray-500',
        ]">
          {{ level }}
        </h2>

        <!-- 描述 -->
        <p class="text-xl text-gray-600 mb-6">
          {{ ratingDescriptions[level] }}
        </p>

        <!-- 统计数据 -->
        <div class="grid grid-cols-3 gap-4 mb-6">
          <div class="bg-gray-100 p-3 rounded-lg">
            <div class="text-2xl font-bold text-blue-500">{{ accuracy * 100 }}%</div>
            <div class="text-xs text-gray-500">准确率</div>
          </div>
          <div class="bg-gray-100 p-3 rounded-lg">
            <div class="text-2xl font-bold text-green-500">{{ bestCombo }}</div>
            <div class="text-xs text-gray-500">连击</div>
          </div>
          <div class="bg-gray-100 p-3 rounded-lg">
            <div class="text-2xl font-bold text-orange-500">{{ currentScore }}</div>
            <div class="text-xs text-gray-500">得分</div>
          </div>
        </div>

        <!-- 关闭按钮 -->
        <button
          @click="close"
          class="w-full bg-gradient-to-r from-blue-500 to-purple-600 text-white py-3 rounded-lg font-bold hover:opacity-90 transition"
        >
          继续
        </button>
      </div>
    </div>
  </Transition>
</template>

<style scoped>
.rating-enter-active,
.rating-leave-active {
  transition: all 0.3s ease;
}

.rating-enter-from {
  opacity: 0;
}

.rating-enter-to {
  opacity: 1;
}

.rating-leave-from {
  opacity: 1;
}

.rating-leave-to {
  opacity: 0;
}
</style>
