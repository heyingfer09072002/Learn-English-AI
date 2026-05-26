<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { useComboStore } from '../stores/comboStore';
import { usePracticeStore } from '../stores/practiceStore';
import ComboDisplay from '../components/game/ComboDisplay.vue';
import RatingAnimation from '../components/game/RatingAnimation.vue';

const comboStore = useComboStore();
const practiceStore = usePracticeStore();

// 句子数据
const currentSentence = ref({
  id: 1,
  contentEn: 'I like to eat apples.',
  contentCn: '我喜欢吃苹果。',
  words: ['I', 'like', 'to', 'eat', 'apples'],
});

// 用户输入
const userInput = ref('');
const startTime = ref(0);
const isCompleted = ref(false);

// 评级结果
const showRating = ref(false);
const ratingResult = ref({
  level: 'S',
  accuracy: 1.0,
  score: 950,
  bestCombo: 10,
} as any);

// 开始时间
function startPractice() {
  startTime.value = Date.now();
}

// 提交答案
async function submitAnswer() {
  const timeSpent = Date.now() - startTime.value;
  
  try {
    const result = await practiceStore.submitPractice({
      sentenceId: currentSentence.value.id,
      courseId: 1,
      practiceMode: 'sentence_builder',
      answer: userInput.value,
      timeSpent,
    });

    if (result) {
      // 更新连击
      comboStore.updateCombo(result.combo);
      
      // 显示评级
      ratingResult.value = result.rating;
      showRating.value = true;
      isCompleted.value = true;
    }
  } catch (error) {
    console.error('提交失败:', error);
  }
}

// 关闭评级
function closeRating() {
  showRating.value = false;
  // 重置状态，准备下一题
  userInput.value = '';
  isCompleted.value = false;
  startPractice();
}

// 快捷键
function handleKeydown(event: KeyboardEvent) {
  if (event.key === 'Enter' && userInput.value.trim()) {
    submitAnswer();
  }
}

onMounted(() => {
  startPractice();
  window.addEventListener('keydown', handleKeydown);
});
</script>

<template>
  <div class="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 p-8">
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
      <div class="mb-8">
        <div class="flex justify-between text-sm text-gray-600 mb-2">
          <span>进度</span>
          <span>1 / 10</span>
        </div>
        <div class="h-2 bg-gray-200 rounded-full">
          <div class="w-1/10 h-full bg-blue-500 rounded-full transition-all"></div>
        </div>
      </div>

      <!-- 句子构建器 -->
      <div class="bg-white rounded-2xl shadow-xl p-8">
        <!-- 中文提示 -->
        <div class="text-2xl text-gray-700 mb-8 text-center">
          {{ currentSentence.contentCn }}
        </div>

        <!-- 单词提示（带首字母） -->
        <div class="flex justify-center gap-2 mb-8 flex-wrap">
          <div
            v-for="(word, index) in currentSentence.words"
            :key="index"
            class="px-3 py-1 bg-gray-100 rounded text-gray-600 text-sm"
          >
            {{ word[0] }}
          </div>
        </div>

        <!-- 输入框 -->
        <div class="mb-6">
          <input
            v-model="userInput"
            type="text"
            :disabled="isCompleted"
            class="w-full px-6 py-4 text-xl border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:outline-none transition disabled:bg-gray-100"
            placeholder="输入完整的英文句子..."
            @input.once="startPractice"
          />
        </div>

        <!-- 提交按钮 -->
        <button
          :disabled="!userInput.trim() || isCompleted"
          @click="submitAnswer"
          class="w-full py-4 bg-gradient-to-r from-blue-500 to-purple-600 text-white text-xl font-bold rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:opacity-90 transition"
        >
          提交 (Enter)
        </button>

        <!-- 快捷键提示 -->
        <div class="mt-4 text-center text-sm text-gray-500">
          <kbd class="px-2 py-1 bg-gray-100 rounded">Enter</kbd> 提交
          <kbd class="px-2 py-1 bg-gray-100 rounded ml-2">Esc</kbd> 跳过
        </div>
      </div>
    </div>

    <!-- 评级动画 -->
    <RatingAnimation
      v-if="showRating"
      :level="ratingResult.level"
      :accuracy="ratingResult.accuracy"
      :score="ratingResult.score"
      :bestCombo="ratingResult.bestCombo"
      :show="showRating"
      @close="closeRating"
    />
  </div>
</template>
