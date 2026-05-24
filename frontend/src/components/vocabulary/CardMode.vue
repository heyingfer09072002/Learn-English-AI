<template>
  <div class="p-8 bg-gradient-to-br from-white/[0.05] to-white/[0.02] border border-white/10 rounded-3xl backdrop-blur-sm">
    <!-- 进度条 -->
    <div class="mb-8">
      <div class="flex items-center justify-between mb-4">
        <span class="text-lg font-semibold">学习进度</span>
        <span class="text-cyan-400 font-bold">{{ currentIndex + 1 }}/{{ words.length }}</span>
      </div>
      <div class="w-full bg-white/10 rounded-full h-3">
        <div 
          class="bg-gradient-to-r from-cyan-500 to-blue-500 h-3 rounded-full transition-all duration-500"
          :style="{ width: `${((currentIndex + 1) / words.length) * 100}%` }"
        ></div>
      </div>
    </div>

    <!-- 卡片区域 -->
    <div 
      v-if="currentWord"
      class="relative w-full max-w-3xl mx-auto mb-8"
      @click="flipCard"
    >
      <div 
        class="relative w-full h-96 cursor-pointer transition-transform duration-500 transform-style-preserve-3d"
        :class="{ 'rotate-y-180': isFlipped }"
      >
        <!-- 卡片正面 -->
        <div class="absolute w-full h-full bg-gradient-to-br from-blue-500/20 to-blue-600/20 border-2 border-blue-500/30 rounded-3xl p-10 backface-hidden">
          <div class="flex flex-col items-center justify-center h-full">
            <h2 class="text-6xl font-black mb-6">{{ currentWord.word }}</h2>
            <div class="flex items-center gap-4 text-xl text-gray-300">
              <span v-if="currentWord.phoneticUk">{{ currentWord.phoneticUk }}</span>
              <button 
                @click.stop="playAudio('uk')"
                class="w-10 h-10 bg-blue-500/30 hover:bg-blue-500/50 rounded-full flex items-center justify-center transition-colors"
              >
                <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M18 3a1 1 0 00-1.196-.98l-10 2A1 1 0 006 5v9.114A4.369 4.369 0 005 14c-1.657 0-3 .895-3 2s1.343 2 3 2 3-.895 3-2V7.82l8-1.6v5.894A4.37 4.37 0 0015 17c1.657 0 3-.895 3-2s-1.343-2-3-2a4.37 4.37 0 00-2.246-.628V5.82l8 1.6a1 1 0 001.196-.98V3z"/>
                </svg>
              </button>
            </div>
            <p class="text-gray-400 mt-8 text-sm">点击卡片查看释义</p>
          </div>
        </div>

        <!-- 卡片背面 -->
        <div class="absolute w-full h-full bg-gradient-to-br from-purple-500/20 to-purple-600/20 border-2 border-purple-500/30 rounded-3xl p-10 rotate-y-180 backface-hidden overflow-y-auto">
          <div class="h-full overflow-y-auto">
            <h2 class="text-4xl font-black mb-6">{{ currentWord.word }}</h2>
            
            <div v-for="(pos, index) in currentWord.pos" :key="index" class="mb-6">
              <div class="flex items-center gap-3 mb-3">
                <span class="px-3 py-1 bg-purple-500/30 text-purple-300 text-sm font-bold rounded-full">
                  {{ pos.pos }}
                </span>
                <span v-if="pos.rootAffix" class="text-sm text-gray-400">
                  {{ pos.rootAffix }}
                </span>
              </div>
              
              <div class="space-y-2">
                <div v-for="(def, i) in pos.definitionCn" :key="i" class="text-lg">
                  <span class="text-gray-300">{{ i + 1 }}. {{ def }}</span>
                </div>
                <p v-if="pos.definitionEn" class="text-sm text-gray-400 italic">
                  {{ pos.definitionEn }}
                </p>
                <p v-if="pos.memoryTip" class="text-sm text-cyan-400">
                  💡 {{ pos.memoryTip }}
                </p>
              </div>
            </div>

            <div v-if="currentWord.sentences && currentWord.sentences.length > 0" class="mt-6">
              <h3 class="text-lg font-bold mb-3">例句</h3>
              <div v-for="(sentence, index) in currentWord.sentences" :key="index" class="mb-4">
                <p class="text-gray-300 mb-1">{{ sentence.sentenceEn }}</p>
                <p class="text-gray-400 text-sm">{{ sentence.sentenceCn }}</p>
              </div>
            </div>

            <div v-if="currentWord.synonyms?.length" class="mt-4">
              <span class="text-sm text-gray-400">同义词：</span>
              <span class="text-sm text-cyan-400">{{ currentWord.synonyms.join(', ') }}</span>
            </div>
            
            <div v-if="currentWord.antonyms?.length" class="mt-2">
              <span class="text-sm text-gray-400">反义词：</span>
              <span class="text-sm text-purple-400">{{ currentWord.antonyms.join(', ') }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 控制按钮 -->
    <div class="flex items-center justify-center gap-6">
      <button 
        @click="markAsUnknown"
        class="px-8 py-4 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-500 hover:to-red-600 rounded-2xl font-bold text-lg transition-all transform hover:scale-105"
      >
        ❌ 不认识
      </button>
      
      <button 
        @click="flipCard"
        class="px-8 py-4 bg-gradient-to-r from-gray-600 to-gray-700 hover:from-gray-500 hover:to-gray-600 rounded-2xl font-bold text-lg transition-all transform hover:scale-105"
      >
        🔄 翻转
      </button>
      
      <button 
        @click="markAsKnown"
        class="px-8 py-4 bg-gradient-to-r from-green-600 to-green-700 hover:from-green-500 hover:to-green-600 rounded-2xl font-bold text-lg transition-all transform hover:scale-105"
      >
        ✅ 认识
      </button>
    </div>

    <!-- 学习结果 -->
    <div v-if="isCompleted" class="mt-8 p-6 bg-gradient-to-br from-green-500/20 to-green-600/20 border border-green-500/30 rounded-2xl">
      <h3 class="text-2xl font-bold mb-4 text-center">🎉 学习完成！</h3>
      <div class="grid grid-cols-3 gap-6 text-center">
        <div>
          <div class="text-3xl font-black text-green-400">{{ knownWords.length }}</div>
          <div class="text-sm text-gray-400">已掌握</div>
        </div>
        <div>
          <div class="text-3xl font-black text-red-400">{{ unknownWords.length }}</div>
          <div class="text-sm text-gray-400">需复习</div>
        </div>
        <div>
          <div class="text-3xl font-black text-cyan-400">{{ Math.round((knownWords.length / words.length) * 100) }}%</div>
          <div class="text-sm text-gray-400">掌握率</div>
        </div>
      </div>
      <button 
        @click="$emit('complete', result)"
        class="w-full mt-6 py-4 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 rounded-xl font-bold transition-all"
      >
        完成学习
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { api } from '@/api'

const props = defineProps<{
  words: any[]
  groupId: number
}>()

const emit = defineEmits<{
  complete: [result: any]
  'progress-update': [progress: any]
}>()

const currentIndex = ref(0)
const isFlipped = ref(false)
const knownWords = ref<number[]>([])
const unknownWords = ref<number[]>([])
const isCompleted = ref(false)

const currentWord = computed(() => {
  return props.words[currentIndex.value]
})

const result = computed(() => ({
  groupId: props.groupId,
  learnedWords: props.words.length,
  knownWords: knownWords.value.length,
  unknownWords: unknownWords.value.length,
  timeSpent: Math.floor((Date.now() - startTime.value) / 1000),
  completedAt: new Date().toISOString()
}))

const startTime = ref(Date.now())

// 翻转卡片
const flipCard = () => {
  isFlipped.value = !isFlipped.value
}

// 播放音频
const playAudio = (accent: 'uk' | 'us') => {
  // TODO: 实现音频播放
  console.log('播放音频:', accent)
}

// 标记为认识
const markAsKnown = async () => {
  if (!currentWord.value) return
  
  knownWords.value.push(currentWord.value.id)
  
  try {
    await api.recordLearning(currentWord.value.id, 'complete', 10)
  } catch (error) {
    console.error('记录学习失败:', error)
  }
  
  nextWord()
}

// 标记为不认识
const markAsUnknown = async () => {
  if (!currentWord.value) return
  
  unknownWords.value.push(currentWord.value.id)
  
  try {
    await api.recordLearning(currentWord.value.id, 'review', 10)
  } catch (error) {
    console.error('记录学习失败:', error)
  }
  
  nextWord()
}

// 下一个单词
const nextWord = () => {
  isFlipped.value = false
  
  if (currentIndex.value < props.words.length - 1) {
    currentIndex.value++
  } else {
    isCompleted.value = true
  }
}

// 键盘快捷键
const handleKeydown = (e: KeyboardEvent) => {
  if (isCompleted.value) return
  
  if (e.code === 'Space') {
    e.preventDefault()
    flipCard()
  } else if (e.code === 'ArrowRight') {
    markAsKnown()
  } else if (e.code === 'ArrowLeft') {
    markAsUnknown()
  }
}

onMounted(() => {
  window.addEventListener('keydown', handleKeydown)
})

onUnmounted(() => {
  window.removeEventListener('keydown', handleKeydown)
})
</script>

<style scoped>
.transform-style-preserve-3d {
  transform-style: preserve-3d;
}

.backface-hidden {
  backface-visibility: hidden;
}

.rotate-y-180 {
  transform: rotateY(180deg);
}
</style>
