<template>
  <div class="text-center space-y-6">
    <!-- 英文句子 -->
    <div class="space-y-4">
      <div class="text-6xl font-black text-white leading-tight drop-shadow-2xl">
        {{ englishSentence }}
      </div>
      
      <!-- 音标 -->
      <div v-if="phonetic" class="flex items-center justify-center space-x-3">
        <span class="px-4 py-1.5 bg-blue-500/20 border border-blue-400/30 rounded-full text-blue-300 font-mono text-lg">
          {{ phonetic }}
        </span>
      </div>
    </div>

    <!-- 中文翻译 -->
    <div v-if="chineseTranslation" class="text-4xl font-bold text-gray-300 leading-relaxed">
      {{ chineseTranslation }}
    </div>

    <!-- 分词展示 -->
    <div v-if="segments && segments.length > 0" class="flex items-center justify-center flex-wrap gap-3 pt-4">
      <div 
        v-for="(segment, index) in segments" 
        :key="index"
        class="group relative px-5 py-3 bg-gradient-to-br from-blue-500/20 to-purple-500/20 border border-white/10 rounded-2xl hover:border-blue-400/50 hover:scale-105 transition-all cursor-pointer"
      >
        <div class="text-xl font-bold text-white">{{ segment.word }}</div>
        <div v-if="segment.meaning" class="text-sm text-gray-400 mt-1">{{ segment.meaning }}</div>
      </div>
    </div>

    <!-- 答案区域 -->
    <div v-if="showAnswer" class="pt-6">
      <div class="inline-block px-8 py-4 bg-gradient-to-r from-green-500/20 to-emerald-500/20 border border-green-400/30 rounded-2xl">
        <div class="text-lg font-bold text-green-400 mb-2">正确答案</div>
        <div class="text-3xl font-bold text-white">{{ answerText }}</div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
interface Segment {
  word: string
  meaning?: string
}

defineProps<{
  englishSentence: string
  chineseTranslation?: string
  phonetic?: string
  segments?: Segment[]
  showAnswer: boolean
  answerText?: string
}>()
</script>
