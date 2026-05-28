<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { apiGet } from '../api/apiClient';

interface Course {
  id: number;
  title: string;
  description: string;
  coverImage?: string;
  courseType: 'text' | 'audio' | 'video' | 'music';
  difficultyLevel: 'beginner' | 'intermediate' | 'advanced';
  studyCount: number;
  viewCount: number;
  authorName?: string;
  sentence_count?: number;
}

interface CourseListResponse {
  courses: Course[];
  total: number;
  page: number;
  limit: number;
}

const router = useRouter();
const courses = ref<Course[]>([]);
const isLoading = ref(true);
const selectedType = ref<string>('all');
const selectedDifficulty = ref<string>('all');
const searchQuery = ref('');

// 课程类型图标
const typeIcons: Record<string, string> = {
  text: '📝',
  audio: '🎧',
  video: '🎬',
  music: '🎵',
};

// 难度颜色
const difficultyColors: Record<string, string> = {
  beginner: 'bg-green-100 text-green-600',
  intermediate: 'bg-yellow-100 text-yellow-600',
  advanced: 'bg-red-100 text-red-600',
};

async function loadCourses() {
  isLoading.value = true;
  try {
    const params: Record<string, string> = {};
    if (selectedType.value !== 'all') params.courseType = selectedType.value;
    if (selectedDifficulty.value !== 'all') params.difficultyLevel = selectedDifficulty.value;
    if (searchQuery.value) params.search = searchQuery.value;

    const result = await apiGet<Course[]>('/api/courses', params);

    if (result.success && result.data) {
      courses.value = result.data;
    } else {
      courses.value = [];
    }
  } catch (error) {
    console.error('加载课程失败:', error);
    courses.value = [];
  } finally {
    isLoading.value = false;
  }
}

function startLearning(course: Course) {
  // 跳转到课程详情/学习页面
  router.push(`/lesson/${course.id}`);
}

onMounted(() => {
  loadCourses();
});
</script>

<template>
  <div class="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 p-8">
    <div class="max-w-7xl mx-auto">
      <!-- 标题 -->
      <h1 class="text-4xl font-bold text-gray-800 mb-8">课程广场</h1>

      <!-- 筛选栏 -->
      <div class="bg-white rounded-xl shadow-lg p-6 mb-8">
        <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
          <!-- 搜索框 -->
          <input
            v-model="searchQuery"
            @keyup.enter="loadCourses"
            type="text"
            placeholder="搜索课程..."
            class="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-700 placeholder-gray-400"
          />
          
          <!-- 课程类型 -->
          <select v-model="selectedType" @change="loadCourses" class="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500">
            <option value="all">所有类型</option>
            <option value="text">文本课程</option>
            <option value="audio">音频课程</option>
            <option value="video">视频课程</option>
            <option value="music">音乐课程</option>
          </select>
          
          <!-- 难度级别 -->
          <select v-model="selectedDifficulty" @change="loadCourses" class="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500">
            <option value="all">所有难度</option>
            <option value="beginner">初级</option>
            <option value="intermediate">中级</option>
            <option value="advanced">高级</option>
          </select>
          
          <!-- 刷新按钮 -->
          <button @click="loadCourses" class="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition">
            刷新
          </button>
        </div>
      </div>

      <!-- 加载状态 -->
      <div v-if="isLoading" class="text-center py-20">
        <div class="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
        <p class="text-gray-600 mt-4">加载课程中...</p>
      </div>

      <!-- 空状态 -->
      <div v-else-if="courses.length === 0" class="text-center py-20 bg-white rounded-2xl shadow-lg">
        <div class="text-6xl mb-4">📚</div>
        <h2 class="text-2xl font-bold text-gray-800 mb-2">暂无课程</h2>
        <p class="text-gray-600 mb-6">暂时没有符合筛选条件的课程</p>
        <button 
          @click="router.push('/courses/create')"
          class="px-6 py-3 bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-bold rounded-lg hover:opacity-90 transition"
        >
          创建第一个课程
        </button>
      </div>

      <!-- 课程列表 -->
      <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div
          v-for="course in courses"
          :key="course.id"
          class="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition cursor-pointer transform hover:-translate-y-1 duration-200"
          @click="startLearning(course)"
        >
          <!-- 精美封面 -->
          <div 
            class="h-48 relative overflow-hidden group"
            :style="{ background: course.coverImage || 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }"
          >
            <!-- 装饰背景 -->
            <div class="absolute inset-0 opacity-10">
              <div class="absolute top-10 left-10 w-20 h-20 bg-white rounded-full blur-2xl"></div>
              <div class="absolute bottom-10 right-10 w-32 h-32 bg-white rounded-full blur-3xl"></div>
            </div>
            
            <!-- 课程图标和标题 -->
            <div class="absolute inset-0 flex items-center justify-center">
              <div class="text-center">
                <div class="text-5xl mb-2 transform group-hover:scale-110 transition duration-200">
                  {{ typeIcons[course.courseType] }}
                </div>
                <h3 class="text-white text-xl font-bold px-4 drop-shadow-lg">
                  {{ course.title }}
                </h3>
              </div>
            </div>
            
            <!-- 右上角难度标签 -->
            <div class="absolute top-3 right-3">
              <span :class="[
                'px-3 py-1 text-xs font-bold rounded-full shadow-lg',
                difficultyColors[course.difficultyLevel]
              ]">
                {{ course.difficultyLevel === 'beginner' ? '初级' : 
                   course.difficultyLevel === 'intermediate' ? '中级' : '高级' }}
              </span>
            </div>
            
            <!-- 底部句子数量 -->
            <div class="absolute bottom-0 left-0 right-0 bg-black bg-opacity-30 backdrop-blur-sm py-2">
              <div class="text-center text-white">
                <span class="text-2xl font-bold">{{ course.sentence_count || 0 }}</span>
                <span class="text-sm ml-1">句</span>
              </div>
            </div>
          </div>

          <!-- 内容 -->
          <div class="p-5">
            <!-- 描述 -->
            <p class="text-sm text-gray-600 mb-4 line-clamp-2 h-10">
              {{ course.description || '暂无描述' }}
            </p>

            <!-- 信息栏 -->
            <div class="flex justify-between items-center text-xs text-gray-500">
              <div class="flex items-center">
                <span class="mr-1">👥</span>
                <span>{{ course.studyCount || 0 }} 人学习</span>
              </div>
              <div class="flex items-center" v-if="course.authorName">
                <span>by {{ course.authorName }}</span>
              </div>
            </div>
            
            <!-- 开始学习按钮 -->
            <button class="w-full mt-4 py-2 px-4 bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-bold rounded-lg hover:from-indigo-600 hover:to-purple-700 transition transform hover:scale-105">
              开始学习 →
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
