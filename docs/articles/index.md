---
lastUpdated: false
---

# Articles

<script setup>
import { data } from './feed.data'
</script>

<div v-for="article in data">
  <h2>{{ article.title }}</h2>
  <div>Published on {{ article.date.displayString }}</div>
  <a :href="article.href">Read more</a>
</div>
