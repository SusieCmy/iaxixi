/*
 * @Date: 2025-02-25
 * @Description: 新闻列表组件
 */
'use client'

import { ExternalLink, RefreshCw, TrendingUp } from 'lucide-react'
import Link from 'next/link'
import { useTranslations } from 'next-intl'
import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { useNews } from '@/hooks/useNews'

const NEWS_SOURCES = [
  { id: 'zaobao', label: '早报' },
  { id: 'weibo', label: '微博热搜' },
  { id: 'douyin', label: '抖音热点' },
  { id: 'toutiao', label: '今日头条' },
]

interface NewsItem {
  id: string
  title: string
  url: string
  pubDate?: string
  extra?: {
    icon?: string | { url: string; scale?: number }
    hot?: number
  }
}

function formatTime(pubDate: string) {
  const date = new Date(pubDate)
  const now = new Date()
  const diff = now.getTime() - date.getTime()
  const minutes = Math.floor(diff / 60000)
  if (minutes < 60) return `${minutes}分钟前`
  const hours = Math.floor(minutes / 60)
  if (hours < 24) return `${hours}小时前`
  return date.toLocaleDateString('zh-CN', { month: 'short', day: 'numeric' })
}

// 序号样式：前3名特殊处理
function RankBadge({ index }: { index: number }) {
  if (index === 0) {
    return (
      <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded font-(family-name:--font-jp) font-bold text-white text-xs bg-(--jp-vermilion)">
        1
      </span>
    )
  }
  if (index === 1) {
    return (
      <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded font-(family-name:--font-jp) font-bold text-white text-xs bg-(--jp-stone)">
        2
      </span>
    )
  }
  if (index === 2) {
    return (
      <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded font-(family-name:--font-jp) font-bold text-white text-xs bg-(--jp-moss)">
        3
      </span>
    )
  }
  return (
    <span className="flex h-5 w-5 shrink-0 items-center justify-center font-(family-name:--font-jp) text-(--jp-ash) text-xs">
      {index + 1}
    </span>
  )
}

export default function NewsList() {
  const t = useTranslations('news')
  const [sourceId, setSourceId] = useState('zaobao')
  const { data, isLoading, error, refetch, isRefetching } = useNews(sourceId)

  const items: NewsItem[] = data?.items || []

  return (
    <div className="mx-auto max-w-screen-2xl py-8 sm:py-12">
      {/* 标题栏 */}
      <div className="mb-6 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <TrendingUp className="h-5 w-5 text-(--jp-vermilion)" />
          <h1 className="font-(family-name:--font-jp) font-medium text-2xl text-(--jp-ink)">
            {t('title')}
          </h1>
        </div>
        <Button
          variant="outline"
          size="icon"
          onClick={() => refetch()}
          disabled={isRefetching}
          className="h-8 w-8 rounded-full"
          aria-label={t('refresh')}
        >
          <RefreshCw className={`h-4 w-4 ${isRefetching ? 'animate-spin' : ''}`} />
        </Button>
      </div>

      {/* 新闻源切换 */}
      <div className="mb-6 flex flex-wrap gap-2">
        {NEWS_SOURCES.map((source) => (
          <button
            key={source.id}
            type="button"
            onClick={() => setSourceId(source.id)}
            className={`rounded-full border px-4 py-1.5 font-(family-name:--font-jp-sans) text-sm transition-colors ${
              sourceId === source.id
                ? 'border-(--jp-vermilion) bg-(--jp-vermilion) text-white'
                : 'border-(--jp-mist) bg-(--jp-cream) text-(--jp-stone) hover:border-(--jp-stone) hover:text-(--jp-ink)'
            }`}
          >
            {source.label}
          </button>
        ))}
      </div>

      {/* 加载状态 */}
      {isLoading && (
        <div className="space-y-2">
          {Array.from({ length: 10 }).map((_, i) => (
            // biome-ignore lint/suspicious/noArrayIndexKey: static skeleton
            <div key={i} className="flex items-center gap-3 border-b border-(--jp-mist) py-3.5">
              <div className="h-5 w-5 animate-pulse rounded bg-(--jp-mist)" />
              <div className="h-4 flex-1 animate-pulse rounded bg-(--jp-mist)" />
              <div className="h-3 w-14 animate-pulse rounded bg-(--jp-mist)" />
            </div>
          ))}
        </div>
      )}

      {/* 错误状态 */}
      {error && (
        <div className="py-12 text-center">
          <p className="mb-2 text-(--jp-ash)">{t('loadFailed')}</p>
          <Button variant="outline" size="sm" onClick={() => refetch()}>
            {t('retry')}
          </Button>
        </div>
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
              className="group flex items-center gap-3 py-3.5 transition-colors hover:bg-(--jp-paper) -mx-3 px-3 rounded-lg"
            >
              <RankBadge index={index} />

              {/* 标题 */}
              <span className="flex-1 font-(family-name:--font-jp-sans) text-(--jp-ink) text-sm leading-relaxed group-hover:text-(--jp-vermilion) transition-colors">
                {item.title}
              </span>

              {/* 时间 + 外链 */}
              <span className="flex shrink-0 items-center gap-2">
                {item.pubDate && (
                  <span className="font-(family-name:--font-jp-sans) text-(--jp-ash) text-xs">
                    {formatTime(item.pubDate)}
                  </span>
                )}
                <ExternalLink className="h-3.5 w-3.5 text-(--jp-ash) opacity-0 transition-opacity group-hover:opacity-100" />
              </span>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}
