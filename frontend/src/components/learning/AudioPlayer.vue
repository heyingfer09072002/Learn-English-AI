<template>
  <div class="hidden">
    <audio 
      ref="audioRef"
      :src="currentSrc"
      :playbackRate="playbackRate"
      @ended="handleEnded"
      @timeupdate="handleTimeUpdate"
      @loadedmetadata="handleLoadedMetadata"
    ></audio>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, computed } from 'vue'

const props = defineProps<{
  src?: string
  isPlaying: boolean
  playbackRate: number
}>()

const emit = defineEmits<{
  ended: []
  timeUpdate: [time: number]
  loaded: [duration: number]
}>()

const audioRef = ref<HTMLAudioElement | null>(null)
const currentSrc = ref(props.src || '')

watch(() => props.src, (newSrc) => {
  if (newSrc) {
    currentSrc.value = newSrc
  }
}, { immediate: true })

watch(() => props.isPlaying, (newIsPlaying) => {
  if (!audioRef.value) return
  
  if (newIsPlaying) {
    audioRef.value.play().catch(err => {
      console.warn('Audio play failed:', err)
    })
  } else {
    audioRef.value.pause()
  }
}, { immediate: true })

const handleEnded = () => {
  emit('ended')
}

const handleTimeUpdate = () => {
  if (audioRef.value) {
    emit('timeUpdate', audioRef.value.currentTime)
  }
}

const handleLoadedMetadata = () => {
  if (audioRef.value) {
    emit('loaded', audioRef.value.duration)
  }
}

const play = () => {
  audioRef.value?.play()
}

const pause = () => {
  audioRef.value?.pause()
}

const toggle = () => {
  if (audioRef.value?.paused) {
    play()
  } else {
    pause()
  }
}

defineExpose({
  play,
  pause,
  toggle
})
</script>
