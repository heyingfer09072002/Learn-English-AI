<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { useComboStore } from '../stores/comboStore';
import { usePracticeStore } from '../stores/practiceStore';
import { apiGet, apiPost } from '../api/apiClient';
import ComboDisplay from '../components/game/ComboDisplay.vue';
import RatingAnimation from '../components/game/RatingAnimation.vue';

interface Sentence {
  id: number;
  contentEn: string;
  contentCn: string;
  words?: string[];
}

const comboStore = useComboStore();
const practiceStore = usePracticeStore();

// 句子数据
const currentSentence = ref<Sentence | null>(null);
const isLoading = ref(true);

// 用户输入
const userInput = ref('');
const startTime = ref(0);
const isCompleted = ref(false);
const error = ref('');

// 评级结果
const showRating = ref(false);
const ratingResult = ref({
  level: 'S',
  accuracy: 1.0,
  score: 950,
  bestCombo: 10,
} as any);

// 从后端加载句子
async function loadSentence() {
  isLoading.value = true;
  error.value = '';
  
  try {
    // TODO: 后端需要有获取练习句子的 API
    const result = await apiGet<Sentence>('/api/practice/sentence');
    
    if (result.success && result.data) {
      currentSentence.value = result.data;
    } else {
      // 后端无数据时使用预设句子（仅供演示，实际应该显示无数据）
      currentSentence.value = {
        id: 0,
        contentEn: 'I like to eat apples.',
        contentCn: '我喜欢吃苹果。',
        words: ['I', 'like', 'to', 'eat', 'apples'],
      };
    }
  } catch (err) {
    console.error('加载句子失败:', err);
    // 使用预设句子作为后备
    currentSentence.value = {
      id: 0,
      contentEn: 'I like to eat apples.',
      contentCn: '我喜欢吃苹果。',
      words: ['I', 'like', 'to', 'eat', 'apples'],
    };
  } finally {
    isLoading.value = false;
  }
}

// 开始时间
function startPractice() {
  startTime.value = Date.now();
}

// 提交答案
async function submitAnswer() {
  if (!currentSentence.value) return;
  
  const timeSpent = Date.now() - startTime.value;
  
  try {
    const result = await apiPost('/api/practice/sentence', {
      sentenceId: currentSentence.value.id,
      courseId: 1, // TODO: 从路由或选择中获取
      practiceMode: 'sentence_builder',
      answer: userInput.value,
      timeSpent,
    });

    if (result.success) {
      // 更新连击
      if (result.data?.combo) {
        comboStore.updateCombo(result.data.combo);
      }
      
      // 显示评级
      if (result.data?.rating) {
        ratingResult.value = result.data.rating;
        showRating.value = true;
        isCompleted.value = true;
      }
    } else {
      // API 调用失败，本地计算
      calculateLocalResult();
    }
  } catch (err) {
    console.error('提交失败:', err);
    // 本地计算结果
    calculateLocalResult();
  }
}

// 本地计算结果（当后端 API 不可用时）
function calculateLocalResult() {
  const correctAnswer = currentSentence.value?.contentEn || '';
  const isCorrect = userInput.value.trim().toLowerCase() === correctAnswer.toLowerCase();
  const timeSpent = Date.now() - startTime.value;
  
  if (isCorrect) {
    ratingResult.value = {
      level: timeSpent < 3000 ? 'SSS' : 'S',
      accuracy: 100,
      score: timeSpent < 3000 ? 1000 : 900,
      bestCombo: comboStore.comboState.count + 1,
    };
  } else {
    ratingResult.value = {
      level: 'C',
      accuracy: 0,
      score: 0,
      bestCombo: comboStore.comboState.count,
    };
  }
  
  showRating.value = true;
  isCompleted.value = true;
}

// 关闭评级
function closeRating() {
  showRating.value = false;
  userInput.value = '';
  isCompleted.value = false;
  loadSentence();
  startPractice();
}

// 快捷键
function handleKeydown(event: KeyboardEvent) {
  if (event.key === 'Enter' && userInput.value.trim() && !isCompleted.value) {
    submitAnswer();
  }
}

onMounted(() => {
  loadSentence();
  startPractice();
  window.addEventListener('keydown', handleKeydown);
});
</script>

<template>
  <div class="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 p-8">
    <!-- 加载状态 -->
    <div v-if="isLoading" class="flex justify-center items-center h-screen">
      <div class="text-center">
        <div class="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mb-4"></div>
        <p class="text-gray-600">加载句子...</p>
      </div>
    </div>

    <!-- 无数据状态 -->
    <div v-else-if="!currentSentence" class="flex justify-center items-center h-screen">
      <div class="text-center">
        <div class="text-6xl mb-4">📝</div>
        <h2 class="text-2xl font-bold text-gray-800 mb-2">暂无练习句子</h2>
        <p class="text-gray-600">请先选择课程或创建新内容</p>
        <button 
          @click="$router.push('/courses')"
          class="mt-4 px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
        >
          浏览课程
        </button>
      </div>
    </div>

    <!-- 主内容 -->
    <template v-else>
      <!-- 连击显示 -->
      <ComboDisplay
        :count="comboStore.comboState.count"
        :maxCombo="comboStore.comboState.maxCombo"
        :multiplier="comboStore.comboState.multiplier"
        :isPerfect="comboStore.comboState.isPerfect"
        :isGreat="comboStore.comboState.isGreat"
      />

      <!-- 主内容区 -->
      <div class="max-w-3xl mx-auto mt-20">
        <!-- 进度条 -->
        
        <!-- 中文提示 -->
        <div class="bg-white rounded-2xl shadow-lg p-6 mb-8">
          <h2 class="text-2xl font-bold text-gray-800 text-center">
            {{ currentSentence.contentCn }}
          </h2>
        </div>

        <!-- 输入区 -->
        <div class="bg-white rounded-2xl shadow-lg p-8">
          <!-- 输入框 -->
          <div class="mb-6">
            <textarea
              v-model="userInput"
              :disabled="isCompleted"
              class="w-full px-6 py-4 text-xl border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:outline-none transition disabled:bg-gray-100 text-gray-700 placeholder-gray-400"
              placeholder="输入完整的英文句子..."
              rows="3"
            ></textarea>
          </div>

          <!-- 提交按钮 -->
          <button
            :disabled="!userInput.trim() || isCompleted"
            @click="submitAnswer"
            class="w-full py-4 bg-gradient-to-r from-blue-500 to-purple-600 text-white text-xl font-bold rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:opacity-90 transition"
          >
            提交 (Enter)
          </button>
        </div>

        <!-- 单词列表（提示） -->
        <div v-if="currentSentence.words" class="mt-8">
          <h3 class="text-lg font-bold text-gray-700 mb-4">单词提示：</h3>
          <div class="flex flex-wrap gap-2">
            <div
              v-for="(word, index) in currentSentence.words"
              :key="index"
              class="px-4 py-2 bg-white rounded-lg shadow text-gray-800"
            >
              {{ word }}
            </div>
          </div>
        </div>
      </div>

      <!-- 评级动画 -->
      <RatingAnimation
        v-if="showRating"
        :level="ratingResult.level"
        :score="ratingResult.score"
        :accuracy="ratingResult.accuracy"
        :combo="ratingResult.bestCombo"
        @close="closeRating"
      />
    </template>
  </div>
</template>
