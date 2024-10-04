import { h, ref, computed, onMounted, watch } from 'vue';
import { NDataTable, NSpace, NSelect, NInput } from 'naive-ui';
import DonutChart from '@/components/charts/DonutChart.vue';
const { defineProps, defineSlots, defineEmits, defineExpose, defineModel, defineOptions, withDefaults, } = await import('vue');
let __VLS_typeProps;
const props = defineProps();
const statusMap = {
    生產: { name: '生產', color: 'bg-green-200 text-green-800' },
    閒置: { name: '閒置', color: 'bg-orange-200 text-orange-800' },
    當機: { name: '當機', color: 'bg-red-200 text-red-800' },
    裝機: { name: '裝機', color: 'bg-blue-200 text-blue-800' },
    工程借機: { name: '工程借機', color: 'bg-purple-200 text-purple-800' },
    其他: { name: '其他', color: 'bg-gray-200 text-gray-800' }
};
const statusOptions = Object.keys(statusMap).map((key) => ({
    label: statusMap[key].name,
    value: key
}));
const selectedStatuses = ref([]);
const searchQuery = ref('');
const sorter = ref({
    columnKey: null,
    order: null
});
const expandedRowKeys = ref([]);
const handleExpandChange = (keys) => {
    expandedRowKeys.value = keys; // accepts both string and number
};
// Add this method to programmatically expand a row
const expandRowById = (id) => {
    if (!expandedRowKeys.value.includes(id)) {
        expandedRowKeys.value.push(id);
    }
};
const filteredAndSortedData = computed(() => {
    let result = props.machines;
    // Apply filtering
    if (selectedStatuses.value.length > 0) {
        result = result.filter((machine) => selectedStatuses.value.includes(machine.currentStatus));
    }
    // Apply search filtering
    if (searchQuery.value) {
        const query = searchQuery.value.toLowerCase();
        result = result.filter((machine) => machine.id.toLowerCase().includes(query) ||
            machine.currentStatus.toLowerCase().includes(query) ||
            getLastUpdated(machine).toLowerCase().includes(query) ||
            calculateEffectiveProductionRatio(machine).ratio.toString().includes(query));
    }
    // Apply sorting
    if (sorter.value.columnKey) {
        result = [...result].sort((a, b) => {
            let compareA;
            let compareB;
            // default comparison by string (handles 'id' and 'currentStatus')
            compareA = a[sorter.value.columnKey];
            compareB = b[sorter.value.columnKey];
            // handle lastUpdated and productionRatio
            if (sorter.value.columnKey === 'lastUpdated') {
                compareA = getLastUpdated(a);
                compareB = getLastUpdated(b);
            }
            else if (sorter.value.columnKey === 'productionRatio') {
                compareA = calculateEffectiveProductionRatio(a).ratio;
                compareB = calculateEffectiveProductionRatio(b).ratio;
            }
            if (compareA < compareB)
                return sorter.value.order === 'ascend' ? -1 : 1;
            if (compareA > compareB)
                return sorter.value.order === 'ascend' ? 1 : -1;
            return 0;
        });
    }
    return result;
});
const handleSorterChange = (sorterInfo) => {
    sorter.value = sorterInfo;
};
const getStatusInfo = (status) => {
    return (statusMap[status] || {
        name: '未知',
        color: 'bg-gray-200 text-gray-800'
    });
};
const formatDateString = (dateString) => {
    const [datePart, timePart] = dateString.split('T');
    if (timePart) {
        const [hours, minutes, seconds] = timePart.split(':');
        return `${datePart} ${hours}:${minutes}:${seconds}`;
    }
    return datePart;
};
const getLastUpdated = (machine) => {
    const lastChange = machine.statusChanges[machine.statusChanges.length - 1];
    return lastChange ? lastChange.startTime : '';
};
const calculateEffectiveProductionRatio = (machine) => {
    const now = new Date().getTime();
    const calculateDuration = (startTime, endTime) => {
        const start = new Date(startTime).getTime();
        const end = endTime ? new Date(endTime).getTime() : now;
        return end - start;
    };
    let totalTime = 0;
    let productiveTime = 0;
    let isAnomaly = false;
    machine.statusChanges.forEach((change, index, array) => {
        const duration = calculateDuration(change.startTime, array[index + 1]?.startTime || null);
        totalTime += duration;
        if (['生產', '裝機', '工程借機'].includes(change.status)) {
            productiveTime += duration;
        }
        if (index === array.length - 1 && change.status === '當機' && duration > 10 * 60 * 60 * 1000) {
            isAnomaly = true;
        }
    });
    return {
        ratio: Math.round((productiveTime / totalTime) * 100),
        isAnomaly
    };
};
const getChartData = (value) => ({
    datasets: [
        {
            data: [value, 100 - value],
            backgroundColor: ['#4CAF50', '#E0E0E0'],
            borderWidth: 0
        }
    ]
});
const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    cutout: '70%',
    plugins: {
        tooltip: { enabled: false },
        legend: { display: false }
    }
};
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
        render(row) {
            const statusInfo = getStatusInfo(row.currentStatus);
            return h('span', {
                class: ['font-bold px-3 py-1 rounded-md text-xs', statusInfo.color]
            }, statusInfo.name);
        }
    },
    {
        title: '當前狀態的起始時間',
        key: 'lastUpdated',
        sorter: true,
        render(row) {
            return formatDateString(getLastUpdated(row));
        }
    },
    {
        title: '有效生產比例',
        key: 'productionRatio',
        sorter: true,
        render(row) {
            const { ratio, isAnomaly } = calculateEffectiveProductionRatio(row);
            if (isAnomaly) {
                return h('div', { style: { color: 'red', fontWeight: 'bold' } }, '異常');
            }
            return h(NSpace, {}, {
                default: () => [
                    h(DonutChart, {
                        chartData: getChartData(ratio),
                        chartOptions: chartOptions,
                        centerText: `${ratio}%`,
                        style: 'width: 40px; height: 40px;'
                    }),
                    `${ratio}%`
                ]
            });
        }
    },
    {
        type: 'expand',
        renderExpand: (row) => {
            return h(NDataTable, {
                columns: [
                    {
                        title: '狀態',
                        key: 'status',
                        render: (rowData) => {
                            const statusInfo = getStatusInfo(rowData.status);
                            return h('span', {
                                class: ['font-bold px-3 py-1 rounded-md text-xs', statusInfo.color]
                            }, statusInfo.name);
                        }
                    },
                    {
                        title: '開始時間',
                        key: 'startTime',
                        render: (rowData) => formatDateString(rowData.startTime)
                    }
                ],
                data: row.statusChanges.map((change, index, array) => ({
                    status: change.status,
                    startTime: change.startTime,
                    endTime: array[index + 1]?.startTime || new Date().toISOString()
                })),
                bordered: false,
                size: 'small'
            });
        }
    }
];
onMounted(() => {
    console.log('Machine statuses:', props.machines.map((m) => m.currentStatus));
});
// Log for debugging
watch([selectedStatuses, searchQuery], ([newStatuses, newQuery]) => {
    console.log('Selected statuses:', newStatuses);
    console.log('Search query:', newQuery);
    console.log('Filtered and sorted data:', filteredAndSortedData.value);
});
const __VLS_fnComponent = (await import('vue')).defineComponent({});
;
let __VLS_functionalComponentProps;
function __VLS_template() {
    const __VLS_ctx = {};
    const __VLS_localComponents = {
        ...{},
        ...{},
        ...__VLS_ctx,
    };
    let __VLS_components;
    const __VLS_localDirectives = {
        ...{},
        ...__VLS_ctx,
    };
    let __VLS_directives;
    let __VLS_styleScopedClasses;
    // CSS variable injection 
    // CSS variable injection end 
    let __VLS_resolvedLocalAndGlobalComponents;
    __VLS_elementAsFunction(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({});
    __VLS_elementAsFunction(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({ ...{ class: ("flex flex-col space-y-4 sm:space-y-0 sm:flex-row sm:justify-between sm:items-center mb-4") }, });
    __VLS_elementAsFunction(__VLS_intrinsicElements.h2, __VLS_intrinsicElements.h2)({ ...{ class: ("text-xl font-bold text-left") }, });
    (__VLS_ctx.filteredAndSortedData.length);
    __VLS_elementAsFunction(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({ ...{ class: ("flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-4 w-full sm:w-auto") }, });
    const __VLS_0 = __VLS_resolvedLocalAndGlobalComponents.NInput;
    /** @type { [typeof __VLS_components.NInput, ] } */
    // @ts-ignore
    const __VLS_1 = __VLS_asFunctionalComponent(__VLS_0, new __VLS_0({ value: ((__VLS_ctx.searchQuery)), type: ("text"), placeholder: ("搜尋機台編號"), ...{ class: ("w-full sm:w-64") }, }));
    const __VLS_2 = __VLS_1({ value: ((__VLS_ctx.searchQuery)), type: ("text"), placeholder: ("搜尋機台編號"), ...{ class: ("w-full sm:w-64") }, }, ...__VLS_functionalComponentArgsRest(__VLS_1));
    const __VLS_6 = __VLS_resolvedLocalAndGlobalComponents.NSelect;
    /** @type { [typeof __VLS_components.NSelect, ] } */
    // @ts-ignore
    const __VLS_7 = __VLS_asFunctionalComponent(__VLS_6, new __VLS_6({ value: ((__VLS_ctx.selectedStatuses)), options: ((__VLS_ctx.statusOptions)), multiple: (true), clearable: (true), ...{ class: ("w-full sm:w-64") }, placeholder: ("選擇狀態"), }));
    const __VLS_8 = __VLS_7({ value: ((__VLS_ctx.selectedStatuses)), options: ((__VLS_ctx.statusOptions)), multiple: (true), clearable: (true), ...{ class: ("w-full sm:w-64") }, placeholder: ("選擇狀態"), }, ...__VLS_functionalComponentArgsRest(__VLS_7));
    const __VLS_12 = __VLS_resolvedLocalAndGlobalComponents.NDataTable;
    /** @type { [typeof __VLS_components.NDataTable, ] } */
    // @ts-ignore
    const __VLS_13 = __VLS_asFunctionalComponent(__VLS_12, new __VLS_12({ ...{ 'onUpdate:expandedRowKeys': {} }, ...{ 'onSorterChange': {} }, columns: ((__VLS_ctx.columns)), data: ((__VLS_ctx.filteredAndSortedData)), loading: ((props.loading)), pagination: (({ pageSize: 10 })), bordered: ((false)), expandedRowKeys: ((__VLS_ctx.expandedRowKeys)), }));
    const __VLS_14 = __VLS_13({ ...{ 'onUpdate:expandedRowKeys': {} }, ...{ 'onSorterChange': {} }, columns: ((__VLS_ctx.columns)), data: ((__VLS_ctx.filteredAndSortedData)), loading: ((props.loading)), pagination: (({ pageSize: 10 })), bordered: ((false)), expandedRowKeys: ((__VLS_ctx.expandedRowKeys)), }, ...__VLS_functionalComponentArgsRest(__VLS_13));
    let __VLS_18;
    const __VLS_19 = {
        'onUpdate:expandedRowKeys': (__VLS_ctx.handleExpandChange)
    };
    const __VLS_20 = {
        onSorterChange: (__VLS_ctx.handleSorterChange)
    };
    let __VLS_15;
    let __VLS_16;
    const __VLS_17 = __VLS_pickFunctionalComponentCtx(__VLS_12, __VLS_14);
    __VLS_styleScopedClasses['flex'];
    __VLS_styleScopedClasses['flex-col'];
    __VLS_styleScopedClasses['space-y-4'];
    __VLS_styleScopedClasses['sm:space-y-0'];
    __VLS_styleScopedClasses['sm:flex-row'];
    __VLS_styleScopedClasses['sm:justify-between'];
    __VLS_styleScopedClasses['sm:items-center'];
    __VLS_styleScopedClasses['mb-4'];
    __VLS_styleScopedClasses['text-xl'];
    __VLS_styleScopedClasses['font-bold'];
    __VLS_styleScopedClasses['text-left'];
    __VLS_styleScopedClasses['flex'];
    __VLS_styleScopedClasses['flex-col'];
    __VLS_styleScopedClasses['sm:flex-row'];
    __VLS_styleScopedClasses['space-y-2'];
    __VLS_styleScopedClasses['sm:space-y-0'];
    __VLS_styleScopedClasses['sm:space-x-4'];
    __VLS_styleScopedClasses['w-full'];
    __VLS_styleScopedClasses['sm:w-auto'];
    __VLS_styleScopedClasses['w-full'];
    __VLS_styleScopedClasses['sm:w-64'];
    __VLS_styleScopedClasses['w-full'];
    __VLS_styleScopedClasses['sm:w-64'];
    var __VLS_slots;
    var __VLS_inheritedAttrs;
    const __VLS_refs = {};
    var $refs;
    return {
        slots: __VLS_slots,
        refs: $refs,
        attrs: {},
    };
}
;
const __VLS_self = (await import('vue')).defineComponent({
    setup() {
        return {
            NDataTable: NDataTable,
            NSelect: NSelect,
            NInput: NInput,
            statusOptions: statusOptions,
            selectedStatuses: selectedStatuses,
            searchQuery: searchQuery,
            expandedRowKeys: expandedRowKeys,
            handleExpandChange: handleExpandChange,
            filteredAndSortedData: filteredAndSortedData,
            handleSorterChange: handleSorterChange,
            columns: columns,
        };
    },
    __typeProps: {},
});
export default (await import('vue')).defineComponent({
    setup() {
        return {};
    },
    __typeProps: {},
});
;
