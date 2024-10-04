import { computed } from 'vue';
// import { fetchMachineData } from '../api/machines'
import DonutChart from '@/components/charts/DonutChart.vue';
import MachineList from '../views/MachineList.vue';
const { defineProps, defineSlots, defineEmits, defineExpose, defineModel, defineOptions, withDefaults, } = await import('vue');
// Define props
let __VLS_typeProps;
const props = defineProps();
// Define colors for each status
const statusColors = {
    生產: '#84cc16',
    閒置: '#f97316',
    當機: '#ef4444',
    裝機: '#fbbf24',
    工程借機: '#06b6d4',
    其他: '#64748b'
};
const statusCounts = computed(() => {
    return props.machines.reduce((acc, machine) => {
        acc[machine.currentStatus] = (acc[machine.currentStatus] || 0) + 1;
        return acc;
    }, {});
});
const mainChartData = computed(() => ({
    labels: Object.keys(statusCounts.value),
    datasets: [
        {
            data: Object.values(statusCounts.value),
            backgroundColor: Object.keys(statusCounts.value).map((status) => statusColors[status])
        }
    ]
}));
const chartOptions = {
    responsive: true,
    plugins: {
        legend: {
            position: 'right'
        }
    }
};
const totalMachines = computed(() => props.machines.length);
// error machine logic
const errorEquipmentCount = computed(() => statusCounts.value['當機'] || 0);
const errorEquipmentRatio = computed(() => totalMachines.value > 0
    ? ((errorEquipmentCount.value / totalMachines.value) * 100).toFixed(1)
    : '0');
// Prepare data for error chart
const errorChartData = computed(() => {
    const errorCount = statusCounts.value['當機'] || 0;
    // const totalMachines = props.machines.length
    return {
        labels: ['當機', '正常'],
        datasets: [
            {
                data: [errorCount, totalMachines.value - errorCount],
                backgroundColor: [statusColors['當機'], '#e2e8f0']
            }
        ]
    };
});
// working machine logic
const workingCount = computed(() => statusCounts.value['生產'] || 0);
const packagingCount = computed(() => statusCounts.value['裝機'] || 0);
const borrowingCount = computed(() => statusCounts.value['工程借機'] || 0);
const efficientRatio = computed(() => {
    return totalMachines.value > 0
        ? (((workingCount.value + packagingCount.value + borrowingCount.value) / totalMachines.value) *
            100).toFixed(1)
        : '0';
});
// Prepare data for working status chart
const workingChartData = computed(() => {
    const working = statusCounts.value['生產'] || 0;
    const packaging = statusCounts.value['裝機'] || 0;
    const borrowing = statusCounts.value['工程借機'] || 0;
    const totalMachines = props.machines.length;
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
    };
});
const centerText = computed(() => `Total: ${totalMachines.value}`);
const handleSectionClick = (label, value) => {
    console.log(`Clicked on ${label} with value ${value}`);
};
// Simulate real-time updates
// setInterval(fetchData, 500000) // Fetch new data every 5 seconds
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
    __VLS_elementAsFunction(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({ ...{ class: ("flex flex-col w-full") }, });
    if (__VLS_ctx.loading) {
        __VLS_elementAsFunction(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({});
    }
    else if (__VLS_ctx.error) {
        __VLS_elementAsFunction(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({});
        (__VLS_ctx.error);
    }
    else {
        __VLS_elementAsFunction(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({ ...{ class: ("w-full border-2 border-gray-200 rounded-md p-4 mb-4") }, });
        __VLS_elementAsFunction(__VLS_intrinsicElements.p, __VLS_intrinsicElements.p)({ ...{ class: ("text-lg font-bold") }, });
        __VLS_elementAsFunction(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({ ...{ class: ("chart-wrapper") }, });
        // @ts-ignore
        [DonutChart,];
        // @ts-ignore
        const __VLS_0 = __VLS_asFunctionalComponent(DonutChart, new DonutChart({ ...{ 'onSectionClick': {} }, chartData: ((__VLS_ctx.mainChartData)), chartOptions: ((__VLS_ctx.chartOptions)), centerText: ((__VLS_ctx.centerText)), }));
        const __VLS_1 = __VLS_0({ ...{ 'onSectionClick': {} }, chartData: ((__VLS_ctx.mainChartData)), chartOptions: ((__VLS_ctx.chartOptions)), centerText: ((__VLS_ctx.centerText)), }, ...__VLS_functionalComponentArgsRest(__VLS_0));
        let __VLS_5;
        const __VLS_6 = {
            onSectionClick: (__VLS_ctx.handleSectionClick)
        };
        let __VLS_2;
        let __VLS_3;
        const __VLS_4 = __VLS_pickFunctionalComponentCtx(DonutChart, __VLS_1);
        __VLS_elementAsFunction(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({ ...{ class: ("flex md:flex-row flex-col w-full gap-4") }, });
        __VLS_elementAsFunction(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({ ...{ class: ("flex-1 border-2 border-gray-200 rounded-md p-4") }, });
        __VLS_elementAsFunction(__VLS_intrinsicElements.p, __VLS_intrinsicElements.p)({ ...{ class: ("text-lg font-bold") }, });
        __VLS_elementAsFunction(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({});
        __VLS_elementAsFunction(__VLS_intrinsicElements.p, __VLS_intrinsicElements.p)({ ...{ class: ("my-2 m-0 text-left text-3xl font-bold text-red-500") }, });
        (__VLS_ctx.errorEquipmentRatio);
        __VLS_elementAsFunction(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({ ...{ class: ("chart-wrapper") }, });
        // @ts-ignore
        [DonutChart,];
        // @ts-ignore
        const __VLS_7 = __VLS_asFunctionalComponent(DonutChart, new DonutChart({ chartData: ((__VLS_ctx.errorChartData)), chartOptions: ((__VLS_ctx.chartOptions)), centerText: ((`${__VLS_ctx.errorEquipmentRatio}%`)), }));
        const __VLS_8 = __VLS_7({ chartData: ((__VLS_ctx.errorChartData)), chartOptions: ((__VLS_ctx.chartOptions)), centerText: ((`${__VLS_ctx.errorEquipmentRatio}%`)), }, ...__VLS_functionalComponentArgsRest(__VLS_7));
        __VLS_elementAsFunction(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({ ...{ class: ("flex-1 border-2 border-gray-200 rounded-md p-4") }, });
        __VLS_elementAsFunction(__VLS_intrinsicElements.p, __VLS_intrinsicElements.p)({ ...{ class: ("text-lg font-bold") }, });
        __VLS_elementAsFunction(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({});
        __VLS_elementAsFunction(__VLS_intrinsicElements.p, __VLS_intrinsicElements.p)({ ...{ class: ("my-2 m-0 text-left text-3xl font-bold text-green-500") }, });
        (__VLS_ctx.efficientRatio);
        __VLS_elementAsFunction(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({ ...{ class: ("chart-wrapper") }, });
        // @ts-ignore
        [DonutChart,];
        // @ts-ignore
        const __VLS_12 = __VLS_asFunctionalComponent(DonutChart, new DonutChart({ chartData: ((__VLS_ctx.workingChartData)), chartOptions: ((__VLS_ctx.chartOptions)), centerText: ((`${__VLS_ctx.efficientRatio}%`)), }));
        const __VLS_13 = __VLS_12({ chartData: ((__VLS_ctx.workingChartData)), chartOptions: ((__VLS_ctx.chartOptions)), centerText: ((`${__VLS_ctx.efficientRatio}%`)), }, ...__VLS_functionalComponentArgsRest(__VLS_12));
    }
    // @ts-ignore
    [MachineList,];
    // @ts-ignore
    const __VLS_17 = __VLS_asFunctionalComponent(MachineList, new MachineList({ machines: ((__VLS_ctx.machines)), loading: ((__VLS_ctx.loading)), error: ((__VLS_ctx.error)), ...{ class: ("my-5") }, }));
    const __VLS_18 = __VLS_17({ machines: ((__VLS_ctx.machines)), loading: ((__VLS_ctx.loading)), error: ((__VLS_ctx.error)), ...{ class: ("my-5") }, }, ...__VLS_functionalComponentArgsRest(__VLS_17));
    __VLS_styleScopedClasses['flex'];
    __VLS_styleScopedClasses['flex-col'];
    __VLS_styleScopedClasses['w-full'];
    __VLS_styleScopedClasses['w-full'];
    __VLS_styleScopedClasses['border-2'];
    __VLS_styleScopedClasses['border-gray-200'];
    __VLS_styleScopedClasses['rounded-md'];
    __VLS_styleScopedClasses['p-4'];
    __VLS_styleScopedClasses['mb-4'];
    __VLS_styleScopedClasses['text-lg'];
    __VLS_styleScopedClasses['font-bold'];
    __VLS_styleScopedClasses['chart-wrapper'];
    __VLS_styleScopedClasses['flex'];
    __VLS_styleScopedClasses['md:flex-row'];
    __VLS_styleScopedClasses['flex-col'];
    __VLS_styleScopedClasses['w-full'];
    __VLS_styleScopedClasses['gap-4'];
    __VLS_styleScopedClasses['flex-1'];
    __VLS_styleScopedClasses['border-2'];
    __VLS_styleScopedClasses['border-gray-200'];
    __VLS_styleScopedClasses['rounded-md'];
    __VLS_styleScopedClasses['p-4'];
    __VLS_styleScopedClasses['text-lg'];
    __VLS_styleScopedClasses['font-bold'];
    __VLS_styleScopedClasses['my-2'];
    __VLS_styleScopedClasses['m-0'];
    __VLS_styleScopedClasses['text-left'];
    __VLS_styleScopedClasses['text-3xl'];
    __VLS_styleScopedClasses['font-bold'];
    __VLS_styleScopedClasses['text-red-500'];
    __VLS_styleScopedClasses['chart-wrapper'];
    __VLS_styleScopedClasses['flex-1'];
    __VLS_styleScopedClasses['border-2'];
    __VLS_styleScopedClasses['border-gray-200'];
    __VLS_styleScopedClasses['rounded-md'];
    __VLS_styleScopedClasses['p-4'];
    __VLS_styleScopedClasses['text-lg'];
    __VLS_styleScopedClasses['font-bold'];
    __VLS_styleScopedClasses['my-2'];
    __VLS_styleScopedClasses['m-0'];
    __VLS_styleScopedClasses['text-left'];
    __VLS_styleScopedClasses['text-3xl'];
    __VLS_styleScopedClasses['font-bold'];
    __VLS_styleScopedClasses['text-green-500'];
    __VLS_styleScopedClasses['chart-wrapper'];
    __VLS_styleScopedClasses['my-5'];
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
            DonutChart: DonutChart,
            MachineList: MachineList,
            mainChartData: mainChartData,
            chartOptions: chartOptions,
            errorEquipmentRatio: errorEquipmentRatio,
            errorChartData: errorChartData,
            efficientRatio: efficientRatio,
            workingChartData: workingChartData,
            centerText: centerText,
            handleSectionClick: handleSectionClick,
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
