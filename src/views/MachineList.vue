<script setup lang="ts">
import { h, ref, computed, onMounted, watch } from 'vue'
import { NDataTable, NSpace, NButton, NSelect, NInput } from 'naive-ui'
import type { DataTableColumns, SelectOption } from 'naive-ui'
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

const statusOptions: SelectOption[] = Object.keys(statusMap).map((key) => ({
  label: statusMap[key as keyof typeof statusMap].name,
  value: key
}))

const selectedStatuses = ref<string[]>([])
const searchQuery = ref('')

const sorter = ref<{ columnKey: string | null; order: 'ascend' | 'descend' | null }>({
  columnKey: null,
  order: null
})

const expandedRowKeys = ref<string[]>([])

const handleExpandChange = (keys: string[]) => {
  expandedRowKeys.value = keys
}
// Add this method to programmatically expand a row
const expandRowById = (id: string) => {
  if (!expandedRowKeys.value.includes(id)) {
    expandedRowKeys.value.push(id)
  }
}

const filteredAndSortedData = computed(() => {
  let result = props.machines

  // Apply filtering
  if (selectedStatuses.value.length > 0) {
    result = result.filter((machine) => selectedStatuses.value.includes(machine.currentStatus))
  }

  // Apply search filtering
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase()
    result = result.filter(
      (machine) =>
        machine.id.toLowerCase().includes(query) ||
        machine.currentStatus.toLowerCase().includes(query) ||
        getLastUpdated(machine).toLowerCase().includes(query) ||
        calculateEffectiveProductionRatio(machine).ratio.toString().includes(query)
    )
  }

  // Apply sorting
  if (sorter.value.columnKey) {
    result = [...result].sort((a, b) => {
      let compareA = a[sorter.value.columnKey as keyof Machine]
      let compareB = b[sorter.value.columnKey as keyof Machine]

      // Special handling for lastUpdated and productionRatio
      if (sorter.value.columnKey === 'lastUpdated') {
        compareA = getLastUpdated(a)
        compareB = getLastUpdated(b)
      } else if (sorter.value.columnKey === 'productionRatio') {
        compareA = calculateEffectiveProductionRatio(a).ratio
        compareB = calculateEffectiveProductionRatio(b).ratio
      }

      if (compareA < compareB) return sorter.value.order === 'ascend' ? -1 : 1
      if (compareA > compareB) return sorter.value.order === 'ascend' ? 1 : -1
      return 0
    })
  }

  return result
})

const handleSorterChange = (sorterInfo: {
  columnKey: string
  order: 'ascend' | 'descend' | null
}) => {
  sorter.value = sorterInfo
}
const getStatusInfo = (status: string) => {
  return (
    statusMap[status as keyof typeof statusMap] || {
      name: '未知',
      color: 'bg-gray-200 text-gray-800'
    }
  )
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

const columns: DataTableColumns<Machine> = [
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
        'span',
        {
          class: ['font-bold px-3 py-1 rounded-md text-xs', statusInfo.color]
        },
        statusInfo.name
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
    sorter: true,
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
  },
  {
    type: 'expand',
    renderExpand: (row: Machine) => {
      return h(NDataTable, {
        columns: [
          {
            title: '狀態',
            key: 'status',
            render: (rowData: { status: string }) => {
              const statusInfo = getStatusInfo(rowData.status)
              return h(
                'span',
                {
                  class: ['font-bold px-3 py-1 rounded-md text-xs', statusInfo.color]
                },
                statusInfo.name
              )
            }
          },
          {
            title: '開始時間',
            key: 'startTime',
            render: (rowData: { startTime: string }) => formatDateString(rowData.startTime)
          }
        ],
        data: row.statusChanges.map((change, index, array) => ({
          status: change.status,
          startTime: change.startTime,
          endTime: array[index + 1]?.startTime || new Date().toISOString()
        })),
        bordered: false,
        size: 'small'
      })
    }
  }
]

onMounted(() => {
  console.log(
    'Machine statuses:',
    props.machines.map((m) => m.currentStatus)
  )
})

// Log for debugging
watch([selectedStatuses, searchQuery], ([newStatuses, newQuery]) => {
  console.log('Selected statuses:', newStatuses)
  console.log('Search query:', newQuery)
  console.log('Filtered and sorted data:', filteredAndSortedData.value)
})
</script>

<template>
  <div>
    <div
      class="flex flex-col space-y-4 sm:space-y-0 sm:flex-row sm:justify-between sm:items-center mb-4"
    >
      <h2 class="text-xl font-bold text-left">機台列表 共{{ filteredAndSortedData.length }}台</h2>
      <div class="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-4 w-full sm:w-auto">
        <NInput
          v-model:value="searchQuery"
          type="text"
          placeholder="搜尋機台編號"
          class="w-full sm:w-64"
        />
        <NSelect
          v-model:value="selectedStatuses"
          :options="statusOptions"
          multiple
          clearable
          class="w-full sm:w-64"
          placeholder="選擇狀態"
        />
      </div>
    </div>
    <NDataTable
      :columns="columns"
      :data="filteredAndSortedData"
      :loading="props.loading"
      :pagination="{ pageSize: 10 }"
      :bordered="false"
      :expanded-row-keys="expandedRowKeys"
      @update:expanded-row-keys="handleExpandChange"
      @sorter-change="handleSorterChange"
    />
  </div>
</template>

<style scoped>
:deep(.n-data-table-td) {
  transition: border-color 0.3s;
}
:deep(.n-data-table-td:hover) {
  border-color: #848484 !important;
}
</style>
