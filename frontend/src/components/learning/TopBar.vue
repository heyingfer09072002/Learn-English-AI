<template>
  <div class="flex items-center justify-between px-8 py-4 border-b border-white/10 bg-[#0a0e27]/60 backdrop-blur-xl">
    <button 
      @click="$emit('back')"
      class="p-3 hover:bg-white/10 rounded-xl transition-all flex items-center space-x-2 group"
    >
      <svg class="w-6 h-6 text-gray-400 group-hover:text-white transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
      </svg>
      <span class="text-gray-400 group-hover:text-white transition-colors">返回</span>
    </button>
    
    <h1 class="text-2xl font-bold text-white">{{ title }}</h1>
    
    <div class="flex items-center space-x-4">
      <div class="flex items-center space-x-2 px-4 py-2 bg-white/5 rounded-xl border border-white/10">
        <div class="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
        <span class="text-sm text-gray-300">Learning Mode</span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  title: string
}>()

defineEmits<{
  back: []
}>()
</script>
