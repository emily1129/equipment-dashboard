<script setup lang="ts">
import { h, ref, computed, watch } from 'vue'
import { NDataTable, NSpace, NSelect, NInput } from 'naive-ui'
import type { DataTableColumns, SelectOption } from 'naive-ui'
import DonutChart from '@/components/charts/DonutChart.vue'
import type { ChartData, ChartOptions } from 'chart.js'

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
  裝機: { name: '裝機', color: 'bg-cyan-200 text-cyan-800' },
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

type RowKey = string | number

const expandedRowKeys = ref<RowKey[]>([])

const handleExpandChange = (keys: RowKey[]) => {
  expandedRowKeys.value = keys
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

    // check for anomaly only for the current (last) status
    if (index === array.length - 1 && change.status === '當機') {
      const breakdownDuration = now - new Date(change.startTime).getTime()
      if (breakdownDuration > 24 * 60 * 60 * 1000) {
        isAnomaly = true
      }
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
    title: () => h('span', { class: 'font-bold' }, '機台編號'),
    key: 'id',
    sorter: true
  },
  {
    title: () => h('span', { class: 'font-bold' }, '當前狀態'),
    key: 'currentStatus',
    sorter: true,
    render(row: Machine) {
      const statusInfo = getStatusInfo(row.currentStatus)
      return h(
        'span',
        {
          class: [
            'md:font-bold font-semibold md:px-3 px-2 py-1 rounded-md text-xs whitespace-normal md:whitespace-nowrap w-10 md:w-auto inline-block',
            statusInfo.color
          ]
        },
        statusInfo.name
      )
    }
  },
  {
    title: () => h('span', { class: 'font-bold' }, '當前狀態之起始時間'),
    key: 'lastUpdated',
    sorter: true,
    render(row: Machine) {
      const lastUpdated = getLastUpdated(row)

      return h(
        'span',
        {
          class: ['text-xxs md:text-sm']
        },
        formatDateString(lastUpdated)
      )
    }
  },
  {
    title: () => h('span', { class: 'font-bold' }, '有效生產比例'),
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
              style: 'width: 32px; height: 32px;'
            }),
            `${ratio}%`
          ]
        }
      )
    }
  }
]

const expandColumn = {
  type: 'expand',
  expandable: (rowData: Machine) => rowData.statusChanges.length > 0,
  renderExpand: (rowData: Machine) => {
    return h('div', { class: 'expanded-section' }, [
      h(NDataTable, {
        columns: [
          {
            title: () => h('span', { class: 'machine-id-column' }, '機台編號'),
            key: 'machineId'
          },
          {
            title: '歷史狀態',
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
            render: (rowData: { startTime: string }) => {
              return h(
                'span',
                {
                  class: ['text-xxs md:text-sm']
                },
                formatDateString(rowData.startTime)
              )
            }
          }
        ],
        data: rowData.statusChanges.map((change, index) => ({
          key: `${rowData.id}-${index}`,
          machineId: index === 0 ? rowData.id : '', // only show the machine ID for the first row
          status: change.status,
          startTime: change.startTime
        })),
        bordered: false,
        size: 'small',
        class: 'inner-expanded-table'
      })
    ])
  }
}

// add the expandColumn to the beginning (left side) of the main table's columns
columns.unshift(expandColumn as DataTableColumns<Machine>[number])

const filteredAndSortedData = computed(() => {
  let result = props.machines.map((machine) => ({
    key: machine.id,
    ...machine
  }))

  if (selectedStatuses.value.length > 0) {
    result = result.filter((machine) => selectedStatuses.value.includes(machine.currentStatus))
  }

  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase()
    result = result.filter(
      (machine) =>
        machine.id.toLowerCase().includes(query) ||
        machine.currentStatus.toLowerCase().includes(query) ||
        getLastUpdated(machine).toLowerCase().includes(query)
    )
  }

  if (sorter.value.columnKey) {
    result = [...result].sort((a, b) => {
      let compareA: string | number
      let compareB: string | number

      compareA = a[sorter.value.columnKey as keyof Machine] as string
      compareB = b[sorter.value.columnKey as keyof Machine] as string

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

// watch([selectedStatuses, searchQuery], ([newStatuses, newQuery]) => {
//   console.log('Selected statuses:', newStatuses)
//   console.log('Search query:', newQuery)
//   console.log('Filtered and sorted data:', filteredAndSortedData.value)
// })
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
          placeholder="搜尋機台編號、狀態、最後更新時間"
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
      @update:sorter="handleSorterChange"
      class="main-table"
    />
  </div>
</template>

<style scoped>
:deep(.n-data-table-td) {
  transition: border-color 0.3s;
}
:deep(.n-data-table-td:hover) {
  border-color: #848484;
}
.custom-table :deep(.n-data-table-th) {
  background-color: rgb(71, 85, 105, 0.3);
  color: white;
}
.text-xxs {
  font-size: 0.5rem;
}
.custom-table :deep(.n-data-table-tr) {
  margin-bottom: 4px;
}
.expanded-section {
  margin: 16px 0;
}

:deep(.inner-expanded-table) {
  background-color: rgba(0, 0, 0, 0.07);
  overflow: hidden;
}

:deep(.inner-expanded-table .n-data-table-wrapper) {
  padding: 2rem;
}

:deep(.inner-expanded-table .n-data-table-td) {
  background-color: transparent !important;
}

:deep(.inner-expanded-table .n-data-table-th) {
  background-color: rgba(0, 0, 0, 0.07) !important;
}

:deep(.main-table .n-data-table-th:nth-child(2)),
:deep(.inner-expanded-table .machine-id-column) {
  width: 22.5%;
}

:deep(.inner-expanded-table .n-data-table-td:first-child:not(:first-of-type)) {
  color: transparent;
}

:deep(.inner-expanded-table .n-data-table-tr:not(:last-child)) {
  border-bottom: 1px solid rgba(0, 0, 0, 0.05);
}
</style>
