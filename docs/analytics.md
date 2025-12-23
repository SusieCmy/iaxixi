# 埋点统一管理文档

## 概述

本项目使用统一的埋点管理工具 `src/lib/analytics.ts`，集中管理 Google Analytics (GA4) 和 Google Tag Manager (GTM) 的事件追踪。

## 配置

### 环境变量

在 `.env.local` 文件中配置以下环境变量：

```env
# Google Analytics GA4 ID
NEXT_PUBLIC_GA_ID=G-XXXXXXXXXX

# Google Tag Manager ID
NEXT_PUBLIC_GTM_ID=GTM-XXXXXXX

# 百度统计 ID
NEXT_PUBLIC_BAIDU_ANALYTICS_ID=xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx

# Google Search Console 验证
NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION=xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx

# 百度站长验证
NEXT_PUBLIC_BAIDU_SITE_VERIFICATION=xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
```

### Layout 配置

在 `src/app/layout.tsx` 中已配置：
- Google Analytics (GA4)
- Google Tag Manager (GTM)
- 百度统计
- SEO 验证码

## 使用方法

### 导入

```typescript
import analytics from '@/lib/analytics'
```

### 基础事件

#### 1. 用户点击名称/头像

```typescript
analytics.clickUserName()
```

#### 2. 查看统计数据

```typescript
analytics.viewStats()
```

#### 3. 点击社交链接

```typescript
analytics.clickSocialLink('GitHub')  // 平台名称
analytics.clickSocialLink('Email')
```

#### 4. 导航事件

```typescript
analytics.navigateToBlog()      // 访问博客
analytics.navigateToProjects()   // 访问项目
```

#### 5. 技术标签点击

```typescript
analytics.clickTechTag('React', '前端框架')  // 技术名, 分类
```

#### 6. 学习中的技术

```typescript
analytics.viewLearningTech('Rust')  // 技术名
```

#### 7. 页面浏览

```typescript
analytics.pageView('博客详情页')  // 页面名称
```

### 高级用法

如果只想触发 GA 或 GTM 其中一个：

```typescript
import { trackGAEvent, trackGTMEvent } from '@/lib/analytics'

// 只触发 GA
trackGAEvent.clickUserName()

// 只触发 GTM
trackGTMEvent.clickUserName()
```

### 自定义事件

```typescript
// GA 自定义事件
trackGAEvent.custom('custom_event_name', {
  category: 'custom_category',
  label: 'custom_label',
  // 其他参数...
})

// GTM 自定义事件
trackGTMEvent.custom('custom_event_name', {
  category: 'custom_category',
  action: 'custom_action',
  // 其他参数...
})
```

## 事件命名规范

### 事件分类 (EventCategory)

- `user`: 用户行为
- `navigation`: 导航行为
- `content`: 内容交互
- `social`: 社交分享
- `form`: 表单交互

### 事件动作 (EventAction)

- `click`: 点击
- `view`: 查看
- `submit`: 提交
- `download`: 下载
- `share`: 分享
- `scroll`: 滚动

### 命名约定

GA4 事件名称使用 **snake_case**（小写+下划线）：
- ✅ `click_user_name`
- ✅ `view_stats`
- ✅ `navigate_to_blog`

GTM 事件名称使用 **snake_case** 或描述性名称：
- ✅ `user_name_clicked`
- ✅ `stats_viewed`
- ✅ `navigation`

## 已实现的埋点

### UserInfo 组件 (`src/components/User/UserInfo/index.tsx`)

| 位置 | 事件 | 说明 |
|------|------|------|
| 用户名称点击 | `clickUserName()` | 点击头像或名称时触发 |
| 统计数据标题点击 | `viewStats()` | 点击"数据统计"标题时触发 |
| 社交链接点击 | `clickSocialLink(platform)` | 点击 GitHub/Email 等社交链接 |
| 快速访问-博客 | `navigateToBlog()` | 点击"技术博客"链接 |
| 快速访问-项目 | `navigateToProjects()` | 点击"项目经历"链接 |
| 技术标签点击 | `clickTechTag(tech, category)` | 点击任意技术标签 |
| 学习中的技术 | `viewLearningTech(tech)` | 点击学习中的技术标签 |

## 数据查看

### Google Analytics (GA4)

1. 访问 [Google Analytics](https://analytics.google.com/)
2. 选择你的项目
3. 进入 **报告 > 互动 > 事件**

### Google Tag Manager (GTM)

1. 访问 [Google Tag Manager](https://tagmanager.google.com/)
2. 选择你的容器
3. 进入 **预览模式** 查看实时事件

### 百度统计

1. 访问 [百度统计](https://tongji.baidu.com/)
2. 选择你的网站
3. 查看实时访客、事件等数据

## 最佳实践

### 1. 保持一致性

所有埋点都通过统一的 `analytics` 工具调用，避免直接使用 `sendGAEvent` 或 `sendGTMEvent`。

### 2. 语义化命名

事件名称应该清晰描述用户行为：
- ✅ `clickSocialLink('GitHub')`
- ❌ `track('click', 'link', 'github')`

### 3. 必要参数

为关键事件传递有用的上下文信息：
```typescript
// 好的做法
analytics.clickTechTag('React', '前端框架')

// 不好的做法
analytics.clickTechTag('React')
```

### 4. 避免过度埋点

只对关键用户行为添加埋点，避免追踪每一个细微的交互。

### 5. 测试验证

在开发环境中测试埋点是否正确触发：
- 打开浏览器开发者工具 > Network
- 筛选 `analytics` 或 `gtm` 请求
- 验证事件参数是否正确

## 扩展埋点

### 添加新事件

1. 在 `src/lib/analytics.ts` 中添加新的事件方法

```typescript
export const trackGAEvent = {
  // ... 现有事件 ...

  // 新增事件
  downloadFile: (fileName: string, fileType: string) => {
    sendGAEvent('event', 'file_download', {
      category: EventCategory.CONTENT,
      action: EventAction.DOWNLOAD,
      label: fileName,
      file_name: fileName,
      file_type: fileType,
    })
  },
}

export const trackGTMEvent = {
  // ... 现有事件 ...

  // 新增事件
  downloadFile: (fileName: string, fileType: string) => {
    sendGTMEvent({
      event: 'file_downloaded',
      category: EventCategory.CONTENT,
      action: EventAction.DOWNLOAD,
      file_name: fileName,
      file_type: fileType,
      label: `文件下载-${fileName}`,
    })
  },
}

export const analytics = {
  // ... 现有事件 ...

  // 新增统一接口
  downloadFile: (fileName: string, fileType: string) => {
    trackGAEvent.downloadFile(fileName, fileType)
    trackGTMEvent.downloadFile(fileName, fileType)
  },
}
```

2. 在组件中使用

```typescript
import analytics from '@/lib/analytics'

<button onClick={() => analytics.downloadFile('resume.pdf', 'pdf')}>
  下载简历
</button>
```

## 常见问题

### Q: 为什么需要同时配置 GA 和 GTM？

A: GA4 专注于数据收集和分析，GTM 提供更灵活的标签管理和触发器配置。两者配合使用可以获得更全面的数据洞察。

### Q: 如何在开发环境中禁用埋点？

A: 可以在 `src/lib/analytics.ts` 中添加环境检查：

```typescript
const isDev = process.env.NODE_ENV === 'development'

export const analytics = {
  clickUserName: () => {
    if (isDev) {
      console.log('[Analytics] clickUserName')
      return
    }
    trackGAEvent.clickUserName()
    trackGTMEvent.clickUserName()
  },
  // ... 其他事件 ...
}
```

### Q: 埋点数据多久能看到？

A:
- **GA4**: 实时数据通常在 1-2 分钟内显示，完整报告可能延迟 24-48 小时
- **GTM**: 预览模式下可以实时查看事件触发
- **百度统计**: 实时访客数据延迟约 5-10 分钟

## 参考资料

- [Google Analytics 4 文档](https://support.google.com/analytics/answer/9304153)
- [Google Tag Manager 文档](https://support.google.com/tagmanager)
- [Next.js Third Parties 文档](https://nextjs.org/docs/app/building-your-application/optimizing/third-party-libraries)
- [百度统计使用指南](https://tongji.baidu.com/web/help/article?id=93)
