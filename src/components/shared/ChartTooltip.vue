<template>
    <div
        v-if="visible && tooltipData"
        ref="tooltipRef"
        :style="tooltipStyle"
        class="chart-tooltip fixed px-4 py-3 rounded-lg text-[0.8125rem] z-[1000] transition-all duration-150 ease-in-out -translate-y-0.5 max-w-[280px] min-w-[120px]"
        role="tooltip"
    >
        <div
            v-if="tooltipData.title"
            class="font-semibold mb-2.5 pb-2 border-b border-white/15 text-sm tracking-tight text-white/95"
        >
            {{ tooltipData.title }}
        </div>
        <div
            v-for="(item, index) in tooltipData.items"
            :key="index"
            class="flex items-center gap-2.5 py-1.5 leading-[1.3] first:pt-0 last:pb-0"
        >
            <span
                v-if="item.color"
                :style="{ backgroundColor: item.color }"
                class="w-2.5 h-2.5 rounded-sm flex-shrink-0 shadow-sm"
            ></span>
            <span class="font-medium text-white/85 flex-shrink-0">{{ item.label }}:</span>
            <span class="ml-auto font-bold text-white tabular-nums tracking-tight">{{ item.value }}</span>
        </div>
    </div>
</template>

<script setup>
import { computed, ref, watch } from 'vue'

const props = defineProps({
    /**
     * Whether tooltip is visible
     */
    visible: {
        type: Boolean,
        default: false
    },
    /**
     * Tooltip data
     */
    tooltipData: {
        type: Object,
        default: null
    },
    /**
     * X position
     */
    x: {
        type: Number,
        default: 0
    },
    /**
     * Y position
     */
    y: {
        type: Number,
        default: 0
    }
})

const tooltipRef = ref(null)

const tooltipStyle = computed(() => ({
    left: `${props.x}px`,
    top: `${props.y}px`,
    opacity: props.visible ? 1 : 0,
    pointerEvents: 'none'
}))

// Adjust position if tooltip goes off screen
watch(() => [props.visible, props.x, props.y], () => {
    if (!props.visible || !tooltipRef.value) return

    setTimeout(() => {
        if (!tooltipRef.value) return

        const rect = tooltipRef.value.getBoundingClientRect()
        const padding = 10

        // Adjust horizontal position
        if (rect.right > window.innerWidth - padding) {
            tooltipRef.value.style.left = `${props.x - rect.width - padding}px`
        }

        // Adjust vertical position
        if (rect.bottom > window.innerHeight - padding) {
            tooltipRef.value.style.top = `${props.y - rect.height - padding}px`
        }
    }, 0)
})
</script>

<style>
/* Tooltip with gradient background and animations */
.chart-tooltip {
    background: linear-gradient(135deg, rgba(17, 24, 39, 0.97) 0%, rgba(31, 41, 55, 0.97) 100%);
    backdrop-filter: blur(12px);
    color: var(--chart-tooltip-text, #ffffff);
    box-shadow:
        0 10px 15px -3px rgba(0, 0, 0, 0.3),
        0 4px 6px -2px rgba(0, 0, 0, 0.2),
        0 0 0 1px rgba(255, 255, 255, 0.1) inset;
}

.chart-tooltip[style*="opacity: 1"] {
    animation: tooltipFadeIn 0.15s ease-out;
}

@keyframes tooltipFadeIn {
    from {
        opacity: 0;
        transform: translateY(4px) scale(0.95);
    }
    to {
        opacity: 1;
        transform: translateY(-2px) scale(1);
    }
}
</style>
