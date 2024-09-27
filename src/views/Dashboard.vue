<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { ChartData, ChartOptions } from 'chart.js'
import { fetchMachineStatus } from '../utils/mockBackend'
import DonutChart from '@/components/charts/DonutChart.vue'
// import MachineList from '../views/MachineList.vue'

interface MachineStatus {
  生產: number
  閒置: number
  當機: number
  裝機: number
  工程借機: number
  其他: number
}

const machineStatus = ref<MachineStatus>({
  生產: 0,
  閒置: 0,
  當機: 0,
  裝機: 0,
  工程借機: 0,
  其他: 0
})

const loading = ref(false)
const error = ref<string | null>(null)

const fetchData = async () => {
  loading.value = true
  error.value = null
  try {
    machineStatus.value = await fetchMachineStatus()
    console.log(machineStatus)
  } catch (e) {
    error.value = 'Failed to fetch data'
    console.error(e)
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  fetchData()
})

const chartData = computed<ChartData<'doughnut'>>(() => ({
  labels: Object.keys(machineStatus.value),
  datasets: [
    {
      data: Object.values(machineStatus.value),
      backgroundColor: ['#84cc16', '#f97316', '#ef4444', '#fbbf24', '#06b6d4', '#64748b']
    }
  ]
}))

const chartOptions: ChartOptions<'doughnut'> = {
  responsive: true,
  plugins: {
    legend: {
      position: 'right' as const
    }
  }
}

const totalMachines = computed(() =>
  Object.values(machineStatus.value).reduce((sum, count) => sum + count, 0)
)

// error machine logic
const errorEquipmentCount = computed(() => machineStatus.value['當機'])

const errorEquipmentRatio = computed(() =>
  totalMachines.value > 0
    ? ((errorEquipmentCount.value / totalMachines.value) * 100).toFixed(1)
    : '0'
)

const errorChartData = computed<ChartData<'doughnut'>>(() => ({
  labels: ['當機', '正常'],
  datasets: [
    {
      data: [errorEquipmentCount.value, totalMachines.value - errorEquipmentCount.value],
      backgroundColor: ['#ef4444', '#e2e8f0']
    }
  ]
}))

// working machine logic

const workingCount = computed(() => machineStatus.value['生產'])
const packagingCount = computed(() => machineStatus.value['裝機'])
const borrowingCount = computed(() => machineStatus.value['工程借機'])

const efficientRatio = computed(() => {
  return totalMachines.value > 0
    ? (
        ((workingCount.value + packagingCount.value + borrowingCount.value) / totalMachines.value) *
        100
      ).toFixed(1)
    : '0'
})

const workingChartData = computed<ChartData<'doughnut'>>(() => ({
  labels: ['生產', '裝機', '工程借機', '無效工作'],
  datasets: [
    {
      data: [
        workingCount.value,
        packagingCount.value,
        borrowingCount.value,
        totalMachines.value - (workingCount.value + packagingCount.value + borrowingCount.value)
      ],
      backgroundColor: ['#84cc16', '#fbbf24', '#06b6d4', '#e2e8f0']
    }
  ]
}))

const centerText = computed(() => `Total: ${totalMachines.value}`)

const handleSectionClick = (label: string, value: number) => {
  console.log(`Clicked on ${label} with value ${value}`)
}

// Simulate real-time updates
setInterval(fetchData, 500000) // Fetch new data every 5 seconds
</script>

<template>
  <div class="px-8 flex flex-col w-full">
    <div v-if="loading">Loading...</div>
    <div v-else-if="error">{{ error }}</div>
    <template v-else>
      <div class="w-full border-2 border-gray-200 rounded-md p-4 mb-4">
        <p class="text-lg font-bold">當前機台狀態分佈</p>
        <div class="chart-wrapper">
          <DonutChart
            :chartData="chartData"
            :chartOptions="chartOptions"
            :centerText="centerText"
            @sectionClick="handleSectionClick"
          />
        </div>
      </div>
      <div class="flex md:flex-row flex-col w-full gap-4">
        <div class="flex-1 border-2 border-gray-200 rounded-md p-4">
          <p class="text-lg font-bold">當前當機異常比例</p>
          <div class="chart-wrapper">
            <DonutChart
              :chartData="errorChartData"
              :chartOptions="chartOptions"
              :centerText="`${errorEquipmentRatio}%`"
            />
          </div>
          <p>當機設備數: {{ errorEquipmentCount }}</p>
        </div>
        <div class="flex-1 border-2 border-gray-200 rounded-md p-4">
          <p class="text-lg font-bold">當前有效生產狀態比例</p>
          <div class="chart-wrapper">
            <DonutChart
              :chartData="workingChartData"
              :chartOptions="chartOptions"
              :centerText="`${efficientRatio}%`"
            />
          </div>
          <p>有效生產設備數: {{ workingCount + packagingCount + borrowingCount }}</p>
        </div>
      </div>
      <!-- <div class="flex w-full gap-4 mt-4">
        <MachineList class="w-full" />
      </div> -->
    </template>
  </div>
</template>

<style scoped>
.chart-wrapper {
  position: relative;
  height: 300px;
  width: 300px;
  margin: 0 auto;
  padding: 0.3rem;
}
</style>
