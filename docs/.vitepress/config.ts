import { defineConfig } from 'vitepress'

export default defineConfig({
  title: `Strawberry Choco's blog`,
  base: '/blog/',
  lastUpdated: true,
  themeConfig: {
    nav: [
      { text: 'Articles', link: '/articles/index.html' },
      { text: 'About Me', link: '/about-me.html' },
    ],
  }
})
