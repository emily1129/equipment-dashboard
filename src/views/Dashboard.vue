<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { ChartData, ChartOptions } from 'chart.js'
import { fetchMachineData, type Machine } from '../api/machines'
import DonutChart from '@/components/charts/DonutChart.vue'
import MachineList from '../views/MachineList.vue'

interface StatusChange {
  status: '生產' | '閒置' | '當機' | '裝機' | '工程借機' | '其他'
  startTime: string
}

interface Machine {
  id: string
  statusChanges: StatusChange[]
  currentStatus: string
}

// Define colors for each status
const statusColors = {
  生產: '#84cc16',
  閒置: '#f97316',
  當機: '#ef4444',
  裝機: '#fbbf24',
  工程借機: '#06b6d4',
  其他: '#64748b'
}

const machines = ref<Machine[]>([])
const loading = ref(false)
const error = ref<string | null>(null)

const fetchData = async () => {
  loading.value = true
  error.value = null
  try {
    machines.value = await fetchMachineData()
    console.log(machines.value)
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

const statusCounts = computed(() => {
  return machines.value.reduce(
    (acc, machine) => {
      acc[machine.currentStatus] = (acc[machine.currentStatus] || 0) + 1
      return acc
    },
    {} as Record<StatusChange['status'], number>
  )
})

const mainChartData = computed<ChartData<'doughnut'>>(() => ({
  labels: Object.keys(statusCounts.value),
  datasets: [
    {
      data: Object.values(statusCounts.value),
      backgroundColor: Object.keys(statusCounts.value).map(
        (status) => statusColors[status as Status]
      )
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

const totalMachines = computed(() => machines.value.length)

// error machine logic
const errorEquipmentCount = computed(() => statusCounts.value['當機'] || 0)

const errorEquipmentRatio = computed(() =>
  totalMachines.value > 0
    ? ((errorEquipmentCount.value / totalMachines.value) * 100).toFixed(1)
    : '0'
)

// Prepare data for error chart
const errorChartData = computed<ChartData<'doughnut'>>(() => {
  const errorCount = statusCounts.value['當機'] || 0
  const totalMachines = machines.value.length
  return {
    labels: ['當機', '正常'],
    datasets: [
      {
        data: [errorCount, totalMachines - errorCount],
        backgroundColor: [statusColors['當機'], '#e2e8f0']
      }
    ]
  }
})

// working machine logic
const workingCount = computed(() => statusCounts.value['生產'] || 0)
const packagingCount = computed(() => statusCounts.value['裝機'] || 0)
const borrowingCount = computed(() => statusCounts.value['工程借機'] || 0)

const efficientRatio = computed(() => {
  return totalMachines.value > 0
    ? (
        ((workingCount.value + packagingCount.value + borrowingCount.value) / totalMachines.value) *
        100
      ).toFixed(1)
    : '0'
})

// Prepare data for working status chart
const workingChartData = computed<ChartData<'doughnut'>>(() => {
  const working = statusCounts.value['生產'] || 0
  const packaging = statusCounts.value['裝機'] || 0
  const borrowing = statusCounts.value['工程借機'] || 0
  const totalMachines = machines.value.length
  return {
    labels: ['生產', '裝機', '工程借機', '無效工作'],
    datasets: [
      {
        data: [working, packaging, borrowing, totalMachines - (working + packaging + borrowing)],
        backgroundColor: [
          statusColors['生產'],
          statusColors['裝機'],
          statusColors['工程借機'],
          '#e2e8f0'
        ]
      }
    ]
  }
})

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
            :chartData="mainChartData"
            :chartOptions="chartOptions"
            :centerText="centerText"
            @sectionClick="handleSectionClick"
          />
        </div>
      </div>
      <div class="flex md:flex-row flex-col w-full gap-4">
        <div class="flex-1 border-2 border-gray-200 rounded-md p-4">
          <p class="text-lg font-bold">當前當機異常比例</p>
          <div>
            <p class="my-2 m-0 text-left text-3xl font-bold text-red-500">
              {{ ((errorEquipmentCount / totalMachines) * 100).toFixed(1) }}%
            </p>
            <div class="chart-wrapper">
              <DonutChart
                :chartData="errorChartData"
                :chartOptions="chartOptions"
                :centerText="`${errorEquipmentRatio}%`"
              />
            </div>
          </div>
        </div>
        <div class="flex-1 border-2 border-gray-200 rounded-md p-4">
          <p class="text-lg font-bold">當前有效生產狀態比例</p>
          <div>
            <p class="my-2 m-0 text-left text-3xl font-bold text-green-500">
              {{
                (((workingCount + packagingCount + borrowingCount) / totalMachines) * 100).toFixed(
                  1
                )
              }}%
            </p>
            <div class="chart-wrapper">
              <DonutChart
                :chartData="workingChartData"
                :chartOptions="chartOptions"
                :centerText="`${efficientRatio}%`"
              />
            </div>
          </div>
        </div>
      </div>
    </template>
    <MachineList :machines="machines" :loading="loading" :error="error" class="my-5" />
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
