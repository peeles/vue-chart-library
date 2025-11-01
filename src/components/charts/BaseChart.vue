<template>
  <div
    ref="containerRef"
    class="chart-container"
    :style="containerStyle"
  >
    <svg
      class="chart-svg"
      :viewBox="`0 0 ${svgWidth} ${svgHeight}`"
      :width="svgWidth"
      :height="svgHeight"
      role="img"
      :aria-label="ariaLabel"
    >
      <slot
        :chart-area="chartArea"
        :width="svgWidth"
        :height="svgHeight"
      />
    </svg>

    <chart-legend
      v-if="showLegend && normalizedDatasets.length > 0"
      :datasets="normalizedDatasets"
      :position="legendPosition"
      :interactive="legendInteractive"
      @toggle="handleLegendToggle"
    />
  </div>
</template>

<script setup>
import { ref, computed, toRef } from 'vue'
import { useChartResize } from '@/composables/useChartResize.js'
import { useChartConfig } from '@/composables/useChartConfig.js'
import { useChartData } from '@/composables/useChartData.js'
import ChartLegend from '@/components/shared/ChartLegend.vue'

const props = defineProps({
  /**
   * Chart data
   */
  data: {
    type: Object,
    required: true
  },
  /**
   * Chart options
   */
  options: {
    type: Object,
    default: () => ({})
  },
  /**
   * Chart width (if not responsive)
   */
  width: {
    type: Number,
    default: null
  },
  /**
   * Chart height (if not responsive)
   */
  height: {
    type: Number,
    default: null
  },
  /**
   * Aria label for accessibility
   */
  ariaLabel: {
    type: String,
    default: 'Chart'
  }
})

const emit = defineEmits(['legend-toggle', 'data-click'])

const containerRef = ref(null)

// Use composables
const optionsRef = toRef(props, 'options')
const dataRef = toRef(props, 'data')

const {
  config,
  isResponsive,
  shouldMaintainAspectRatio,
  aspectRatio,
  padding,
  showLegend,
  calculateDimensions,
  calculateChartArea
} = useChartConfig(optionsRef)

const {
  normalizedDatasets,
  isEmpty
} = useChartData(dataRef, optionsRef)

const { width: containerWidth, height: containerHeight } = useChartResize(
  containerRef
)

// Calculate SVG dimensions
const svgWidth = computed(() => {
  if (!isResponsive.value && props.width) {
    return props.width
  }

  if (isResponsive.value && containerWidth.value > 0) {
    const { width } = calculateDimensions(
      containerWidth.value,
      containerHeight.value
    )
    return width
  }

  return 600 // Default width
})

const svgHeight = computed(() => {
  if (!isResponsive.value && props.height) {
    return props.height
  }

  if (isResponsive.value && containerWidth.value > 0) {
    if (shouldMaintainAspectRatio.value) {
      return svgWidth.value / aspectRatio.value
    }
    return containerHeight.value || svgWidth.value / aspectRatio.value
  }

  return 300 // Default height
})

// Calculate chart area (excluding padding)
const chartArea = computed(() => {
  return calculateChartArea(svgWidth.value, svgHeight.value)
})

const containerStyle = computed(() => {
  if (!isResponsive.value) {
    return {
      width: `${props.width}px`,
      height: `${props.height}px`
    }
  }
  return {
    width: '100%',
    height: shouldMaintainAspectRatio.value ? 'auto' : '100%'
  }
})

const legendPosition = computed(() => {
  return config.value.plugins?.legend?.position || 'top'
})

const legendInteractive = computed(() => {
  return config.value.plugins?.legend?.interactive !== false
})

const handleLegendToggle = (event) => {
  emit('legend-toggle', event)
}

// Expose for parent components
defineExpose({
  chartArea,
  svgWidth,
  svgHeight,
  normalizedDatasets,
  isEmpty
})
</script>

<style scoped>
.chart-container {
  position: relative;
  width: 100%;
  height: 100%;
}

.chart-svg {
  display: block;
}
</style>