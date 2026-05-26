<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';

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
    const params = new URLSearchParams();
    if (selectedType.value !== 'all') params.append('courseType', selectedType.value);
    if (selectedDifficulty.value !== 'all') params.append('difficultyLevel', selectedDifficulty.value);
    if (searchQuery.value) params.append('search', searchQuery.value);
    
    const response = await fetch(`/api/courses?${params}`);
    const result = await response.json();
    
    if (result.success) {
      courses.value = result.data.courses;
    }
  } catch (error) {
    console.error('加载课程失败:', error);
  } finally {
    isLoading.value = false;
  }
}

function startLearning(course: Course) {
  router.push(`/learning/${course.id}`);
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
            class="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          
          <!-- 课程类型 -->
          <select v-model="selectedType" @change="loadCourses" class="px-4 py-2 border border-gray-300 rounded-lg">
            <option value="all">所有类型</option>
            <option value="text">文本课程</option>
            <option value="audio">音频课程</option>
            <option value="video">视频课程</option>
            <option value="music">音乐课程</option>
          </select>
          
          <!-- 难度级别 -->
          <select v-model="selectedDifficulty" @change="loadCourses" class="px-4 py-2 border border-gray-300 rounded-lg">
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

      <!-- 课程列表 -->
      <div v-if="isLoading" class="text-center py-20">
        <div class="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>

      <div v-else-if="courses.length === 0" class="text-center py-20 text-gray-500">
        暂无课程
      </div>

      <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div
          v-for="course in courses"
          :key="course.id"
          class="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition cursor-pointer"
          @click="startLearning(course)"
        >
          <!-- 封面图 -->
          <div class="h-40 bg-gradient-to-r from-blue-400 to-purple-500 flex items-center justify-center text-6xl">
            {{ typeIcons[course.courseType] }}
          </div>

          <!-- 内容 -->
          <div class="p-4">
            <!-- 标题 -->
            <h3 class="text-lg font-bold text-gray-800 mb-2 line-clamp-1">
              {{ course.title }}
            </h3>

            <!-- 描述 -->
            <p class="text-sm text-gray-600 mb-3 line-clamp-2">
              {{ course.description || '暂无描述' }}
            </p>

            <!-- 标签 -->
            <div class="flex gap-2 mb-3 flex-wrap">
              <span :class="['px-2 py-1 text-xs rounded-full', difficultyColors[course.difficultyLevel]]">
                {{ course.difficultyLevel === 'beginner' ? '初级' : 
                   course.difficultyLevel === 'intermediate' ? '中级' : '高级' }}
              </span>
              <span class="px-2 py-1 text-xs rounded-full bg-gray-100 text-gray-600">
                {{ typeIcons[course.courseType] }} {{ 
                  course.courseType === 'text' ? '文本' :
                  course.courseType === 'audio' ? '音频' :
                  course.courseType === 'video' ? '视频' : '音乐'
                }}
              </span>
            </div>

            <!-- 统计信息 -->
            <div class="flex justify-between text-xs text-gray-500">
              <span>{{ course.studyCount }} 人学习</span>
              <span v-if="course.authorName">by {{ course.authorName }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
