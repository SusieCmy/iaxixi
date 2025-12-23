/*
 * @Author: Susie 1732728869@qq.com
 * @Date: 2025-08-18 20:45:19
 * @LastEditors: Susie 1732728869@qq.com
 * @LastEditTime: 2025-08-20 20:22:42
 * @FilePath: \susie-cmy\src\app\blog\page.tsx
 * @Description: 强者都是孤独的
 *
 * Copyright (c) 2025 by 1732728869@qq.com, All Rights Reserved.
 */

import type { Metadata } from 'next'
import Link from 'next/link'
import UserTextClone from '@/components/animations/UserTextClone'
import { getAllPosts } from '@/lib/blog'
import { getTagStyle } from '@/lib/tagStyles'

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
    <div className="mx-auto min-h-screen max-w-screen-2xl p-6 font-[family-name:var(--font-geist-sans)]">
      <main className="mx-auto">
        <div className="mb-8">
          <h1 className="mb-4 w-24 cursor-target font-bold text-2xl">
            <UserTextClone propsText="技术博客" />
          </h1>
        </div>

        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {posts.map((post) => (
            <article
              key={post.slug}
              className="group relative overflow-hidden rounded-2xl border border-base-300 bg-base-100 shadow-lg transition-all duration-500 hover:scale-[1.02] hover:border-primary/30 hover:shadow-2xl"
            >
              <Link href={`/blog/${post.slug}`} className="block h-full">
                <div className="flex h-full flex-col p-6">
                  {/* 标题和描述区域 */}
                  <div className="mb-6 flex-1">
                    <h2 className="mb-3 font-bold text-base-content text-xl leading-tight transition-colors duration-300 group-hover:text-primary">
                      {post.title}
                    </h2>
                    <p className="line-clamp-3 text-base-content/70 text-sm leading-relaxed">
                      {post.description}
                    </p>
                  </div>

                  {/* 标签区域 */}
                  <div className="mb-6 flex flex-wrap gap-2">
                    {post.tags.map((tag) => (
                      <span
                        key={tag}
                        className={`cursor-target rounded-full px-3 py-1 font-semibold text-xs transition-transform duration-200 hover:scale-105 ${getTagStyle(tag)}`}
                      >
                        {tag}
                      </span>
                    ))}
                  </div>

                  {/* 底部信息区域 */}
                  <div className="flex items-center justify-between border-base-300 border-t pt-4">
                    <time dateTime={post.date} className="font-medium text-base-content/60 text-xs">
                      {new Date(post.date).toLocaleDateString('zh-CN', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                      })}
                    </time>
                    <div className="flex items-center gap-1 text-base-content/60 text-xs">
                      <svg className="h-3 w-3" fill="currentColor" viewBox="0 0 20 20">
                        <path
                          fillRule="evenodd"
                          d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z"
                          clipRule="evenodd"
                        />
                      </svg>
                      <span>{post.readingTime} 分钟</span>
                    </div>
                  </div>

                  {/* 悬停箭头指示器 */}
                  <div className="absolute top-6 right-6 translate-x-2 transform opacity-0 transition-all duration-300 group-hover:translate-x-0 group-hover:opacity-100">
                    <svg className="h-5 w-5 text-primary" fill="currentColor" viewBox="0 0 20 20">
                      <path
                        fillRule="evenodd"
                        d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                </div>
              </Link>
            </article>
          ))}
        </div>

        {posts.length === 0 && (
          <div className="py-12 text-center">
            <p className="text-gray-500 text-lg dark:text-gray-400">暂无博客文章，敬请期待！</p>
          </div>
        )}
      </main>
    </div>
  )
}
