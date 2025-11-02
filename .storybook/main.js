/** @type { import('@storybook/vue3-vite').StorybookConfig } */
const config = {
    stories: [
        '../src/**/*.mdx',
        '../src/**/*.stories.@(js|jsx|mjs|ts|tsx)'
    ],
    addons: [
        '@storybook/addon-docs',
        '@storybook/addon-a11y',
    ],
    framework: {
        name: '@storybook/vue3-vite',
        options: {
            docgen: true,
        },
    },
    core: {
        disableTelemetry: true,
    },
}

export default config
