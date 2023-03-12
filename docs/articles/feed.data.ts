import matter from "gray-matter";
import { readdirSync, readFileSync, statSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { cwd } from "node:process";
import { fileURLToPath } from "node:url";
import { createMarkdownRenderer, MarkdownRenderer } from "vitepress";

declare const data: Article[];
export { data };

interface Article {
  title: string;
  href: string;
  date: {
    unixTimeStamp: number;
    displayString: string;
  };
  excerpt: string;
}

let md: MarkdownRenderer;
const currentDir = dirname(fileURLToPath(import.meta.url));
const articleDir = resolve(currentDir, "./");
const cache = new Map();

export default {
  watch: join(articleDir, "*.md"),
  async load(): Promise<Article[]> {
    md = md ?? (await createMarkdownRenderer(cwd()));

    return readdirSync(articleDir)
      .filter((file) => file.endsWith(".md") && !file.endsWith("index.md"))
      .map((file) => getArticle(file, articleDir))
      .sort((a, b) => b.date.unixTimeStamp - a.date.unixTimeStamp);
  },
};

function getArticle(file: string, postDir: string): Article {
  const articlePath = join(postDir, file);
  const timestamp = statSync(articlePath).mtimeMs;

  const cachedArticle = cache.get(articlePath);

  if (cachedArticle != null && timestamp === cachedArticle?.timestamp) {
    return cachedArticle.data;
  }

  const src = readFileSync(articlePath, "utf-8");
  const { data, excerpt } = matter(src, { excerpt: true });

  const article: Article = {
    title: data.title,
    href: `./${file.replace(/\.md$/, ".html")}`,
    date: formatDate(data.date),
    excerpt: excerpt != null ? md.render(excerpt) : "",
  };

  cache.set(articlePath, {
    timestamp,
    post: article,
  });

  return article;
}

function formatDate(date: string | Date): Article["date"] {
  if (!(date instanceof Date)) {
    date = new Date(date);
  }

  date.setUTCHours(12);

  return {
    unixTimeStamp: +date,
    displayString: date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    }),
  };
}
