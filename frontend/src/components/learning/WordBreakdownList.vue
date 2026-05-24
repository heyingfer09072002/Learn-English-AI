<template>
  <div class="space-y-6">
    <div class="flex items-center space-x-3 mb-6">
      <svg class="w-6 h-6 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
      </svg>
      <h3 class="text-xl font-bold text-white">句子结构解析</h3>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      <div 
        v-for="(word, index) in words" 
        :key="index"
        class="group p-5 bg-gradient-to-br from-white/[0.05] to-white/[0.02] border border-white/10 rounded-2xl hover:border-blue-400/50 transition-all duration-300"
        :style="{ animationDelay: `${index * 100}ms` }"
      >
        <div class="flex items-start justify-between mb-3">
          <div>
            <div class="text-2xl font-bold text-white mb-1">{{ word.text }}</div>
            <div v-if="word.phonetic" class="text-sm text-gray-400 font-mono">{{ word.phonetic }}</div>
          </div>
          <span 
            class="px-3 py-1 rounded-full text-xs font-bold"
            :class="getPosColor(word.pos)"
          >
            {{ word.pos }}
          </span>
        </div>
        
        <div class="space-y-2">
          <div class="text-sm text-gray-300">
            <span class="text-gray-500">释义：</span>
            {{ word.meaning }}
          </div>
          
          <div v-if="word.example" class="text-sm text-gray-400 italic">
            <span class="text-gray-500">例句：</span>
            {{ word.example }}
          </div>
        </div>

        <div class="mt-4 pt-4 border-t border-white/10">
          <div class="text-xs text-gray-500">角色</div>
          <div class="text-sm text-blue-400 font-medium">{{ word.role }}</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
interface Word {
  text: string
  phonetic?: string
  pos: string
  meaning: string
  role: string
  example?: string
}

defineProps<{
  words: Word[]
}>()

const getPosColor = (pos: string) => {
  const colors: Record<string, string> = {
    'n.': 'bg-blue-500/20 text-blue-400',
    'v.': 'bg-purple-500/20 text-purple-400',
    'adj.': 'bg-cyan-500/20 text-cyan-400',
    'adv.': 'bg-orange-500/20 text-orange-400',
    'prep.': 'bg-green-500/20 text-green-400',
    'pron.': 'bg-pink-500/20 text-pink-400',
    'art.': 'bg-yellow-500/20 text-yellow-400',
    'conj.': 'bg-red-500/20 text-red-400'
  }
  return colors[pos] || 'bg-gray-500/20 text-gray-400'
}
</script>

<style scoped>
@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.grid > div {
  animation: fadeInUp 0.5s ease-out forwards;
}
</style>
