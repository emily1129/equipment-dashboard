import { computed } from 'vue';
import { Doughnut } from 'vue-chartjs';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
const { defineProps, defineSlots, defineEmits, defineExpose, defineModel, defineOptions, withDefaults, } = await import('vue');
ChartJS.register(ArcElement, Tooltip, Legend);
let __VLS_typeProps;
const props = withDefaults(defineProps(), {
    chartOptions: () => ({}),
    centerText: '102%'
});
const emit = defineEmits();
const centerTextPlugin = {
    id: 'centerText',
    afterDraw: (chart) => {
        const { ctx, chartArea: { left, top, width, height } } = chart;
        ctx.save();
        ctx.font = 'bolder 30px Arial';
        ctx.fillStyle = 'black';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(props.centerText, left + width / 2, top + height / 2);
        ctx.restore();
    }
};
const defaultOptions = {
    responsive: true,
    cutout: '50%',
    plugins: {
        legend: {
            display: false
        },
        tooltip: {
            callbacks: {
                label: (context) => {
                    const label = context.label || '';
                    const value = context.raw;
                    const total = context.dataset.data.reduce((acc, data) => acc + data, 0);
                    const percentage = ((value / total) * 100).toFixed(1);
                    return `${label}: ${percentage}%`;
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
            hoverOffset: 4,
            hoverBorderWidth: 2,
            hoverBorderColor: 'white'
        }
    }
};
const mergedOptions = computed(() => ({
    ...defaultOptions,
    ...props.chartOptions,
    plugins: {
        ...defaultOptions.plugins,
        ...props.chartOptions?.plugins,
        centerText: centerTextPlugin
    },
    onClick: (event, elements) => {
        if (!elements.length)
            return;
        const index = elements[0].index;
        if (index === undefined)
            return;
        const label = props.chartData.labels?.[index];
        const value = props.chartData.datasets[0].data[index];
        emit('sectionClick', label, value);
    },
    onHover: (event, elements) => {
        const nativeEvent = event.native;
        if (nativeEvent && nativeEvent.target) {
            ;
            nativeEvent.target.style.cursor = elements.length ? 'pointer' : 'default';
        }
    }
}));
const __VLS_withDefaultsArg = (function (t) { return t; })({
    chartOptions: () => ({}),
    centerText: '102%'
});
const __VLS_fnComponent = (await import('vue')).defineComponent({
    __typeEmits: {},
});
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
    let __VLS_resolvedLocalAndGlobalComponents;
    const __VLS_0 = __VLS_resolvedLocalAndGlobalComponents.Doughnut;
    /** @type { [typeof __VLS_components.Doughnut, ] } */
    // @ts-ignore
    const __VLS_1 = __VLS_asFunctionalComponent(__VLS_0, new __VLS_0({ data: ((__VLS_ctx.chartData)), options: ((__VLS_ctx.mergedOptions)), }));
    const __VLS_2 = __VLS_1({ data: ((__VLS_ctx.chartData)), options: ((__VLS_ctx.mergedOptions)), }, ...__VLS_functionalComponentArgsRest(__VLS_1));
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
            Doughnut: Doughnut,
            mergedOptions: mergedOptions,
        };
    },
    __typeEmits: {},
    __typeProps: {},
    props: {},
});
export default (await import('vue')).defineComponent({
    setup() {
        return {};
    },
    __typeEmits: {},
    __typeProps: {},
    props: {},
});
;
