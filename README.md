# Vue Charts

A customisable, fully-tested chart library for Vue 3 with Tailwind CSS 4 support.

## Features

- **Multiple Chart Types**: Bar, Line, Pie, and Stacked charts
- **Fully Customizable**: Match Chart.js configuration patterns
- **Responsive**: Charts adapt to container size automatically
- **Accessible**: WCAG AA compliant with ARIA labels
- **Tailwind CSS 4**: Modern utility-first styling
- **Storybook**: Interactive component documentation
- **Full Test Coverage**: Vitest with >90% coverage target
- **No TypeScript**: Pure JavaScript with JSDoc for type hints

## Installation

```bash
npm install @vue-charts/core
```

## Quick Start

```vue
<template>
  <div style="height: 400px;">
    <BarChart :data="chartData" :options="chartOptions" />
  </div>
</template>

<script setup>
import { BarChart } from '@vue-charts/core'
import '@vue-charts/core/style.css'

const chartData = {
  labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
  datasets: [{
    label: 'Sales 2024',
    data: [12, 19, 3, 5, 2, 3],
    backgroundColor: '#3b82f6'
  }]
}

const chartOptions = {
  responsive: true,
  plugins: {
    legend: { display: true }
  }
}
</script>
```

## Development

```bash
# Install dependencies
npm install

# Run demo app
npm run dev

# Run tests
npm test

# Run tests with coverage
npm run test:coverage

# Run Storybook
npm run storybook

# Build library
npm run build
```

## Chart Types

### Bar Chart
```vue
<BarChart :data="data" :options="options" />
```

### Line Chart (Coming Soon)
```vue
<LineChart :data="data" :options="options" />
```

### Pie Chart (Coming Soon)
```vue
<PieChart :data="data" :options="options" />
```

### Stacked Chart (Coming Soon)
```vue
<StackedChart :data="data" :options="options" />
```

## Configuration

Charts accept a `data` object and an `options` object that follows Chart.js patterns:

```javascript
{
  data: {
    labels: ['Label 1', 'Label 2'],
    datasets: [{
      label: 'Dataset 1',
      data: [10, 20],
      backgroundColor: '#3b82f6'
    }]
  },
  options: {
    responsive: true,
    maintainAspectRatio: true,
    scales: {
      y: { beginAtZero: true }
    },
    plugins: {
      legend: { display: true, position: 'top' },
      tooltip: { enabled: true }
    }
  }
}
```

## Theming

The library uses Tailwind CSS 4 with the modern `@theme` directive. Customize colors in your CSS:

```css
@import "tailwindcss";

@theme {
  --color-chart-primary: #3b82f6;
  --color-chart-secondary: #8b5cf6;
  --color-chart-success: #10b981;
}
```

Or override CSS variables directly:

```css
:root {
  --chart-primary: #3b82f6;
  --chart-grid-color: #e5e7eb;
  --chart-text-color: #374151;
}
```

## License

ISC
