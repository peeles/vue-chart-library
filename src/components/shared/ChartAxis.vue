<template>
  <g
    :class="`chart-axis chart-axis-${axis}`"
    role="img"
    :aria-label="`${axis.toUpperCase()} axis`"
  >
    <!-- Axis line -->
    <line
      v-if="showLine"
      :x1="axisLine.x1"
      :y1="axisLine.y1"
      :x2="axisLine.x2"
      :y2="axisLine.y2"
      :stroke="gridColor"
      stroke-width="2"
    />

    <!-- Grid lines and ticks -->
    <g
      v-for="(tick, index) in ticks"
      :key="index"
      class="axis-tick"
    >
      <!-- Grid line -->
      <line
        v-if="showGrid"
        :x1="tick.gridLine.x1"
        :y1="tick.gridLine.y1"
        :x2="tick.gridLine.x2"
        :y2="tick.gridLine.y2"
        :stroke="gridColor"
        stroke-width="1"
        opacity="0.3"
      />

      <!-- Tick mark -->
      <line
        v-if="showTicks"
        :x1="tick.tickMark.x1"
        :y1="tick.tickMark.y1"
        :x2="tick.tickMark.x2"
        :y2="tick.tickMark.y2"
        :stroke="axisColor"
        stroke-width="1"
      />

      <!-- Label -->
      <text
        v-if="showLabels"
        :x="tick.label.x"
        :y="tick.label.y"
        :text-anchor="tick.label.textAnchor"
        :dominant-baseline="tick.label.dominantBaseline"
        :fill="axisColor"
        font-size="12"
        class="axis-label"
      >
        {{ tick.label.text }}
      </text>
    </g>
  </g>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  /**
   * Axis type: 'x' or 'y'
   */
  axis: {
    type: String,
    required: true,
    validator: (value) => ['x', 'y'].includes(value)
  },
  /**
   * Tick values and labels
   */
  ticks: {
    type: Array,
    default: () => []
  },
  /**
   * Chart area dimensions
   */
  chartArea: {
    type: Object,
    required: true
  },
  /**
   * Show grid lines
   */
  showGrid: {
    type: Boolean,
    default: true
  },
  /**
   * Show axis line
   */
  showLine: {
    type: Boolean,
    default: true
  },
  /**
   * Show tick marks
   */
  showTicks: {
    type: Boolean,
    default: true
  },
  /**
   * Show labels
   */
  showLabels: {
    type: Boolean,
    default: true
  },
  /**
   * Grid color
   */
  gridColor: {
    type: String,
    default: 'var(--chart-grid-color, #e5e7eb)'
  },
  /**
   * Axis color
   */
  axisColor: {
    type: String,
    default: 'var(--chart-axis-color, #6b7280)'
  }
})

const axisLine = computed(() => {
  const { x, y, width, height } = props.chartArea

  if (props.axis === 'x') {
    return {
      x1: x,
      y1: y + height,
      x2: x + width,
      y2: y + height
    }
  } else {
    return {
      x1: x,
      y1: y,
      x2: x,
      y2: y + height
    }
  }
})
</script>

<style scoped>
.axis-label {
  font-family: var(--chart-font-family, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif),serif;
  user-select: none;
}
</style>
