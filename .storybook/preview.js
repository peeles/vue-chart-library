import '../src/styles/main.css'

/** @type { import('@storybook/vue3').Preview } */
const preview = {
  parameters: {
    layout: 'centered',
    backgrounds: {
      default: 'light',
      values: [
        {
          name: 'light',
          value: '#ffffff',
        },
        {
          name: 'dark',
          value: '#1a1a1a',
        },
      ],
    },
  },
    // Enables auto‑generated docs for all stories
    tags: ['autodocs'],
}

export default preview
