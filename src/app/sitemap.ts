/*
 * @Date: 2025-07-25 15:56:15
 * @Description: SEO Sitemap 配置 - 支持多语言
 */
import type { MetadataRoute } from 'next'

export const dynamic = 'force-static'

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://www.iaxixi.com'

  // 定义所有页面路径
  const pages = [
    { path: '', priority: 1, changeFrequency: 'weekly' as const },
    { path: '/home', priority: 0.9, changeFrequency: 'weekly' as const },
    { path: '/about', priority: 0.9, changeFrequency: 'monthly' as const },
    { path: '/blog', priority: 0.8, changeFrequency: 'weekly' as const },
    { path: '/contact', priority: 0.6, changeFrequency: 'yearly' as const },
    { path: '/dashboard', priority: 0.7, changeFrequency: 'monthly' as const },
    { path: '/dialogue', priority: 0.7, changeFrequency: 'monthly' as const },
    { path: '/aigc', priority: 0.7, changeFrequency: 'monthly' as const },
  ]

  const sitemap: MetadataRoute.Sitemap = []

  // 为每个页面生成中文和英文版本
  for (const page of pages) {
    // 中文版本（默认语言，不带前缀）
    sitemap.push({
      url: `${baseUrl}${page.path}`,
      lastModified: new Date(),
      changeFrequency: page.changeFrequency,
      priority: page.priority,
      alternates: {
        languages: {
          zh: `${baseUrl}${page.path}`,
          en: `${baseUrl}/en${page.path}`,
        },
      },
    })
  }

  return sitemap
}
