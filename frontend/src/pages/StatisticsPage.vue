<script setup lang="ts">
import { ref, onMounted, computed } from 'vue';

interface Overview {
  totalStudyTime: number;
  totalPractices: number;
  currentStreak: number;
  bestStreak: number;
  masteredWords: number;
  averageAccuracy: number;
}

interface HeatmapData {
  date: string;
  count: number;
  duration: number;
}

interface RadarData {
  listening: number;
  speaking: number;
  reading: number;
  writing: number;
  vocabulary: number;
}

const overview = ref<Overview | null>(null);
const heatmapData = ref<HeatmapData[]>([]);
const radarData = ref<RadarData | null>(null);
const isLoading = ref(false);

// 格式化学习时长
function formatStudyTime(minutes: number): string {
  if (minutes < 60) return `${minutes}分钟`;
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  return `${hours}小时${mins}分钟`;
}

// 获取热力图颜色
function getHeatmapColor(count: number): string {
  if (count === 0) return 'bg-gray-200';
  if (count < 5) return 'bg-green-200';
  if (count < 10) return 'bg-green-400';
  if (count < 20) return 'bg-green-600';
  return 'bg-green-800';
}

// 雷达图配置
const radarConfig = {
  width: 300,
  height: 300,
  center: 150,
  radius: 100,
  metrics: [
    { key: 'listening', label: '听力' },
    { key: 'speaking', label: '口语' },
    { key: 'reading', label: '阅读' },
    { key: 'writing', label: '写作' },
    { key: 'vocabulary', label: '词汇' },
  ],
};

// 计算雷达图坐标
function getRadarPoint(value: number, index: number) {
  const total = radarConfig.metrics.length;
  const angle = (Math.PI * 2 * index) / total - Math.PI / 2;
  const normalizedValue = value / 100;
  const x = radarConfig.center + radarConfig.radius * normalizedValue * Math.cos(angle);
  const y = radarConfig.center + radarConfig.radius * normalizedValue * Math.sin(angle);
  return { x, y };
}

async function loadStatistics() {
  isLoading.value = true;
  try {
    const [overviewRes, heatmapRes, radarRes] = await Promise.all([
      fetch('/api/statistics/overview').then(r => r.json()),
      fetch('/api/statistics/heatmap').then(r => r.json()),
      fetch('/api/statistics/radar').then(r => r.json()),
    ]);

    if (overviewRes.success) overview.value = overviewRes.data;
    if (heatmapRes.success) heatmapData.value = heatmapRes.data;
    if (radarRes.success) radarData.value = radarRes.data;
  } catch (error) {
    console.error('加载统计失败:', error);
  } finally {
    isLoading.value = false;
  }
}

onMounted(() => {
  loadStatistics();
});
</script>

<template>
  <div class="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 p-8">
    <div class="max-w-6xl mx-auto">
      <!-- 标题 -->
      <h1 class="text-4xl font-bold text-gray-800 mb-8">学习统计</h1>

      <div v-if="isLoading" class="text-center py-20">
        <div class="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>

      <div v-else class="space-y-8">
        <!-- 概览卡片 -->
        <div class="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4">
          <div class="bg-white rounded-xl shadow-lg p-4">
            <div class="text-3xl font-bold text-blue-500">{{ overview?.totalStudyTime || 0 }}</div>
            <div class="text-sm text-gray-600">总学习时长 (分钟)</div>
          </div>
          <div class="bg-white rounded-xl shadow-lg p-4">
            <div class="text-3xl font-bold text-green-500">{{ overview?.totalPractices || 0 }}</div>
            <div class="text-sm text-gray-600">总练习次数</div>
          </div>
          <div class="bg-white rounded-xl shadow-lg p-4">
            <div class="text-3xl font-bold text-orange-500">{{ overview?.currentStreak || 0 }}</div>
            <div class="text-sm text-gray-600">当前连续天数</div>
          </div>
          <div class="bg-white rounded-xl shadow-lg p-4">
            <div class="text-3xl font-bold text-purple-500">{{ overview?.bestStreak || 0 }}</div>
            <div class="text-sm text-gray-600">最佳连续天数</div>
          </div>
          <div class="bg-white rounded-xl shadow-lg p-4">
            <div class="text-3xl font-bold text-red-500">{{ overview?.masteredWords || 0 }}</div>
            <div class="text-sm text-gray-600">已掌握单词</div>
          </div>
          <div class="bg-white rounded-xl shadow-lg p-4">
            <div class="text-3xl font-bold text-cyan-500">{{ (overview?.averageAccuracy * 100).toFixed(1) }}%</div>
            <div class="text-sm text-gray-600">平均准确率</div>
          </div>
        </div>

        <!-- 雷达图和热力图 -->
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <!-- 能力雷达图 -->
          <div class="bg-white rounded-xl shadow-lg p-6">
            <h2 class="text-2xl font-bold mb-6">能力分布</h2>
            <div class="flex justify-center">
              <svg :width="radarConfig.width" :height="radarConfig.height">
                <!-- 背景网格 -->
                <polygon
                  v-for="i in 5"
                  :key="i"
                  :points="radarConfig.metrics.map((_, j) => {
                    const point = getRadarPoint(20 * i, j);
                    return `${point.x},${point.y}`;
                  }).join(' ')"
                  fill="none"
                  stroke="#e5e7eb"
                  :stroke-width="1"
                />
                
                <!-- 数据线 -->
                <polygon
                  v-if="radarData"
                  :points="radarConfig.metrics.map((metric, i) => {
                    const point = getRadarPoint(radarData[metric.key as keyof RadarData] || 0, i);
                    return `${point.x},${point.y}`;
                  }).join(' ')"
                  fill="rgba(59, 130, 246, 0.2)"
                  stroke="#3b82f6"
                  :stroke-width="2"
                />
                
                <!-- 数据点 -->
                <circle
                  v-for="(metric, i) in radarConfig.metrics"
                  :key="metric.key"
                  :cx="getRadarPoint(radarData?.[metric.key as keyof RadarData] || 0, i).x"
                  :cy="getRadarPoint(radarData?.[metric.key as keyof RadarData] || 0, i).y"
                  r="4"
                  fill="#3b82f6"
                />
                
                <!-- 标签 -->
                <text
                  v-for="(metric, i) in radarConfig.metrics"
                  :key="metric.key"
                  :x="getRadarPoint(120, i).x"
                  :y="getRadarPoint(120, i).y"
                  text-anchor="middle"
                  dominant-baseline="middle"
                  class="text-xs fill-gray-600"
                >
                  {{ metric.label }}
                </text>
              </svg>
            </div>
          </div>

          <!-- 学习热力图 -->
          <div class="bg-white rounded-xl shadow-lg p-6">
            <h2 class="text-2xl font-bold mb-6">学习热力图 (最近 90 天)</h2>
            <div class="grid grid-cols-13 gap-1">
              <div
                v-for="day in heatmapData"
                :key="day.date"
                :class="['w-4 h-4 rounded', getHeatmapColor(day.count)]"
                :title="`${day.date}: ${day.count} 次练习，${day.duration} 分钟`"
              />
            </div>
            <div class="flex items-center gap-2 mt-4 text-xs text-gray-600">
              <span>少</span>
              <div class="w-3 h-3 rounded bg-gray-200"></div>
              <div class="w-3 h-3 rounded bg-green-200"></div>
              <div class="w-3 h-3 rounded bg-green-400"></div>
              <div class="w-3 h-3 rounded bg-green-600"></div>
              <div class="w-3 h-3 rounded bg-green-800"></div>
              <span>多</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.grid-cols-13 {
  grid-template-columns: repeat(13, 1fr);
}
</style>
