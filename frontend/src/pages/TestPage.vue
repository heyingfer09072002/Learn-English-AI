<script setup lang="ts">
import { ref } from 'vue';

const count = ref(0);
</script>

<template>
  <div class="p-8">
    <h1 class="text-3xl font-bold mb-4">测试页面</h1>
    <p class="text-xl mb-4">如果你能看到这个页面，说明 Vue 正在正常工作!</p>
    <button 
      @click="count++"
      class="px-4 py-2 bg-blue-500 text-white rounded"
    >
      点击次数：{{ count }}
    </button>
  </div>
</template>
