<template>
  <iframe :src="assistantUrl" style="width:100%;height:calc(100vh - 100px);border:none;border-radius:8px;"></iframe>
</template>
<script setup>
import { computed } from 'vue'
const assistantUrl = computed(() => {
  const isDev = window.location.hostname === 'localhost'
  return isDev ? '/ai-assistant.html' : '/ai-badge-saas/ai-assistant.html'
})
</script>
