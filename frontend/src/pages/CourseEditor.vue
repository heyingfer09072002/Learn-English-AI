<script setup lang="ts">
import { ref, computed } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();

// 表单数据
const formData = ref({
  title: '',
  description: '',
  courseType: 'text' as 'text' | 'audio' | 'video' | 'music',
  difficultyLevel: 'beginner' as 'beginner' | 'intermediate' | 'advanced',
  targetAudience: '',
  tags: '',
  content: '',
});

const isCreating = ref(false);
const previewSentences = ref<string[]>([]);
const errors = ref<string[]>([]);

// 课程类型选项
const courseTypeOptions = [
  { value: 'text', label: '文本课程', icon: '📝' },
  { value: 'audio', label: '音频课程', icon: '🎧' },
  { value: 'video', label: '视频课程', icon: '🎬' },
  { value: 'music', label: '音乐课程', icon: '🎵' },
];

// 难度选项
const difficultyOptions = [
  { value: 'beginner', label: '初级', color: 'bg-green-100 text-green-600' },
  { value: 'intermediate', label: '中级', color: 'bg-yellow-100 text-yellow-600' },
  { value: 'advanced', label: '高级', color: 'bg-red-100 text-red-600' },
];

// 预览句子（模拟 AI 分句）
function previewSentencesFromContent() {
  if (!formData.value.content) {
    previewSentences.value = [];
    return;
  }
  
  // 简单分句（实际应该调用后端 AI 服务）
  const sentences = formData.value.content
    .split(/[.!?]+/)
    .filter(s => s.trim().length > 0)
    .slice(0, 10); // 只显示前 10 句
  
  previewSentences.value = sentences;
}

// 验证表单
function validateForm(): boolean {
  errors.value = [];
  
  if (!formData.value.title || formData.value.title.length < 1) {
    errors.value.push('请输入课程标题');
  }
  
  if (!formData.value.content || formData.value.content.length < 10) {
    errors.value.push('请输入至少 10 个字符的课程内容');
  }
  
  return errors.value.length === 0;
}

// 创建课程
async function createCourse() {
  if (!validateForm()) return;
  
  isCreating.value = true;
  
  try {
    const response = await fetch('/api/courses', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({
        title: formData.value.title,
        description: formData.value.description,
        courseType: formData.value.courseType,
        difficultyLevel: formData.value.difficultyLevel,
        targetAudience: formData.value.targetAudience,
        tags: formData.value.tags.split(',').filter(t => t.trim()),
        content: formData.value.content,
      }),
    });
    
    const result = await response.json();
    
    if (result.success) {
      alert('课程创建成功！');
      router.push(`/courses/${result.data.id}`);
    } else {
      errors.value.push(result.error?.message || '创建失败');
    }
  } catch (error) {
    errors.value.push('网络错误，请稍后重试');
    console.error(error);
  } finally {
    isCreating.value = false;
  }
}
</script>

<template>
  <div class="min-h-screen bg-gradient-to-br from-indigo-50 to-purple-50 p-8">
    <div class="max-w-4xl mx-auto">
      <!-- 标题 -->
      <h1 class="text-4xl font-bold text-gray-800 mb-8">创建课程</h1>
      
      <!-- 错误提示 -->
      <div v-if="errors.length > 0" class="mb-6 space-y-2">
        <div v-for="(error, index) in errors" :key="index" class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg">
          {{ error }}
        </div>
      </div>
      
      <!-- 表单 -->
      <div class="bg-white rounded-2xl shadow-xl p-8 mb-8">
        <!-- 基本信息 -->
        <div class="space-y-6">
          <h2 class="text-2xl font-bold mb-4">基本信息</h2>
          
          <!-- 标题 -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">
              课程标题 <span class="text-red-500">*</span>
            </label>
            <input
              v-model="formData.title"
              type="text"
              placeholder="例如：CET-6 高频词汇"
              class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
          
          <!-- 描述 -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">课程描述</label>
            <textarea
              v-model="formData.description"
              rows="3"
              placeholder="简要描述课程内容..."
              class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
            ></textarea>
          </div>
          
          <!-- 目标人群 -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">目标人群</label>
            <input
              v-model="formData.targetAudience"
              type="text"
              placeholder="例如：大学生、职场人士、考研党"
              class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
          
          <!-- 标签 -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">标签（用逗号分隔）</label>
            <input
              v-model="formData.tags"
              type="text"
              placeholder="例如：CET-6, 词汇，高频"
              class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
        </div>
        
        <!-- 课程类型和难度 -->
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
          <!-- 课程类型 -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">课程类型</label>
            <div class="grid grid-cols-2 gap-2">
              <button
                v-for="option in courseTypeOptions"
                :key="option.value"
                @click="formData.courseType = option.value"
                :class="[
                  'p-3 rounded-lg border-2 transition flex flex-col items-center gap-2',
                  formData.courseType === option.value
                    ? 'border-indigo-500 bg-indigo-50'
                    : 'border-gray-200 hover:border-gray-300',
                ]"
              >
                <span class="text-2xl">{{ option.icon }}</span>
                <span class="text-sm">{{ option.label }}</span>
              </button>
            </div>
          </div>
          
          <!-- 难度级别 -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">难度级别</label>
            <div class="space-y-2">
              <button
                v-for="option in difficultyOptions"
                :key="option.value"
                @click="formData.difficultyLevel = option.value"
                :class="[
                  'w-full p-3 rounded-lg border-2 transition flex items-center justify-between',
                  formData.difficultyLevel === option.value
                    ? 'border-indigo-500 bg-indigo-50'
                    : 'border-gray-200 hover:border-gray-300',
                ]"
              >
                <span>{{ option.label }}</span>
                <span :class="['px-3 py-1 rounded-full text-xs font-bold', option.color]">
                  {{ option.label }}
                </span>
              </button>
            </div>
          </div>
        </div>
        
        <!-- 课程内容 -->
        <div class="mt-8">
          <label class="block text-sm font-medium text-gray-700 mb-2">
            课程内容 <span class="text-red-500">*</span>
          </label>
          <textarea
            v-model="formData.content"
            @input="previewSentencesFromContent"
            rows="10"
            placeholder="输入英文句子，每句一行。AI 将自动分句并生成知识点..."
            class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 font-mono"
          ></textarea>
          <div class="text-sm text-gray-500 mt-2">
            当前句子数：{{ previewSentences.length }}
          </div>
        </div>
        
        <!-- 预览 -->
        <div v-if="previewSentences.length > 0" class="mt-6">
          <h3 class="text-lg font-bold mb-3">句子预览（前 10 句）</h3>
          <div class="bg-gray-50 rounded-lg p-4 space-y-2">
            <div
              v-for="(sentence, index) in previewSentences"
              :key="index"
              class="flex gap-3 items-start"
            >
              <span class="text-sm text-gray-500 w-6">{{ index + 1 }}.</span>
              <span class="flex-1">{{ sentence.trim() }}</span>
            </div>
          </div>
        </div>
        
        <!-- 提交按钮 -->
        <div class="mt-8">
          <button
            @click="createCourse"
            :disabled="isCreating"
            class="w-full py-4 bg-gradient-to-r from-indigo-500 to-purple-600 text-white text-xl font-bold rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:opacity-90 transition"
          >
            {{ isCreating ? '创建中...' : '创建课程' }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
