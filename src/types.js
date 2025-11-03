/**
 * @file Central type definitions for the vue-charts library
 * These types are used throughout the codebase for JSDoc documentation
 */

/**
 * Dataset object containing chart data and styling
 * @typedef {Object} Dataset
 * @property {string} [label] - Dataset label for legend
 * @property {number[]} data - Array of numeric data points
 * @property {string} [backgroundColor] - Background color (hex, rgb, rgba)
 * @property {string} [borderColor] - Border color (hex, rgb, rgba)
 * @property {number} [borderWidth=1] - Border width in pixels
 * @property {boolean} [hidden=false] - Whether dataset is hidden
 * @property {number} [tension=0] - Line tension for line charts (0-1)
 * @property {boolean} [fill=false] - Whether to fill area under line
 * @property {string} [pointStyle='circle'] - Point style for line charts
 * @property {number} [pointRadius=3] - Point radius for line charts
 */

/**
 * Chart data structure following Chart.js pattern
 * @typedef {Object} ChartData
 * @property {string[]} labels - Array of labels for data points
 * @property {Dataset[]} datasets - Array of dataset objects
 */

/**
 * Scale tick configuration
 * @typedef {Object} ScaleTicks
 * @property {boolean} [display=true] - Whether to display ticks
 * @property {string} [color='#666'] - Tick label color
 * @property {number} [font.size=12] - Font size for tick labels
 * @property {Function} [callback] - Callback function to format tick values
 * @property {number} [maxTicksLimit] - Maximum number of ticks
 * @property {number} [stepSize] - Fixed step size between ticks
 */

/**
 * Scale grid configuration
 * @typedef {Object} ScaleGrid
 * @property {boolean} [display=true] - Whether to display grid lines
 * @property {string} [color='rgba(0,0,0,0.1)'] - Grid line color
 * @property {number} [lineWidth=1] - Grid line width
 * @property {boolean} [drawBorder=true] - Whether to draw border
 * @property {boolean} [drawOnChartArea=true] - Whether to draw on chart area
 * @property {boolean} [drawTicks=true] - Whether to draw tick marks
 */

/**
 * Scale configuration
 * @typedef {Object} ScaleConfig
 * @property {boolean} [display=true] - Whether to display the axis
 * @property {string} [type='linear'] - Scale type (linear, logarithmic, time, category)
 * @property {boolean} [beginAtZero=false] - Whether to start at zero
 * @property {number} [min] - Minimum value for scale
 * @property {number} [max] - Maximum value for scale
 * @property {ScaleTicks} [ticks] - Tick configuration
 * @property {ScaleGrid} [grid] - Grid configuration
 * @property {string} [position='left'] - Axis position (left, right, top, bottom)
 * @property {string} [title.display=false] - Whether to show axis title
 * @property {string} [title.text] - Axis title text
 */

/**
 * Scales configuration object
 * @typedef {Object} ScalesConfig
 * @property {ScaleConfig} [x] - X-axis configuration
 * @property {ScaleConfig} [y] - Y-axis configuration
 */

/**
 * Legend configuration
 * @typedef {Object} LegendConfig
 * @property {boolean} [display=true] - Whether to display legend
 * @property {string} [position='top'] - Legend position (top, bottom, left, right)
 * @property {string} [align='center'] - Legend alignment (start, center, end)
 * @property {boolean} [reverse=false] - Whether to reverse legend items
 * @property {Object} [labels] - Legend label configuration
 * @property {number} [labels.padding=10] - Padding between legend items
 * @property {number} [labels.fontSize=12] - Font size for labels
 * @property {string} [labels.fontColor='#666'] - Font color for labels
 */

/**
 * Tooltip configuration
 * @typedef {Object} TooltipConfig
 * @property {boolean} [enabled=true] - Whether tooltips are enabled
 * @property {string} [mode='nearest'] - Tooltip mode (point, nearest, index, dataset)
 * @property {boolean} [intersect=true] - Whether tooltip requires intersection
 * @property {string} [backgroundColor='rgba(0,0,0,0.8)'] - Tooltip background color
 * @property {string} [titleColor='#fff'] - Title text color
 * @property {string} [bodyColor='#fff'] - Body text color
 * @property {number} [borderWidth=0] - Border width
 * @property {string} [borderColor='rgba(0,0,0,0)'] - Border color
 * @property {number} [padding=6] - Internal padding
 * @property {Function} [callbacks.label] - Callback to format tooltip labels
 * @property {Function} [callbacks.title] - Callback to format tooltip title
 */

/**
 * Plugin configuration
 * @typedef {Object} PluginConfig
 * @property {LegendConfig} [legend] - Legend configuration
 * @property {TooltipConfig} [tooltip] - Tooltip configuration
 * @property {Object} [title] - Title plugin configuration
 * @property {boolean} [title.display=false] - Whether to display title
 * @property {string} [title.text] - Title text
 */

/**
 * Chart options configuration
 * @typedef {Object} ChartOptions
 * @property {boolean} [responsive=true] - Whether chart is responsive
 * @property {boolean} [maintainAspectRatio=true] - Whether to maintain aspect ratio
 * @property {number} [aspectRatio=2] - Aspect ratio (width/height)
 * @property {ScalesConfig} [scales] - Scales configuration
 * @property {PluginConfig} [plugins] - Plugin configuration
 * @property {string[]} [colors] - Custom color palette
 * @property {Object} [animation] - Animation configuration
 * @property {number} [animation.duration=1000] - Animation duration in ms
 * @property {string} [animation.easing='easeInOutQuart'] - Animation easing
 * @property {Function} [onClick] - Click event handler
 * @property {Function} [onHover] - Hover event handler
 */

/**
 * Chart area dimensions and position
 * @typedef {Object} ChartArea
 * @property {number} x - X position of chart area
 * @property {number} y - Y position of chart area
 * @property {number} width - Width of chart area
 * @property {number} height - Height of chart area
 * @property {number} [left] - Left margin
 * @property {number} [right] - Right margin
 * @property {number} [top] - Top margin
 * @property {number} [bottom] - Bottom margin
 */

/**
 * Axis tick object
 * @typedef {Object} AxisTick
 * @property {number|string} value - Tick value
 * @property {string} label - Tick label to display
 * @property {number} position - Position along axis (pixels or percentage)
 */

/**
 * RGB color object
 * @typedef {Object} RGBColor
 * @property {number} r - Red value (0-255)
 * @property {number} g - Green value (0-255)
 * @property {number} b - Blue value (0-255)
 */

/**
 * Data range object
 * @typedef {Object} DataRange
 * @property {number} min - Minimum value in range
 * @property {number} max - Maximum value in range
 */

/**
 * Nice scale calculation result
 * @typedef {Object} NiceScale
 * @property {number} min - Nice minimum value
 * @property {number} max - Nice maximum value
 * @property {number} step - Step size between ticks
 * @property {number} ticks - Number of ticks
 */

/**
 * Pie slice data
 * @typedef {Object} PieSlice
 * @property {number} startAngle - Start angle in degrees
 * @property {number} endAngle - End angle in degrees
 * @property {number} percentage - Percentage of total (0-100)
 * @property {number} value - Original data value
 */

/**
 * Cartesian coordinates
 * @typedef {Object} Point
 * @property {number} x - X coordinate
 * @property {number} y - Y coordinate
 */

/**
 * Tooltip data structure
 * @typedef {Object} TooltipData
 * @property {string} title - Tooltip title
 * @property {TooltipItem[]} items - Array of tooltip items
 */

/**
 * Individual tooltip item
 * @typedef {Object} TooltipItem
 * @property {string} label - Item label
 * @property {number|string} value - Item value
 * @property {string} color - Item color
 */

/**
 * Tooltip state
 * @typedef {Object} TooltipState
 * @property {boolean} visible - Whether tooltip is visible
 * @property {TooltipData|null} data - Tooltip data
 * @property {number} x - X position on screen
 * @property {number} y - Y position on screen
 */

/**
 * Bar click event payload
 * @typedef {Object} BarClickEvent
 * @property {string} label - Label for the clicked bar
 * @property {number} datasetIndex - Index of the dataset
 * @property {number} value - Value of the clicked bar
 */

/**
 * Legend toggle event payload
 * @typedef {Object} LegendToggleEvent
 * @property {number} datasetIndex - Index of the toggled dataset
 * @property {boolean} hidden - New hidden state
 */

/**
 * Dimension object for chart sizing
 * @typedef {Object} Dimensions
 * @property {number} width - Width in pixels
 * @property {number} height - Height in pixels
 */

/**
 * Vue ref object (generic)
 * @template T
 * @typedef {Object} Ref
 * @property {T} value - The ref's value
 */

/**
 * Vue computed ref (read-only)
 * @template T
 * @typedef {Object} ComputedRef
 * @property {T} value - The computed value (read-only)
 */

// This file only exports type definitions via JSDoc comments
// No runtime exports are needed
export {}
