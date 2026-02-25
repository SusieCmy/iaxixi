/*
 * @Date: 2025-02-25
 * @Description: 首页新闻卡片 - 展示早报前3条
 */
'use client'

import { ExternalLink, Newspaper } from 'lucide-react'
import Link from 'next/link'
import { useEffect } from 'react'
import { useNews } from '@/hooks/useNews'
import { animateElements, staggerDelay } from '@/lib/animations'

interface NewsItem {
  id: string
  title: string
  url: string
}

export default function NewsCard() {
  const { data, isLoading, error } = useNews('zaobao')
  const items: NewsItem[] = (data?.items || []).slice(0, 3)
  useEffect(() => {
    animateElements('.news-card', {
      translateY: [40, 0],
      delay: staggerDelay(0, 0.1),
      duration: 0.8,
      ease: 'easeOut',
    })
  }, [])
  return (
    <div className="news-card w-full border border-(--jp-mist) bg-(--jp-cream) opacity-0 transition-colors hover:border-(--jp-stone)">
      <div className="flex flex-col p-5">
        {/* 标题栏 */}
        <div className="mb-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Newspaper className="h-4 w-4 text-(--jp-vermilion)" />
            <span className="font-(family-name:--font-jp) font-medium text-(--jp-ink) text-sm">
              早报
            </span>
          </div>
          <span className="font-(family-name:--font-jp-sans) text-(--jp-ash) text-xs">
            今日要闻
          </span>
        </div>

        {/* 加载骨架 */}
        {isLoading && (
          <div className="divide-y divide-(--jp-mist)">
            {Array.from({ length: 3 }).map((_, i) => (
              // biome-ignore lint/suspicious/noArrayIndexKey: static skeleton
              <div key={i} className="flex items-center gap-3 py-3">
                <div className="h-4 w-4 animate-pulse rounded bg-(--jp-mist)" />
                <div className="h-3 flex-1 animate-pulse rounded bg-(--jp-mist)" />
              </div>
            ))}
          </div>
        )}

        {/* 错误状态 */}
        {error && (
          <p className="py-3 text-center font-(family-name:--font-jp-sans) text-(--jp-ash) text-xs">
            暂时无法获取新闻
          </p>
        )}

        {/* 新闻列表 */}
        {!isLoading && !error && items.length > 0 && (
          <div className="divide-y divide-(--jp-mist)">
            {items.map((item, index) => (
              <Link
                key={item.id}
                href={item.url}
                target="_blank"
                rel="noopener noreferrer"
                className="group flex items-start gap-2.5 py-3 transition-colors"
              >
                <span
                  className={`mt-0.5 shrink-0 font-(family-name:--font-jp) font-bold text-xs ${
                    index === 0
                      ? 'text-(--jp-vermilion)'
                      : index === 1
                        ? 'text-(--jp-stone)'
                        : 'text-(--jp-moss)'
                  }`}
                >
                  {index + 1}
                </span>
                <span className="flex-1 font-(family-name:--font-jp-sans) text-(--jp-ink) text-xs leading-relaxed transition-colors group-hover:text-(--jp-vermilion) line-clamp-2">
                  {item.title}
                </span>
                <ExternalLink className="mt-0.5 h-3 w-3 shrink-0 text-(--jp-ash) opacity-0 transition-opacity group-hover:opacity-100" />
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
