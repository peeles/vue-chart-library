<template>
  <div
    ref="containerRef"
    class="chart-container"
    :style="containerStyle"
  >
    <svg
      class="chart-svg"
      :class="{ 'chart-svg-loaded': !isLoading }"
      :viewBox="`0 0 ${svgWidth} ${svgHeight}`"
      role="img"
      :aria-label="ariaLabel"
      preserveAspectRatio="xMidYMid meet"
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

    <chart-loading-spinner
      :visible="isLoading"
      :message="loadingMessage"
      :size="loadingSpinnerSize"
    />
  </div>
</template>

<script setup>
import { ref, computed, toRef, watch, onMounted } from 'vue'
import { useChartResize } from '@/composables/useChartResize.js'
import { useChartConfig } from '@/composables/useChartConfig.js'
import { useChartData } from '@/composables/useChartData.js'
import ChartLegend from '@/components/shared/ChartLegend.vue'
import ChartLoadingSpinner from '@/components/shared/ChartLoadingSpinner.vue'

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
  },
  /**
   * Show loading spinner during initial load
   */
  showLoading: {
    type: Boolean,
    default: true
  },
  /**
   * Loading message text
   */
  loadingMessage: {
    type: String,
    default: ''
  },
  /**
   * Loading spinner size
   */
  loadingSpinnerSize: {
    type: Number,
    default: 40
  },
  /**
   * Loading delay in ms before showing spinner
   */
  loadingDelay: {
    type: Number,
    default: 100
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

// Loading state
const isLoading = ref(props.showLoading)
const isResizing = ref(false)
let resizeTimeout = null

// Initial mount - hide loading after first render
onMounted(() => {
  if (props.showLoading) {
    setTimeout(() => {
      isLoading.value = false
    }, props.loadingDelay)
  }
})

// Watch for resize events and show brief loading state
watch([containerWidth, containerHeight], () => {
  if (containerWidth.value > 0 && containerHeight.value > 0 && !isLoading.value) {
    isResizing.value = true
    clearTimeout(resizeTimeout)
    resizeTimeout = setTimeout(() => {
      isResizing.value = false
    }, 150)
  }
})

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
      const calculatedHeight = svgWidth.value / aspectRatio.value
      // If container has explicit height, use the minimum of calculated and container height
      if (containerHeight.value > 0) {
        return Math.min(calculatedHeight, containerHeight.value)
      }
      return calculatedHeight
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
  overflow: hidden;
}

.chart-svg {
  display: block;
  width: 100%;
  height: 100%;
  max-width: 100%;
  max-height: 100%;
  opacity: 0;
  transition: opacity 0.3s ease-in;
}

.chart-svg-loaded {
  opacity: 1;
}
</style>