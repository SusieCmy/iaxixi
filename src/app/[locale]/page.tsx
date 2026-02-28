/*
 * @Date: 2025-07-07 10:29:58
 * @LastEditors: Susie 1732728869@qq.com
 * @LastEditTime: 2025-11-19 21:42:49
 * @FilePath: \susie-cmy\src\app\page.tsx
 * @Description: 强者都是孤独的
 */
import type { Metadata } from 'next'
import UserInfoPage from '@/components/user/UserInfo'

export const metadata: Metadata = {
  title: 'chenmuyu - 前端开发工程师 | iaxixi.com',
  description:
    'chenmuyu，Web前端开发工程师，专注于现代前端技术开发，持续学习新前端技术，分享前端开发经验',
  keywords: [
    'chenmuyu',
    '前端开发',
    'iaxixi',
    '开发工程师',
    '博客',
    '项目经历',
    '联系我',
    '关于我',
  ],
  authors: [{ name: 'chenmuyu', url: 'https://www.iaxixi.com' }],
  creator: 'chenmuyu',
  publisher: 'chenmuyu',
  openGraph: {
    type: 'profile',
    locale: 'zh_CN',
    url: 'https://www.iaxixi.com',
    title: 'chenmuyu - 前端开发工程师',
    description: 'Web前端开发工程师，专注现代前端技术',
    siteName: 'iaxixi - chenmuyu',
    images: [
      {
        url: '/cmy.jpg',
        width: 1200,
        height: 630,
        alt: 'chenmuyu - 前端开发工程师',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'chenmuyu - 前端开发工程师',
    description: 'Web前端开发工程师',
    images: ['/cmy.jpg'],
  },
  alternates: {
    canonical: 'https://www.iaxixi.com',
  },
}

export default function Index() {
  return (
    <div className="font-(family-name:--font-geist-sans) mx-auto max-w-screen-2xl">
      <UserInfoPage />
    </div>
  )
}
