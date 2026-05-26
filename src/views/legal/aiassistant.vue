<template>
  <iframe :src="url" style="width:100%;height:calc(100vh - 100px);border:none;border-radius:8px;"></iframe>
</template>
<script setup>
import { computed } from 'vue'
const url = computed(() => {
  const isLocal = window.location.hostname === 'localhost'
  return isLocal ? '/ai-assistant.html?v=' + Date.now() : '/ai-badge-saas/ai-assistant.html?v=' + Date.now()
})
</script>
