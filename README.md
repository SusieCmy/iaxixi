# 🌟 Chen Muyu - 个人网站

> 现代化的个人作品集网站 | Next.js 16 + React 19 + TypeScript

[![Next.js](https://img.shields.io/badge/Next.js-16.0.9-black?style=flat-square&logo=next.js)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19.2.0-blue?style=flat-square&logo=react)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?style=flat-square&logo=typescript)](https://www.typescriptlang.org/)

## 🌐 在线访问

**网站**: [https://www.iaxixi.com](https://www.iaxixi.com)
**备案**: 湘ICP备2023003507号

## ✨ 核心特性

- ⚡ **极速性能** - Next.js 16 + Turbopack 毫秒级热更新
- 🎭 **流畅动画** - Anime.js v4 动画引擎
- 📝 **博客系统** - Markdown 支持 + 语法高亮
- 🌙 **主题切换** - 明暗主题无缝切换
- 📊 **数据可视化** - Recharts 图表展示
- 🤖 **AI 聊天** - DeepSeek API 集成
- 🎯 **SEO 优化** - 完整结构化数据
- 📈 **数据分析** - GA4 + 百度统计

## 🚀 快速开始

### 安装

```bash
# 克隆项目
git clone https://github.com/SusieCmy/chenmuyu.git
cd chenmuyu

# 安装依赖
bun install
# 或 pnpm install
```

### 开发

```bash
# 启动开发服务器
bun run dev

# 访问 http://localhost:3000
```

### 构建

```bash
# 生产构建
bun run build

# 本地预览
bun run start
```

### 代码检查

```bash
# Lint + 格式化
bun run lint

# 类型检查
bun run type-check
```

## 📁 项目结构

```
src/
├── app/                    # Next.js App Router
│   ├── blog/              # 博客系统
│   ├── projects/          # 项目展示
│   ├── aigc/              # AIGC 功能
│   └── api/               # API 路由
│
├── components/            # 可复用组件
│   ├── Animation/         # 动画组件
│   ├── Blog/              # 博客组件
│   ├── Chat/              # 聊天组件
│   ├── Layout/            # 布局组件
│   ├── UI/                # UI 组件
│   └── User/              # 用户组件
│
├── constants/             # 常量配置
│   ├── routes.ts          # 路由常量
│   └── config.ts          # 全局配置
│
├── lib/                   # 工具库
│   ├── analytics.ts       # 埋点管理
│   ├── animations.ts      # 动画工具
│   └── blog.ts            # 博客工具
│
├── utils/                 # 工具函数
│   ├── cn.ts              # 类名合并
│   ├── date.ts            # 日期格式化
│   └── format.ts          # 通用格式化
│
├── hooks/                 # 自定义 Hooks
├── store/                 # 状态管理
└── types/                 # TypeScript 类型
```

## 🛠️ 技术栈

**核心**: Next.js 16 · React 19 · TypeScript 5
**样式**: Tailwind CSS 4 · DaisyUI 5
**动画**: Anime.js 4.2.2
**数据**: TanStack Query · Zustand · Recharts
**AI**: OpenAI SDK · DeepSeek
**工具**: Biome · Bun · Husky

## 🔧 环境变量

创建 [.env.local](.env.local) 文件：

```env
# Google Analytics & GTM
NEXT_PUBLIC_GA_ID=G-XXXXXXXXXX
NEXT_PUBLIC_GTM_ID=GTM-XXXXXXX

# 百度统计
NEXT_PUBLIC_BAIDU_ANALYTICS_ID=xxxxxxxxxx

# DeepSeek API
DEEPSEEK_API_KEY=sk-xxxxxxxxxx
```

## 📝 开发指南

### 添加博客文章

在 [content/posts/](content/posts/) 创建 `.md` 文件：

```markdown
---
title: "文章标题"
date: "2025-12-16"
description: "文章简介"
tags: ["React", "Next.js"]
---

# 文章内容
```

### 使用路由常量

```typescript
import { ROUTES } from '@/constants/routes'

<Link href={ROUTES.BLOG}>博客</Link>
<Link href={ROUTES.BLOG_POST('slug')}>文章</Link>
```

### 使用工具函数

```typescript
import { cn, formatDate } from '@/utils'

const className = cn('px-2', condition && 'bg-blue-500')
const date = formatDate('2025-12-16') // "2025-12-16"
```

## 📊 埋点分析

查看 [docs/analytics.md](docs/analytics.md) 了解完整使用方法。

```typescript
import analytics from '@/lib/analytics'

// 页面浏览
analytics.pageView('首页')

// 自定义事件
analytics.clickTechTag('React', '前端框架')
```

## 📦 部署

### Vercel (推荐)

```bash
vercel --prod
```

### 其他平台

支持 Netlify、Cloudflare Pages、AWS 等所有支持 Next.js 的平台。

## 📄 文档

- [埋点使用指南](docs/analytics.md)
- [动画使用指南](docs/animations-guide.md)
- [Biome 迁移文档](docs/biome-bun-migration.md)
- [Anime.js 说明](animejs.instructions.md)

## 📮 联系方式

**网站**: [https://www.iaxixi.com](https://www.iaxixi.com)
**邮箱**: 1732728869@qq.com
**GitHub**: [@SusieCmy](https://github.com/SusieCmy)

## 🙏 致谢

[Next.js](https://nextjs.org/) · [React](https://react.dev/) · [Tailwind CSS](https://tailwindcss.com/) · [Anime.js](https://animejs.com/) · [Biome](https://biomejs.dev/)

---

⭐ Star 支持一下吧！
