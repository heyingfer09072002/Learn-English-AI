<template>
  <div class="p-8 bg-gradient-to-br from-white/[0.05] to-white/[0.02] border border-white/10 rounded-3xl backdrop-blur-sm">
    <!-- 进度条 -->
    <div class="mb-8">
      <div class="flex items-center justify-between mb-4">
        <span class="text-lg font-semibold">选择题测试</span>
        <span class="text-cyan-400 font-bold">{{ currentIndex + 1 }}/{{ words.length }}</span>
      </div>
      <div class="w-full bg-white/10 rounded-full h-3">
        <div 
          class="bg-gradient-to-r from-purple-500 to-pink-500 h-3 rounded-full transition-all duration-500"
          :style="{ width: `${((currentIndex + 1) / words.length) * 100}%` }"
        ></div>
      </div>
    </div>

    <!-- 题目区域 -->
    <div v-if="currentWord && !showResult" class="relative w-full max-w-3xl mx-auto mb-8">
      <div class="bg-gradient-to-br from-purple-500/20 to-pink-600/20 border-2 border-purple-500/30 rounded-3xl p-10">
        <!-- 题目 -->
        <div class="text-center mb-8">
          <h2 class="text-5xl font-black text-white mb-4">{{ currentWord.word }}</h2>
          <p v-if="currentWord.phoneticUk" class="text-2xl text-gray-300">{{ currentWord.phoneticUk }}</p>
        </div>

        <!-- 选项 -->
        <div class="grid gap-4">
          <button
            v-for="(option, index) in shuffledOptions"
            :key="option.id"
            @click="selectOption(option)"
            :disabled="isSelecting"
            class="w-full p-6 bg-white/10 hover:bg-white/20 border-2 border-purple-500/30 hover:border-purple-500/60 rounded-2xl text-left transition-all transform hover:scale-102 disabled:transform-none"
          >
            <div class="flex items-center gap-4">
              <span class="w-10 h-10 bg-purple-500/30 rounded-full flex items-center justify-center font-bold text-xl">
                {{ String.fromCharCode(65 + index) }}
              </span>
              <div class="flex-1">
                <div v-if="option.isPos" class="flex items-center gap-3">
                  <span class="px-3 py-1 bg-purple-500/30 text-purple-300 text-sm font-bold rounded-full">
                    {{ option.pos }}
                  </span>
                  <span v-if="option.rootAffix" class="text-sm text-gray-400">{{ option.rootAffix }}</span>
                </div>
                <p class="text-lg text-gray-200">{{ option.definitionCn?.[0] || option.text }}</p>
              </div>
            </div>
          </button>
        </div>
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

        <div class="space-y-4 mb-6">
          <div v-if="selectedOption && !isCorrect" class="bg-red-500/20 border border-red-500/30 rounded-xl p-4">
            <p class="text-red-300">你的答案：{{ selectedOption.definitionCn?.[0] || selectedOption.text }}</p>
          </div>
          <div class="bg-green-500/20 border border-green-500/30 rounded-xl p-4">
            <p class="text-green-300 font-bold">正确答案：{{ correctOption.definitionCn?.[0] || correctOption.text }}</p>
          </div>
        </div>

        <button
          @click="nextWord"
          class="w-full py-4 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 rounded-2xl font-bold text-xl transition-all"
        >
          {{ currentIndex < words.length - 1 ? '下一题' : '查看结果' }}
        </button>
      </div>
    </div>

    <!-- 学习结果 -->
    <div v-if="isCompleted" class="mt-8 p-6 bg-gradient-to-br from-purple-500/20 to-pink-600/20 border border-purple-500/30 rounded-2xl">
      <h3 class="text-2xl font-bold mb-4 text-center">🎉 测试完成！</h3>
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
          <div class="text-3xl font-black text-purple-400">{{ accuracyRate }}%</div>
          <div class="text-sm text-gray-400">正确率</div>
        </div>
      </div>
      <button 
        @click="$emit('complete', result)"
        class="w-full mt-6 py-4 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 rounded-xl font-bold transition-all"
      >
        完成测试
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'

const props = defineProps<{
  words: any[]
  groupId: number
}>()

const emit = defineEmits<{
  complete: [result: any]
}>()

const currentIndex = ref(0)
const selectedOption = ref<any>(null)
const isSelecting = ref(false)
const showResult = ref(false)
const isCorrect = ref(false)
const isCompleted = ref(false)
const correctCount = ref(0)
const incorrectCount = ref(0)
const shuffledOptions = ref<any[]>([])

const currentWord = computed(() => props.words[currentIndex.value])

const correctOption = computed(() => {
  if (!currentWord.value?.pos?.length) return { text: '暂无释义' }
  return {
    id: currentWord.value.id,
    isPos: true,
    ...currentWord.value.pos[0]
  }
})

const result = computed(() => ({
  groupId: props.groupId,
  mode: 'choice',
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

// 生成选项（1 个正确答案 + 3 个干扰项）
const generateOptions = () => {
  const options = []
  
  // 添加正确答案
  if (currentWord.value?.pos?.length) {
    options.push({
      id: currentWord.value.id,
      isPos: true,
      ...currentWord.value.pos[0]
    })
  }
  
  // 添加干扰项（从其他单词中随机选择）
  const otherWords = props.words.filter((_, idx) => idx !== currentIndex.value)
  const shuffledOthers = otherWords.sort(() => Math.random() - 0.5)
  
  for (const word of shuffledOthers) {
    if (options.length >= 4) break
    if (word.pos?.length) {
      options.push({
        id: word.id,
        isPos: true,
        ...word.pos[0]
      })
    }
  }
  
  // 如果干扰项不足，使用默认文本
  while (options.length < 4) {
    options.push({
      id: `default-${options.length}`,
      isPos: false,
      text: '以上都不是'
    })
  }
  
  // 打乱选项顺序
  shuffledOptions.value = options.sort(() => Math.random() - 0.5)
}

// 选择选项
const selectOption = (option: any) => {
  if (isSelecting.value) return
  
  isSelecting.value = true
  selectedOption.value = option
  isCorrect.value = option.id === currentWord.value.id
  
  if (isCorrect.value) {
    correctCount.value++
  } else {
    incorrectCount.value++
  }
  
  setTimeout(() => {
    showResult.value = true
  }, 500)
}

// 下一个单词
const nextWord = () => {
  selectedOption.value = null
  showResult.value = false
  isCorrect.value = false
  
  if (currentIndex.value < props.words.length - 1) {
    currentIndex.value++
    generateOptions()
  } else {
    isCompleted.value = true
  }
}

onMounted(() => {
  generateOptions()
})
</script>

<style scoped>
.hover\:scale-102:hover {
  transform: scale(1.02);
}
</style>
