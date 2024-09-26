<script setup lang="ts">
defineProps<{
  msg: string
}>()
</script>

<template>
  <div class="greetings">
    <h1 class="green">{{ msg }}</h1>
    <p class="font-medium text-green-500">You’ve successfully created a project with</p>
  </div>
</template>

<style scoped></style>
