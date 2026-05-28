<template>
  <div class="fixed top-4 right-4 z-40 pointer-events-none">
    <!-- 经验值获得动画 -->
    <transition-group name="exp-list">
      <div
        v-for="exp in expAnimations"
        :key="exp.id"
        class="bg-gradient-to-r from-yellow-400 to-orange-500 text-white font-bold px-4 py-2 rounded-full shadow-lg animate-float-up"
      >
        +{{ exp.value }} EXP
      </div>
    </transition-group>

    <!-- 等级提升提示 -->
    <transition name="level-up">
      <div
        v-if="showLevelUp"
        class="fixed inset-0 flex items-center justify-center z-50 pointer-events-none"
      >
        <div class="bg-gradient-to-br from-purple-600 to-pink-600 text-white px-8 py-6 rounded-2xl shadow-2xl animate-pulse transform scale-110">
          <div class="text-center">
            <div class="text-5xl mb-2">🎉</div>
            <div class="text-3xl font-bold">等级提升!</div>
            <div class="text-xl mt-2">Lv.{{ newLevel }} {{ newTitle }}</div>
          </div>
        </div>
      </div>
    </transition>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

interface ExpAnimation {
  id: number
  value: number
}

const expAnimations = ref<ExpAnimation[]>([])
const showLevelUp = ref(false)
const newLevel = ref(1)
const newTitle = ref('英语新手')
let animationId = 0

function addExp(value: number) {
  animationId++
  expAnimations.value.push({ id: animationId, value })
  
  // 2 秒后移除
  setTimeout(() => {
    expAnimations.value = expAnimations.value.filter(a => a.id !== animationId)
  }, 2000)
}

function showLevelUpAnimation(level: number, title: string) {
  newLevel.value = level
  newTitle.value = title
  showLevelUp.value = true
  
  setTimeout(() => {
    showLevelUp.value = false
  }, 3000)
}

defineExpose({ addExp, showLevelUpAnimation })
</script>

<style scoped>
@keyframes float-up {
  0% { transform: translateY(0) scale(1); opacity: 1; }
  100% { transform: translateY(-50px) scale(1.2); opacity: 0; }
}

.animate-float-up {
  animation: float-up 2s ease-out forwards;
}

.exp-list-enter-active,
.exp-list-leave-active {
  transition: all 0.5s ease;
}

.exp-list-enter-from {
  opacity: 0;
  transform: translateX(50px);
}

.exp-list-leave-to {
  opacity: 0;
  transform: translateY(-50px);
}

.level-up-enter-active,
.level-up-leave-active {
  transition: all 0.5s ease;
}

.level-up-enter-from {
  opacity: 0;
  transform: scale(0.5);
}

.level-up-leave-to {
  opacity: 0;
  transform: scale(1.5);
}
</style>
