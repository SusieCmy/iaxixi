# 🌐 项目国际化实施指南

## 📊 概述

本文档记录了项目的完整国际化实施方案，包括已完成和待完成的工作。

## ✅ 已完成

### 1. 基础设施
- ✅ 安装 next-intl v4.6.1
- ✅ 配置路由和中间件
- ✅ 重构项目结构（`[locale]` 动态路由）

### 2. 翻译文件
- ✅ 创建完整的 `messages/zh.json`（中文翻译）
- ✅ 创建完整的 `messages/en.json`（英文翻译）
- ✅ 包含以下命名空间：
  - `common` - 通用词汇
  - `nav` - 导航菜单
  - `home` - 首页
  - `about` - 关于页
  - `blog` - 博客
  - `projects` - 项目页
  - `contact` - 联系页
  - `chat` - AI 聊天
  - `workflow` - 工作流
  - `footer` - 页脚
  - `metadata` - SEO 元数据
  - `language` - 语言切换

### 3. 已国际化的组件
- ✅ Navigation 组件（导航菜单）
- ✅ LanguageSwitcher 组件（语言切换器）
- ✅ Layout Footer（页脚链接）

## 🔄 待完成

### 高优先级组件

#### 1. 首页 UserInfo 组件
**文件**: `src/components/User/UserInfo/index.tsx`

**需要替换的文本**：
```typescript
// 统计项标签
'项目经验' → t('home.stats.projects')
'技术文章' → t('home.stats.articles')
'开源贡献' → t('home.stats.contributions')
'代码行数' → t('home.stats.codeLines')

// 个人信息
'陈慕宇' → t('home.name')
'前端开发工程师' → t('home.position')

// 章节标题
'关于我' → t('home.aboutTitle')
'数据统计' → t('home.dataStatistics')
'快速访问' → t('home.quickAccess')
'技术广度' → t('home.techStack')

// 技术分类
'前端框架' → t('home.techCategories.frontend')
'样式方案' → t('home.techCategories.styling')
'开发工具' → t('home.techCategories.tools')
'其他技能' → t('home.techCategories.others')
'正在学习' → t('home.learning')

// 描述文本
欢迎语和描述 → t('home.welcome') / t('home.description')
```

**实施步骤**：
1. 在组件顶部添加 `'use client'`（如果还没有）
2. 导入 `useTranslations`: `import { useTranslations } from 'next-intl'`
3. 在组件中使用: `const t = useTranslations('home')`
4. 替换所有硬编码文本为 `t('key')`

#### 2. Chat 相关组件

**ChatHeader** (`src/components/Chat/ChatHeader/index.tsx`):
```typescript
'AI 助手' → t('chat.title')
'DeepSeek AI' → t('chat.subtitle')
'清空' → t('chat.clearChat')
```

**MessageInput** (`src/components/Chat/MessageInput/index.tsx`):
```typescript
'输入消息...' → t('chat.inputPlaceholder')
```

**MessageItem** (`src/components/Chat/MessageItem/index.tsx`):
```typescript
'你' → t('chat.you')
'AI' → t('chat.ai')
'思考中...' → t('chat.thinking')
'重新生成' → t('chat.regenerate')
```

**EmptyState** (`src/components/Chat/EmptyState/index.tsx`):
```typescript
'开始新对话' → t('chat.emptyTitle')
'探索 AI 的无限可能...' → t('chat.emptyDescription')
```

**constants.ts** (`src/components/Chat/constants.ts`):
```typescript
quickPrompts 数组 → 使用 t('chat.quickPrompts.*')
```

#### 3. Blog 相关组件

**blog/page.tsx** (`src/app/[locale]/blog/page.tsx`):
```typescript
const t = useTranslations('blog')
'技术博客' → t('title')
'{post.readingTime} 分钟' → t('readingTime', { time: post.readingTime })
```

**blog/[slug]/page.tsx** (`src/app/[locale]/blog/[slug]/page.tsx`):
```typescript
'返回博客列表' → t('blog.backToList')
'约 {time} 分钟阅读' → t('blog.readingTime', { time: post.readingTime })
```

**blog/[slug]/not-found.tsx** (`src/app/[locale]/blog/[slug]/not-found.tsx`):
```typescript
'文章未找到' → t('blog.notFound.title')
'抱歉，您访问的文章不存在或已被删除。' → t('blog.notFound.description')
'返回博客列表' → t('blog.backToList')
'返回首页' → t('blog.backToHome')
```

**MobileTOC** (`src/components/Blog/MobileTOC/index.tsx`):
```typescript
'文章目录' → t('blog.toc')
'关闭目录' → t('blog.closeToc')
```

#### 4. Workflow 相关组件

**aigc/page.tsx** (`src/app/[locale]/aigc/page.tsx`):
```typescript
const t = useTranslations('workflow')
'我的工作流' → t('title')
'创建工作流' → t('create')
'还没有工作流' → t('noWorkflows')
// ... 其他文本
```

**WorkflowNameDialog** (`src/components/Workflow/WorkflowNameDialog.tsx`):
```typescript
使用 t('workflow.dialog.*') 和 t('common.*')
```

### 中优先级

#### 5. 页面元数据国际化

**所有 page.tsx 文件的 Metadata**:
```typescript
export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>
}): Promise<Metadata> {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'metadata' })

  return {
    title: t('homeTitle'),
    description: t('homeDescription'),
    // ...
  }
}
```

#### 6. 主题切换提示文本

**Navigation 组件**:
```typescript
const t = useTranslations('nav')
title={t('toggleTheme', {
  mode: themeType === 'light' ? t('darkMode') : t('lightMode')
})}
```

### 低优先级

#### 7. 日期格式化
将所有 `'zh-CN'` 替换为基于 locale 的动态值：
```typescript
const locale = useLocale()
date.toLocaleDateString(locale === 'zh' ? 'zh-CN' : 'en-US')
```

#### 8. 数字格式化
使用 Intl API 进行国际化：
```typescript
new Intl.NumberFormat(locale).format(number)
```

## 📝 实施模板

### 客户端组件模板
```typescript
'use client'

import { useTranslations } from 'next-intl'

export default function MyComponent() {
  const t = useTranslations('namespace')

  return (
    <div>
      <h1>{t('title')}</h1>
      <p>{t('description')}</p>
    </div>
  )
}
```

### 服务端组件模板
```typescript
import { getTranslations } from 'next-intl/server'

export default async function MyPage({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'namespace' })

  return (
    <div>
      <h1>{t('title')}</h1>
    </div>
  )
}
```

### 带参数的翻译
```typescript
// 翻译文件
{
  "greeting": "Hello, {name}!",
  "items": "{count} items"
}

// 使用
t('greeting', { name: 'John' })
t('items', { count: 5 })
```

## 🧪 测试清单

每个组件国际化后需要测试：
- [ ] 中文模式下显示正确
- [ ] 英文模式下显示正确
- [ ] 切换语言后立即更新
- [ ] 无控制台错误
- [ ] 无缺失翻译键警告

## 📚 参考资源

- [next-intl 官方文档](https://next-intl.dev/)
- [项目翻译文件](messages/)
- [国际化配置](src/i18n/)

---

**最后更新**: 2025-12-17
**负责人**: Claude Code
