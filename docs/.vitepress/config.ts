import { defineConfig } from 'vitepress'

export default defineConfig({
  base: '/blog/',
  themeConfig: {
    sidebar: [
      {
        text: 'Articles',
        items: [
          { text: 'On Testing', link: '/on-testing.html' },
        ]
      }
    ]
  }
})
