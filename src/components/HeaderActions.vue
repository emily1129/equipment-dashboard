<script setup lang="ts">
defineProps(['lastUpdated'])
</script>

<template>
  <div class="flex items-center">
    <span class="md:text-sm text-xs text-slate-600">最新更新時間: {{ lastUpdated }}</span>
  </div>
</template>
