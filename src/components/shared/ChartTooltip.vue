<template>
  <div
    v-if="visible && tooltipData"
    ref="tooltipRef"
    class="chart-tooltip"
    :style="tooltipStyle"
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
        class="tooltip-marker"
        :style="{ backgroundColor: item.color }"
      ></span>
      <span class="tooltip-label">{{ item.label }}:</span>
      <span class="tooltip-value">{{ item.value }}</span>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue'

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
  background-color: var(--chart-tooltip-bg, rgba(0, 0, 0, 0.8));
  color: var(--chart-tooltip-text, #ffffff);
  padding: 0.75rem;
  border-radius: 0.375rem;
  font-size: 0.875rem;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
  z-index: 1000;
  transition: opacity 0.2s;
  max-width: 250px;
}

.tooltip-title {
  font-weight: 600;
  margin-bottom: 0.5rem;
  padding-bottom: 0.5rem;
  border-bottom: 1px solid rgba(255, 255, 255, 0.2);
}

.tooltip-item {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.25rem 0;
}

.tooltip-marker {
  width: 0.75rem;
  height: 0.75rem;
  border-radius: 0.125rem;
  flex-shrink: 0;
}

.tooltip-label {
  font-weight: 500;
}

.tooltip-value {
  margin-left: auto;
  font-weight: 600;
}
</style>