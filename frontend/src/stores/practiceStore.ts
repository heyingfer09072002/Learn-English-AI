import { defineStore } from 'pinia';
import { ref } from 'vue';

export interface PracticeRecord {
  id: number;
  userId: number;
  sentenceId: number;
  courseId: number;
  practiceMode: string;
  isCorrect: boolean;
  timeSpent: number;
  accuracy: number;
  comboCount: number;
  rating: string;
  score: number;
  createdAt: string;
}

export const usePracticeStore = defineStore('practice', () => {
  const recentRecords = ref<PracticeRecord[]>([]);
  const isLoading = ref(false);

  async function submitPractice(data: {
    sentenceId: number;
    courseId: number;
    practiceMode: string;
    answer: string;
    timeSpent: number;
  }) {
    isLoading.value = true;
    try {
      const response = await fetch('/api/practice/sentence', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(data),
      });

      const result = await response.json();
      
      if (result.success) {
        recentRecords.value.unshift(result.data.record);
        return result.data;
      }
    } finally {
      isLoading.value = false;
    }
  }

  return {
    recentRecords,
    isLoading,
    submitPractice,
  };
});
