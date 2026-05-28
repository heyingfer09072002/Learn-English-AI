<template>
  <div class="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition">
    <!-- 句子内容 -->
    <div class="mb-4">
      <div class="text-lg font-bold text-gray-800 mb-2">
        {{ sentence.english }}
      </div>
      <div class="text-gray-600 mb-2">{{ sentence.chinese }}</div>
      <div v-if="sentence.translation" class="text-sm text-indigo-600 italic">
        {{ sentence.translation }}
      </div>
    </div>

    <!-- 标签 -->
    <div class="flex items-center gap-2 mb-3">
      <span class="px-2 py-1 bg-indigo-100 text-indigo-700 text-xs rounded">
        {{ formatDifficulty(sentence.difficulty) }}
      </span>
      <span v-if="course" class="px-2 py-1 bg-purple-100 text-purple-700 text-xs rounded">
        {{ course.title }}
      </span>
    </div>

    <!-- 笔记区域 -->
    <div class="mb-4">
      <div class="flex items-center justify-between mb-2">
        <span class="text-sm font-bold text-gray-700">📝 笔记</span>
        <button
          @click="editNote"
          class="text-xs text-indigo-600 hover:text-indigo-800"
        >
          {{ note ? '编辑' : '添加' }}
        </button>
      </div>
      
      <div v-if="note" class="p-3 bg-yellow-50 rounded-lg text-sm text-gray-700">
        {{ note }}
      </div>
      <div v-else class="p-3 bg-gray-50 rounded-lg text-sm text-gray-400 italic">
        点击"添加"记录学习笔记
      </div>
    </div>

    <!-- 时间信息 -->
    <div class="text-xs text-gray-400 mb-4">
      收藏于 {{ formatDate(createdAt) }}
    </div>

    <!-- 操作按钮 -->
    <div class="flex gap-2">
      <button
        @click="$emit('practice')"
        class="flex-1 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition text-sm font-bold"
      >
        练习
      </button>
      <button
        @click="$emit('remove')"
        class="px-4 py-2 border border-red-200 text-red-600 rounded-lg hover:bg-red-50 transition text-sm font-bold"
      >
        取消收藏
      </button>
    </div>

    <!-- 编辑笔记弹窗 -->
    <div v-if="showNoteEditor" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div class="bg-white rounded-xl p-6 w-full max-w-md mx-4">
        <h3 class="text-lg font-bold mb-4">编辑笔记</h3>
        <textarea
          v-model="noteDraft"
          class="w-full h-32 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
          placeholder="记录这个句子的重点、用法或记忆技巧..."
        ></textarea>
        <div class="flex gap-2 mt-4">
          <button
            @click="showNoteEditor = false"
            class="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition"
          >
            取消
          </button>
          <button
            @click="saveNote"
            class="flex-1 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition"
          >
            保存
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'

const props = defineProps<{
  id: number
  sentence: {
    english: string
    chinese: string
    translation?: string
    difficulty: string
  }
  course?: {
    id: number
    title: string
  } | null
  note?: string | null
  createdAt: string
}>()

const emit = defineEmits<{
  remove: []
  practice: []
  'update-note': [note: string]
}>()

const showNoteEditor = ref(false)
const noteDraft = ref('')

const note = computed(() => props.note)

function formatDifficulty(difficulty: string) {
  const map: Record<string, string> = {
    beginner: '入门',
    elementary: '基础',
    intermediate: '中级',
    upperIntermediate: '中高级',
    advanced: '高级',
  }
  return map[difficulty] || difficulty
}

function formatDate(dateStr: string) {
  const date = new Date(dateStr)
  const now = new Date()
  const diff = now.getTime() - date.getTime()
  const days = Math.floor(diff / (1000 * 60 * 60 * 24))
  
  if (days === 0) return '今天'
  if (days === 1) return '昨天'
  if (days < 7) return `${days}天前`
  return date.toLocaleDateString('zh-CN')
}

function editNote() {
  noteDraft.value = props.note || ''
  showNoteEditor.value = true
}

function saveNote() {
  emit('update-note', noteDraft.value)
  showNoteEditor.value = false
}
</script>
