<script setup lang="ts">
import { computed } from 'vue'
import { Pie } from 'vue-chartjs'
import {
  Chart as ChartJS,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  CategoryScale,
  ChartData,
  ChartOptions
} from 'chart.js'

ChartJS.register(Title, Tooltip, Legend, ArcElement, CategoryScale)

interface Props {
  chartData: ChartData<'pie'>
  chartOptions: ChartOptions<'pie'>
}

const props = withDefaults(defineProps<Props>(), {
  chartData: () => ({
    labels: [],
    datasets: []
  }),
  chartOptions: () => ({
    responsive: true
  })
})

const chartData = computed(() => props.chartData)
// const chartOptions = computed(() => props.chartData)
const chartOptions = computed<ChartOptions<'pie'>>(() => ({
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      position: 'right' as const
    }
  },
  layout: {
    padding: {
      left: 0,
      right: 0, // Adjust this value to create space for the legend
      top: 0,
      bottom: 0
    }
  },
  ...props.chartOptions
}))
</script>

<template>
  <Pie :data="chartData" :options="chartOptions" />
</template>
