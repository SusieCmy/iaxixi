# Chen Muyu - 个人网站

> 基于 Next.js 16 + React 19 + TypeScript 构建的现代化个人作品集与博客网站

[![Next.js](https://img.shields.io/badge/Next.js-16.0.10-black?style=flat-square&logo=next.js)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19.2.0-blue?style=flat-square&logo=react)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.9-blue?style=flat-square&logo=typescript)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4-38B2AC?style=flat-square&logo=tailwind-css)](https://tailwindcss.com/)
[![DaisyUI](https://img.shields.io/badge/DaisyUI-5-5A0EF8?style=flat-square)](https://daisyui.com/)

## 在线访问

- **网站**: [https://www.iaxixi.com](https://www.iaxixi.com)
- **备案**: 湘ICP备2023003507号

## 核心特性

- **极速性能** - Next.js 16 + Turbopack，毫秒级热更新
- **国际化** - 中英双语支持，基于 next-intl 的 SEO 友好 URL 结构
- **博客系统** - Markdown 驱动，支持 YAML frontmatter、语法高亮、阅读进度条
- **AI 助手** - 集成 Coze AI 机器人 + DeepSeek API，支持对话与音频处理
- **主题切换** - 明暗主题 + 多配色方案，持久化存储
- **数据可视化** - Recharts 交互式图表，Dashboard 数据面板
- **SEO 优化** - 结构化数据、Open Graph、Twitter Card、Sitemap、Robots.txt
- **数据分析** - Google Analytics 4 + Google Tag Manager + 百度统计
- **天气服务** - 和风天气 API 集成，实时天气展示
- **AIGC 工作流** - AI 工作流可视化与交互页面

## 技术栈

| 分类 | 技术 |
|------|------|
| **框架** | Next.js 16 · React 19 · TypeScript 5 |
| **样式** | Tailwind CSS 4 · DaisyUI 5 |
| **动画** | Motion (Framer Motion) 12 |
| **状态管理** | Zustand 5 · TanStack React Query 5 |
| **AI 集成** | Coze API · OpenAI SDK · DeepSeek |
| **国际化** | next-intl 4 |
| **内容** | gray-matter · react-markdown · react-syntax-highlighter |
| **图表** | Recharts 3 · XY Flow (React Flow) 12 |
| **UI 组件** | Radix UI · Lucide React · class-variance-authority |
| **代码质量** | Biome 2 · Husky · lint-staged |
| **包管理** | Bun (主要) / pnpm (备选) |

## 快速开始

### 环境要求

- Node.js 18+
- Bun (推荐) 或 pnpm

### 安装

```bash
# 克隆项目
git clone https://github.com/SusieCmy/chenmuyu.git
cd chenmuyu

# 安装依赖
bun install
# 或
pnpm install
```

### 配置环境变量

复制 `.env.example` 为 `.env.local` 并填写配置：

```bash
cp .env.example .env.local
```

```env
# Google Analytics & Tag Manager
NEXT_PUBLIC_GA_ID=your-ga-id
NEXT_PUBLIC_GTM_ID=your-gtm-id

# 百度统计
NEXT_PUBLIC_BAIDU_ANALYTICS_ID=your-baidu-analytics-id

# 站点验证
NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION=your-google-verification-code
NEXT_PUBLIC_BAIDU_SITE_VERIFICATION=your-baidu-verification-code

# 网站信息
NEXT_PUBLIC_SITE_URL=https://your-domain.com

# DeepSeek API
DEEPSEEK_API_KEY=sk-your-deepseek-api-key

# Coze AI
COZE_PAT=your-coze-pat-token

# 和风天气 API
QWEATHER_API_KEY=your-qweather-api-key
```

### 开发

```bash
# 启动开发服务器
bun run dev

# 访问 http://localhost:3000
```

### 构建与部署

```bash
# 生产构建
bun run build

# 本地预览
bun run start
```

### 代码检查

```bash
# Lint + 自动修复
bun run lint

# 仅检查（不修复）
bun run lint:check

# 格式化代码
bun run format

# TypeScript 类型检查
bun run type-check

# 清理缓存
bun run clean
```

## 项目结构

```
src/
├── app/                        # Next.js App Router
│   ├── [locale]/               # 国际化路由 (zh/en)
│   │   ├── home/               # 首页
│   │   ├── about/              # 关于页
│   │   ├── blog/               # 博客列表与文章详情
│   │   ├── projects/           # 项目展示
│   │   ├── contact/            # 联系页
│   │   ├── dashboard/          # 数据面板
│   │   ├── dialogue/           # 对话界面
│   │   └── aigc/               # AIGC 工作流
│   ├── api/                    # API 路由
│   │   ├── coze/               # Coze AI (chat/bots/audio)
│   │   ├── news/               # 新闻接口
│   │   └── weather/            # 天气接口
│   ├── robots.ts               # SEO robots.txt
│   └── sitemap.ts              # SEO sitemap
│
├── components/                 # 可复用组件
│   ├── animations/             # 动画组件
│   ├── blog/                   # 博客组件
│   ├── charts/                 # 图表组件
│   ├── chat/                   # 聊天 UI
│   ├── layout/                 # 布局组件
│   ├── seo/                    # SEO 组件
│   ├── theme/                  # 主题切换
│   ├── toast/                  # 通知提示
│   └── ui/                     # 基础 UI 组件
│
├── constants/                  # 常量配置
├── hooks/                      # 自定义 Hooks
├── store/                      # Zustand 状态管理
├── lib/                        # 工具库
├── utils/                      # 工具函数
├── types/                      # TypeScript 类型
├── i18n/                       # 国际化配置
├── config/                     # 应用配置
├── providers/                  # Context Providers
└── middleware.ts               # Next.js 中间件

content/
└── posts/                      # Markdown 博客文章

messages/                       # i18n 翻译文件 (zh.json / en.json)
```

## 页面路由

| 路由 | 说明 |
|------|------|
| `/[locale]` | 首页 |
| `/[locale]/about` | 关于我 |
| `/[locale]/blog` | 博客列表 |
| `/[locale]/blog/[slug]` | 博客文章详情 |
| `/[locale]/projects` | 项目展示 |
| `/[locale]/contact` | 联系方式 |
| `/[locale]/dashboard` | 数据面板 |
| `/[locale]/dialogue` | AI 对话 |
| `/[locale]/aigc` | AIGC 工作流 |
| `/[locale]/aigc/[workflowId]` | 工作流详情 |

## 开发指南

### 添加博客文章

在 `content/posts/` 目录下创建 `.md` 文件：

```markdown
---
title: "文章标题"
date: "2026-01-01"
description: "文章简介"
tags: ["React", "Next.js"]
---

# 文章正文内容
```

### 使用路由常量

```typescript
import { ROUTES } from '@/constants/routes'

<Link href={ROUTES.BLOG}>博客</Link>
<Link href={ROUTES.BLOG_POST('slug')}>文章</Link>
```

### 国际化

翻译文件位于 `messages/` 目录，支持 `zh.json` 和 `en.json`。默认语言为中文，URL 前缀策略为 `as-needed`。

## 部署

### Vercel (推荐)

```bash
vercel --prod
```

### 其他平台

支持 Netlify、Cloudflare Pages、AWS 等所有兼容 Next.js 的平台。

## 文档

- [埋点使用指南](docs/analytics.md)
- [动画使用指南](docs/animations-guide.md)
- [Biome 迁移文档](docs/biome-bun-migration.md)

## 联系方式

- **网站**: [https://www.iaxixi.com](https://www.iaxixi.com)
- **GitHub**: [@SusieCmy](https://github.com/SusieCmy)

## 致谢

[Next.js](https://nextjs.org/) · [React](https://react.dev/) · [Tailwind CSS](https://tailwindcss.com/) · [DaisyUI](https://daisyui.com/) · [Biome](https://biomejs.dev/) · [Coze](https://www.coze.com/)

---

如果觉得不错，欢迎 Star 支持！
