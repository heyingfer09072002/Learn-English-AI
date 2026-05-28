<template>
  <div class="min-h-screen bg-gradient-to-br from-indigo-50 to-purple-50 p-8">
    <div class="max-w-6xl mx-auto">
      <!-- 页面标题 -->
      <h1 class="text-3xl font-bold text-gray-800 mb-2">错题本</h1>
      <p class="text-gray-600 mb-8">收藏重点句子，记录学习笔记</p>

      <!-- 统计卡片 -->
      <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div class="bg-white rounded-xl shadow-lg p-6">
          <div class="flex items-center justify-between">
            <div>
              <div class="text-sm text-gray-600 mb-1">收藏总数</div>
              <div class="text-3xl font-bold text-indigo-600">{{ stats.total }}</div>
            </div>
            <div class="text-4xl">⭐</div>
          </div>
        </div>
        
        <div class="bg-white rounded-xl shadow-lg p-6">
          <div class="flex items-center justify-between">
            <div>
              <div class="text-sm text-gray-600 mb-1">覆盖课程</div>
              <div class="text-3xl font-bold text-purple-600">{{ stats.courses }}</div>
            </div>
            <div class="text-4xl">📚</div>
          </div>
        </div>
        
        <div class="bg-white rounded-xl shadow-lg p-6">
          <div class="flex items-center justify-between">
            <div>
              <div class="text-sm text-gray-600 mb-1">本周新增</div>
              <div class="text-3xl font-bold text-green-600">{{ stats.weekAdded }}</div>
            </div>
            <div class="text-4xl">📈</div>
          </div>
        </div>
      </div>

      <!-- 筛选栏 -->
      <div class="bg-white rounded-xl shadow-lg p-4 mb-6">
        <div class="flex items-center gap-4">
          <select
            v-model="selectedCourse"
            class="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            @change="loadFavorites"
          >
            <option value="">全部课程</option>
            <option v-for="course in courses" :key="course.id" :value="course.id">
              {{ course.title }}
            </option>
          </select>
          
          <div class="text-sm text-gray-600">
            共 {{ favorites.length }} 个句子
          </div>
        </div>
      </div>

      <!-- 加载状态 -->
      <div v-if="isLoading" class="text-center py-20">
        <div class="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-500"></div>
        <p class="text-gray-600 mt-4">加载收藏...</p>
      </div>

      <!-- 收藏列表 -->
      <template v-else>
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <FavoriteCard
            v-for="fav in favorites"
            :key="fav.id"
            :id="fav.id"
            :sentence="fav.sentence"
            :course="fav.course"
            :note="fav.note"
            :created-at="fav.createdAt"
            @remove="removeFavorite(fav.id)"
            @practice="practiceSentence(fav.sentence)"
            @update-note="updateNote(fav.id, $event)"
          />
        </div>

        <!-- 空状态 -->
        <div v-if="favorites.length === 0" class="text-center py-20 bg-white rounded-xl shadow-lg">
          <div class="text-6xl mb-4">⭐</div>
          <h3 class="text-xl font-bold text-gray-800 mb-2">还没有收藏</h3>
          <p class="text-gray-600 mb-6">在课程学习中点击⭐收藏重点句子</p>
          <router-link
            to="/courses"
            class="inline-block px-6 py-3 bg-indigo-600 text-white font-bold rounded-lg hover:bg-indigo-700 transition"
          >
            浏览课程
          </router-link>
        </div>
      </template>

      <!-- 快速浮动按钮 -->
      <button
        v-if="favorites.length > 0"
        @click="practiceAll"
        class="fixed bottom-8 right-8 w-14 h-14 bg-indigo-600 text-white rounded-full shadow-lg hover:bg-indigo-700 transition flex items-center justify-center text-2xl"
        title="集中练习"
      >
        🎯
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { apiGet, apiDelete, apiPut } from '../api/apiClient'
import FavoriteCard from '../components/FavoriteCard.vue'

const router = useRouter()
const isLoading = ref(true)
const favorites = ref<any[]>([])
const courses = ref<any[]>([])
const selectedCourse = ref('')
const stats = ref({ total: 0, courses: 0, weekAdded: 0 })

async function loadFavorites() {
  try {
    isLoading.value = true
    const url = selectedCourse.value 
      ? `/api/favorites?courseId=${selectedCourse.value}`
      : '/api/favorites'
    
    const result = await apiGet(url)
    if (result.success && result.data) {
      favorites.value = result.data
      stats.value.total = result.total || result.data.length
    }
  } catch (error) {
    console.error('加载收藏失败:', error)
  } finally {
    isLoading.value = false
  }
}

async function loadCourses() {
  try {
    const result = await apiGet('/api/courses')
    if (result.success && result.data) {
      courses.value = result.data
    }
  } catch (error) {
    console.error('加载课程失败:', error)
  }
}

async function loadStats() {
  try {
    const result = await apiGet('/api/favorites/stats')
    if (result.success && result.data) {
      stats.value = {
        total: result.data.total,
        courses: Object.keys(result.data.byCourse).length,
        weekAdded: 0, // TODO: 从后端计算
      }
    }
  } catch (error) {
    console.error('加载统计失败:', error)
  }
}

async function removeFavorite(id: number) {
  if (!confirm('确定要取消收藏吗？')) return
  
  try {
    const result = await apiDelete(`/api/favorites/${id}`)
    if (result.success) {
      await loadFavorites()
      await loadStats()
    }
  } catch (error) {
    console.error('取消收藏失败:', error)
  }
}

async function updateNote(id: number, note: string) {
  try {
    const result = await apiPut(`/api/favorites/${id}/note`, { note })
    if (result.success) {
      await loadFavorites()
    }
  } catch (error) {
    console.error('更新笔记失败:', error)
  }
}

function practiceSentence(sentence: any) {
  // TODO: 打开练习模式
  alert(`开始练习：${sentence.english}`)
}

function practiceAll() {
  // TODO: 批量练习模式
  alert('集中练习功能开发中...')
}

onMounted(() => {
  loadFavorites()
  loadCourses()
  loadStats()
})
</script>
