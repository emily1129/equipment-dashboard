<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import HeaderActions from './components/HeaderActions.vue'
import { fetchMachineData } from './api/machines'
import type { Machine } from './types/types'

const router = useRouter()
const currentPage = ref('機台分佈')

const machines = ref<Machine[]>([])
const lastUpdated = ref('')
const loading = ref(false)
const error = ref<string | null>(null)

const fetchData = async () => {
  loading.value = true
  error.value = null
  try {
    machines.value = await fetchMachineData()
    lastUpdated.value = new Date().toLocaleTimeString()
    console.log(machines.value)
  } catch (e) {
    error.value = 'Failed to fetch data'
    console.error(e)
  } finally {
    loading.value = false
  }
}

fetchData()

const sidebarOpen = ref(false)

const toggleSidebar = () => {
  sidebarOpen.value = !sidebarOpen.value
}

const handleLinkClick = (pageName: string) => {
  currentPage.value = pageName
  sidebarOpen.value = false
}
</script>

<template>
  <div class="flex flex-col md:flex-row h-screen w-full font-sans">
    <!-- Header: hamburger + title + current page on sm screens -->
    <header class="flex flex-col md:hidden px-4 py-4 border-b border-slate-300">
      <div class="flex justify-between items-center">
        <p class="font-extrabold text-2xl">機台狀態看板系統</p>
        <button class="p-2 md:hidden" @click="toggleSidebar">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            class="h-8 w-8 text-slate-700"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            stroke-width="2"
          >
            <path stroke-linecap="round" stroke-linejoin="round" d="M4 6h16M4 12h16m-7 6h7" />
          </svg>
        </button>
      </div>
      <!-- Current Page shown below the title on sm -->
      <h1 class="text-xl font-semibold mt-2">{{ currentPage }}</h1>
    </header>

    <!-- Sidebar -->
    <aside
      :class="[
        'fixed md:relative md:translate-x-0 top-0 left-0 w-full md:w-64 flex flex-col p-2 border-b md:border-r border-slate-300 z-10 md:h-screen h-auto md:bg-transparent bg-white transition-transform transform duration-300',
        sidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
      ]"
    >
      <div class="flex-grow">
        <div class="flex justify-between md:block">
          <p
            class="font-extrabold text-2xl px-4 md:pt-4 md:pb-7 py-4 cursor-pointer"
            @click="$router.push('/')"
          >
            機台狀態看板系統
          </p>
          <svg
            v-if="sidebarOpen"
            xmlns="http://www.w3.org/2000/svg"
            class="h-8 w-8 text-slate-700 cursor-pointer m-4 md:hidden"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            stroke-width="2"
            @click="toggleSidebar"
          >
            <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </div>

        <nav class="flex flex-col">
          <RouterLink
            to="/"
            class="flex py-2 px-4 m-2 text-sm rounded-md hover:bg-slate-300 hover:text-slate-700 transition-colors"
            :class="{ 'bg-slate-600 text-white': $route.path === '/' }"
            @click="handleLinkClick('機台分佈')"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke-width="1.5"
              stroke="currentColor"
              class="size-6 mr-2"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                d="M3.75 3v11.25A2.25 2.25 0 0 0 6 16.5h2.25M3.75 3h-1.5m1.5 0h16.5m0 0h1.5m-1.5 0v11.25A2.25 2.25 0 0 1 18 16.5h-2.25m-7.5 0h7.5m-7.5 0-1 3m8.5-3 1 3m0 0 .5 1.5m-.5-1.5h-9.5m0 0-.5 1.5m.75-9 3-3 2.148 2.148A12.061 12.061 0 0 1 16.5 7.605"
              />
            </svg>
            機台分佈
          </RouterLink>
          <!-- Add more navigation links -->
        </nav>
      </div>
      <div class="h-6 mt-auto py-2 px-4 w-full flex md:justify-start justify-end">
        <HeaderActions :lastUpdated="lastUpdated" />
      </div>
    </aside>

    <!-- Main content -->
    <main class="flex-1 flex flex-col">
      <header
        class="hidden md:flex justify-between items-center px-8 pt-6 pb-4 border-b border-slate-300"
      >
        <h1 class="text-xl font-semibold">{{ currentPage }}</h1>
      </header>
      <div class="flex-1 p-8 overflow-auto">
        <RouterView :machines="machines" :loading="loading" :error="error" />
      </div>
    </main>
  </div>
</template>
