/*
 * @Date: 2025-07-07 11:00:02
 * @LastEditors: cmy && 1732728869@qq.com
 * @LastEditTime: 2025-07-29 10:46:23
 * @FilePath: \susie-cmy\src\app\about\page.tsx
 * @Description: 强者都是孤独的
 */
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: '联系我',
  description: '联系chenmuyu，讨论技术合作、项目开发或技术交流',
  keywords: ['联系方式', '技术合作', '项目合作', 'chenmuyu'],
  openGraph: {
    title: '联系我 | chenmuyu - iaxixi.com',
    description: '与chenmuyu取得联系，探讨技术问题或合作机会',
    type: 'website',
  },
  alternates: {
    canonical: 'https://www.iaxixi.com/contact',
  },
}

export default function Contact() {
  return (
    <div className="mx-auto min-h-screen max-w-screen-2xl font-[family-name:var(--font-geist-sans)]">
      <main className="" />
    </div>
  )
}
