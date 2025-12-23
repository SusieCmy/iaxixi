/*
 * @Date: 2025-07-25 15:56:15
 * @LastEditors: cmy && 1732728869@qq.com
 * @LastEditTime: 2025-07-25 15:58:01
 * @FilePath: \susie-cmy\src\app\sitemap.ts
 * @Description: 强者都是孤独的
 */
import type { MetadataRoute } from 'next'

export const dynamic = 'force-static'

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://www.iaxixi.com'

  return [
    {
      url: baseUrl,
      changeFrequency: 'weekly',
      priority: 1,
    },
    {
      url: `${baseUrl}/about`,
      changeFrequency: 'monthly',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/blog`,
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/projects`,
      changeFrequency: 'monthly',
      priority: 0.7,
    },
    {
      url: `${baseUrl}/contact`,
      changeFrequency: 'yearly',
      priority: 0.6,
    },
  ]
}
