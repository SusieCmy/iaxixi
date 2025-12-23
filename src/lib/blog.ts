import fs from 'node:fs'
import path from 'node:path'
import matter from 'gray-matter'
import type { BlogMetadata, BlogPost } from '@/types/blog'

const postsDirectory = path.join(process.cwd(), 'content/posts')

export function getAllPosts(): BlogPost[] {
  // 如果posts目录不存在，返回示例数据
  if (!fs.existsSync(postsDirectory)) {
    return getSamplePosts()
  }

  const fileNames = fs.readdirSync(postsDirectory)
  const allPostsData = fileNames
    .filter((fileName) => fileName.endsWith('.md'))
    .map((fileName) => {
      const slug = fileName.replace(/\.md$/, '')
      const fullPath = path.join(postsDirectory, fileName)
      const fileContents = fs.readFileSync(fullPath, 'utf8')
      const { data, content } = matter(fileContents)

      const metadata = data as BlogMetadata
      const readingTime = Math.ceil(content.split(' ').length / 200) // 约每分钟200字

      return {
        slug,
        title: metadata.title,
        description: metadata.description,
        date: metadata.date,
        tags: metadata.tags || [],
        content,
        readingTime,
      }
    })

  return allPostsData.sort((a, b) => (new Date(a.date) > new Date(b.date) ? -1 : 1))
}

export function getPostBySlug(slug: string): BlogPost | null {
  const posts = getAllPosts()
  return posts.find((post) => post.slug === slug) || null
}

// 示例数据
function getSamplePosts(): BlogPost[] {
  return [
    {
      slug: 'getting-started-with-nextjs',
      title: 'Next.js 入门指南',
      description: '从零开始学习 Next.js，构建现代化的 React 应用程序',
      date: '2024-01-15',
      tags: ['Next.js', 'React', 'JavaScript'],
      content: `# Next.js 入门指南

Next.js 是一个基于 React 的全栈框架，提供了许多开箱即用的功能。

## 主要特性

- **服务端渲染 (SSR)**
- **静态站点生成 (SSG)**
- **API 路由**
- **自动代码分割**

## 安装

\`\`\`bash
npx create-next-app@latest my-app
cd my-app
npm run dev
\`\`\`

这样你就可以开始使用 Next.js 了！`,
      readingTime: 3,
    },
    {
      slug: 'react-hooks-best-practices',
      title: 'React Hooks 最佳实践',
      description: '掌握 React Hooks 的正确使用方法，编写更优雅的组件',
      date: '2024-01-10',
      tags: ['React', 'Hooks', 'JavaScript'],
      content: `# React Hooks 最佳实践

React Hooks 让函数组件拥有了状态管理能力。

## 常用 Hooks

### useState
用于管理组件状态：

\`\`\`jsx
const [count, setCount] = useState(0);
\`\`\`

### useEffect
用于处理副作用：

\`\`\`jsx
useEffect(() => {
  document.title = \`Count: \${count}\`;
}, [count]);
\`\`\`

记住，Hooks 只能在函数组件的顶层调用！`,
      readingTime: 5,
    },
    {
      slug: 'typescript-tips',
      title: 'TypeScript 实用技巧',
      description: '提升 TypeScript 开发效率的实用技巧和最佳实践',
      date: '2024-01-05',
      tags: ['TypeScript', 'JavaScript', '开发技巧'],
      content: `# TypeScript 实用技巧

TypeScript 为 JavaScript 添加了类型系统，让代码更加健壮。

## 实用技巧

### 1. 联合类型
\`\`\`typescript
type Status = 'loading' | 'success' | 'error';
\`\`\`

### 2. 泛型
\`\`\`typescript
function identity<T>(arg: T): T {
  return arg;
}
\`\`\`

### 3. 条件类型
\`\`\`typescript
type IsString<T> = T extends string ? true : false;
\`\`\`

这些技巧能帮你写出更好的 TypeScript 代码！`,
      readingTime: 4,
    },
  ]
}
