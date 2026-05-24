<template>
  <div class="min-h-screen bg-[#0a0e27] text-white">
    <Navbar />
    
    <main class="container mx-auto px-6 py-8">
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[calc(100vh-8rem)]">
        <!-- 侧边栏 - 对话列表 -->
        <div class="lg:col-span-1 bg-gradient-to-br from-white/[0.03] to-white/[0.01] border border-white/10 rounded-2xl p-6">
          <div class="flex items-center justify-between mb-6">
            <h2 class="text-xl font-bold">对话历史</h2>
            <button class="p-2 hover:bg-white/5 rounded-lg transition-all">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
              </svg>
            </button>
          </div>
          
          <div class="space-y-2">
            <div 
              v-for="chat in chats" 
              :key="chat.id"
              class="p-4 rounded-xl hover:bg-white/5 cursor-pointer transition-all"
              :class="{'bg-white/10': currentChatId === chat.id}"
              @click="currentChatId = chat.id"
            >
              <div class="font-medium mb-1">{{ chat.title }}</div>
              <div class="text-sm text-gray-400 truncate">{{ chat.preview }}</div>
              <div class="text-xs text-gray-500 mt-2">{{ chat.time }}</div>
            </div>
          </div>
        </div>

        <!-- 主对话区域 -->
        <div class="lg:col-span-2 flex flex-col bg-gradient-to-br from-white/[0.03] to-white/[0.01] border border-white/10 rounded-2xl">
          <!-- 消息列表 -->
          <div class="flex-1 overflow-y-auto p-6 space-y-6">
            <div class="flex items-start space-x-4">
              <div class="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center flex-shrink-0">
                <span class="text-sm font-bold">AI</span>
              </div>
              <div class="flex-1">
                <div class="bg-white/5 rounded-2xl rounded-tl-none p-4 inline-block">
                  <p class="text-gray-200">Hello! I'm your AI English tutor. Let's practice conversation together. What would you like to talk about today?</p>
                </div>
              </div>
            </div>

            <div class="flex items-start space-x-4 flex-row-reverse">
              <div class="w-10 h-10 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-xl flex items-center justify-center flex-shrink-0">
                <span class="text-sm font-bold">Me</span>
              </div>
              <div class="flex-1 flex justify-end">
                <div class="bg-blue-600/20 border border-blue-500/30 rounded-2xl rounded-tr-none p-4 inline-block">
                  <p class="text-gray-200">Hi! I'd like to practice talking about daily life.</p>
                </div>
              </div>
            </div>

            <div class="flex items-start space-x-4">
              <div class="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center flex-shrink-0">
                <span class="text-sm font-bold">AI</span>
              </div>
              <div class="flex-1">
                <div class="bg-white/5 rounded-2xl rounded-tl-none p-4 inline-block">
                  <p class="text-gray-200">Great! Let's start with your daily routine. What time do you usually wake up on weekdays?</p>
                </div>
              </div>
            </div>
          </div>

          <!-- 输入区域 -->
          <div class="border-t border-white/10 p-6">
            <div class="flex items-end space-x-4">
              <div class="flex-1 bg-white/5 border border-white/10 rounded-2xl p-4">
                <textarea 
                  v-model="message"
                  placeholder="Type your message in English..."
                  class="w-full bg-transparent border-none outline-none resize-none text-white placeholder-gray-500"
                  rows="2"
                ></textarea>
              </div>
              <button class="p-4 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 rounded-xl transition-all">
                <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                </svg>
              </button>
            </div>
            <div class="flex items-center justify-between mt-4">
              <div class="flex items-center space-x-2 text-sm text-gray-400">
                <span class="flex items-center space-x-1">
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
                  </svg>
                  <span>语音输入</span>
                </span>
              </div>
              <div class="text-sm text-gray-500">AI 对话练习</div>
            </div>
          </div>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
import Navbar from '@/components/layout/Navbar.vue'
import { ref } from 'vue'

const message = ref('')
const currentChatId = ref(1)

const chats = [
  { id: 1, title: 'Daily Life', preview: 'What time do you usually wake up?', time: '刚刚' },
  { id: 2, title: 'Work & Career', preview: 'Tell me about your job.', time: '昨天' },
  { id: 3, title: 'Travel', preview: 'Where did you go for vacation?', time: '3 天前' },
  { id: 4, title: 'Hobbies', preview: 'What do you like to do in free time?', time: '1 周前' }
]
</script>
