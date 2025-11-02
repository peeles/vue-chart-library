<template>
    <div
        v-if="visible"
        aria-label="Loading chart"
        aria-live="polite"
        class="absolute inset-0 flex items-center justify-center bg-white/90 z-[100] rounded-[inherit] transition-opacity duration-200 ease-linear"
        role="status"
    >
        <div class="flex flex-col items-center gap-3">
            <svg
                :height="size"
                :width="size"
                class="spinner"
                viewBox="0 0 50 50"
            >
                <circle
                    class="spinner-track"
                    cx="25"
                    cy="25"
                    fill="none"
                    r="20"
                    stroke-width="4"
                />
                <circle
                    class="spinner-circle"
                    cx="25"
                    cy="25"
                    fill="none"
                    r="20"
                    stroke-linecap="round"
                    stroke-width="4"
                />
            </svg>
            <span v-if="message" class="text-sm font-medium text-gray-700 tracking-tight">{{ message }}</span>
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

<style>
/* Spinner rotation and dash animations */
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
