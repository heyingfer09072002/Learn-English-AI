<template>
  <div class="min-h-screen bg-[#0a0e27] text-white overflow-hidden relative">
    <!-- 动态背景 -->
    <div class="fixed inset-0 overflow-hidden pointer-events-none">
      <div class="absolute -top-40 -right-40 w-[600px] h-[600px] bg-blue-500/15 rounded-full blur-3xl animate-pulse"></div>
      <div class="absolute top-1/3 -left-40 w-[500px] h-[500px] bg-purple-500/15 rounded-full blur-3xl animate-pulse delay-700"></div>
      <div class="absolute -bottom-40 right-1/4 w-[400px] h-[400px] bg-cyan-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
    </div>

    <div class="relative z-10 flex flex-col h-screen">
      <!-- 顶部标题栏 -->
      <TopBar 
        title="Unit 11 · 衣物与穿搭 · 句子练习"
        @back="handleBack"
      />

      <!-- 主内容区 -->
      <main class="flex-1 flex flex-col items-center justify-center px-8 py-8 overflow-y-auto">
        <!-- 进度条 -->
        <div class="w-full max-w-4xl mb-8">
          <div class="flex items-center justify-between text-sm text-gray-400 mb-3">
            <span>Progress</span>
            <span>{{ currentIndex + 1 }} / {{ sentences.length }}</span>
          </div>
          <div class="w-full bg-white/10 rounded-full h-2 overflow-hidden">
            <div 
              class="h-full bg-gradient-to-r from-blue-500 via-purple-500 to-cyan-500 transition-all duration-500"
              :style="{ width: `${((currentIndex + 1) / sentences.length) * 100}%` }"
            ></div>
          </div>
        </div>

        <!-- 句子展示区 -->
        <div class="w-full max-w-4xl mb-12">
          <SentenceDisplay
            :english-sentence="currentSentence.english"
            :chinese-translation="currentSentence.chinese"
            :phonetic="currentSentence.phonetic"
            :segments="currentSentence.segments"
            :show-answer="isAnswerVisible"
            :answer-text="currentSentence.answer"
          />
        </div>

        <!-- 单词拆解区 -->
        <div 
          v-if="isAnswerVisible && currentSentence.words"
          class="w-full max-w-4xl mb-12 animate-fadeIn"
        >
          <WordBreakdownList :words="currentSentence.words" />
        </div>

        <!-- 学习控制栏 -->
        <div class="mb-12">
          <LearningControlBar
            :is-playing="isPlaying"
            :is-slow-mode="isSlowMode"
            :is-answer-visible="isAnswerVisible"
            @toggle-play="togglePlay"
            @toggle-slow="toggleSlowMode"
            @toggle-answer="toggleAnswer"
            @prev="prevSentence"
            @next="nextSentence"
          />
        </div>

        <!-- 快捷键提示 -->
        <div class="mb-8">
          <ShortcutHintBar />
        </div>
      </main>
    </div>

    <!-- 音频播放器 -->
    <AudioPlayer
      ref="audioPlayer"
      :src="currentSentence.audio"
      :is-playing="isPlaying"
      :playback-rate="playbackRate"
      @ended="handleAudioEnded"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import TopBar from '@/components/learning/TopBar.vue'
import SentenceDisplay from '@/components/learning/SentenceDisplay.vue'
import WordBreakdownList from '@/components/learning/WordBreakdownList.vue'
import LearningControlBar from '@/components/learning/LearningControlBar.vue'
import ShortcutHintBar from '@/components/learning/ShortcutHintBar.vue'
import AudioPlayer from '@/components/learning/AudioPlayer.vue'

const router = useRouter()
const audioPlayer = ref(null)

// 状态
const currentIndex = ref(0)
const isPlaying = ref(false)
const isSlowMode = ref(false)
const isAnswerVisible = ref(false)
const playbackRate = ref(1)

// 句子数据
const sentences = ref([
  {
    english: "I wear earrings.",
    chinese: "我戴耳环。",
    phonetic: "/aɪ wɪr ˈɪrɪŋz/",
    audio: "",
    answer: "I wear earrings.",
    segments: [
      { word: "I", meaning: "我" },
      { word: "wear", meaning: "穿戴" },
      { word: "earrings", meaning: "耳环" }
    ],
    words: [
      {
        text: "I",
        phonetic: "/aɪ/",
        pos: "pron.",
        meaning: "我",
        role: "主语",
        example: "I love learning English."
      },
      {
        text: "wear",
        phonetic: "/wɪr/",
        pos: "v.",
        meaning: "穿，戴",
        role: "谓语",
        example: "She wears a beautiful dress."
      },
      {
        text: "earrings",
        phonetic: "/ˈɪrɪŋz/",
        pos: "n.",
        meaning: "耳环（复数）",
        role: "宾语",
        example: "Her earrings are very shiny."
      }
    ]
  },
  {
    english: "She is wearing a scarf.",
    chinese: "她戴着一条围巾。",
    phonetic: "/ʃi ˈɪz ˈwɛrɪŋ ə skɑrf/",
    audio: "",
    answer: "She is wearing a scarf.",
    segments: [
      { word: "She", meaning: "她" },
      { word: "is wearing", meaning: "正穿着" },
      { word: "a", meaning: "一条" },
      { word: "scarf", meaning: "围巾" }
    ],
    words: [
      {
        text: "She",
        phonetic: "/ʃi/",
        pos: "pron.",
        meaning: "她",
        role: "主语",
        example: "She is my best friend."
      },
      {
        text: "is wearing",
        phonetic: "/ɪz ˈwɛrɪŋ/",
        pos: "v.",
        meaning: "正穿着（现在进行时）",
        role: "谓语",
        example: "He is wearing a hat."
      },
      {
        text: "a",
        phonetic: "/ə/",
        pos: "art.",
        meaning: "一个，一条",
        role: "冠词",
        example: "I have a dream."
      },
      {
        text: "scarf",
        phonetic: "/skɑrf/",
        pos: "n.",
        meaning: "围巾",
        role: "宾语",
        example: "This scarf is very warm."
      }
    ]
  },
  {
    english: "He put on his jacket.",
    chinese: "他穿上了他的夹克。",
    phonetic: "/hi pʊt ɑn hɪz ˈʤækɪt/",
    audio: "",
    answer: "He put on his jacket.",
    segments: [
      { word: "He", meaning: "他" },
      { word: "put on", meaning: "穿上" },
      { word: "his", meaning: "他的" },
      { word: "jacket", meaning: "夹克" }
    ],
    words: [
      {
        text: "He",
        phonetic: "/hi/",
        pos: "pron.",
        meaning: "他",
        role: "主语",
        example: "He is a teacher."
      },
      {
        text: "put on",
        phonetic: "/pʊt ɑn/",
        pos: "v.",
        meaning: "穿上",
        role: "谓语",
        example: "Put on your shoes."
      },
      {
        text: "his",
        phonetic: "/hɪz/",
        pos: "pron.",
        meaning: "他的",
        role: "定语",
        example: "This is his book."
      },
      {
        text: "jacket",
        phonetic: "/ˈʤækɪt/",
        pos: "n.",
        meaning: "夹克衫",
        role: "宾语",
        example: "The jacket is blue."
      }
    ]
  }
])

// 当前句子
const currentSentence = computed(() => sentences.value[currentIndex.value])

// 键盘事件处理
const handleKeyDown = (e: KeyboardEvent) => {
  // 避免在输入框中触发
  if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) {
    return
  }

  switch (e.code) {
    case 'Space':
      e.preventDefault()
      togglePlay()
      break
    case 'KeyS':
      toggleSlowMode()
      break
    case 'KeyA':
      toggleAnswer()
      break
    case 'ArrowLeft':
      e.preventDefault()
      prevSentence()
      break
    case 'ArrowRight':
      e.preventDefault()
      nextSentence()
      break
    case 'Escape':
      handleBack()
      break
  }
}

// 音频控制
const togglePlay = () => {
  isPlaying.value = !isPlaying.value
}

const handleAudioEnded = () => {
  isPlaying.value = false
  // 可配置：是否自动播放下一句
  // nextSentence()
}

// 切换慢速模式
const toggleSlowMode = () => {
  isSlowMode.value = !isSlowMode.value
  playbackRate.value = isSlowMode.value ? 0.5 : 1
}

// 切换显示答案
const toggleAnswer = () => {
  isAnswerVisible.value = !isAnswerVisible.value
}

// 上一句
const prevSentence = () => {
  if (currentIndex.value > 0) {
    currentIndex.value--
    resetState()
  }
}

// 下一句
const nextSentence = () => {
  if (currentIndex.value < sentences.value.length - 1) {
    currentIndex.value++
    resetState()
  }
}

// 重置状态
const resetState = () => {
  isPlaying.value = false
  isSlowMode.value = false
  isAnswerVisible.value = false
  playbackRate.value = 1
}

// 返回
const handleBack = () => {
  router.push('/learning')
}

// 生命周期
onMounted(() => {
  window.addEventListener('keydown', handleKeyDown)
})

onUnmounted(() => {
  window.removeEventListener('keydown', handleKeyDown)
})
</script>

<style scoped>
.delay-700 {
  animation-delay: 700ms;
}

.delay-1000 {
  animation-delay: 1000ms;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.animate-fadeIn {
  animation: fadeIn 0.5s ease-out forwards;
}

/* 自定义滚动条 */
::-webkit-scrollbar {
  width: 8px;
}

::-webkit-scrollbar-track {
  background: rgba(255, 255, 255, 0.05);
}

::-webkit-scrollbar-thumb {
  background: rgba(255, 255, 255, 0.2);
  border-radius: 4px;
}

::-webkit-scrollbar-thumb:hover {
  background: rgba(255, 255, 255, 0.3);
}
</style>
