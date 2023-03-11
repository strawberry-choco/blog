import { defineConfig } from 'vitepress'

export default defineConfig({
  title: `Strawberry Choco's blog`,
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
