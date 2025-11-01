// Chart components
export { default as BarChart } from './components/charts/BarChart.vue'
export { default as StackedChart } from './components/charts/StackedChart.vue'
export { default as LineChart } from './components/charts/LineChart.vue'
export { default as PieChart } from './components/charts/PieChart.vue'

// Shared components
export { default as ChartLegend } from './components/shared/ChartLegend.vue'
export { default as ChartTooltip } from './components/shared/ChartTooltip.vue'
export { default as ChartAxis } from './components/shared/ChartAxis.vue'
export { default as ChartLoadingSpinner } from './components/shared/ChartLoadingSpinner.vue'

// Composable
export { useChartResize } from './composables/useChartResize.js'
export { useChartData } from './composables/useChartData.js'
export { useChartConfig } from './composables/useChartConfig.js'
export { useChartScale } from './composables/useChartScale.js'

// Utilities
export * from './utils/validators.js'
export * from './utils/colourUtils.js'
export * from './utils/chartCalculations.js'

// Styles
import './styles/main.css'

// FontAwesome plugin
export { default as installFontAwesome } from './plugins/fontawesome.js'
