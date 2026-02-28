/*
 * @Date: 2025-08-18
 * @Description: 技术博客列表页 - 日系简约风格
 */

import { BookOpen, Calendar, Clock } from 'lucide-react'
import type { Metadata } from 'next'
import Link from 'next/link'
import { getAllPosts } from '@/lib/blog'

export const metadata: Metadata = {
  title: '技术博客',
  description: '分享前端开发经验、技术心得和学习笔记',
  keywords: ['技术博客', '前端开发', 'React', 'Next.js', 'JavaScript', 'TypeScript'],
  openGraph: {
    title: '技术博客 | chenmuyu - iaxixi.com',
    description: '分享前端开发经验、技术心得和学习笔记',
    type: 'website',
    images: ['/cmy.jpg'],
  },
  alternates: {
    canonical: 'https://www.iaxixi.com/blog',
  },
}

export default function Blog() {
  const posts = getAllPosts()

  return (
    <div className="mx-auto min-h-screen max-w-screen-2xl px-6 py-8">
      <main>
        {/* 页面标题 */}
        <div className="mb-10">
          <h1 className="font-(family-name:--font-jp) mb-2 flex items-center gap-2 font-medium text-(--jp-ink) text-2xl">
            <BookOpen className="h-6 w-6 text-(--jp-vermilion)" />
            技术博客
          </h1>
          <p className="font-(family-name:--font-jp-sans) text-(--jp-ash) text-sm">
            分享前端开发经验与技术心得
          </p>
        </div>

        {/* 文章列表 */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {posts.map((post) => (
            <article
              key={post.slug}
              className="group relative overflow-hidden border border-(--jp-mist) bg-(--jp-cream) transition-colors hover:border-(--jp-stone)"
            >
              <Link href={`/blog/${post.slug}`} className="block h-full">
                <div className="flex h-full flex-col p-5">
                  {/* 标题和描述 */}
                  <div className="mb-4 flex-1">
                    <h2 className="font-(family-name:--font-jp) mb-2 font-medium text-(--jp-ink) text-lg transition-colors group-hover:text-(--jp-vermilion)">
                      {post.title}
                    </h2>
                    <p className="font-(family-name:--font-jp-sans) line-clamp-2 text-(--jp-stone) text-sm leading-relaxed">
                      {post.description}
                    </p>
                  </div>

                  {/* 标签 */}
                  <div className="mb-4 flex flex-wrap gap-1.5">
                    {post.tags.map((tag) => (
                      <span
                        key={tag}
                        className="font-(family-name:--font-jp-sans) rounded-md border border-(--jp-mist) bg-(--jp-paper) px-2 py-0.5 text-(--jp-ash) text-xs"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>

                  {/* 底部信息 */}
                  <div className="flex items-center justify-between border-(--jp-mist) border-t pt-4">
                    <div className="flex items-center gap-1.5 text-(--jp-ash)">
                      <Calendar className="h-3.5 w-3.5" />
                      <time
                        dateTime={post.date}
                        className="font-(family-name:--font-jp-sans) text-xs"
                      >
                        {new Date(post.date).toLocaleDateString('zh-CN', {
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric',
                        })}
                      </time>
                    </div>
                    <div className="flex items-center gap-1.5 text-(--jp-ash)">
                      <Clock className="h-3.5 w-3.5" />
                      <span className="font-(family-name:--font-jp-sans) text-xs">
                        {post.readingTime} 分钟
                      </span>
                    </div>
                  </div>
                </div>
              </Link>
            </article>
          ))}
        </div>

        {/* 空状态 */}
        {posts.length === 0 && (
          <div className="py-16 text-center">
            <p className="font-(family-name:--font-jp-sans) text-(--jp-ash)">
              暂无博客文章，敬请期待
            </p>
          </div>
        )}
      </main>
    </div>
  )
}
