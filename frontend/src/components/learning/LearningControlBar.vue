<template>
  <div class="flex items-center justify-center space-x-6">
    <!-- 上一句 -->
    <button 
      @click="$emit('prev')"
      class="group p-5 bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/30 rounded-2xl transition-all"
      title="上一句 (←)"
    >
      <svg class="w-8 h-8 text-gray-400 group-hover:text-white transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
      </svg>
    </button>

    <!-- 慢速播放 -->
    <button 
      @click="$emit('toggleSlow')"
      class="group relative p-5 border rounded-2xl transition-all"
      :class="isSlowMode 
        ? 'bg-purple-500/20 border-purple-400/50 text-purple-400' 
        : 'bg-white/5 border-white/10 hover:border-white/30 text-gray-400 hover:text-white'"
      title="慢速播放 (S)"
    >
      <svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
      <span class="absolute -bottom-6 left-1/2 -translate-x-1/2 text-xs font-medium">慢速</span>
    </button>

    <!-- 播放/暂停 -->
    <button 
      @click="$emit('togglePlay')"
      class="group p-8 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 rounded-2xl transition-all transform hover:scale-105 shadow-lg shadow-blue-500/30"
      :title="isPlaying ? '暂停 (空格)' : '播放 (空格)'"
    >
      <svg v-if="!isPlaying" class="w-10 h-10 text-white ml-1" fill="currentColor" viewBox="0 0 24 24">
        <path d="M8 5v14l11-7z" />
      </svg>
      <svg v-else class="w-10 h-10 text-white" fill="currentColor" viewBox="0 0 24 24">
        <path d="M6 4h4v16H6V4zm8 0h4v16h-4V4z" />
      </svg>
    </button>

    <!-- 显示答案 -->
    <button 
      @click="$emit('toggleAnswer')"
      class="group relative p-5 border rounded-2xl transition-all"
      :class="isAnswerVisible 
        ? 'bg-green-500/20 border-green-400/50 text-green-400' 
        : 'bg-white/5 border-white/10 hover:border-white/30 text-gray-400 hover:text-white'"
      title="显示答案 (A)"
    >
      <svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
      </svg>
      <span class="absolute -bottom-6 left-1/2 -translate-x-1/2 text-xs font-medium">答案</span>
    </button>

    <!-- 下一句 -->
    <button 
      @click="$emit('next')"
      class="group p-5 bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/30 rounded-2xl transition-all"
      title="下一句 (→)"
    >
      <svg class="w-8 h-8 text-gray-400 group-hover:text-white transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
      </svg>
    </button>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  isPlaying: boolean
  isSlowMode: boolean
  isAnswerVisible: boolean
}>()

defineEmits<{
  togglePlay: []
  toggleSlow: []
  toggleAnswer: []
  prev: []
  next: []
}>()
</script>
