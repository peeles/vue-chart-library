/** @type { import('@storybook/vue3-vite').StorybookConfig } */
const config = {
  stories: ['../src/**/*.stories.@(js|jsx|mjs|ts|tsx)'],
  addons: [
    '@storybook/addon-links'
  ],
  framework: {
    name: '@storybook/vue3-vite',
    options: {
      docgen: true,
    },
  },
  docs: {
    autodocs: false,
  },
  core: {
    disableTelemetry: true,
  },
}

export default config
