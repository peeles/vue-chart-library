<template>
    <div
        v-if="datasets.length > 0"
        :class="legendClasses"
        class="flex flex-wrap gap-4 py-3 px-2"
    >
        <div
            v-for="(dataset, index) in datasets"
            :key="index"
            :aria-label="`Toggle ${dataset.label}`"
            :aria-pressed="!isDisabled(index)"
            :class="{ 'opacity-40': isDisabled(index), 'legend-item-interactive': props.interactive }"
            class="legend-item flex items-center gap-2.5 px-3 py-2 text-sm font-medium text-gray-700 transition-all duration-200 ease-linear rounded-lg"
            role="button"
            tabindex="0"
            @click="toggleDataset(index)"
            @keydown.enter="toggleDataset(index)"
        >
            <span
                :style="{ backgroundColor: dataset.backgroundColor }"
                :class="{ 'opacity-30': isDisabled(index) }"
                class="legend-marker w-3.5 h-3.5 rounded flex-shrink-0 shadow-sm transition-all duration-200 ease-linear"
            ></span>
            <span :class="{ 'line-through': isDisabled(index) }" class="whitespace-nowrap tracking-tight">{{ dataset.label }}</span>
        </div>
    </div>
</template>

<script setup>
import { computed, ref } from 'vue'

const props = defineProps({
    /**
     * Array of datasets to display
     */
    datasets: {
        type: Array,
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

const legendClasses = computed(() => {
    const positionClasses = {
        top: 'flex-row justify-center',
        bottom: 'flex-row justify-center',
        left: 'flex-col justify-start',
        right: 'flex-col justify-start'
    }

    return positionClasses[props.position] || 'flex-row justify-center'
})

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

<style>
/* Interactive legend item states */
.legend-item-interactive {
    cursor: pointer;
    user-select: none;
}

.legend-item-interactive:hover {
    background-color: rgba(0, 0, 0, 0.03);
    transform: translateY(-1px);
}

.legend-item-interactive:active {
    transform: translateY(0);
}

.legend-item-interactive:focus {
    outline: 2px solid var(--chart-primary, #3b82f6);
    outline-offset: 2px;
    background-color: rgba(59, 130, 246, 0.05);
}

.legend-item-interactive:hover .legend-marker {
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.15);
    transform: scale(1.1);
}
</style>
