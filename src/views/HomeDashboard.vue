<script setup lang="ts">
import { computed } from 'vue'
import type { ChartData, ChartOptions } from 'chart.js'
import ChartComponent from '../components/ChartComponent.vue'
import Machines from './Machines.vue'
import type { Machine, Status } from '../types/types'

// Define props
const props = defineProps<{
  machines: Machine[]
  loading: boolean
  error: string | null
}>()

const statusColors: Record<Status, string> = {
  生產: '#a3e635',
  閒置: '#fb923c',
  當機: '#f87171',
  裝機: '#22d3ee',
  工程借機: '#a78bfa',
  其他: '#94a3b8'
}

const statusCounts = computed(() => {
  return props.machines.reduce(
    (acc, machine) => {
      acc[machine.currentStatus] = (acc[machine.currentStatus] || 0) + 1
      return acc
    },
    {} as Record<Status, number>
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
      position: 'right'
    }
  }
}

const totalMachines = computed(() => props.machines.length)

// error machine logic
const errorEquipmentCount = computed(() => statusCounts.value['當機'] || 0)

const errorEquipmentRatio = computed(() =>
  totalMachines.value > 0
    ? ((errorEquipmentCount.value / totalMachines.value) * 100).toFixed(1)
    : '0'
)

// prepare data for error chart
const errorChartData = computed<ChartData<'doughnut'>>(() => {
  const errorCount = statusCounts.value['當機'] || 0
  return {
    labels: ['當機', '正常'],
    datasets: [
      {
        data: [errorCount, totalMachines.value - errorCount],
        backgroundColor: [statusColors['當機'], '#e2e8f0']
      }
    ]
  }
})

// efficientworking machine logic
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

// data for working status chart
const workingChartData = computed<ChartData<'doughnut'>>(() => {
  const working = statusCounts.value['生產'] || 0
  const packaging = statusCounts.value['裝機'] || 0
  const borrowing = statusCounts.value['工程借機'] || 0
  const totalMachines = props.machines.length
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

// setInterval(fetchData, 500000) // Fetch new data every 5 seconds
</script>

<template>
  <div class="flex flex-col w-full">
    <div class="flex text-2xl font-bold text-slate-500" v-if="loading">Loading...</div>
    <div v-else-if="error">{{ error }}</div>
    <template v-else>
      <ChartComponent
        title="當前機台狀態分佈"
        :chartData="mainChartData"
        :chartOptions="chartOptions"
        :centerText="centerText"
        class="w-full mb-4"
      />
      <div class="flex md:flex-row flex-col w-full gap-4">
        <ChartComponent
          title="當前當機異常比例"
          :chartData="errorChartData"
          :chartOptions="chartOptions"
          :centerText="`${errorEquipmentRatio}%`"
          showPercentage
          :percentage="errorEquipmentRatio"
          percentageColor="text-red-500"
          class="flex-1"
        />
        <ChartComponent
          title="當前有效生產狀態比例"
          :chartData="workingChartData"
          :chartOptions="chartOptions"
          :centerText="`${efficientRatio}%`"
          showPercentage
          :percentage="efficientRatio"
          percentageColor="text-green-500"
          class="flex-1"
        />
      </div>
    </template>
    <Machines :machines="machines" :loading="loading" :error="error" class="my-5" />
  </div>
</template>

<style scoped>
.chart-wrapper {
  position: relative;
  height: 320px;
  width: 320px;
  margin: 0 auto;
  padding: 0.3rem;
}
</style>
