---
title: "Next.js 入门指南"
description: "从零开始学习 Next.js，构建现代化的 React 应用程序"
date: "2024-01-15"
tags: ["Next.js", "React", "JavaScript"]
---

# Next.js 入门指南

Next.js 是一个基于 React 的全栈框架，提供了许多开箱即用的功能，让开发者能够快速构建生产就绪的 Web 应用程序。

## 主要特性

### 1. 服务端渲染 (SSR)
Next.js 支持服务端渲染，能够提升首屏加载速度和SEO效果：

```jsx
// pages/index.js
export default function Home({ data }) {
  return (
    <div>
      <h1>欢迎来到我的网站</h1>
      <p>{data.message}</p>
    </div>
  )
}

export async function getServerSideProps() {
  const data = await fetch('https://api.example.com/data')
  return {
    props: { data }
  }
}
```

### 2. 静态站点生成 (SSG)
对于不经常变化的内容，可以使用静态生成：

```jsx
export async function getStaticProps() {
  const posts = await getPosts()
  return {
    props: { posts },
    revalidate: 60 // 每60秒重新生成
  }
}
```

### 3. API 路由
Next.js 允许你在同一个项目中创建API端点：

```jsx
// pages/api/hello.js
export default function handler(req, res) {
  res.status(200).json({ message: 'Hello World' })
}
```

### 4. 自动代码分割
Next.js 会自动为每个页面创建单独的JavaScript包，只加载需要的代码。

## 快速开始

### 安装
```bash
npx create-next-app@latest my-app
cd my-app
npm run dev
```

### 项目结构
```
my-app/
├── pages/          # 页面文件
├── public/         # 静态资源
├── styles/         # 样式文件
├── components/     # 组件
└── lib/           # 工具函数
```

## 路由系统

Next.js 使用基于文件系统的路由：

- `pages/index.js` → `/`
- `pages/about.js` → `/about`
- `pages/blog/[slug].js` → `/blog/:slug`

### 动态路由示例
```jsx
// pages/blog/[slug].js
import { useRouter } from 'next/router'

export default function BlogPost() {
  const router = useRouter()
  const { slug } = router.query

  return <h1>文章: {slug}</h1>
}
```

## 样式方案

Next.js 支持多种样式解决方案：

### CSS Modules
```jsx
import styles from './Button.module.css'

export default function Button() {
  return (
    <button className={styles.primary}>
      点击我
    </button>
  )
}
```

### Styled JSX
```jsx
export default function Home() {
  return (
    <div>
      <h1>Hello World</h1>
      <style jsx>{`
        h1 {
          color: blue;
        }
      `}</style>
    </div>
  )
}
```

## 性能优化

### 图片优化
使用 Next.js 的 Image 组件自动优化图片：

```jsx
import Image from 'next/image'

export default function Profile() {
  return (
    <Image
      src="/profile.jpg"
      alt="个人头像"
      width={300}
      height={300}
      priority
    />
  )
}
```

### 字体优化
```jsx
import { Inter } from 'next/font/google'

const inter = Inter({ subsets: ['latin'] })

export default function MyApp({ Component, pageProps }) {
  return (
    <main className={inter.className}>
      <Component {...pageProps} />
    </main>
  )
}
```

## 部署

### Vercel 部署（推荐）
```bash
npm install -g vercel
vercel
```

### 其他平台
Next.js 应用可以部署到任何支持 Node.js 的平台。

## 总结

Next.js 是一个功能强大且易于使用的React框架，适合构建各种类型的Web应用程序。它的主要优势包括：

- 零配置开始
- 优秀的开发体验
- 内置性能优化
- 灵活的渲染策略
- 活跃的社区支持

现在就开始你的 Next.js 之旅吧！