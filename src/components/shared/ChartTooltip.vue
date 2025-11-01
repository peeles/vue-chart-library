<template>
    <div
        v-if="visible && tooltipData"
        ref="tooltipRef"
        :style="tooltipStyle"
        class="chart-tooltip"
        role="tooltip"
    >
        <div
            v-if="tooltipData.title"
            class="tooltip-title"
        >
            {{ tooltipData.title }}
        </div>
        <div
            v-for="(item, index) in tooltipData.items"
            :key="index"
            class="tooltip-item"
        >
            <span
                v-if="item.color"
                :style="{ backgroundColor: item.color }"
                class="tooltip-marker"
            ></span>
            <span class="tooltip-label">{{ item.label }}:</span>
            <span class="tooltip-value">{{ item.value }}</span>
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

<style scoped>
.chart-tooltip {
    position: fixed;
    background: linear-gradient(135deg, rgba(17, 24, 39, 0.97) 0%, rgba(31, 41, 55, 0.97) 100%);
    backdrop-filter: blur(12px);
    color: var(--chart-tooltip-text, #ffffff);
    padding: 0.75rem 1rem;
    border-radius: 0.5rem;
    font-size: 0.8125rem;
    box-shadow:
        0 10px 15px -3px rgba(0, 0, 0, 0.3),
        0 4px 6px -2px rgba(0, 0, 0, 0.2),
        0 0 0 1px rgba(255, 255, 255, 0.1) inset;
    z-index: 1000;
    transition: opacity 0.15s ease-in-out, transform 0.15s ease-in-out;
    transform: translateY(-2px);
    max-width: 280px;
    min-width: 120px;
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

.tooltip-title {
    font-weight: 600;
    margin-bottom: 0.625rem;
    padding-bottom: 0.5rem;
    border-bottom: 1px solid rgba(255, 255, 255, 0.15);
    font-size: 0.875rem;
    letter-spacing: -0.01em;
    color: rgba(255, 255, 255, 0.95);
}

.tooltip-item {
    display: flex;
    align-items: center;
    gap: 0.625rem;
    padding: 0.375rem 0;
    line-height: 1.3;
}

.tooltip-item:first-of-type {
    padding-top: 0;
}

.tooltip-item:last-of-type {
    padding-bottom: 0;
}

.tooltip-marker {
    width: 0.625rem;
    height: 0.625rem;
    border-radius: 0.125rem;
    flex-shrink: 0;
    box-shadow: 0 1px 2px rgba(0, 0, 0, 0.2);
}

.tooltip-label {
    font-weight: 500;
    color: rgba(255, 255, 255, 0.85);
    flex-shrink: 0;
}

.tooltip-value {
    margin-left: auto;
    font-weight: 700;
    color: rgba(255, 255, 255, 1);
    font-variant-numeric: tabular-nums;
    letter-spacing: -0.02em;
}
</style>
