<script setup lang="ts">
import { computed } from 'vue'
import { Doughnut } from 'vue-chartjs'
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  ChartData,
  ChartOptions,
  Plugin
} from 'chart.js'

ChartJS.register(ArcElement, Tooltip, Legend)

interface Props {
  chartData: ChartData<'doughnut'>
  chartOptions?: ChartOptions<'doughnut'>
  centerText?: string
}

const props = withDefaults(defineProps<Props>(), {
  chartOptions: () => ({}),
  centerText: '102%'
})

const emit = defineEmits<{
  (e: 'sectionClick', label: string, value: number): void
}>()

const centerTextPlugin: Plugin<'doughnut'> = {
  id: 'centerText',
  afterDraw: (chart) => {
    const {
      ctx,
      chartArea: { left, top, width, height }
    } = chart
    ctx.save()
    ctx.font = 'bolder 30px Arial'
    ctx.fillStyle = 'black'
    ctx.textAlign = 'center'
    ctx.textBaseline = 'middle'
    ctx.fillText(props.centerText, left + width / 2, top + height / 2)
    ctx.restore()
  }
}

const defaultOptions: ChartOptions<'doughnut'> = {
  responsive: true,
  cutout: '70%',
  plugins: {
    legend: {
      display: false
    },
    tooltip: {
      callbacks: {
        label: (context) => {
          const label = context.label || ''
          const value = context.raw as number
          const total = (context.dataset.data as number[]).reduce((acc, data) => acc + data, 0)
          const percentage = ((value / total) * 100).toFixed(1)
          return `${label}: ${percentage}%`
        }
      }
    }
  },
  hover: {
    mode: 'nearest',
    intersect: true
  },
  elements: {
    arc: {
      borderWidth: 2,
      hoverOffset: 5,
      hoverBorderWidth: 3,
      hoverBorderColor: 'white'
    }
  }
}

const mergedOptions = computed(() => ({
  ...defaultOptions,
  ...props.chartOptions,
  plugins: {
    ...defaultOptions.plugins,
    ...props.chartOptions?.plugins,
    centerText: centerTextPlugin
  },
  onClick: (event, elements) => {
    if (!elements.length) return
    const index = elements[0].index
    if (index === undefined) return
    const label = props.chartData.labels?.[index] as string
    const value = props.chartData.datasets[0].data[index] as number
    emit('sectionClick', label, value)
  },
  onHover: (event, elements) => {
    if (event.native) {
      event.native.target.style.cursor = elements.length ? 'pointer' : 'default'
    }
  }
}))
</script>

<template>
  <Doughnut :data="chartData" :options="mergedOptions" />
</template>
