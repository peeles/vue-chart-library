<template>
  <div
    v-if="datasets.length > 0"
    class="chart-legend"
    :class="legendClasses"
  >
    <div
      v-for="(dataset, index) in datasets"
      :key="index"
      class="legend-item"
      :class="{ 'legend-item-disabled': isDisabled(index) }"
      @click="toggleDataset(index)"
      @keydown.enter="toggleDataset(index)"
      tabindex="0"
      role="button"
      :aria-pressed="!isDisabled(index)"
      :aria-label="`Toggle ${dataset.label}`"
    >
      <span
        class="legend-marker"
        :style="{ backgroundColor: dataset.backgroundColor }"
      />
      <span class="legend-label">{{ dataset.label }}</span>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'

const props = defineProps({
  /**
   * Array of datasets to display
   */
  datasets: {
    type: Array,
    required: true,
    default: () => []
  },
  /**
   * Legend position: 'top', 'bottom', 'left', 'right'
   */
  position: {
    type: String,
    default: 'top',
    validator: (value) => ['top', 'bottom', 'left', 'right'].includes(value)
  },
  /**
   * Allow toggling datasets on/off
   */
  interactive: {
    type: Boolean,
    default: true
  }
})

const emit = defineEmits(['toggle'])

const disabledDatasets = ref(new Set())

const legendClasses = computed(() => ({
  [`legend-${props.position}`]: true,
  'legend-interactive': props.interactive
}))

const isDisabled = (index) => {
  return disabledDatasets.value.has(index)
}

const toggleDataset = (index) => {
  if (!props.interactive) return

  if (disabledDatasets.value.has(index)) {
    disabledDatasets.value.delete(index)
  } else {
    disabledDatasets.value.add(index)
  }

  emit('toggle', {
    index,
    disabled: disabledDatasets.value.has(index)
  })
}
</script>

<style scoped>
.chart-legend {
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
  padding: 0.75rem 0.5rem;
}

.legend-top,
.legend-bottom {
  flex-direction: row;
  justify-content: center;
}

.legend-left,
.legend-right {
  flex-direction: column;
  justify-content: flex-start;
}

.legend-item {
  display: flex;
  align-items: center;
  gap: 0.625rem;
  padding: 0.5rem 0.75rem;
  font-size: 0.875rem;
  font-weight: 500;
  color: var(--chart-text-color, #374151);
  transition: all 0.2s ease;
  border-radius: 0.5rem;
}

.legend-interactive .legend-item {
  cursor: pointer;
  user-select: none;
}

.legend-interactive .legend-item:hover {
  background-color: rgba(0, 0, 0, 0.03);
  transform: translateY(-1px);
}

.legend-interactive .legend-item:active {
  transform: translateY(0);
}

.legend-interactive .legend-item:focus {
  outline: 2px solid var(--chart-primary, #3b82f6);
  outline-offset: 2px;
  background-color: rgba(59, 130, 246, 0.05);
}

.legend-item-disabled {
  opacity: 0.4;
}

.legend-item-disabled .legend-marker {
  opacity: 0.3;
}

.legend-item-disabled .legend-label {
  text-decoration: line-through;
}

.legend-marker {
  width: 0.875rem;
  height: 0.875rem;
  border-radius: 0.25rem;
  flex-shrink: 0;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
  transition: all 0.2s ease;
}

.legend-interactive .legend-item:hover .legend-marker {
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.15);
  transform: scale(1.1);
}

.legend-label {
  white-space: nowrap;
  letter-spacing: -0.01em;
}
</style>