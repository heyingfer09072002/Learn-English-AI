import api from './index';

export interface PracticeSubmitData {
  sentenceId: number;
  courseId: number;
  practiceMode: 'sentence_builder' | 'dictation' | 'listening' | 'speaking' | 'choice';
  answer: string;
  timeSpent: number;
}

export interface PracticeResult {
  record: any;
  combo: {
    count: number;
    maxCombo: number;
    multiplier: number;
    isPerfect: boolean;
    isGreat: boolean;
    sessionId: string;
  };
  rating: {
    level: string;
    accuracy: number;
    averageTime: number;
    bestCombo: number;
    score: number;
    feedback: string;
  };
  isCorrect: boolean;
  message?: string;
}

/**
 * 提交练习
 */
export async function submitPractice(data: PracticeSubmitData): Promise<PracticeResult> {
  const response = await api.post('/practice/sentence', data);
  return response.data.data;
}

/**
 * 获取练习历史
 */
export async function getPracticeHistory(page = 1, limit = 20) {
  const response = await api.get('/practice/history', { params: { page, limit } });
  return response.data.data;
}

/**
 * 获取练习统计
 */
export async function getPracticeStats() {
  const response = await api.get('/practice/stats');
  return response.data.data;
}
