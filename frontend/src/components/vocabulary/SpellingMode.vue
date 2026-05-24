<template>
  <div class="p-8 bg-gradient-to-br from-white/[0.05] to-white/[0.02] border border-white/10 rounded-3xl backdrop-blur-sm">
    <!-- 进度条 -->
    <div class="mb-8">
      <div class="flex items-center justify-between mb-4">
        <span class="text-lg font-semibold">拼写练习</span>
        <span class="text-cyan-400 font-bold">{{ currentIndex + 1 }}/{{ words.length }}</span>
      </div>
      <div class="w-full bg-white/10 rounded-full h-3">
        <div 
          class="bg-gradient-to-r from-green-500 to-emerald-500 h-3 rounded-full transition-all duration-500"
          :style="{ width: `${((currentIndex + 1) / words.length) * 100}%` }"
        ></div>
      </div>
    </div>

    <!-- 拼写区域 -->
    <div v-if="currentWord && !showResult" class="relative w-full max-w-3xl mx-auto mb-8">
      <div class="bg-gradient-to-br from-green-500/20 to-emerald-600/20 border-2 border-green-500/30 rounded-3xl p-10">
        <!-- 显示中文释义和词性 -->
        <div class="text-center mb-8">
          <div v-if="currentWord.pos && currentWord.pos.length > 0" class="mb-4">
            <span class="px-4 py-2 bg-green-500/30 text-green-300 text-lg font-bold rounded-full">
              {{ currentWord.pos[0].pos }}
            </span>
          </div>
          <p class="text-3xl font-bold text-white mb-4">
            {{ currentWord.pos && currentWord.pos[0] ? currentWord.pos[0].definitionCn[0] : '暂无释义' }}
          </p>
          <p v-if="currentWord.pos && currentWord.pos[0]?.definitionEn" class="text-xl text-gray-400 italic">
            {{ currentWord.pos[0].definitionEn }}
          </p>
        </div>

        <!-- 输入框 -->
        <div class="mb-6">
          <input
            v-model="userSpelling"
            type="text"
            @keyup.enter="checkSpelling"
            :disabled="isChecking"
            class="w-full px-6 py-4 bg-white/10 border-2 border-green-500/30 rounded-2xl text-3xl text-center font-bold text-white placeholder-gray-500 focus:outline-none focus:border-green-500/60 transition-colors"
            placeholder="输入英文单词..."
            autocomplete="off"
          />
        </div>

        <!-- 提示信息 -->
        <div class="flex items-center justify-center gap-4 mb-6">
          <button
            @click="showFirstLetter"
            :disabled="hintsUsed >= 1"
            class="px-4 py-2 bg-yellow-500/30 hover:bg-yellow-500/50 disabled:bg-gray-500/30 rounded-xl text-sm font-bold transition-colors"
          >
            💡 首字母提示 ({{ hintsUsed }}/1)
          </button>
          <button
            @click="playAudio"
            class="px-4 py-2 bg-blue-500/30 hover:bg-blue-500/50 rounded-xl text-sm font-bold transition-colors"
          >
            🔊 播放读音
          </button>
        </div>

        <!-- 提交按钮 -->
        <button
          @click="checkSpelling"
          :disabled="!userSpelling.trim() || isChecking"
          class="w-full py-4 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-500 hover:to-emerald-500 disabled:from-gray-600 disabled:to-gray-700 rounded-2xl font-bold text-xl transition-all transform hover:scale-105 disabled:transform-none"
        >
          {{ isChecking ? '检查中...' : '提交答案' }}
        </button>
      </div>
    </div>

    <!-- 结果显示 -->
    <div v-if="showResult && currentWord" class="relative w-full max-w-3xl mx-auto mb-8">
      <div :class="isCorrect ? 'bg-gradient-to-br from-green-500/20 to-green-600/20 border-green-500/30' : 'bg-gradient-to-br from-red-500/20 to-red-600/20 border-red-500/30'" class="border-2 rounded-3xl p-10">
        <div class="text-center mb-6">
          <div class="text-6xl mb-4">{{ isCorrect ? '✅' : '❌' }}</div>
          <h3 :class="isCorrect ? 'text-green-400' : 'text-red-400'" class="text-4xl font-black mb-2">
            {{ isCorrect ? '回答正确！' : '回答错误' }}
          </h3>
        </div>

        <div class="bg-white/10 rounded-2xl p-6 mb-6">
          <div class="text-5xl font-black text-center mb-4">{{ currentWord.word }}</div>
          <div class="text-center text-xl text-gray-300">{{ currentWord.phoneticUk }}</div>
        </div>

        <div v-if="!isCorrect" class="mb-6">
          <p class="text-lg text-gray-300 mb-2">你的答案：<span class="font-bold text-red-400">{{ userSpelling }}</span></p>
          <p class="text-lg text-gray-300">正确答案：<span class="font-bold text-green-400">{{ currentWord.word }}</span></p>
        </div>

        <button
          @click="nextWord"
          class="w-full py-4 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 rounded-2xl font-bold text-xl transition-all"
        >
          {{ currentIndex < words.length - 1 ? '下一个单词' : '查看结果' }}
        </button>
      </div>
    </div>

    <!-- 学习结果 -->
    <div v-if="isCompleted" class="mt-8 p-6 bg-gradient-to-br from-cyan-500/20 to-blue-600/20 border border-cyan-500/30 rounded-2xl">
      <h3 class="text-2xl font-bold mb-4 text-center">🎉 练习完成！</h3>
      <div class="grid grid-cols-3 gap-6 text-center">
        <div>
          <div class="text-3xl font-black text-green-400">{{ correctCount }}</div>
          <div class="text-sm text-gray-400">正确数</div>
        </div>
        <div>
          <div class="text-3xl font-black text-red-400">{{ incorrectCount }}</div>
          <div class="text-sm text-gray-400">错误数</div>
        </div>
        <div>
          <div class="text-3xl font-black text-cyan-400">{{ accuracyRate }}%</div>
          <div class="text-sm text-gray-400">正确率</div>
        </div>
      </div>
      <button 
        @click="$emit('complete', result)"
        class="w-full mt-6 py-4 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 rounded-xl font-bold transition-all"
      >
        完成练习
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'

const props = defineProps<{
  words: any[]
  groupId: number
}>()

const emit = defineEmits<{
  complete: [result: any]
}>()

const currentIndex = ref(0)
const userSpelling = ref('')
const isChecking = ref(false)
const showResult = ref(false)
const isCorrect = ref(false)
const hintsUsed = ref(0)
const isCompleted = ref(false)
const correctCount = ref(0)
const incorrectCount = ref(0)

const currentWord = computed(() => props.words[currentIndex.value])

const result = computed(() => ({
  groupId: props.groupId,
  mode: 'spelling',
  totalWords: props.words.length,
  correctCount: correctCount.value,
  incorrectCount: incorrectCount.value,
  accuracyRate: accuracyRate.value,
  timeSpent: Math.floor((Date.now() - startTime.value) / 1000),
  completedAt: new Date().toISOString()
}))

const accuracyRate = computed(() => {
  if (props.words.length === 0) return 0
  return Math.round((correctCount.value / props.words.length) * 100)
})

const startTime = ref(Date.now())

// 显示首字母提示
const showFirstLetter = () => {
  if (!currentWord.value || hintsUsed.value >= 1) return
  userSpelling.value = currentWord.value.word[0]
  hintsUsed.value++
}

// 播放音频
const playAudio = () => {
  // TODO: 实现音频播放
  console.log('播放读音')
}

// 检查拼写
const checkSpelling = () => {
  if (!userSpelling.value.trim() || isChecking.value) return
  
  isChecking.value = true
  
  setTimeout(() => {
    const normalizedUser = userSpelling.value.trim().toLowerCase()
    const normalizedCorrect = currentWord.value.word.toLowerCase()
    
    isCorrect.value = normalizedUser === normalizedCorrect
    
    if (isCorrect.value) {
      correctCount.value++
    } else {
      incorrectCount.value++
    }
    
    isChecking.value = false
    showResult.value = true
  }, 500)
}

// 下一个单词
const nextWord = () => {
  userSpelling.value = ''
  showResult.value = false
  isCorrect.value = false
  hintsUsed.value = 0
  
  if (currentIndex.value < props.words.length - 1) {
    currentIndex.value++
  } else {
    isCompleted.value = true
  }
}
</script>
