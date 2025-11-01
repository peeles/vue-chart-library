# BarChart Component Documentation

A fully responsive and customisable bar chart component for Vue 3 with a Chart.js-like API.

## Features

- ✅ **Responsive** - Automatically adapts to container size
- ✅ **Interactive** - Hover tooltips and click events
- ✅ **Customisable** - Full control over colours, spacing, and appearance
- ✅ **Accessible** - ARIA labels and keyboard navigation
- ✅ **Multiple Datasets** - Support for comparing multiple data series
- ✅ **SVG-based** - Scalable and performant rendering
- ✅ **60fps animations** - Smooth transitions and interactions
- ✅ **Loading States** - Built-in loading spinner with customisable messages

## Installation

```bash
npm install @vue-charts/core
```

## Basic Usage

```vue
<template>
  <div style="width: 100%; height: 400px;">
    <bar-chart :data="chartData" :options="chartOptions" />
  </div>
</template>

<script setup>
import { BarChart } from '@vue-charts/core'
import '@vue-charts/core/style.css'

const chartData = {
  labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
  datasets: [{
    label: 'Sales 2024',
    data: [12, 19, 3, 5, 2, 8],
    backgroundColor: '#3b82f6',
    borderColor: '#2563eb',
    borderWidth: 2
  }]
}

const chartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  scales: {
    y: {
      beginAtZero: true
    }
  }
}
</script>
```

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `data` | `Object` | **required** | Chart data including labels and datasets |
| `options` | `Object` | `{}` | Chart configuration options |
| `width` | `Number` | `null` | Fixed width (only when responsive is false) |
| `height` | `Number` | `null` | Fixed height (only when responsive is false) |
| `showLoading` | `Boolean` | `true` | Display loading spinner during initial render |
| `loadingMessage` | `String` | `''` | Custom loading message text |
| `loadingSpinnerSize` | `Number` | `40` | Loading spinner size in pixels |
| `loadingDelay` | `Number` | `100` | Delay before hiding spinner (milliseconds) |

## Data Structure

### ChartData Object

```typescript
{
  labels: string[]           // X-axis labels
  datasets: Dataset[]        // Array of datasets
}
```

### Dataset Object

```typescript
{
  label: string                      // Dataset label (for legend)
  data: number[]                     // Data values
  backgroundColor: string | string[] // Bar background colour(s)
  borderColor?: string | string[]    // Bar border colour(s)
  borderWidth?: number               // Border width (default: 0)
}
```

## Configuration Options

### Responsive Behavior

```javascript
{
  responsive: true,              // Auto-resize to container
  maintainAspectRatio: true,    // Keep aspect ratio on resize
  aspectRatio: 2                // Width to height ratio (default: 2)
}
```

### Padding

```javascript
{
  padding: {
    top: 20,      // Top padding in pixels
    right: 20,    // Right padding in pixels
    bottom: 40,   // Bottom padding in pixels
    left: 50      // Left padding in pixels
  }
}
```

### Scales Configuration

```javascript
{
  scales: {
    x: {
      display: true,           // Show x-axis
      grid: {
        display: true,         // Show vertical grid lines
        color: '#e5e7eb'       // Grid line colour
      },
      ticks: {
        display: true,         // Show x-axis labels
        color: '#6b7280'       // Label colour
      }
    },
    y: {
      display: true,           // Show y-axis
      beginAtZero: true,       // Start y-axis at zero
      grid: {
        display: true,         // Show horizontal grid lines
        color: '#e5e7eb'       // Grid line colour
      },
      ticks: {
        display: true,         // Show y-axis labels
        color: '#6b7280'       // Label colour
      }
    }
  }
}
```

### Plugins Configuration

```javascript
{
  plugins: {
    legend: {
      display: true,           // Show legend
      position: 'top',         // Legend position: 'top', 'bottom', 'left', 'right'
      interactive: true        // Allow toggling datasets
    },
    tooltip: {
      enabled: true,           // Enable hover tooltips
      mode: 'index'           // Tooltip mode
    }
  }
}
```

## Events

### @bar-click

Emitted when a bar is clicked.

```vue
<bar-chart
  :data="chartData"
  @bar-click="handleBarClick"
/>
```

**Event Payload:**
```javascript
{
  label: string,        // X-axis label
  value: number,        // Bar value
  datasetIndex: number  // Dataset index
}
```

**Example:**
```javascript
function handleBarClick(event) {
  console.log(`Clicked ${event.label}: ${event.value}`)
}
```

### @legend-toggle

Emitted when a legend item is toggled (if legend is interactive).

```vue
<bar-chart
  :data="chartData"
  @legend-toggle="handleLegendToggle"
/>
```

**Event Payload:**
```javascript
{
  index: number,    // Dataset index
  disabled: boolean // New disabled state
}
```

## Examples

### Single Dataset

```vue
<template>
  <bar-chart :data="data" />
</template>

<script setup>
const data = {
  labels: ['Q1', 'Q2', 'Q3', 'Q4'],
  datasets: [{
    label: 'Revenue',
    data: [45000, 52000, 48000, 67000],
    backgroundColor: '#3b82f6'
  }]
}
</script>
```

### Multiple Datasets

```vue
<template>
  <bar-chart :data="data" />
</template>

<script setup>
const data = {
  labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
  datasets: [
    {
      label: '2024',
      data: [12, 19, 3, 5, 2, 8],
      backgroundColor: '#3b82f6'
    },
    {
      label: '2023',
      data: [7, 11, 5, 8, 3, 7],
      backgroundColor: '#8b5cf6'
    }
  ]
}
</script>
```

### Custom Colours Per Bar

```vue
<template>
  <bar-chart :data="data" :options="options" />
</template>

<script setup>
const data = {
  labels: ['North', 'South', 'East', 'West', 'Central'],
  datasets: [{
    label: 'Regional Sales',
    data: [85, 92, 78, 88, 95],
    backgroundColor: ['#ef4444', '#f59e0b', '#10b981', '#3b82f6', '#8b5cf6']
  }]
}

const options = {
  plugins: {
    legend: { display: false }
  }
}
</script>
```

### Interactive with Dynamic Data

```vue
<template>
  <div>
    <button @click="randomiseData">Randomise</button>
    <bar-chart
      :data="chartData"
      @bar-click="handleClick"
    />
  </div>
</template>

<script setup>
import { ref } from 'vue'

const chartData = ref({
  labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'],
  datasets: [{
    label: 'Views',
    data: [120, 190, 130, 150, 220],
    backgroundColor: '#3b82f6'
  }]
})

function randomiseData() {
  chartData.value = {
    ...chartData.value,
    datasets: [{
      ...chartData.value.datasets[0],
      data: Array.from({ length: 5 }, () => Math.floor(Math.random() * 300))
    }]
  }
}

function handleClick(event) {
  console.log('Clicked:', event)
}
</script>
```

### No Grid Lines

```vue
<template>
  <bar-chart :data="data" :options="options" />
</template>

<script setup>
const data = {
  labels: ['A', 'B', 'C', 'D'],
  datasets: [{
    label: 'Values',
    data: [10, 20, 15, 25],
    backgroundColor: '#10b981'
  }]
}

const options = {
  scales: {
    x: { grid: { display: false } },
    y: { grid: { display: false } }
  }
}
</script>
```

## Styling with CSS Variables

Customise the chart appearance using CSS variables:

```css
:root {
  --chart-primary: #3b82f6;
  --chart-grid-color: #e5e7eb;
  --chart-axis-color: #6b7280;
  --chart-text-color: #374151;
  --chart-tooltip-bg: rgba(0, 0, 0, 0.8);
  --chart-tooltip-text: #ffffff;
}
```

## Accessibility

The BarChart component follows accessibility best practices:

- **ARIA labels** on all interactive elements
- **Keyboard navigation** support for interactive elements
- **Screen reader** compatibility with proper role attributes
- **High contrast** mode support via CSS variables
- **Semantic SVG** structure with descriptive titles

## Performance

The component is optimised for performance:

- **60fps animations** using `requestAnimationFrame`
- **Debounced resize** handling (16ms) for smooth responsive behaviour
- **Efficient SVG rendering** for scalability
- **Minimal re-renders** with Vue's reactivity system
- Tested with **50+ data points** without performance degradation

## Browser Support

- Chrome/Edge 90+
- Firefox 88+
- Safari 14+
- Mobile browsers (iOS 14+, Android Chrome)

## Testing

All stories include explicit test cases covering:

- ✓ Rendering without errors
- ✓ Data accuracy
- ✓ Responsive behaviour
- ✓ Event handling
- ✓ Edge cases (empty data, negative values, large datasets)
- ✓ Performance metrics
- ✓ Accessibility compliance

## Storybook Stories

View the interactive Storybook stories to see:

1. **Default** - Basic single dataset chart
2. **Multiple Datasets** - Year-over-year comparison
3. **No Grid Lines** - Minimalist styling
4. **Custom Colours** - Per-bar colour customisation
5. **Interactive** - Click events and dynamic updates
6. **Small Data** - Edge case with minimal data points
7. **Large Dataset** - Performance test with 50+ points
8. **Empty State** - Handling zero values
9. **Negative Values** - Support for negative data
10. **Fixed Size** - Non-responsive chart
11. **With Loading Spinner** - Loading states and spinner customisation

Run Storybook:
```bash
npm run storybook
```

Then navigate to `Charts/BarChart` in the sidebar and select any story from the Canvas view.
