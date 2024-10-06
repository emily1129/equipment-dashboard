<script setup lang="ts">
import type { ChartData, ChartOptions } from 'chart.js'
import DonutChart from '@/components/charts/DonutChart.vue'

defineProps<{
  title: string
  chartData: ChartData<'doughnut'>
  chartOptions: ChartOptions<'doughnut'>
  centerText: string
  showPercentage?: boolean
  percentage?: string
  percentageColor?: string
}>()
</script>

<template>
  <div class="border border-slate-300 bg-white/40 shadow-md shadow-slate-200 rounded-xl p-5">
    <p class="text-lg font-bold">{{ title }}</p>
    <div>
      <p v-if="showPercentage" :class="['my-2 m-0 text-left text-3xl font-bold', percentageColor]">
        {{ percentage }}%
      </p>
      <div class="chart-wrapper">
        <DonutChart :chartData="chartData" :chartOptions="chartOptions" :centerText="centerText" />
      </div>
    </div>
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
