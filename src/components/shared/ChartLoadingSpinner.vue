<template>
  <div
    v-if="visible"
    class="chart-loading-overlay"
    role="status"
    aria-live="polite"
    aria-label="Loading chart"
  >
    <div class="spinner-container">
      <svg
        class="spinner"
        viewBox="0 0 50 50"
        :width="size"
        :height="size"
      >
        <circle
          class="spinner-track"
          cx="25"
          cy="25"
          r="20"
          fill="none"
          stroke-width="4"
        />
        <circle
          class="spinner-circle"
          cx="25"
          cy="25"
          r="20"
          fill="none"
          stroke-width="4"
          stroke-linecap="round"
        />
      </svg>
      <span v-if="message" class="spinner-message">{{ message }}</span>
    </div>
  </div>
</template>

<script setup>
defineProps({
  /**
   * Whether spinner is visible
   */
  visible: {
    type: Boolean,
    default: false
  },
  /**
   * Loading message
   */
  message: {
    type: String,
    default: ''
  },
  /**
   * Spinner size in pixels
   */
  size: {
    type: Number,
    default: 40
  },
  /**
   * Overlay opacity
   */
  opacity: {
    type: Number,
    default: 0.9
  }
})
</script>

<style scoped>
.chart-loading-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--chart-loading-bg, rgba(255, 255, 255, v-bind(opacity)));
  z-index: 100;
  border-radius: inherit;
  transition: opacity 0.2s ease;
}

.spinner-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.75rem;
}

.spinner {
  animation: rotate 1.4s linear infinite;
  transform-origin: center;
}

.spinner-track {
  stroke: var(--chart-spinner-track, rgba(59, 130, 246, 0.2));
}

.spinner-circle {
  stroke: var(--chart-spinner-color, #3b82f6);
  stroke-dasharray: 80, 200;
  stroke-dashoffset: 0;
  animation: dash 1.4s ease-in-out infinite;
}

.spinner-message {
  font-size: 0.875rem;
  font-weight: 500;
  color: var(--chart-text-color, #374151);
  letter-spacing: -0.01em;
}

@keyframes rotate {
  100% {
    transform: rotate(360deg);
  }
}

@keyframes dash {
  0% {
    stroke-dasharray: 1, 200;
    stroke-dashoffset: 0;
  }
  50% {
    stroke-dasharray: 100, 200;
    stroke-dashoffset: -50;
  }
  100% {
    stroke-dasharray: 100, 200;
    stroke-dashoffset: -150;
  }
}
</style>
