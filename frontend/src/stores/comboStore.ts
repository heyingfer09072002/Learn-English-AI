import { defineStore } from 'pinia';
import { ref, computed } from 'vue';

export interface ComboState {
  count: number;
  maxCombo: number;
  multiplier: number;
  isPerfect: boolean;
  isGreat: boolean;
  sessionId: string;
}

export const useComboStore = defineStore('combo', () => {
  const comboState = ref<ComboState>({
    count: 0,
    maxCombo: 0,
    multiplier: 1.0,
    isPerfect: false,
    isGreat: false,
    sessionId: '',
  });

  const isActive = computed(() => comboState.value.count > 0);
  const message = computed(() => {
    if (comboState.value.isPerfect) return '🔥 Perfect!';
    if (comboState.value.isGreat) return '✨ Great!';
    if (comboState.value.count >= 10) return '🎯 Amazing!';
    if (comboState.value.count >= 5) return '👍 Good!';
    return '';
  });

  function updateCombo(state: ComboState) {
    comboState.value = state;
  }

  function resetCombo() {
    comboState.value = {
      count: 0,
      maxCombo: comboState.value.maxCombo,
      multiplier: 1.0,
      isPerfect: false,
      isGreat: false,
      sessionId: '',
    };
  }

  function incrementMaxCombo(newMax: number) {
    if (newMax > comboState.value.maxCombo) {
      comboState.value.maxCombo = newMax;
    }
  }

  return {
    comboState,
    isActive,
    message,
    updateCombo,
    resetCombo,
    incrementMaxCombo,
  };
});
