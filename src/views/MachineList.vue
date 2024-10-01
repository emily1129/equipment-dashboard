<script setup lang="ts">
import { h, ref, computed } from 'vue'
import { NDataTable, NTag, NSpace, NButton } from 'naive-ui'
import DonutChart from '@/components/charts/DonutChart.vue'
import { ChartData, ChartOptions } from 'chart.js'

interface StatusChange {
  status: '生產' | '閒置' | '當機' | '裝機' | '工程借機' | '其他'
  startTime: string
}

interface Machine {
  id: string
  statusChanges: StatusChange[]
  currentStatus: string
}

interface Props {
  machines: Machine[]
  loading: boolean
  error: string | null
}

const props = defineProps<Props>()

const statusMap = {
  生產: { name: '生產', color: 'bg-green-200 text-green-800' },
  閒置: { name: '閒置', color: 'bg-orange-200 text-orange-800' },
  當機: { name: '當機', color: 'bg-red-200 text-red-800' },
  裝機: { name: '裝機', color: 'bg-blue-200 text-blue-800' },
  工程借機: { name: '工程借機', color: 'bg-purple-200 text-purple-800' },
  其他: { name: '其他', color: 'bg-gray-200 text-gray-800' }
}

const getStatusInfo = (status: string) => {
  return statusMap[status] || { name: '未知', color: 'bg-gray-200 text-gray-800' }
}

const formatDateString = (dateString: string): string => {
  const [datePart, timePart] = dateString.split('T')
  if (timePart) {
    const [hours, minutes, seconds] = timePart.split(':')
    return `${datePart} ${hours}:${minutes}:${seconds}`
  }
  return datePart
}

const getLastUpdated = (machine: Machine) => {
  const lastChange = machine.statusChanges[machine.statusChanges.length - 1]
  return lastChange ? lastChange.startTime : ''
}

const calculateEffectiveProductionRatio = (
  machine: Machine
): { ratio: number; isAnomaly: boolean } => {
  const now = new Date().getTime()

  const calculateDuration = (startTime: string, endTime: string | null): number => {
    const start = new Date(startTime).getTime()
    const end = endTime ? new Date(endTime).getTime() : now
    return end - start
  }

  let totalTime = 0
  let productiveTime = 0
  let isAnomaly = false

  machine.statusChanges.forEach((change, index, array) => {
    const duration = calculateDuration(change.startTime, array[index + 1]?.startTime || null)
    totalTime += duration

    if (['生產', '裝機', '工程借機'].includes(change.status)) {
      productiveTime += duration
    }

    if (index === array.length - 1 && change.status === '當機' && duration > 10 * 60 * 60 * 1000) {
      isAnomaly = true
    }
  })

  return {
    ratio: Math.round((productiveTime / totalTime) * 100),
    isAnomaly
  }
}

const getChartData = (value: number): ChartData<'doughnut'> => ({
  datasets: [
    {
      data: [value, 100 - value],
      backgroundColor: ['#4CAF50', '#E0E0E0'],
      borderWidth: 0
    }
  ]
})

const chartOptions: ChartOptions<'doughnut'> = {
  responsive: true,
  maintainAspectRatio: false,
  cutout: '70%',
  plugins: {
    tooltip: { enabled: false },
    legend: { display: false }
  }
}

const columns = [
  {
    title: '機台編號',
    key: 'id',
    sorter: true
  },
  {
    title: '當前狀態',
    key: 'currentStatus',
    sorter: true,
    render(row: Machine) {
      const statusInfo = getStatusInfo(row.currentStatus)
      return h(
        NTag,
        {
          style: {
            backgroundColor: statusInfo.color.split(' ')[0].replace('bg-', ''),
            color: statusInfo.color.split(' ')[1].replace('text-', '')
          }
        },
        { default: () => statusInfo.name }
      )
    }
  },
  {
    title: '當前狀態的起始時間',
    key: 'lastUpdated',
    sorter: true,
    render(row: Machine) {
      return formatDateString(getLastUpdated(row))
    }
  },
  {
    title: '有效生產比例',
    key: 'productionRatio',
    render(row: Machine) {
      const { ratio, isAnomaly } = calculateEffectiveProductionRatio(row)
      if (isAnomaly) {
        return h('div', { style: { color: 'red', fontWeight: 'bold' } }, '異常')
      }
      return h(
        NSpace,
        {},
        {
          default: () => [
            h(DonutChart, {
              chartData: getChartData(ratio),
              chartOptions: chartOptions,
              centerText: `${ratio}%`,
              style: 'width: 40px; height: 40px;'
            }),
            `${ratio}%`
          ]
        }
      )
    }
  }
]

const data = computed(() => props.machines)

const expandable = {
  expandedRowKeys: ref<string[]>([]),
  renderExpandIcon: ({ expanded }: { expanded: boolean }) => {
    return h(
      NButton,
      {
        size: 'small',
        quaternary: true,
        circle: true
      },
      { default: () => (expanded ? '▼' : '►') }
    )
  },
  expandedRowRender: (row: Machine) => {
    return h(NDataTable, {
      columns: [
        {
          title: '狀態',
          key: 'status',
          render: (rowData: StatusChange) =>
            h(NTag, {}, { default: () => getStatusInfo(rowData.status).name })
        },
        {
          title: '開始時間',
          key: 'startTime',
          render: (rowData: StatusChange) => formatDateString(rowData.startTime)
        },
        { title: '持續時間', key: 'duration' }
      ],
      data: row.statusChanges.map((change, index, array) => ({
        status: change.status,
        startTime: change.startTime,
        duration: formatDateString(array[index + 1]?.startTime || new Date().toISOString())
      })),
      bordered: false,
      size: 'small'
    })
  }
}
</script>

<template>
  <div>
    <h2 class="text-2xl font-bold mb-4">機台列表 共{{ props.machines.length }}台</h2>
    <n-data-table
      :columns="columns"
      :data="data"
      :loading="props.loading"
      :expandable="expandable"
      :pagination="{ pageSize: 10 }"
      :bordered="false"
    />
  </div>
</template>
