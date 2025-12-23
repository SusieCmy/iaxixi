/*
 * @Date: 2025-07-31 17:31:30
 * @LastEditors: cmy && 1732728869@qq.com
 * @LastEditTime: 2025-07-31 17:32:14
 * @FilePath: \susie-cmy\src\app\projects\page.tsx
 * @Description: 强者都是孤独的
 */

import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: '历程',
  description: '我是chenmuyu，一名热爱技术的前端开发工程师，专注于现代Web开发技术',
  keywords: ['chenmuyu', '前端工程师', '个人简介', 'Web开发'],
  openGraph: {
    title: '历程 | chenmuyu - iaxixi.com',
    description: '了解chenmuyu的技术背景、工作经历和个人兴趣',
    type: 'profile',
    images: ['/cmy.jpg'],
  },
  alternates: {
    canonical: 'https://www.iaxixi.com/projects',
  },
}
export default function Projects() {
  return (
    <div className="mx-auto min-h-screen max-w-screen-2xl font-[family-name:var(--font-geist-sans)]">
      <main className="" />
    </div>
  )
}
