<template>
  <div class="min-h-screen bg-[#0a0e27] text-white">
    <Navbar />
    
    <main class="container mx-auto px-6 py-8">
      <!-- 页面标题 -->
      <div class="mb-12">
        <h1 class="text-5xl font-black mb-4 bg-gradient-to-r from-white via-blue-100 to-purple-100 bg-clip-text text-transparent">词汇学习</h1>
        <p class="text-xl text-gray-400">科学记忆曲线，高效掌握六级词汇</p>
      </div>

      <!-- 学习模式选择 -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
        <div 
          v-for="mode in learningModes" 
          :key="mode.id"
          class="group p-8 bg-gradient-to-br from-white/[0.05] to-white/[0.02] border border-white/10 rounded-3xl hover:border-blue-500/50 transition-all duration-500 cursor-pointer backdrop-blur-sm"
          :class="{ 'border-blue-500/50 bg-blue-500/10': selectedMode === mode.id }"
          @click="selectedMode = mode.id"
        >
          <div class="w-16 h-16 bg-gradient-to-br from-blue-500/30 to-blue-600/30 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
            <component :is="mode.icon" class="w-8 h-8 text-blue-400" />
          </div>
          <h3 class="text-2xl font-bold mb-2">{{ mode.name }}</h3>
          <p class="text-gray-400 text-sm">{{ mode.description }}</p>
        </div>
      </div>

      <!-- 词汇组选择器 -->
      <div class="mb-12">
        <div class="flex items-center justify-between mb-6">
          <h2 class="text-3xl font-bold">选择词汇组</h2>
          <select 
            v-model="selectedCategory"
            class="px-6 py-3 bg-white/5 border border-white/10 rounded-xl focus:outline-none focus:border-blue-500/50 text-gray-700"
          >
            <option value="all">全部分类</option>
            <option value="frequency">按词频</option>
            <option value="pos">按词性</option>
            <option value="theme">按主题</option>
            <option value="exam">按考试</option>
            <option value="stage">按阶段</option>
          </select>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div 
            v-for="group in filteredGroups" 
            :key="group.id"
            class="group p-6 bg-gradient-to-br from-white/[0.05] to-white/[0.02] border border-white/10 rounded-2xl hover:border-cyan-500/50 transition-all duration-500 cursor-pointer"
            @click="selectGroup(group)"
          >
            <div class="flex items-start justify-between mb-4">
              <div>
                <h3 class="text-xl font-bold mb-2">{{ group.name }}</h3>
                <p class="text-gray-400 text-sm">{{ group.description }}</p>
              </div>
              <span class="px-3 py-1 bg-cyan-500/20 text-cyan-400 text-sm font-bold rounded-full">
                {{ group.wordCount }}词
              </span>
            </div>
            
            <div class="space-y-3">
              <div class="flex items-center justify-between text-sm">
                <span class="text-gray-400">学习进度</span>
                <span class="text-cyan-400 font-semibold">{{ group.learnedCount }}/{{ group.wordCount }}</span>
              </div>
              <div class="w-full bg-white/10 rounded-full h-2">
                <div 
                  class="bg-gradient-to-r from-cyan-500 to-blue-500 h-2 rounded-full transition-all duration-500"
                  :style="{ width: `${(group.learnedCount / group.wordCount) * 100}%` }"
                ></div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- 学习区域 -->
      <div v-if="selectedMode && selectedGroupId" class="mb-12">
        <component 
          :is="modeComponent"
          :words="currentWords"
          :groupId="selectedGroupId"
          @complete="handleComplete"
          @progress-update="updateProgress"
        />
      </div>

      <!-- 统计面板 -->
      <div class="p-10 bg-gradient-to-br from-white/[0.05] to-white/[0.02] border border-white/10 rounded-3xl backdrop-blur-sm">
        <h3 class="text-3xl font-bold mb-8">学习统计</h3>
        <div class="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div class="p-6 bg-white/5 rounded-2xl">
            <div class="text-gray-400 text-sm mb-2">总词汇量</div>
            <div class="text-4xl font-black mb-2">{{ stats.totalWords }}</div>
            <div class="text-xs text-gray-500">已掌握 {{ stats.masteredWords }} 词</div>
          </div>
          
          <div class="p-6 bg-white/5 rounded-2xl">
            <div class="text-gray-400 text-sm mb-2">今日待复习</div>
            <div class="text-4xl font-black mb-2 text-cyan-400">{{ stats.reviewDueToday }}</div>
            <div class="text-xs text-gray-500">准确率 {{ stats.accuracy }}%</div>
          </div>
          
          <div class="p-6 bg-white/5 rounded-2xl">
            <div class="text-gray-400 text-sm mb-2">学习时长</div>
            <div class="text-4xl font-black mb-2 text-purple-400">{{ Math.floor(stats.totalLearnTime / 60) }}m</div>
            <div class="text-xs text-gray-500">{{ stats.streakDays }} 天连续</div>
          </div>
          
          <div class="p-6 bg-white/5 rounded-2xl">
            <div class="text-gray-400 text-sm mb-2">已学习</div>
            <div class="text-4xl font-black mb-2 text-green-400">{{ stats.learnedWords }}</div>
            <div class="text-xs text-gray-500">掌握率 {{ Math.round((stats.masteredWords / stats.totalWords) * 100) }}%</div>
          </div>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { BookOpen, Type, CheckCircle, Headphones } from 'lucide-vue-next'
import Navbar from '@/components/layout/Navbar.vue'
import CardMode from '@/components/vocabulary/CardMode.vue'
import SpellingMode from '@/components/vocabulary/SpellingMode.vue'
import ChoiceMode from '@/components/vocabulary/ChoiceMode.vue'
import ListeningMode from '@/components/vocabulary/ListeningMode.vue'
import { api, type VocabularyGroup, type LearningProgress } from '@/api'

const learningModes = [
  { id: 'card', name: '卡片背诵', description: '闪卡记忆，快速掌握', icon: BookOpen },
  { id: 'spelling', name: '拼写练习', description: '听音拼写，强化记忆', icon: Type },
  { id: 'choice', name: '选择题', description: '多项选择，检验成果', icon: CheckCircle },
  { id: 'listening', name: '听力辨音', description: '听音辨义，提升听力', icon: Headphones }
]

const selectedMode = ref<string | null>(null)
const selectedGroupId = ref<number | null>(null)
const selectedCategory = ref('all')
const currentWords = ref<any[]>([])

const groups = ref<VocabularyGroup[]>([])
const stats = ref<LearningProgress>({
  totalWords: 0,
  learnedWords: 0,
  masteredWords: 0,
  reviewDueToday: 0,
  totalLearnTime: 0,
  accuracy: 0,
  streakDays: 0
})

const filteredGroups = computed(() => {
  if (selectedCategory.value === 'all') return groups.value
  return groups.value.filter(g => g.categoryType === selectedCategory.value)
})

const modeComponent = computed(() => {
  const components: Record<string, any> = {
    card: CardMode,
    spelling: SpellingMode,
    choice: ChoiceMode,
    listening: ListeningMode
  }
  return selectedMode.value ? components[selectedMode.value] : null
})

// 加载词汇组
const loadGroups = async () => {
  try {
    const res = await api.getVocabularyGroups()
    groups.value = res.data || []
  } catch (error) {
    console.error('加载词汇组失败:', error)
  }
}

// 加载统计数据
const loadStats = async () => {
  try {
    const res = await api.getVocabularyProgress()
    stats.value = res.data || {}
  } catch (error) {
    console.error('加载统计失败:', error)
  }
}

// 选择词汇组
const selectGroup = async (group: VocabularyGroup) => {
  selectedGroupId.value = group.id
  try {
    const res = await api.getWordsInGroup(group.id, 1, 20)
    currentWords.value = res.data.words || []
  } catch (error) {
    console.error('加载词汇失败:', error)
  }
}

// 完成学习
const handleComplete = async (result: any) => {
  console.log('学习完成:', result)
  await loadStats()
}

// 更新进度
const updateProgress = (progress: any) => {
  console.log('进度更新:', progress)
}

onMounted(() => {
  loadGroups()
  loadStats()
})
</script>
