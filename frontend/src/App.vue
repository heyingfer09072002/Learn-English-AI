<script setup lang="ts">
import { computed, onMounted } from 'vue';
import { RouterView, useRoute, useRouter } from 'vue-router';
import Navbar from './components/layout/Navbar.vue';
import AIAssistant from './components/ai/AIAssistant.vue';

const route = useRoute();
const router = useRouter();

// 登录页不显示导航栏
const showNavbar = computed(() => {
  return route.path !== '/login';
});

// 调试：打印路由信息
onMounted(() => {
  console.log('当前路由:', route.path);
  console.log('路由元信息:', route.meta);
  console.log('Token:', localStorage.getItem('auth_token'));
});
</script>

<template>
  <div class="min-h-screen bg-gray-50">
    <Navbar v-if="showNavbar" />
    <RouterView />
    <AIAssistant v-if="showNavbar" />
  </div>
</template>
