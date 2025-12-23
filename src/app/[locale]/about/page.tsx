/*
 * @Date: 2025-07-07 11:00:02
 * @LastEditors: cmy && 1732728869@qq.com
 * @LastEditTime: 2025-07-29 10:46:23
 * @FilePath: \susie-cmy\src\app\about\page.tsx
 * @Description: 强者都是孤独的
 */
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: '关于我',
  description: '我是chenmuyu，一名热爱技术的前端开发工程师，专注于现代Web开发技术',
  keywords: ['chenmuyu', '前端工程师', '个人简介', 'Web开发'],
  openGraph: {
    title: '关于我 | chenmuyu - iaxixi.com',
    description: '了解chenmuyu的技术背景、工作经历和个人兴趣',
    type: 'profile',
    images: ['/cmy.jpg'],
  },
  alternates: {
    canonical: 'https://www.iaxixi.com/about',
  },
}

import UserInfoPage from '@/components/user/UserInfo'

export default function About() {
  return (
    <div className="min-h-screen font-[family-name:var(--font-geist-sans)]">
      <main className="pb-16">
        <UserInfoPage />
      </main>
    </div>
  )
}
