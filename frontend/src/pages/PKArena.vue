<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue';
import ComboDisplay from '../components/game/ComboDisplay.vue';
import RatingAnimation from '../components/game/RatingAnimation.vue';

// 游戏状态
const gameState = ref<'lobby' | 'matching' | 'playing' | 'result'>('lobby');
const opponent = ref<{ username: string; avatar: string; score: number } | null>(null);
const timeLeft = ref(30);
const currentSentence = ref('');
const userInput = ref('');
const feedback = ref<'correct' | 'incorrect' | null>(null);

// 对战数据
const playerScore = ref(0);
const opponentScore = ref(0);
const round = ref(1);
const totalRounds = 5;

// WebSocket
let ws: WebSocket | null = null;

// 模拟对手
const mockOpponents = [
  { username: '英语达人', avatar: '🦁', score: 0 },
  { username: '学习王者', avatar: '🐯', score: 0 },
  { username: '词汇大师', avatar: '🦅', score: 0 },
];

// 开始匹配
function startMatching() {
  gameState.value = 'matching';
  
  // 模拟匹配成功
  setTimeout(() => {
    const randomOpponent = mockOpponents[Math.floor(Math.random() * mockOpponents.length)];
    opponent.value = { ...randomOpponent };
    gameState.value = 'playing';
    startRound();
  }, 2000);
  
  // 实际应该连接 WebSocket
  // connectWebSocket();
}

// 连接 WebSocket (预留)
function connectWebSocket() {
  const wsUrl = `ws://localhost:3001/ws/pk?token=${localStorage.getItem('token')}`;
  ws = new WebSocket(wsUrl);
  
  ws.onopen = () => {
    console.log('WebSocket connected');
    ws?.send(JSON.stringify({ type: 'match_start' }));
  };
  
  ws.onmessage = (event) => {
    const data = JSON.parse(event.data);
    
    switch (data.type) {
      case 'match_found':
        opponent.value = data.opponent;
        gameState.value = 'playing';
        startRound();
        break;
      case 'opponent_score':
        opponentScore.value = data.score;
        break;
      case 'round_end':
        handleRoundEnd();
        break;
    }
  };
}

// 开始回合
function startRound() {
  timeLeft.value = 30;
  userInput.value = '';
  feedback.value = null;
  
  // 模拟句子（实际应该从后端获取）
  const sentences = [
    'The quick brown fox jumps over the lazy dog.',
    'Practice makes perfect.',
    'Knowledge is power.',
    'Time flies when you have fun.',
    'Every cloud has a silver lining.',
  ];
  currentSentence.value = sentences[round.value - 1] || 'Default sentence.';
  
  // 倒计时
  const timer = setInterval(() => {
    timeLeft.value--;
    
    if (timeLeft.value <= 0) {
      clearInterval(timer);
      handleTimeUp();
    }
  }, 1000);
}

// 提交答案
function submitAnswer() {
  const isCorrect = userInput.value.trim().toLowerCase() === 
                    currentSentence.value.toLowerCase();
  
  feedback.value = isCorrect ? 'correct' : 'incorrect';
  
  if (isCorrect) {
    playerScore.value += 100;
  }
  
  // 发送答案到服务器
  if (ws?.readyState === WebSocket.OPEN) {
    ws.send(JSON.stringify({
      type: 'submit_answer',
      answer: userInput.value,
      isCorrect,
    }));
  }
  
  // 延迟后进入下一回合
  setTimeout(() => {
    if (round.value < totalRounds) {
      round.value++;
      startRound();
    } else {
      gameState.value = 'result';
    }
  }, 1500);
}

// 时间到
function handleTimeUp() {
  feedback.value = 'incorrect';
  
  setTimeout(() => {
    if (round.value < totalRounds) {
      round.value++;
      startRound();
    } else {
      gameState.value = 'result';
    }
  }, 1500);
}

// 回合结束
function handleRoundEnd() {
  // 处理对手得分更新等
}

// 清理
onUnmounted(() => {
  if (ws) {
    ws.close();
  }
});
</script>

<template>
  <div class="min-h-screen bg-gradient-to-br from-orange-50 to-red-50 p-8">
    <div class="max-w-4xl mx-auto">
      <!-- 大厅 -->
      <div v-if="gameState === 'lobby'" class="text-center py-20">
        <h1 class="text-5xl font-bold text-gray-800 mb-4">⚔️ PK 竞技</h1>
        <p class="text-xl text-gray-600 mb-8">与其他学习者实时对战，提升英语水平！</p>
        
        <div class="bg-white rounded-2xl shadow-xl p-8 mb-8">
          <h2 class="text-2xl font-bold mb-4">游戏规则</h2>
          <div class="text-left space-y-3 text-gray-700">
            <div class="flex items-start gap-3">
              <span class="text-2xl">1️⃣</span>
              <span>共 5 个回合，每回合 30 秒</span>
            </div>
            <div class="flex items-start gap-3">
              <span class="text-2xl">2️⃣</span>
              <span>根据句子完整性和准确性评分</span>
            </div>
            <div class="flex items-start gap-3">
              <span class="text-2xl">3️⃣</span>
              <span>分数高者获胜，可获得丰厚奖励！</span>
            </div>
          </div>
        </div>
        
        <button
          @click="startMatching"
          class="px-12 py-5 bg-gradient-to-r from-orange-500 to-red-600 text-white text-2xl font-bold rounded-full hover:opacity-90 transition transform hover:scale-105"
        >
          开始匹配
        </button>
      </div>
      
      <!-- 匹配中 -->
      <div v-else-if="gameState === 'matching'" class="text-center py-20">
        <div class="animate-spin text-6xl mb-8">🔍</div>
        <h2 class="text-3xl font-bold text-gray-800 mb-4">正在匹配对手...</h2>
        <p class="text-xl text-gray-600">寻找水平相近的对手</p>
      </div>
      
      <!-- 游戏中 -->
      <div v-else-if="gameState === 'playing'" class="space-y-6">
        <!-- 对战信息 -->
        <div class="flex justify-between items-center bg-white rounded-xl p-6 shadow-lg">
          <!-- 玩家信息 -->
          <div class="text-center">
            <div class="text-4xl mb-2">👤</div>
            <div class="font-bold">我</div>
            <div class="text-2xl font-bold text-indigo-600">{{ playerScore }}</div>
          </div>
          
          <!-- VS -->
          <div class="text-4xl font-bold text-gray-400">VS</div>
          
          <!-- 对手信息 -->
          <div class="text-center">
            <div class="text-4xl mb-2">{{ opponent?.avatar || '👤' }}</div>
            <div class="font-bold">{{ opponent?.username || '对手' }}</div>
            <div class="text-2xl font-bold text-red-600">{{ opponentScore }}</div>
          </div>
        </div>
        
        <!-- 连击显示 -->
        <ComboDisplay :combo="0" :max-combo="0" />
        
        <!-- 回合和倒计时 -->
        <div class="flex justify-between items-center bg-white rounded-xl p-4 shadow">
          <div class="text-xl font-bold">
            第 {{ round }} / {{ totalRounds }} 回合
          </div>
          <div 
            :class="[
              'text-3xl font-bold px-6 py-2 rounded-lg',
              timeLeft <= 10 ? 'bg-red-100 text-red-600' : 'bg-indigo-100 text-indigo-600',
            ]"
          >
            ⏱️ {{ timeLeft }}s
          </div>
        </div>
        
        <!-- 题目 -->
        <div class="bg-white rounded-2xl shadow-xl p-8">
          <h3 class="text-lg font-bold text-gray-700 mb-4">听写句子：</h3>
          <div class="text-2xl text-gray-800 mb-6" v-if="currentSentence">
            {{ currentSentence }}
          </div>
          
          <!-- 输入框 -->
          <textarea
            v-model="userInput"
            :disabled="!!feedback"
            rows="3"
            placeholder="输入你听到的句子..."
            class="w-full px-4 py-3 border-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-lg"
            :class="feedback === 'correct' ? 'border-green-500 bg-green-50' : 
                    feedback === 'incorrect' ? 'border-red-500 bg-red-50' : 'border-gray-300'"
            @keyup.enter="submitAnswer"
          ></textarea>
          
          <!-- 提交按钮 -->
          <button
            @click="submitAnswer"
            :disabled="!userInput.trim() || !!feedback"
            class="mt-4 w-full py-4 bg-gradient-to-r from-indigo-500 to-purple-600 text-white text-xl font-bold rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:opacity-90 transition"
          >
            提交答案
          </button>
          
          <!-- 反馈 -->
          <div v-if="feedback === 'correct'" class="mt-4 text-center text-green-600 text-xl font-bold">
            ✅ 正确！
          </div>
          <div v-else-if="feedback === 'incorrect'" class="mt-4 text-center text-red-600 text-xl font-bold">
            ❌ 错误！正确答案：{{ currentSentence }}
          </div>
        </div>
      </div>
      
      <!-- 结果页面 -->
      <div v-else-if="gameState === 'result'" class="text-center py-10">
        <div class="bg-white rounded-2xl shadow-xl p-10">
          <h2 class="text-4xl font-bold mb-8">
            {{ playerScore > opponentScore ? '🏆 胜利！' : playerScore < opponentScore ? '😢 失败' : '🤝 平局' }}
          </h2>
          
          <!-- 最终比分 -->
          <div class="flex justify-center items-center gap-10 mb-8">
            <div class="text-center">
              <div class="text-4xl mb-2">👤</div>
              <div class="text-5xl font-bold text-indigo-600">{{ playerScore }}</div>
              <div class="text-gray-600">我</div>
            </div>
            <div class="text-4xl font-bold text-gray-400">VS</div>
            <div class="text-center">
              <div class="text-4xl mb-2">{{ opponent?.avatar || '👤' }}</div>
              <div class="text-5xl font-bold text-red-600">{{ opponentScore }}</div>
              <div class="text-gray-600">{{ opponent?.username || '对手' }}</div>
            </div>
          </div>
          
          <!-- 评级动画 -->
          <RatingAnimation 
            v-if="playerScore > opponentScore"
            :accuracy="100"
            :avg-time="5"
            :combo="5"
            show-medal
          />
          
          <!-- 按钮 -->
          <div class="flex gap-4 justify-center mt-8">
            <button
              @click="gameState = 'lobby'"
              class="px-8 py-3 border-2 border-gray-300 rounded-lg hover:bg-gray-100 transition"
            >
              返回大厅
            </button>
            <button
              @click="startMatching"
              class="px-8 py-3 bg-gradient-to-r from-orange-500 to-red-600 text-white font-bold rounded-lg hover:opacity-90 transition"
            >
              再来一局
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
