/*
 * @Date: 2025-07-25 15:53:23
 * @LastEditors: cmy && 1732728869@qq.com
 * @LastEditTime: 2025-07-25 15:53:32
 * @FilePath: \susie-cmy\src\app\robots.ts
 * @Description: 强者都是孤独的
 */
import type { MetadataRoute } from 'next'

export const dynamic = 'force-static'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/', // 允许所有页面被抓取
    },
    sitemap: 'https://www.iaxixi.com/sitemap.xml',
    host: 'https://www.iaxixi.com',
  }
}
