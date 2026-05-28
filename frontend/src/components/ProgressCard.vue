<template>
  <div class="bg-white rounded-xl shadow-lg p-6">
    <!-- 课程标题 -->
    <div class="flex items-center justify-between mb-4">
      <h3 class="text-lg font-bold text-gray-800">{{ title }}</h3>
      <span :class="[
        'px-3 py-1 text-xs font-bold rounded-full',
        difficultyColors[difficulty]
      ]">
        {{ difficultyText }}
      </span>
    </div>

    <!-- 进度条 -->
    <div class="mb-4">
      <div class="flex justify-between text-sm mb-2">
        <span class="text-gray-600">学习进度</span>
        <span class="font-bold text-indigo-600">{{ completed }}/{{ total }}</span>
      </div>
      <div class="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
        <div
          class="h-full bg-gradient-to-r from-indigo-500 to-purple-500 transition-all duration-500"
          :style="{ width: `${progress}%` }"
        ></div>
      </div>
      <div class="text-right text-xs text-gray-500 mt-1">{{ progress }}%</div>
    </div>

    <!-- 统计数据 -->
    <div class="grid grid-cols-3 gap-4 text-center">
      <div>
        <div class="text-2xl font-bold text-green-600">{{ completed }}</div>
        <div class="text-xs text-gray-500">已掌握</div>
      </div>
      <div>
        <div class="text-2xl font-bold text-yellow-600">{{ learning }}</div>
        <div class="text-xs text-gray-500">学习中</div>
      </div>
      <div>
        <div class="text-2xl font-bold text-gray-600">{{ newCount }}</div>
        <div class="text-xs text-gray-500">未学习</div>
      </div>
    </div>

    <!-- 最后学习时间 -->
    <div v-if="lastPracticed" class="mt-4 pt-4 border-t text-xs text-gray-500">
      最后学习：{{ formatDate(lastPracticed) }}
    </div>

    <!-- 操作按钮 -->
    <div class="mt-4 flex gap-2">
      <button
        @click="$emit('continue')"
        class="flex-1 bg-indigo-600 text-white py-2 rounded-lg text-sm font-semibold hover:bg-indigo-700 transition"
      >
        继续学习
      </button>
      <button
        v-if="progress > 0"
        @click="$emit('reset')"
        class="px-4 py-2 border border-gray-300 text-gray-600 rounded-lg text-sm hover:bg-gray-50 transition"
      >
        重置
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
interface Props {
  title: string
  difficulty: 'beginner' | 'intermediate' | 'advanced'
  total: number
  completed: number
  learning: number
  lastPracticed?: string | null
}

defineProps<Props>()
defineEmits<{
  continue: []
  reset: []
}>()

const difficultyColors = {
  beginner: 'bg-green-100 text-green-600',
  intermediate: 'bg-yellow-100 text-yellow-600',
  advanced: 'bg-red-100 text-red-600'
}

const difficultyText = {
  beginner: '初级',
  intermediate: '中级',
  advanced: '高级'
}

const formatDate = (dateStr: string) => {
  const date = new Date(dateStr)
  const now = new Date()
  const diff = now.getTime() - date.getTime()
  const days = Math.floor(diff / (1000 * 60 * 60 * 24))
  
  if (days === 0) return '今天'
  if (days === 1) return '昨天'
  if (days < 7) return `${days}天前`
  return date.toLocaleDateString('zh-CN')
}
</script>
