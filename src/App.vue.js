import { ref } from 'vue';
import HeaderActions from './components/HeaderActions.vue';
import { fetchMachineData } from './api/machines';
const { defineProps, defineSlots, defineEmits, defineExpose, defineModel, defineOptions, withDefaults, } = await import('vue');
const currentPage = ref('機台狀態維護');
const machines = ref([]);
const lastUpdated = ref('');
const loading = ref(false);
const error = ref(null);
const fetchData = async () => {
    loading.value = true;
    error.value = null;
    try {
        machines.value = await fetchMachineData();
        lastUpdated.value = new Date().toLocaleTimeString();
        console.log(machines.value);
    }
    catch (e) {
        error.value = 'Failed to fetch data';
        console.error(e);
    }
    finally {
        loading.value = false;
    }
};
fetchData();
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
    let __VLS_resolvedLocalAndGlobalComponents;
    __VLS_elementAsFunction(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({ ...{ class: ("flex flex-col md:flex-row h-screen w-full font-sans") }, });
    __VLS_elementAsFunction(__VLS_intrinsicElements.main, __VLS_intrinsicElements.main)({ ...{ class: ("flex-1 flex flex-col bg-white") }, });
    __VLS_elementAsFunction(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({ ...{ class: ("w-full bg-gray-100 border-b md:border-r border-gray-200") }, });
    __VLS_elementAsFunction(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({ ...{ class: ("flex justify-between px-4") }, });
    __VLS_elementAsFunction(__VLS_intrinsicElements.p, __VLS_intrinsicElements.p)({ ...{ class: ("font-extrabold text-3xl py-5") }, });
    // @ts-ignore
    [HeaderActions,];
    // @ts-ignore
    const __VLS_0 = __VLS_asFunctionalComponent(HeaderActions, new HeaderActions({ lastUpdated: ((__VLS_ctx.lastUpdated)), }));
    const __VLS_1 = __VLS_0({ lastUpdated: ((__VLS_ctx.lastUpdated)), }, ...__VLS_functionalComponentArgsRest(__VLS_0));
    __VLS_elementAsFunction(__VLS_intrinsicElements.nav, __VLS_intrinsicElements.nav)({ ...{ class: ("flex bg-slate-300 w-full") }, });
    const __VLS_5 = __VLS_resolvedLocalAndGlobalComponents.RouterLink;
    /** @type { [typeof __VLS_components.RouterLink, typeof __VLS_components.RouterLink, ] } */
    // @ts-ignore
    const __VLS_6 = __VLS_asFunctionalComponent(__VLS_5, new __VLS_5({ ...{ 'onClick': {} }, to: ("/"), ...{ class: ("flex justify-center w-1/2 py-3 px-4 text-md hover:bg-slate-400 hover:text-slate-700 transition-colors") }, ...{ class: (({ 'bg-slate-600 text-white': __VLS_ctx.$route.path === '/' })) }, }));
    const __VLS_7 = __VLS_6({ ...{ 'onClick': {} }, to: ("/"), ...{ class: ("flex justify-center w-1/2 py-3 px-4 text-md hover:bg-slate-400 hover:text-slate-700 transition-colors") }, ...{ class: (({ 'bg-slate-600 text-white': __VLS_ctx.$route.path === '/' })) }, }, ...__VLS_functionalComponentArgsRest(__VLS_6));
    let __VLS_11;
    const __VLS_12 = {
        onClick: (...[$event]) => {
            __VLS_ctx.currentPage = '機台狀態維護';
        }
    };
    let __VLS_8;
    let __VLS_9;
    __VLS_elementAsFunction(__VLS_intrinsicElements.svg, __VLS_intrinsicElements.svg)({ xmlns: ("http://www.w3.org/2000/svg"), fill: ("none"), viewBox: ("0 0 24 24"), "stroke-width": ("1.5"), stroke: ("currentColor"), ...{ class: ("size-6 mr-2") }, });
    __VLS_elementAsFunction(__VLS_intrinsicElements.path)({ "stroke-linecap": ("round"), "stroke-linejoin": ("round"), d: ("M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87.074.04.147.083.22.127.325.196.72.257 1.075.124l1.217-.456a1.125 1.125 0 0 1 1.37.49l1.296 2.247a1.125 1.125 0 0 1-.26 1.431l-1.003.827c-.293.241-.438.613-.43.992a7.723 7.723 0 0 1 0 .255c-.008.378.137.75.43.991l1.004.827c.424.35.534.955.26 1.43l-1.298 2.247a1.125 1.125 0 0 1-1.369.491l-1.217-.456c-.355-.133-.75-.072-1.076.124a6.47 6.47 0 0 1-.22.128c-.331.183-.581.495-.644.869l-.213 1.281c-.09.543-.56.94-1.11.94h-2.594c-.55 0-1.019-.398-1.11-.94l-.213-1.281c-.062-.374-.312-.686-.644-.87a6.52 6.52 0 0 1-.22-.127c-.325-.196-.72-.257-1.076-.124l-1.217.456a1.125 1.125 0 0 1-1.369-.49l-1.297-2.247a1.125 1.125 0 0 1 .26-1.431l1.004-.827c.292-.24.437-.613.43-.991a6.932 6.932 0 0 1 0-.255c.007-.38-.138-.751-.43-.992l-1.004-.827a1.125 1.125 0 0 1-.26-1.43l1.297-2.247a1.125 1.125 0 0 1 1.37-.491l1.216.456c.356.133.751.072 1.076-.124.072-.044.146-.086.22-.128.332-.183.582-.495.644-.869l.214-1.28Z"), });
    __VLS_elementAsFunction(__VLS_intrinsicElements.path)({ "stroke-linecap": ("round"), "stroke-linejoin": ("round"), d: ("M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"), });
    __VLS_nonNullable(__VLS_10.slots).default;
    const __VLS_10 = __VLS_pickFunctionalComponentCtx(__VLS_5, __VLS_7);
    const __VLS_13 = __VLS_resolvedLocalAndGlobalComponents.RouterLink;
    /** @type { [typeof __VLS_components.RouterLink, typeof __VLS_components.RouterLink, ] } */
    // @ts-ignore
    const __VLS_14 = __VLS_asFunctionalComponent(__VLS_13, new __VLS_13({ ...{ 'onClick': {} }, to: ("/machines"), ...{ class: ("flex justify-center w-1/2 py-3 px-4 text-md hover:bg-slate-400 hover:text-slate-700 transition-colors") }, ...{ class: (({ 'bg-slate-600 text-white': __VLS_ctx.$route.path === '/machines' })) }, }));
    const __VLS_15 = __VLS_14({ ...{ 'onClick': {} }, to: ("/machines"), ...{ class: ("flex justify-center w-1/2 py-3 px-4 text-md hover:bg-slate-400 hover:text-slate-700 transition-colors") }, ...{ class: (({ 'bg-slate-600 text-white': __VLS_ctx.$route.path === '/machines' })) }, }, ...__VLS_functionalComponentArgsRest(__VLS_14));
    let __VLS_19;
    const __VLS_20 = {
        onClick: (...[$event]) => {
            __VLS_ctx.currentPage = '機台報表';
        }
    };
    let __VLS_16;
    let __VLS_17;
    __VLS_elementAsFunction(__VLS_intrinsicElements.svg, __VLS_intrinsicElements.svg)({ xmlns: ("http://www.w3.org/2000/svg"), fill: ("none"), viewBox: ("0 0 24 24"), "stroke-width": ("1.5"), stroke: ("currentColor"), ...{ class: ("size-6 mr-2") }, });
    __VLS_elementAsFunction(__VLS_intrinsicElements.path)({ "stroke-linecap": ("round"), "stroke-linejoin": ("round"), d: ("M3.75 3v11.25A2.25 2.25 0 0 0 6 16.5h2.25M3.75 3h-1.5m1.5 0h16.5m0 0h1.5m-1.5 0v11.25A2.25 2.25 0 0 1 18 16.5h-2.25m-7.5 0h7.5m-7.5 0-1 3m8.5-3 1 3m0 0 .5 1.5m-.5-1.5h-9.5m0 0-.5 1.5m.75-9 3-3 2.148 2.148A12.061 12.061 0 0 1 16.5 7.605"), });
    __VLS_nonNullable(__VLS_18.slots).default;
    const __VLS_18 = __VLS_pickFunctionalComponentCtx(__VLS_13, __VLS_15);
    __VLS_elementAsFunction(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({ ...{ class: ("flex-1 py-4 overflow-auto px-8") }, });
    const __VLS_21 = __VLS_resolvedLocalAndGlobalComponents.RouterView;
    /** @type { [typeof __VLS_components.RouterView, ] } */
    // @ts-ignore
    const __VLS_22 = __VLS_asFunctionalComponent(__VLS_21, new __VLS_21({ machines: ((__VLS_ctx.machines)), loading: ((__VLS_ctx.loading)), error: ((__VLS_ctx.error)), }));
    const __VLS_23 = __VLS_22({ machines: ((__VLS_ctx.machines)), loading: ((__VLS_ctx.loading)), error: ((__VLS_ctx.error)), }, ...__VLS_functionalComponentArgsRest(__VLS_22));
    __VLS_styleScopedClasses['flex'];
    __VLS_styleScopedClasses['flex-col'];
    __VLS_styleScopedClasses['md:flex-row'];
    __VLS_styleScopedClasses['h-screen'];
    __VLS_styleScopedClasses['w-full'];
    __VLS_styleScopedClasses['font-sans'];
    __VLS_styleScopedClasses['flex-1'];
    __VLS_styleScopedClasses['flex'];
    __VLS_styleScopedClasses['flex-col'];
    __VLS_styleScopedClasses['bg-white'];
    __VLS_styleScopedClasses['w-full'];
    __VLS_styleScopedClasses['bg-gray-100'];
    __VLS_styleScopedClasses['border-b'];
    __VLS_styleScopedClasses['md:border-r'];
    __VLS_styleScopedClasses['border-gray-200'];
    __VLS_styleScopedClasses['flex'];
    __VLS_styleScopedClasses['justify-between'];
    __VLS_styleScopedClasses['px-4'];
    __VLS_styleScopedClasses['font-extrabold'];
    __VLS_styleScopedClasses['text-3xl'];
    __VLS_styleScopedClasses['py-5'];
    __VLS_styleScopedClasses['flex'];
    __VLS_styleScopedClasses['bg-slate-300'];
    __VLS_styleScopedClasses['w-full'];
    __VLS_styleScopedClasses['flex'];
    __VLS_styleScopedClasses['justify-center'];
    __VLS_styleScopedClasses['w-1/2'];
    __VLS_styleScopedClasses['py-3'];
    __VLS_styleScopedClasses['px-4'];
    __VLS_styleScopedClasses['text-md'];
    __VLS_styleScopedClasses['hover:bg-slate-400'];
    __VLS_styleScopedClasses['hover:text-slate-700'];
    __VLS_styleScopedClasses['transition-colors'];
    __VLS_styleScopedClasses['bg-slate-600'];
    __VLS_styleScopedClasses['text-white'];
    __VLS_styleScopedClasses['size-6'];
    __VLS_styleScopedClasses['mr-2'];
    __VLS_styleScopedClasses['flex'];
    __VLS_styleScopedClasses['justify-center'];
    __VLS_styleScopedClasses['w-1/2'];
    __VLS_styleScopedClasses['py-3'];
    __VLS_styleScopedClasses['px-4'];
    __VLS_styleScopedClasses['text-md'];
    __VLS_styleScopedClasses['hover:bg-slate-400'];
    __VLS_styleScopedClasses['hover:text-slate-700'];
    __VLS_styleScopedClasses['transition-colors'];
    __VLS_styleScopedClasses['bg-slate-600'];
    __VLS_styleScopedClasses['text-white'];
    __VLS_styleScopedClasses['size-6'];
    __VLS_styleScopedClasses['mr-2'];
    __VLS_styleScopedClasses['flex-1'];
    __VLS_styleScopedClasses['py-4'];
    __VLS_styleScopedClasses['overflow-auto'];
    __VLS_styleScopedClasses['px-8'];
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
            HeaderActions: HeaderActions,
            currentPage: currentPage,
            machines: machines,
            lastUpdated: lastUpdated,
            loading: loading,
            error: error,
        };
    },
});
export default (await import('vue')).defineComponent({
    setup() {
        return {};
    },
});
;
