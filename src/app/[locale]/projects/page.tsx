/*
 * @Date: 2026-02-26
 * @Description: 历程页面 - 读取 git 提交记录展示时间线
 */
import type { Metadata } from 'next'
import { GitTimeline } from '@/components/projects/GitTimeline'

export const metadata: Metadata = {
  title: '历程',
  description: '通过 git 提交记录，记录这个网站的成长历程',
  alternates: {
    canonical: 'https://www.iaxixi.com/projects',
  },
}

async function getGitLog() {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'
    const res = await fetch(`${baseUrl}/api/git-log`, {
      next: { revalidate: 3600 }, // 缓存 1 小时
    })
    if (!res.ok) return []
    const data = await res.json()
    return data.commits ?? []
  } catch {
    return []
  }
}

export default async function Projects() {
  const commits = await getGitLog()
  return <GitTimeline commits={commits} />
}
