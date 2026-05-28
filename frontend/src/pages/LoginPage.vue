<template>
  <div class="min-h-screen bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 flex items-center justify-center p-4">
    <div class="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden">
      <!-- 头部 -->
      <div class="bg-gradient-to-r from-indigo-600 to-purple-600 px-8 py-6">
        <h1 class="text-2xl font-bold text-white text-center">
          {{ isLogin ? '欢迎回来' : '创建账号' }}
        </h1>
        <p class="text-indigo-100 text-center mt-2">
          {{ isLogin ? '登录开始英语学习之旅' : '注册免费开始学习' }}
        </p>
      </div>

      <!-- 表单 -->
      <div class="px-8 py-6">
        <form @submit.prevent="handleSubmit" class="space-y-4">
          <!-- 邮箱 -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">
              邮箱地址
            </label>
            <input
              v-model="form.email"
              type="email"
              required
              class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-gray-700 placeholder-gray-400"
              placeholder="your@email.com"
            />
          </div>

          <!-- 密码 -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">
              密码
            </label>
            <input
              v-model="form.password"
              type="password"
              required
              class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-gray-700 placeholder-gray-400"
              :placeholder="isLogin ? '请输入密码' : '至少 6 位密码'"
            />
          </div>

          <!-- 用户名（仅注册） -->
          <div v-if="!isLogin">
            <label class="block text-sm font-medium text-gray-700 mb-1">
              用户名（可选）
            </label>
            <input
              v-model="form.username"
              type="text"
              class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-gray-700 placeholder-gray-400"
              placeholder="你想被称呼的名字"
            />
          </div>

          <!-- 错误提示 -->
          <div v-if="error" class="bg-red-50 text-red-600 px-4 py-3 rounded-lg text-sm">
            {{ error }}
          </div>

          <!-- 提交按钮 -->
          <button
            type="submit"
            :disabled="isLoading"
            class="w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-3 rounded-lg font-semibold hover:from-indigo-700 hover:to-purple-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {{ isLoading ? '加载中...' : (isLogin ? '登录' : '注册') }}
          </button>
        </form>

        <!-- 切换登录/注册 -->
        <div class="mt-6 text-center text-sm text-gray-600">
          {{ isLogin ? '还没有账号？' : '已有账号？' }}
          <button
            @click="isLogin = !isLogin"
            class="text-indigo-600 font-semibold hover:underline"
          >
            {{ isLogin ? '立即注册' : '返回登录' }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { apiPost } from '../api/apiClient';

const router = useRouter();
const isLogin = ref(true);
const isLoading = ref(false);
const error = ref('');

const form = ref({
  email: '',
  password: '',
  username: ''
});

async function handleSubmit() {
  isLoading.value = true;
  error.value = '';

  try {
    const endpoint = isLogin.value ? '/api/auth/login' : '/api/auth/register';
    const result = await apiPost(endpoint, form.value);

    if (result.success && result.data) {
      // 保存 token
      localStorage.setItem('auth_token', result.data.token);
      localStorage.setItem('user_info', JSON.stringify(result.data.user));
      
      // 跳转到首页
      router.push('/');
    } else {
      error.value = result.error?.message || '操作失败';
    }
  } catch (err: any) {
    error.value = err.message || '网络错误，请稍后重试';
  } finally {
    isLoading.value = false;
  }
}
</script>
