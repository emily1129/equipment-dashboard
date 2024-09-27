<script setup lang="ts">
import { ref } from 'vue'
import { RouterLink, RouterView } from 'vue-router'
import HeaderActions from './components/HeaderActions.vue'

const currentPage = ref('機台狀態維護')
</script>

<template>
  <div class="flex flex-col md:flex-row h-screen w-full font-sans">
    <!-- Sidebar -->
    <aside class="w-full md:w-60 p-2 bg-gray-100 border-b md:border-r border-gray-200">
      <p class="font-extrabold text-xl px-4 pt-5 pb-7">機台狀態看板系統</p>
      <nav class="flex flex-col">
        <RouterLink
          to="/"
          class="flex py-2 px-4 mb-2 text-sm rounded-md hover:bg-gray-300 hover:text-slate-700 transition-colors"
          :class="{ 'bg-slate-600 text-white': $route.path === '/' }"
          @click="currentPage = '機台狀態維護'"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke-width="1.5"
            stroke="currentColor"
            class="size-5 mr-2"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              d="M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87.074.04.147.083.22.127.325.196.72.257 1.075.124l1.217-.456a1.125 1.125 0 0 1 1.37.49l1.296 2.247a1.125 1.125 0 0 1-.26 1.431l-1.003.827c-.293.241-.438.613-.43.992a7.723 7.723 0 0 1 0 .255c-.008.378.137.75.43.991l1.004.827c.424.35.534.955.26 1.43l-1.298 2.247a1.125 1.125 0 0 1-1.369.491l-1.217-.456c-.355-.133-.75-.072-1.076.124a6.47 6.47 0 0 1-.22.128c-.331.183-.581.495-.644.869l-.213 1.281c-.09.543-.56.94-1.11.94h-2.594c-.55 0-1.019-.398-1.11-.94l-.213-1.281c-.062-.374-.312-.686-.644-.87a6.52 6.52 0 0 1-.22-.127c-.325-.196-.72-.257-1.076-.124l-1.217.456a1.125 1.125 0 0 1-1.369-.49l-1.297-2.247a1.125 1.125 0 0 1 .26-1.431l1.004-.827c.292-.24.437-.613.43-.991a6.932 6.932 0 0 1 0-.255c.007-.38-.138-.751-.43-.992l-1.004-.827a1.125 1.125 0 0 1-.26-1.43l1.297-2.247a1.125 1.125 0 0 1 1.37-.491l1.216.456c.356.133.751.072 1.076-.124.072-.044.146-.086.22-.128.332-.183.582-.495.644-.869l.214-1.28Z"
            />
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"
            />
          </svg>
          機台狀態維護</RouterLink
        >
        <RouterLink
          to="/machines"
          class="flex py-2 px-4 mb-2 text-sm rounded-md hover:bg-gray-300 hover:text-slate-700 transition-colors"
          :class="{ 'bg-slate-600 text-white': $route.path === '/machines' }"
          @click="currentPage = '看板報表'"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke-width="1.5"
            stroke="currentColor"
            class="size-5 mr-2"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              d="M3.75 3v11.25A2.25 2.25 0 0 0 6 16.5h2.25M3.75 3h-1.5m1.5 0h16.5m0 0h1.5m-1.5 0v11.25A2.25 2.25 0 0 1 18 16.5h-2.25m-7.5 0h7.5m-7.5 0-1 3m8.5-3 1 3m0 0 .5 1.5m-.5-1.5h-9.5m0 0-.5 1.5m.75-9 3-3 2.148 2.148A12.061 12.061 0 0 1 16.5 7.605"
            />
          </svg>
          看板報表</RouterLink
        >
      </nav>
    </aside>

    <!-- Main Content -->
    <main class="flex-1 flex flex-col bg-white">
      <header class="flex justify-between items-center px-8 pt-6 pb-4 border-b border-gray-200">
        <h1 class="text-xl font-semibold">{{ currentPage }}</h1>
        <HeaderActions />
      </header>
      <div class="flex-1 py-4 overflow-auto">
        <RouterView />
      </div>
    </main>
  </div>
</template>
