<template>
  <div class="p-8 bg-gradient-to-br from-white/[0.05] to-white/[0.02] border border-white/10 rounded-3xl backdrop-blur-sm">
    <!-- 进度条 -->
    <div class="mb-8">
      <div class="flex items-center justify-between mb-4">
        <span class="text-lg font-semibold">听力辨音</span>
        <span class="text-cyan-400 font-bold">{{ currentIndex + 1 }}/{{ words.length }}</span>
      </div>
      <div class="w-full bg-white/10 rounded-full h-3">
        <div 
          class="bg-gradient-to-r from-yellow-500 to-orange-500 h-3 rounded-full transition-all duration-500"
          :style="{ width: `${((currentIndex + 1) / words.length) * 100}%` }"
        ></div>
      </div>
    </div>

    <!-- 听力区域 -->
    <div v-if="currentWord && !showResult" class="relative w-full max-w-3xl mx-auto mb-8">
      <div class="bg-gradient-to-br from-yellow-500/20 to-orange-600/20 border-2 border-yellow-500/30 rounded-3xl p-10">
        <!-- 播放按钮 -->
        <div class="text-center mb-8">
          <button
            @click="playAudio"
            :disabled="!audioPlayed"
            class="w-32 h-32 mx-auto bg-gradient-to-br from-yellow-500 to-orange-600 hover:from-yellow-400 hover:to-orange-500 disabled:from-gray-600 disabled:to-gray-700 rounded-full flex items-center justify-center transition-all transform hover:scale-110 disabled:transform-none shadow-2xl"
          >
            <svg class="w-16 h-16" fill="currentColor" viewBox="0 0 20 20">
              <path d="M18 3a1 1 0 00-1.196-.98l-10 2A1 1 0 006 5v9.114A4.369 4.369 0 005 14c-1.657 0-3 .895-3 2s1.343 2 3 2 3-.895 3-2V7.82l8-1.6v5.894A4.37 4.37 0 0015 17c1.657 0 3-.895 3-2s-1.343-2-3-2a4.37 4.37 0 00-2.246-.628V5.82l8 1.6a1 1 0 001.196-.98V3z"/>
            </svg>
          </button>
          <p class="text-xl text-gray-300 mt-4">点击播放读音</p>
          <p v-if="audioPlayed" class="text-sm text-yellow-400 mt-2">已播放 {{ playCount }} 次</p>
        </div>

        <!-- 输入框 -->
        <div class="mb-6">
          <input
            v-model="userAnswer"
            type="text"
            @keyup.enter="checkAnswer"
            :disabled="isChecking"
            class="w-full px-6 py-4 bg-white/10 border-2 border-yellow-500/30 rounded-2xl text-2xl text-center font-bold text-white placeholder-gray-500 focus:outline-none focus:border-yellow-500/60 transition-colors"
            placeholder="根据听到的读音，拼写出单词..."
            autocomplete="off"
          />
        </div>

        <!-- 控制按钮 -->
        <div class="flex gap-4 mb-6">
          <button
            @click="playAudio"
            :disabled="!audioPlayed"
            class="flex-1 py-4 bg-yellow-500/30 hover:bg-yellow-500/50 disabled:bg-gray-500/30 rounded-2xl font-bold transition-colors"
          >
            🔊 再次播放
          </button>
          <button
            @click="showHint"
            :disabled="hintsUsed >= 2"
            class="flex-1 py-4 bg-cyan-500/30 hover:bg-cyan-500/50 disabled:bg-gray-500/30 rounded-2xl font-bold transition-colors"
          >
            💡 提示 ({{ hintsUsed }}/2)
          </button>
        </div>

        <!-- 提交按钮 -->
        <button
          @click="checkAnswer"
          :disabled="!userAnswer.trim() || isChecking"
          class="w-full py-4 bg-gradient-to-r from-yellow-600 to-orange-600 hover:from-yellow-500 hover:to-orange-500 disabled:from-gray-600 disabled:to-gray-700 rounded-2xl font-bold text-xl transition-all transform hover:scale-105 disabled:transform-none"
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
            {{ isCorrect ? '听力正确！' : '听力错误' }}
          </h3>
        </div>

        <div class="bg-white/10 rounded-2xl p-6 mb-6">
          <div class="text-5xl font-black text-center mb-4">{{ currentWord.word }}</div>
          <div class="text-center text-xl text-gray-300 mb-4">{{ currentWord.phoneticUk }}</div>
          <div v-if="currentWord.pos && currentWord.pos.length > 0" class="text-center">
            <span class="px-3 py-1 bg-yellow-500/30 text-yellow-300 text-sm font-bold rounded-full">
              {{ currentWord.pos[0].pos }}
            </span>
            <p class="text-lg text-gray-300 mt-2">{{ currentWord.pos[0].definitionCn[0] }}</p>
          </div>
        </div>

        <div v-if="!isCorrect" class="mb-6">
          <p class="text-lg text-gray-300 mb-2">你的答案：<span class="font-bold text-red-400">{{ userAnswer }}</span></p>
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
    <div v-if="isCompleted" class="mt-8 p-6 bg-gradient-to-br from-yellow-500/20 to-orange-600/20 border border-yellow-500/30 rounded-2xl">
      <h3 class="text-2xl font-bold mb-4 text-center">🎉 听力训练完成！</h3>
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
          <div class="text-3xl font-black text-yellow-400">{{ accuracyRate }}%</div>
          <div class="text-sm text-gray-400">正确率</div>
        </div>
      </div>
      <button 
        @click="$emit('complete', result)"
        class="w-full mt-6 py-4 bg-gradient-to-r from-yellow-600 to-orange-600 hover:from-yellow-500 hover:to-orange-500 rounded-xl font-bold transition-all"
      >
        完成训练
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
const userAnswer = ref('')
const isChecking = ref(false)
const showResult = ref(false)
const isCorrect = ref(false)
const hintsUsed = ref(0)
const playCount = ref(0)
const audioPlayed = ref(false)
const isCompleted = ref(false)
const correctCount = ref(0)
const incorrectCount = ref(0)

const currentWord = computed(() => props.words[currentIndex.value])

const result = computed(() => ({
  groupId: props.groupId,
  mode: 'listening',
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

// 播放音频
const playAudio = () => {
  // TODO: 实现真实的音频播放
  // 这里模拟音频播放
  setTimeout(() => {
    audioPlayed.value = true
    playCount.value++
  }, 500)
}

// 显示提示
const showHint = () => {
  if (!currentWord.value || hintsUsed.value >= 2) return
  
  hintsUsed.value++
  
  if (hintsUsed.value === 1) {
    // 显示首字母
    userAnswer.value = currentWord.value.word[0].toUpperCase()
  } else if (hintsUsed.value === 2) {
    // 显示前三个字母
    userAnswer.value = currentWord.value.word.substring(0, 3)
  }
}

// 检查答案
const checkAnswer = () => {
  if (!userAnswer.value.trim() || isChecking.value) return
  
  isChecking.value = true
  
  setTimeout(() => {
    const normalizedUser = userAnswer.value.trim().toLowerCase()
    const normalizedCorrect = currentWord.value.word.toLowerCase()
    
    // 允许一定的容错（如前后空格、大小写）
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
  userAnswer.value = ''
  showResult.value = false
  isCorrect.value = false
  hintsUsed.value = 0
  playCount.value = 0
  audioPlayed.value = false
  
  if (currentIndex.value < props.words.length - 1) {
    currentIndex.value++
  } else {
    isCompleted.value = true
  }
}
</script>
