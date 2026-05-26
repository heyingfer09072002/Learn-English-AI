<script setup lang="ts">
import { RouterView } from 'vue-router';
import Navbar from './components/layout/Navbar.vue';
import AIAssistant from './components/ai/AIAssistant.vue';
</script>

<template>
  <div class="min-h-screen bg-gray-50">
    <Navbar />
    <RouterView />
    <AIAssistant />
  </div>
</template>
