<script setup lang="ts">
import { ref, nextTick } from 'vue';

const isOpen = ref(false);
const isTyping = ref(false);
const messages = ref<Array<{ role: 'user' | 'assistant'; content: string; timestamp: Date }>>([
  {
    role: 'assistant',
    content: '你好！我是你的 AI 英语助手，有任何问题都可以问我哦！😊',
    timestamp: new Date(),
  },
]);
const userInput = ref('');
const chatContainer = ref<HTMLElement | null>(null);

// 常见问题
const quickQuestions = [
  '这个单词怎么发音？',
  '这句话的语法结构是什么？',
  '有更好的表达方式吗？',
  '帮我解释这个短语',
];

// 发送消息
async function sendMessage() {
  if (!userInput.value.trim()) return;
  
  messages.value.push({
    role: 'user',
    content: userInput.value,
    timestamp: new Date(),
  });
  
  const userMessage = userInput.value;
  userInput.value = '';
  isTyping.value = true;
  
  await nextTick();
  scrollToBottom();
  
  try {
    const response = await fetch('/api/ai/assistant/ask', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({
        question: userMessage,
        context: 'english_learning',
      }),
    });
    
    const result = await response.json();
    
    if (result.success) {
      messages.value.push({
        role: 'assistant',
        content: result.data.answer,
        timestamp: new Date(),
      });
    } else {
      messages.value.push({
        role: 'assistant',
        content: '抱歉，我遇到了一些问题，请稍后再试。',
        timestamp: new Date(),
      });
    }
  } catch (error) {
    console.error(error);
    messages.value.push({
      role: 'assistant',
      content: '网络错误，请检查连接后重试。',
      timestamp: new Date(),
    });
  } finally {
    isTyping.value = false;
    await nextTick();
    scrollToBottom();
  }
}

function scrollToBottom() {
  if (chatContainer.value) {
    chatContainer.value.scrollTop = chatContainer.value.scrollHeight;
  }
}

function useQuickQuestion(question: string) {
  userInput.value = question;
  sendMessage();
}

function handleKeydown(event: KeyboardEvent) {
  if (event.key === 'Enter' && !event.shiftKey) {
    event.preventDefault();
    sendMessage();
  }
}
</script>

<template>
  <div class="fixed bottom-6 right-6 z-50">
    <button
      v-if="!isOpen"
      @click="isOpen = true"
      class="w-16 h-16 bg-gradient-to-r from-indigo-500 to-purple-600 text-white text-3xl rounded-full shadow-2xl hover:opacity-90 transition transform hover:scale-110 flex items-center justify-center"
    >
      🤖
    </button>
    
    <div
      v-else
      class="bg-white rounded-2xl shadow-2xl w-96 h-[500px] flex flex-col overflow-hidden"
    >
      <div class="bg-gradient-to-r from-indigo-500 to-purple-600 p-4 flex justify-between items-center">
        <div class="flex items-center gap-3">
          <span class="text-2xl">🤖</span>
          <div>
            <div class="text-white font-bold">AI 英语助手</div>
            <div class="text-indigo-200 text-xs">随时为你解答</div>
          </div>
        </div>
        <button @click="isOpen = false" class="text-white hover:text-gray-200 transition">✕</button>
      </div>
      
      <div ref="chatContainer" class="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
        <div
          v-for="(message, index) in messages"
          :key="index"
          :class="['flex', message.role === 'user' ? 'justify-end' : 'justify-start']"
        >
          <div
            :class="[
              'max-w-[80%] p-3 rounded-2xl',
              message.role === 'user'
                ? 'bg-indigo-500 text-white rounded-br-sm'
                : 'bg-white text-gray-800 shadow rounded-bl-sm',
            ]"
          >
            {{ message.content }}
          </div>
        </div>
        
        <div v-if="isTyping" class="flex justify-start">
          <div class="bg-white p-3 rounded-2xl shadow rounded-bl-sm">
            <div class="flex gap-1">
              <div class="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style="animation-delay: 0s"></div>
              <div class="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style="animation-delay: 0.1s"></div>
              <div class="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style="animation-delay: 0.2s"></div>
            </div>
          </div>
        </div>
      </div>
      
      <div class="px-4 py-2 bg-white border-t border-gray-200">
        <div class="flex gap-2 overflow-x-auto pb-2">
          <button
            v-for="question in quickQuestions"
            :key="question"
            @click="useQuickQuestion(question)"
            class="px-3 py-1 bg-indigo-100 text-indigo-600 text-sm rounded-full whitespace-nowrap hover:bg-indigo-200 transition"
          >
            {{ question }}
          </button>
        </div>
      </div>
      
      <div class="p-4 bg-white border-t border-gray-200">
        <div class="flex gap-2">
          <textarea
            v-model="userInput"
            @keydown="handleKeydown"
            rows="2"
            placeholder="输入你的问题..."
            class="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none"
          ></textarea>
          <button
            @click="sendMessage"
            :disabled="!userInput.trim() || isTyping"
            class="px-4 py-2 bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:opacity-90 transition"
          >
            发送
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
