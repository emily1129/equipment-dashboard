<script lang="ts">
import { ref } from 'vue'

const lastUpdated = ref('1 mins ago')

const refresh = () => {
  // implement refresh logic
  lastUpdated.value = '5 mins ago'
}
</script>

<template>
  <div class="flex items-center">
    <button
      @click="refresh"
      class="flex text-sm border-slate-500 border text-slate-500 px-3 py-1 rounded-md hover:bg-slate-700 hover:text-white transition-colors mr-4"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 26 26"
        stroke-width="1.5"
        stroke="currentColor"
        class="size-5"
      >
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0 3.181 3.183a8.25 8.25 0 0 0 13.803-3.7M4.031 9.865a8.25 8.25 0 0 1 13.803-3.7l3.181 3.182m0-4.991v4.99"
        />
      </svg>
      <p>更新</p>
    </button>
    <span class="text-sm text-gray-600">最後更新時間: {{ this.lastUpdated }}</span>
  </div>
</template>
