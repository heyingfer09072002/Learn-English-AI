<template>
  <div class="min-h-screen bg-[#0a0e27] text-white flex items-center justify-center p-6">
    <div class="w-full max-w-md">
      <!-- Logo 和标题 -->
      <div class="text-center mb-12">
        <h1 class="text-6xl font-black mb-4 bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-500 bg-clip-text text-transparent">
          EnglishAI
        </h1>
        <p class="text-xl text-gray-400">科学记忆 · 高效学习</p>
      </div>

      <!-- 登录表单 -->
      <div class="bg-gradient-to-br from-white/[0.05] to-white/[0.02] border border-white/10 rounded-3xl p-10 backdrop-blur-sm">
        <h2 class="text-3xl font-bold mb-8 text-center">用户登录</h2>

        <div v-if="showRegister" class="space-y-6">
          <div>
            <label class="block text-sm font-medium text-gray-400 mb-2">用户名</label>
            <input
              v-model="registerForm.username"
              type="text"
              class="w-full px-6 py-4 bg-white/5 border border-white/10 rounded-2xl focus:outline-none focus:border-cyan-500/50 transition-colors"
              placeholder="请输入用户名"
            />
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-400 mb-2">邮箱</label>
            <input
              v-model="registerForm.email"
              type="email"
              class="w-full px-6 py-4 bg-white/5 border border-white/10 rounded-2xl focus:outline-none focus:border-cyan-500/50 transition-colors"
              placeholder="请输入邮箱"
            />
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-400 mb-2">密码</label>
            <input
              v-model="registerForm.password"
              type="password"
              class="w-full px-6 py-4 bg-white/5 border border-white/10 rounded-2xl focus:outline-none focus:border-cyan-500/50 transition-colors"
              placeholder="请输入密码"
            />
          </div>

          <button
            @click="handleRegister"
            :disabled="isLoading"
            class="w-full py-4 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 disabled:from-gray-600 disabled:to-gray-700 rounded-2xl font-bold text-lg transition-all transform hover:scale-105 disabled:transform-none"
          >
            {{ isLoading ? '注册中...' : '立即注册' }}
          </button>

          <p class="text-center text-gray-400">
            已有账号？
            <button @click="showRegister = false" class="text-cyan-400 hover:text-cyan-300 font-bold">
              立即登录
            </button>
          </p>
        </div>

        <div v-else class="space-y-6">
          <div>
            <label class="block text-sm font-medium text-gray-400 mb-2">邮箱</label>
            <input
              v-model="loginForm.email"
              type="email"
              class="w-full px-6 py-4 bg-white/5 border border-white/10 rounded-2xl focus:outline-none focus:border-cyan-500/50 transition-colors"
              placeholder="请输入邮箱"
            />
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-400 mb-2">密码</label>
            <input
              v-model="loginForm.password"
              type="password"
              class="w-full px-6 py-4 bg-white/5 border border-white/10 rounded-2xl focus:outline-none focus:border-cyan-500/50 transition-colors"
              placeholder="请输入密码"
            />
          </div>

          <div class="flex items-center justify-between text-sm">
            <label class="flex items-center gap-2">
              <input type="checkbox" class="rounded border-white/20 bg-white/5" />
              <span class="text-gray-400">记住我</span>
            </label>
            <button class="text-cyan-400 hover:text-cyan-300">忘记密码？</button>
          </div>

          <button
            @click="handleLogin"
            :disabled="isLoading"
            class="w-full py-4 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 disabled:from-gray-600 disabled:to-gray-700 rounded-2xl font-bold text-lg transition-all transform hover:scale-105 disabled:transform-none"
          >
            {{ isLoading ? '登录中...' : '立即登录' }}
          </button>

          <p class="text-center text-gray-400">
            还没有账号？
            <button @click="showRegister = true" class="text-cyan-400 hover:text-cyan-300 font-bold">
              立即注册
            </button>
          </p>
        </div>

        <!-- 错误提示 -->
        <div v-if="errorMessage" class="mt-6 p-4 bg-red-500/20 border border-red-500/30 rounded-2xl">
          <p class="text-red-400 text-center">{{ errorMessage }}</p>
        </div>

        <!-- 成功提示 -->
        <div v-if="successMessage" class="mt-6 p-4 bg-green-500/20 border border-green-500/30 rounded-2xl">
          <p class="text-green-400 text-center">{{ successMessage }}</p>
        </div>
      </div>

      <!-- 功能特点 -->
      <div class="grid grid-cols-3 gap-6 mt-12">
        <div class="text-center">
          <div class="w-12 h-12 mx-auto bg-gradient-to-br from-cyan-500/20 to-cyan-600/20 rounded-2xl flex items-center justify-center mb-3">
            <svg class="w-6 h-6 text-cyan-400" fill="currentColor" viewBox="0 0 20 20">
              <path d="M18 3a1 1 0 00-1.196-.98l-10 2A1 1 0 006 5v9.114A4.369 4.369 0 005 14c-1.657 0-3 .895-3 2s1.343 2 3 2 3-.895 3-2V7.82l8-1.6v5.894A4.37 4.37 0 0015 17c1.657 0 3-.895 3-2s-1.343-2-3-2a4.37 4.37 0 00-2.246-.628V5.82l8 1.6a1 1 0 001.196-.98V3z"/>
            </svg>
          </div>
          <p class="text-sm text-gray-400">科学记忆</p>
        </div>
        <div class="text-center">
          <div class="w-12 h-12 mx-auto bg-gradient-to-br from-blue-500/20 to-blue-600/20 rounded-2xl flex items-center justify-center mb-3">
            <svg class="w-6 h-6 text-blue-400" fill="currentColor" viewBox="0 0 20 20">
              <path d="M2 10a8 8 0 018-8v8h8a8 8 0 11-16 0z"/>
              <path d="M12 2.252A8.014 8.014 0 0117.748 8H12V2.252z"/>
            </svg>
          </div>
          <p class="text-sm text-gray-400">6000+ 词汇</p>
        </div>
        <div class="text-center">
          <div class="w-12 h-12 mx-auto bg-gradient-to-br from-purple-500/20 to-purple-600/20 rounded-2xl flex items-center justify-center mb-3">
            <svg class="w-6 h-6 text-purple-400" fill="currentColor" viewBox="0 0 20 20">
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
            </svg>
          </div>
          <p class="text-sm text-gray-400">4 种模式</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { api } from '@/api'

const router = useRouter()
const showRegister = ref(false)
const isLoading = ref(false)
const errorMessage = ref('')
const successMessage = ref('')

const loginForm = ref({
  email: '',
  password: ''
})

const registerForm = ref({
  username: '',
  email: '',
  password: ''
})

// 登录处理
const handleLogin = async () => {
  if (!loginForm.value.email || !loginForm.value.password) {
    errorMessage.value = '请填写邮箱和密码'
    return
  }

  isLoading.value = true
  errorMessage.value = ''

  try {
    const res = await api.login(loginForm.value.email, loginForm.value.password)
    if (res.success) {
      // 存储 token 和用户信息
      localStorage.setItem('token', res.data.token)
      localStorage.setItem('user', JSON.stringify(res.data.user))
      
      successMessage.value = '登录成功，跳转中...'
      setTimeout(() => {
        router.push('/vocabulary')
      }, 1000)
    }
  } catch (error: any) {
    errorMessage.value = error.response?.data?.message || '登录失败，请重试'
  } finally {
    isLoading.value = false
  }
}

// 注册处理
const handleRegister = async () => {
  if (!registerForm.value.username || !registerForm.value.email || !registerForm.value.password) {
    errorMessage.value = '请填写所有字段'
    return
  }

  isLoading.value = true
  errorMessage.value = ''

  try {
    const res = await api.register({
      username: registerForm.value.username,
      email: registerForm.value.email,
      password: registerForm.value.password
    })
    
    if (res.success) {
      // 自动登录
      localStorage.setItem('token', res.data.token)
      localStorage.setItem('user', JSON.stringify(res.data.user))
      
      successMessage.value = '注册成功，跳转中...'
      setTimeout(() => {
        router.push('/vocabulary')
      }, 1000)
    }
  } catch (error: any) {
    errorMessage.value = error.response?.data?.message || '注册失败，请重试'
  } finally {
    isLoading.value = false
  }
}

// 检查是否已登录
onMounted(() => {
  const token = localStorage.getItem('token')
  if (token) {
    router.push('/vocabulary')
  }
})
</script>
