<template>
  <iframe :src="url" style="width:100%;height:calc(100vh - 100px);border:none;border-radius:8px;" @load="onLoad"></iframe>
</template>
<script setup>
import { ref, computed } from 'vue'
const v = Date.now()
const isLocal = window.location.hostname === 'localhost'
const url = ref(isLocal ? `/ai-assistant.html?t=${v}` : `/ai-badge-saas/ai-assistant.html?t=${v}`)
const onLoad = () => {}
</script>
